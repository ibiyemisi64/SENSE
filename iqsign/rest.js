/********************************************************************************/
/*										*/
/*		rest.js 							*/
/*										*/
/*	Handle RESTful interface for iQsign					*/
/*										*/
/*	Written by spr								*/
/*										*/
/********************************************************************************/
/*	Copyright 2023 Brown University -- Steven P. Reiss			*/
/*********************************************************************************
 *  Copyright 2023, Brown University, Providence, RI.				 *
 *										 *
 *			  All Rights Reserved					 *
 *										 *
 *  Permission to use, copy, modify, and distribute this software and its	 *
 *  documentation for any purpose other than its incorporation into a		 *
 *  commercial product is hereby granted without fee, provided that the 	 *
 *  above copyright notice appear in all copies and that both that		 *
 *  copyright notice and this permission notice appear in supporting		 *
 *  documentation, and that the name of Brown University not be used in 	 *
 *  advertising or publicity pertaining to distribution of the software 	 *
 *  without specific, written prior permission. 				 *
 *										 *
 *  BROWN UNIVERSITY DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS		 *
 *  SOFTWARE, INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND		 *
 *  FITNESS FOR ANY PARTICULAR PURPOSE.  IN NO EVENT SHALL BROWN UNIVERSITY	 *
 *  BE LIABLE FOR ANY SPECIAL, INDIRECT OR CONSEQUENTIAL DAMAGES OR ANY 	 *
 *  DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS,		 *
 *  WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS		 *
 *  ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE 	 *
 *  OF THIS SOFTWARE.								 *
 *										 *
 ********************************************************************************/

"use strict";

const uuid = require("node-uuid");

const db = require("./database");
const config = require("./config");
const auth = require("./auth");
const sign = require("./sign");
const images = require("./images");
const server = require("./server");


var users_updated = new Set();
var users_active = new Set();


/********************************************************************************/
/*										*/
/*	Setup Router								*/
/*										*/
/********************************************************************************/

function restRouter(restful) {
   restful.use(session);
   restful.all("/rest/ping", handlePing);
   restful.get("/rest/login", handlePrelogin);
   restful.post("/rest/login", handleLogin);
   restful.post("/rest/register", handleRegister);
   restful.post("/rest/forgotpassword", auth.handleForgotPassword);
   restful.all("/rest/logout", handleLogout);
   restful.all("/rest/authorize", handleAuthorize);
   restful.all("/rest/about", displayAboutPage);
   restful.get("/rest/instructions", displayInstructionsPage);
   restful.use(authenticate);
   restful.all("/rest/signs", handleGetAllSigns);
   restful.put("/rest/sign/:signid/setto", handleSetSignTo);
   restful.post("/rest/sign/setto", handleSetSignTo);
   restful.post("/rest/sign/:signid/update", handleUpdate);
   restful.post("/rest/sign/update", handleUpdate);
   restful.all("/rest/savedimages", images.displaySavedImagePage);
   restful.all("/rest/svgimages", images.displaySvgImagePage);
   restful.post("/rest/loadsignimage", sign.handleLoadSignImage);
   restful.post("/rest/savesignimage", handleSaveSignImage);
   restful.post("/rest/removesignimage", handleRemoveSavedSignImage);
   restful.post("/rest/sign/preview", sign.handlePreviewSign);
   restful.post("/rest/createcode", sign.createLoginCode);

   restful.all("/rest/namedsigns", handleGetAllSavedSigns);
   restful.post("/rest/addsign", handleAddSign);
   restful.post("/rest/removeuser", handleRemoveUser);

   restful.all("*", badUrl);
   restful.use(errorHandler);

   return restful;
}


function displayAboutPage(req, res) {
   return server.displayAboutPage(req, res);
}


function displayInstructionsPage(req, res) {
   return server.displayInstructionsPage(req, res);
}

function badUrl(req, res) {
   res.status(404);
   let rslt = { status: "ERROR", reason: "Invalid URL" };
   res.end(JSON.stringify(rslt));
}



function errorHandler(err, req, res, next) {
   console.log("ERROR on request %s %s %s", req.method, req.url, err);
   console.log("STACK", err.stack);
   res.status(500);

   res.end();
}



/********************************************************************************/
/*										*/
/*	Restful session management						*/
/*										*/
/********************************************************************************/

async function session(req, res, next) {
   console.log("REST SESSION", req.session, req.query, req.body, req.params);
   if (req.session == null) {
      let sid = req.body ? req.body.session : null;
      if (sid == null && req.query) sid = req.query.session;
      if (sid != null) {
	 let row = await db.query01(
	    "SELECT * from iQsignRestful WHERE session = $1",
	    [sid]
	 );
	 if (row != null) {
	    let ltime = new Date(row.last_time);
	    let now = new Date();
	    if (ltime.getTime() == NaN) ltime = new Date(0);
	    console.log("CHECK TIMES", ltime, now, ltime.getTime(), now.getTime());
	    if (now.getTime() - ltime.getTime() > config.SESSION_TIMEOUT) {
	       row = null;
	       sid = null;
	    }
	    req.session = row;
	 }
	 else sid = null;
      }
      if (sid == null) {
	 sid = uuid.v1();
	 let code = config.randomString(32);
	 await db.query(
	    "INSERT INTO iQsignRestful (session,code) " + "VALUES ($1,$2)",
	    [sid, code]
	 );
	 req.session = {
	    session: sid,
	    userid: null,
	    code: code,
	 };
      }
   }

   req.session.uuid = req.session.session;

   console.log("SESSION", req.session);

   next();
}



async function handleAuthorize(req, res) {
   console.log("AUTHORiZE", req.token);

   req.session.userid = null;

   let row = await db.query1("SELECT * FROM iQsignLoginCodes WHERE code = $1", [
      req.token,
   ]);
   req.session.userid = row.userid;
   req.session.code = req.token;

   await db.query(
      "UPDATE iQsignLoginCodes SET last_used = CURRENT_TIMESTAMP " +
      "WHERE code = $1",
      [req.token]
   );

   await updateSession(req);

   let rslt = {
      status: "OK",
      session: req.session.session,
      userid: row.userid,
      signid: row.signid,
   };

   res.end(JSON.stringify(rslt));
}



async function updateSession(req) {
   console.log("REST UPDATE SESSION", req.session);
   if (req.session != null) {
      await db.query(
	 "UPDATE iQsignRestful " +
	 "SET userid = $1, last_used = CURRENT_TIMESTAMP " +
	 "WHERE session = $2",
	 [req.session.userid, req.session.session]
      );
   }
}



async function authenticate(req, res, next) {
   console.log("REST AUTH", req.session, req.body, req.query, req.token);

   if (req.token != null && req.token != req.session.code) {
      let rslt = { status: "ERROR", message: "Bad authorization code" };
      res.status(400);
      res.json(rslt);
   }

   if (req.session.userid == null) {
      let rslt = { status: "ERROR", message: "Unauthorized" };
      res.status(400);
      res.json(rslt);
   }
   else {
      await updateSession(req);
      if (req.session.user == null) {
	 let row = await db.query1("SELECT * FROM iQsignUsers WHERE id = $1", [
	    req.session.userid,
	 ]);
	 row.password = null;
	 row.altpassword = null;
	 req.session.user = row;
	 req.user = row;
      }
      if (req.session.user != null) users_active.add(req.session.user.username);
      console.log("REST DONE AUTHENTICATE");
      next();
   }
}



async function handleLogout(req, res, next) {
   if (req.session.user != null) users_active.remove(req.session.user.username);

   req.user = null;
   if (req.sesison != null) {
      req.session.userid = null;
      req.session.user = null;
      await updateSession();
   }

   res.status(200);
   res.json({ status: "OK" });
}



/********************************************************************************/
/*										*/
/*	Handle user updates							*/
/*										*/
/********************************************************************************/

async function handleSaveSignImage(req,res)
{
   let uid = req.user.username;
   users_updated.add(uid);

   sign.handleSaveSignImage(req,res);
}


async function handleRemoveSavedSignImage(req,res)
{
   let uid = req.user.username;
   users_updated.add(uid);

   sign.handleRemoveSavedSignImage(req,res);
}



async function handlePing(req, res) {
   console.log("PING", req.body, users_active, users_updated);

   let users = req.body.users;
   let upds = [];
   let auth = [];
   for (let u of req.body.users) {
      if (!users_active.has(u)) auth.push(u);
      if (users_updated.delete(u)) upds.push(u);
    }

   let rslt = {
	 status: "OK",
	 authorize: auth,
	 update : upds,
    };

   res.end(JSON.stringify(rslt));
}




/********************************************************************************/
/*										*/
/*	Handle login/register							*/
/*										*/
/********************************************************************************/

async function handlePrelogin(req, res) {
   let rslt = {
      session: req.session.session,
      code: req.session.code,
   };

   console.log("REST PRE LOGIN", req.session, rslt);

   res.end(JSON.stringify(rslt));
}



async function handleLogin(req, res) {
   console.log("REST LOGIN", req.session);

   req.session.userid = null;

   await auth.handleLogin(req, res, true);

   if (req.session.user != null) {
      req.session.userid = req.session.user.id;
      users_active.add(req.session.user.username);
   }
   await updateSession(req);
}



async function handleRegister(req, res) {
   console.log("REST REGISTER");

   await auth.handleRegister(req, res, true);
}



/********************************************************************************/
/*										*/
/*	Handle sign requests							*/
/*										*/
/********************************************************************************/

async function handleGetAllSigns(req, res) {
   console.log("REST LIST SIGNS", req.session);

   let rows = await db.query("SELECT * FROM iQsignSigns WHERE userid = $1", [
      req.session.userid,
   ]);
   console.log("SIGN LIST ", rows);
   let data = [];
   for (let row of rows) {
      let sd = await getDataFromRow(row);
      data.push(sd);
      //    await checkSavedSign(sd);
   }
   let rslt = { status: "OK", data: data };
   console.log("RESULT", data);
   res.status(200);
   res.json(rslt);
}


async function checkSavedSign(signdata) {
   let rows = db.query("SELECT * FROM iQsignDefines " +
      "WHERE (userid = $1 OR userid IS NULL) AND name = $2",
      [signdata.userid, signdata.displayname]);
   if (rows != null && rows.length > 0) return;
   sign.handleNewSign(signdata);
}



async function getDataFromRow(row) {
   let dname = await sign.getDisplayName(row);
   let wurl = sign.getWebUrl(row.namekey);
   let iurl = sign.getImageUrl(row.namekey);
   let sd = {
      name: row.name,
      displayname: dname,
      width: row.width,
      height: row.height,
      namekey: row.namekey,
      dim: row.dimension,
      signurl: wurl,
      imageurl: iurl,
      signbody: row.lastsign,
      interval: row.interval,
      signid: row.id,
      signuser: row.userid,
      localimageurl: sign.getLocalImageUrl(row.namekey),
   };

   return sd;
}



/********************************************************************************/
/*										*/
/*	Handle user editing							*/
/*										*/
/********************************************************************************/

async function handleAddSign(req, res) {
   console.log("REST ADD SIGN", req.body);
   let fg = await sign.setupSign(
      req.body.name,
      req.user.email,
      req.body.signname
   );
   if (!fg) {
      let rslt = { status: "ERROR" };
      console.log("ADD SIGN FAILED");
      res.status(200);
      res.json(rslt);
   }
   else {
      handleGetAllSigns(req, res);
   }
}



async function handleRemoveUser(req, res) {
   let uid = req.user.id;

   req.user = null;
   if (req.session) {
      req.session.user = null;
      res.session.userid = null;
   }

   await db.query("DELETE FROM OauthTokens WHERE userid = $1", [uid]);
   await db.query("DELETE FROM OauthCodes WHERE userid = $1", [uid]);
   await db.query("DELETE FROM iQsignRestful WHERE userid = $1", [uid]);
   await db.query("DELETE FROM iQsignUseCounts WHERE userid = $1", [uid]);
   await db.query("DELETE FROM iQsignSignCodes WHERE userid = $1", [uid]);
   await db.query("DELETE FROM iQsignDefines WHERE userid = $1", [uid]);
   await db.query("DELETE FROM iQsignImages WHERE userid = $1", [uid]);
   await db.query("DELETE FROM iQsignSigns WHERE userid = $1", [uid]);
   await db.query("DELETE FROM iQsignValidator WHERE userid = $1", [uid]);
   await db.query("DELETE FROM iQsignUsers WHERE id = $1", [uid]);

   let rslt = { status: "OK" };
   res.status(200);
   res.json(rslt);
}



/********************************************************************************/
/*										*/
/*	Handle sign editing							*/
/*										*/
/********************************************************************************/

async function handleSetSignTo(req, res) {
   console.log("REST SIGN SETTO", req.body, req.params);
   let sid = req.params.signid;
   if (sid == null) sid = req.body.signid;
   let row = await db.query1("SELECT * FROM iQsignSigns WHERE id = $1", [sid]);
   let cnts = "=" + req.body.value + "\n";
   if (req.body.sets != null) {
      cnts += "= " + req.body.sets + "\n";
   }
   if (req.body.other != null && req.body.other != "") {
      cnts += "# " + req.body.other + "\n";
   }
   let row1 = await sign.changeSign(row, cnts);
   let data = await getDataFromRow(row1);
   let rslt = { status: "OK", data: data };
   res.status(200);
   res.json(rslt);
}



async function handleUpdate(req, res) {
   console.log("REST SIGN UPDATE", req.body, req.params);

   await sign.doHandleUpdate(req, res);
   let rslt = { status: "OK" };
   res.status(200);
   res.json(rslt);
}



async function handleGetAllSavedSigns(req, res) {
   console.log("REST GET ALL SAVED SIGNS", req.session);

   let data = [];
   let used = {};

   let q =
      "SELECT * FROM iQsignDefines D " +
      "LEFT OUTER JOIN iQsignUseCounts C ON D.id = C.defineid " +
      "WHERE D.userid = $1 OR D.userid IS NULL " +
      "ORDER BY C.count DESC, C.last_used DESC, D.id";
   let rows = await db.query(q, [req.session.userid]);

   for (let row of rows) {
      let sd = {
	 name: row.name,
	 contents: row.contents,
	 defid: row.id,
	 userid: row.userid,
	 lastupdate: row.lastupdate,
      };
      let sd1 = used[row.name];
      if (sd1 != null) {
	 if (sd1.userid == null) {
	    sd1.contents = row.contents;
	    sd1.defid = row.id;
	    sd1.userid = row.userid;
	    sd1.lastupdate = row.lastupdate;
	 }
	 continue;
      }
      used[row.name] = sd;
      data.push(sd);
   }

   console.log("RESULT", data);

   let rslt = { status: "OK", data: data };
   res.status(200);
   res.json(rslt);
}



function defSort(d1, d2) {
   return d1.lastupdate.getTime() - d2.lastupdate.getTime();
}



/********************************************************************************/
/*										*/
/*	Exports 								*/
/*										*/
/********************************************************************************/

exports.restRouter = restRouter;

/* end of module rest */

