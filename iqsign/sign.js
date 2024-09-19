/********************************************************************************/
/*										*/
/*		sign.js 							*/
/*										*/
/*	Code for managing the sign						*/
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

const db = require('./database');
const config = require("./config");
const auth = require("./auth");

const handlebars = require("handlebars");

const fs = require("fs/promises");
const util = require("util");
const { exec, spawn } = require('child-process-async');
const tmp = require('tmp-promise');
tmp.setGracefulCleanup();

const net = require("net");
const { PromiseSocket } = require("promise-socket");

let qropts = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
};

var preview_counters = { };
var preview_busy = { };
var exec_counters = { };
var exec_busy = { };



/********************************************************************************/
/*										*/
/*	Display home page							*/
/*										*/
/********************************************************************************/

async function displayIndexPage(req,res)
{
   return displayHome(req,res,false);
}


async function displayHomePage(req,res)
{
   return displayHome(req,res,true);
}



async function displaySignPage(req,res)
{
   displayHome(req,res,false,req.query.sign);
}



async function displayHome(req,res,home,sid)
{
   if (req.session.user == null) {
      res.redirect("/login");
      return;
    }
   
   let rows = null;
   if (sid == null) {
      rows = await db.query("SELECT * FROM iQsignSigns WHERE userid = $1",
            [req.session.user.id]);
    }
   else {
      rows = await db.query("SELECT * FROM iQsignSigns WHERE userid = $1 AND id = $2",
            [req.session.user.id,sid]);
    }
   
   if (rows.length == 0) {
      rows = await db.query("SELECT * FROM iQsignUsers WHERE id = $1",
            [req.session.user.id]);
      if (rows.length == 0) res.redirect('/login');
      else res.redirect('/login');
    }
   else if (rows.length == 1 && !home) {
      renderSignPage(req,res,rows[0]);
    }
   else {
      renderHomePage(req,res,rows);
    }
}



/********************************************************************************/
/*										*/
/*	Home page rendering							*/
/*										*/
/********************************************************************************/

function renderHomePage(req,res,signsdata)
{
   let data = { signs : signsdata, user : req.session.user, code : req.session.code };
   
   if (signsdata.length == 1) {
      data.signwidth = 6;
    }
   else {
      data.signwidth = 5;
      data.remove = true;
    }
   data.urlpfx = "http://" + config.getWebHost() + "/iqsign";
   
   res.render("home" ,data);
}



async function renderSignPage(req,res,signdata)
{
   let rows0 = await db.query("SELECT id, name FROM iQsignDefines " +
         "WHERE userid = $1 OR userid IS NULL", [req.session.user.id ]);
   let rows1 = await db.query("SELECT id,name FROM iQsignImages " +
         "WHERE userid = $1 OR userid IS NULL", [req.session.user.id ]);
   let data = {
         sign : signdata,
         user : req.session.user,
         code: req.session.code,
         urlpfx : "http://" + config.getWebHost() + "/iqsign",
         savedsigns : rows0,
         savedimages : rows1,
         anysavedimages : rows1.length > 0,
         random: Math.random(),
    };
   data["dim" + signdata.dimension] = "selected";
   
   res.render("sign" ,data);
}



/********************************************************************************/
/*										*/
/*	Handle update request							*/
/*										*/
/********************************************************************************/

async function handleUpdate(req,res)
{
   let signdata = await doHandleUpdate(req,res);
   renderSignPage(req,res,signdata);
}



async function doHandleUpdate(req,res)
{
   console.log("Sign UPDATE",req.body);
   let s = req.body.signdata.trim();
   let ss = s;
   ss = ss.replace(/\r/g,"");
   ss = ss.replace(/\t/g," ");
   
   let uid = req.body.signuser;
   let sid = req.params.signid;
   if (sid == null) sid = req.body.signid;
   
   if (req.body.signuser != req.user.id) throw "Invalid user";
   
   console.log("UPDATE DATA",ss);
   
   let row = await db.query1("SELECT * FROM iQsignSigns WHERE id = $1 " +
         " AND userid = $2 AND namekey = $3",
         [ sid, uid, req.body.signkey ]);
   
   
   await db.query("UPDATE iQsignSigns " +
         "SET name = $1, lastsign = $2, lastupdate = CURRENT_TIMESTAMP, " +
         "  dimension = $3, width = $4, height = $5, displayname = NULL " +
         "WHERE id = $6",
         [req.body.signname, ss, req.body.signdim,
            req.body.signwidth, req.body.signheight, sid]);
   
   let signdata = await db.query1("SELECT * FROM iQsignSigns WHERE id = $1 " +
         " AND userid = $2 AND namekey = $3",
         [ sid, req.body.signuser, req.body.signkey ]);
   
   await setupWebPage(signdata);
   await updateSign(signdata,req.user.id,false,false);
   
   console.log("SIGN SHOULD BE READY");
   
   return signdata;
}



async function changeSign(signdata,cnts)
{
   console.log("SIGN UPDATE",signdata,cnts);
   let s = cnts.trim();
   let ss = s;
   ss = ss.replace(/\r/g,"");
   ss = ss.replace(/\t/g," ");
   await db.query("UPDATE iQsignSigns SET lastsign = $1, displayname = NULL " + " WHERE id = $2",
         [ ss, signdata.id ]);
   signdata.lastsign = ss;
   signdata.displayname = null;
   
   await handleNewSign(signdata);
   
   await setupWebPage(signdata);
   await updateSign(signdata,signdata.userid,true,false);
   
   return signdata;
}



async function handleNewSign(signdata)
{
   let dname = await getDisplayName(signdata);
   let user = true;
   let row = await db.query01("SELECT * FROM iQsignDefines D WHERE D.userid = $1 AND D.name = $2",
         [signdata.userid,dname]);
   if (row == null) {
      row = await db.query01("SELECT * FROM iQsignDefines D WHERE D.userid IS NULL and D.name = $1",
            [dname]);
      user = false;
    }
   if (row == null) {
      // no previous definition
      await db.query("INSERT INTO iQsignDefines(id,userid,name,contents) " +
            "VALUES ( DEFAULT, $1, $2, $3)",
            [signdata.userid, dname, signdata.lastsign]);
    }
   else if (row.contents != signdata.contents && user) {
      await db.query("UPDATE iQsignDefines SET contents = $1 WHERE id = $2",
            [signdata.lastsign,row.id]);
    }
}



/********************************************************************************/
/*                                                                              */
/*      Handle preview sign image                                               */
/*                                                                              */
/********************************************************************************/

async function handlePreviewSign(req,res)
{
   console.log("Sign PREVIEW",req.body);
   let s = req.body.signdata.trim();
   let ss = s;
   ss = ss.replace(/\r/g,"");
   ss = ss.replace(/\t/g," ");
   
   let uid = req.body.signuser;
   let sid = req.params.signid;
   if (sid == null) sid = req.body.signid;
   
   if (req.body.signuser != req.user.id) throw "Invalid user";
   
   let signdata = await db.query1("SELECT * FROM iQsignSigns WHERE id = $1 " +
         " AND userid = $2 AND namekey = $3",
         [ sid, req.body.signuser, req.body.signkey ]);
   
   
   console.log("PREVIEW DATA",ss);
   signdata.lastsign = ss;
   await updateSign(signdata,uid,false,true)
   
   handleOk(req,res);
}


/********************************************************************************/
/*										*/
/*	Handle save sign							*/
/*										*/
/********************************************************************************/

async function handleSaveSignImage(req,res)
{
   console.log("SAVE SIGN IMAGE",req.body);
   
   if (req.body.signid == null) return handleError(req,res,"No sign id");
   if (req.body.name == '') return handleError(req,res,"No name given");
   let uid = req.user.id;
   if (req.user.admin) uid = null;
   
   let rows = await db.query("SELECT * FROM iQsignSigns WHERE id = $1 ",
         [ req.body.signid ]);
   if (rows.length == 0) return handleError(req,res,"Invalid sign id");
   let signdata = rows[0];
   if (signdata.userid != req.body.signuser) return handleError(req,res,"Invalid user");
   if (signdata.namekey != req.body.signnamekey) return handleError(req,res,"Invalid namekey");
   let cnts = req.body.signbody;
   if (cnts == null) cnts = signdata.lastsign;
   
   let rows1 = await db.query("SELECT * FROM iQsignDefines " +
         "WHERE userid = $1 AND name = $2",
         [ uid, req.body.name ]);
   if (rows1.length == 0) {
      let rows2 = await db.query("INSERT INTO iQsignDefines(userid,name,contents) " +
            "VALUES ( $1, $2, $3 )",
            [ uid, req.body.name, cnts ]);
      rows1 = await db.query1("SELECT * FROM iQsignDefines " +
            "WHERE userid = $1 AND name = $2",
            [ uid, req.body.name ]);
      await db.query("INSERT INTO iQsignUseCounts (defineid,userid) VALUES ($1,$2)",
            [rows1.id,uid]);
    }
   else {
      let rows3 = await db.query("UPDATE iQsignDefines SET contents = $1 "+
            "WHERE userid = $2 AND name = $3",
            [ cnts, uid, req.body.name ]);
    }
   
   handleOk(req,res);
}



async function handleRemoveSavedSignImage(req,res)
{
   console.log("REMOVE SIGN IMAGE",req.body);
   if (req.body.name == '') return handleError(req, res, "No name given");
   
   let row = await db.query01("SELECT id FROM iQsignDefines WHERE name = $1 AND userid = $2",
      [req.body.name,req.user.id]);
   if (row != null) {
      await db.query("DELETE FROM iQsignUsageCounts WHERE defineid = $1",
         [row.id]);
   }
   
   await db.query("DELETE FROM iQsignDefines WHERE name = $1 AND userid = $2",
         [req.body.name,req.user.id]);
   
   handleOk(req,res);
}



/********************************************************************************/
/*										*/
/*	Handle load sign							*/
/*										*/
/********************************************************************************/

async function handleLoadSignImage(req,res)
{
   console.log("LOAD SIGN IMAGE",req.body);
   
   if (req.body.signid == null) return handleError(req,res,"No sign id");
   let name = null;
   let nameid = null;
   if (req.body.nameid != null) {
      nameid = req.body.nameid;
      if (nameid == "*Current*") name = "*Current*";
    }
   else if (req.body.signname != null) {
      name = req.body.signname;
    }
   if (!name && !nameid) return handleError(req,res,"No name given");
   
   let cnts = null;
   if (name == "*Current*") {
      let rows = await db.query("SELECT * FROM iQsignSigns WHERE id = $1",
            [ req.body.signid ]);
      if (rows.length == 0) return handleError(req,res,"Invalid sign id");
      let signdata = rows[0];
      if (signdata.userid != req.user.id && signdata.userid != null)
         return handleError(req,res,"Invalid user");
      if (signdata.namekey != req.body.signnamekey) return handleError(req,res,"Invalid namekey");
      cnts = signdata.lastsign;
    }
   else {
      let rows = [];
      if (nameid != null) {
         rows = await db.query("SELECT * FROM iQsignDefines WHERE id = $1",
               [ nameid ]);
       }
      else {
         rows = await db.query("SELECT * FROM iqSignDefines WHERE name = $1 AND userid = $2",
               [name,req.user.id]);
         if (rows.length == 0) {
            rows = await db.query("SELECT * FROM iQsignDefines WHERE name = $1 AND userid IS NULL",
                  [ name ]);
          }
       }
      if (rows.length == 0) return handleError(req,res,"Bad define id");
      let defdata = rows[0];
      if (defdata.userid != null && defdata.userid != req.user.id)
         return handleError(req,res,"Bad user define id");
      cnts = defdata.contents;
      name = defdata.name;
    }
   
   console.log
   
   let data = {
         name : name,
         contents : cnts,
    };
   handleOk(req,res,data);
}


/********************************************************************************/
/*										*/
/*	Setup a sign for a user 						*/
/*										*/
/********************************************************************************/

async function setupSign(name, email, signname)
{
   let namekey = config.randomString(8);
   let s = config.INITIAL_SIGN.trim();
   let ss = s;
   ss = ss.replace(/\r/g, "");
   ss = ss.replace(/\t/g, " ");
   
   console.log("SIGN", name, email, namekey, ss);
   let rows0 = await db.query("SELECT id FROM iQsignUsers WHERE email = $1", 
         [ email ]);
   if (rows0.length != 1) {
      console.log("SETUP SIGN: Bad user email", email);
      return false;
    }
   console.log(rows0);
   let uid = rows0[0].id;
   
   let rows1 = await db.query("SELECT * FROM iQsignSigns WHERE userid = $1", [
      uid,
   ]);
   
   // case where there is already an existing sign
   if (rows1 != null && signname != null) {
      ss = signname;
    }
   
   await db.query(
         "INSERT INTO iQsignSigns (id, userid, name, namekey, lastsign) " +
         "VALUES ( DEFAULT, $1, $2, $3, $4 )",
         [uid, name, namekey, ss]
   );
   
   let signdata = await db.query1(
         "SELECT * FROM iQsignSigns WHERE namekey = $1",
         [namekey]
   );
   
   await handleNewSign(signdata);
   
   await setupWebPage(signdata);
   // create named sign for CURRENT <signname> CONTENTS
   await updateSign(signdata, uid, false,false);
   
   return true;
}



async function setupWebPage(signdata)
{
   var txt = await fs.readFile(config.TEMPLATE_FILE,'utf8');
   txt = txt.toString().trim() + "\n";
   var template = handlebars.compile(txt);
   var data = { namekey : signdata.namekey };
   var result = template(data);
   console.log("SETUP PAGE",getHtmlFile(signdata.namekey));
   await fs.writeFile(getHtmlFile(signdata.namekey),result);
}




/********************************************************************************/
/*										*/
/*	Update sign								*/
/*										*/
/********************************************************************************/

async function updateSign(signdata,uid,counts,preview)
{
   let fg = await waitForUpdateReady(uid,preview);
   
   if (fg) {
      await updateSignSocket(signdata,uid,counts,preview);
      finishUpdate(uid,preview);
    }
}


async function updateSignSocket(signdata,uid,counts,preview)
{
   let pass = {
         width : signdata.width,
         height : signdata.height,
         userid : uid,
         contents : signdata.lastsign,
         outfile : getImageFile(signdata.namekey,preview),
         counts : counts
    };
   
   console.log("START SIGN UPDATE SOCKET");
   
   let sock = new net.Socket({ allowHalfOpen : true, readable : true, writable : true });
   let psock = new PromiseSocket(sock);
   psock.setTimeout(10000);
   
   await psock.connect(config.MAKER_PORT);
   await psock.writeAll(JSON.stringify(pass));
   await psock.end();
   let data = await psock.readAll();
   let rslt = JSON.parse(data);
   sock.destroy();
   console.log("DONE SOCKET SIGN DONE SUPDATE",rslt);
}


async function updateSignExec(signdata,counts,preview)
{
   let data = signdata.lastsign;
   
   let w = signdata.width;
   let h = signdata.height;
   let tmpobj = await tmp.file();
   await fs.writeFile(tmpobj.path,data);
   
   console.log("UPDATE CONTENTS",data);
   
   let args = [ "-w", w, "-h", h, "-i", tmpobj.path, "-o", getImageFile(signdata.namekey,preview) ];
   if (counts) args.push("-c");
   
   console.log("UPDATE SIGN",args);
   
   const child = spawn(config.getSignBuilder(), args, { } );
   child.stderr.on('data', (data2) => {
      console.log('signmaker:',data2);
    });
   child.stdout.on('data', (data1) => {
      console.log('signmaker:',data1);
    });
   const { exitCode } = await child;
   
   console.log("DONE EXEC",exitCode);
}

async function waitForUpdateReady(uid,preview)
{
   let ctr = (preview ? preview_counters : exec_counters);
   let busy = (preview ? preview_busy : exec_busy);
   let c = ctr[uid];
   if (c == null) {
      c = 1;
      busy[uid] = false;
      console.log("SIGN UPDATE SETUP USER", uid,preview);
    }
   else {
      c = ++c;
      console.log("SIGN UPDATE USER COUNT", uid, c,preview);
    }
   ctr[uid] = c;
   while (busy[uid] && ctr[uid] == c) {
      console.log("SIGN UPDATE WAIT", uid, c);
      await config.sleepNow(5);
    }
   if (ctr[uid] != c) {
      console.log("SIGN UPDATE SKIP",uid,ctr[uid],c,busy[uid])
      return false;
   }
   busy[uid] = true;
   console.log("SIGN UPDATE BUSY", uid, c,preview);
   return true;
}

function finishUpdate(uid,preview)
{
   let busy = (preview ? preview_busy : exec_busy);
   busy[uid] = false;
   console.log("SIGN UPDATE DONE", uid,preview);
   // notify
}



function getImageUrl(namekey)
{
   return "http://" + config.getWebHost() + "/iqsign/signs/image" + namekey  + ".png";
}


function getLocalImageUrl(namekey)
{
   let pfx = "https://" + config.getWebHost() + ":" + config.HTTPS_PORT;
   
   return pfx + "/signimage/image" + namekey + ".png";
}

function getWebUrl(namekey)
{
   return "http://" + config.getWebHost() + "/iqsign/signs/sign" + namekey  + ".html";
}



function getImageFile(key,preview)
{
   let p = "";
   if (preview) p = "PREVIEW";
   let f = config.getWebDirectory() + "/signs/image" + p +  key + ".png";
   return f;
}


function getHtmlFile(key)
{
   let f = config.getWebDirectory() + "/signs/sign" + key + ".html";
   return f;
}

async function getDisplayName(row)
{
   if (typeof row == "number") {
      row = await db.query1("SELECT * FROM iQsignSigns WHERE id = $1",[row]);
    }
   if (row.displayname != null) return row.displayname;
   
   console.log("GET DISPLAY NAME FOR",row);
   
   let sname = null;
   let dname = null;
   for (let line of row.lastsign.split("\n")) {
      line = line.trim();
      if (line.startsWith('=')) {
         let i = line.indexOf('=',1);
         sname = line.substring(1);
         if (i > 0) {
            while (i > 0) {
               let c = line.charAt(i);
               if (c == ' ' || c == '\t') {
                  sname = line.substring(1,i).trim();
                }
             }
          }
       }
      else if (line.startsWith('@') || line.startsWith("%")) continue;
      else if (dname == null) {
         let wds = line.split(/\s/);
         for (let wd of wds) {
            if (wd.startsWith("#")) continue;
            if (dname == null) dname = wd;
            else dname += " " + wd;
          }
       }
    }
   
   if (sname == null) {
      let row0 = await db.query01("SELECT * FROM iqSignDefines " +
            "WHERE contents = $1 AND userid = $2",
            [ row.lastsign, row.userid ]);
      if (row0 == null) {
         let row0 = await db.query01("SELECT * FROM iqSignDefines " +
               "WHERE contents = $1 AND userid IS NULL",
               [ row.lastsign ]);
       }
      if (row0 != null) sname = row0.name;
      else sname = dname;
    }
   
   await db.query("UPDATE iQsignSigns SET displayname = $1 WHERE id = $2",
         [ sname, row.id]);
   
   return sname;
}



/********************************************************************************/
/*										*/
/*	Handle generating a one-time code for a sign				*/
/*										*/
/********************************************************************************/

function displayCodePage(req,res)
{
   console.log("CODE PAGE",req.session.user,req.body);
   
   if (req.session.user.id != req.body.signuser) return handleError(req,res,"Invalid user");
   
   let data = { user : req.body.signuser, sign : req.body.signid, key: req.body.signkey };
   
   res.render("gencode",data);
}



async function createLoginCode(req,res)
{
   console.log("DISPLAY CODE",req.body,req.user,req.session);
   
   let uid = req.body.signuser;
   let sid = req.body.signid;
   let skey = req.body.signkey;
   
   if (req.body.signuser != req.session.user.id) handleError(req,res,"Invalid user");
   
   let row = await db.query1("SELECT * FROM iQsignSigns WHERE id = $1 " +
         " AND userid = $2 AND namekey = $3",
         [ sid, uid, skey ]);
   
   let code = config.randomString(24,'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
   await db.query("INSERT INTO iQsignLoginCodes ( code,userid,signid ) " +
         "VALUES ( $1, $2, $3 )",
         [code,uid,sid]);
   
   let rslt = { code : code };
   handleOk(req,res,rslt);
}



/********************************************************************************/
/*										*/
/*	Status management on pages						*/
/*										*/
/********************************************************************************/

function handleError(req,res,msg)
{
   console.log("Request failed",msg);
   
   let rslt = { status : 'ERROR', message: msg };
   res.end(JSON.stringify(rslt));
}


function handleOk(req,res,rslt)
{
   console.log("Request succeeded");
   
   if (rslt == null) {
      rslt = { status : 'OK' };
    }
   else {
      rslt.status = "OK";
    }
   
   res.end(JSON.stringify(rslt));
}



/********************************************************************************/
/*										*/
/*	Exports 								*/
/*										*/
/********************************************************************************/

exports.displayHomePage = displayHomePage;
exports.displayIndexPage = displayIndexPage;
exports.displaySignPage = displaySignPage;
exports.setupSign = setupSign;
exports.setupWebPage = setupWebPage;
exports.updateSign = updateSign;
exports.handleUpdate = handleUpdate;
exports.doHandleUpdate = doHandleUpdate;
exports.handleSaveSignImage = handleSaveSignImage;
exports.handleRemoveSavedSignImage = handleRemoveSavedSignImage;
exports.handleLoadSignImage = handleLoadSignImage;
exports.handlePreviewSign = handlePreviewSign;
exports.getImageUrl = getImageUrl;
exports.getLocalImageUrl = getLocalImageUrl;
exports.getWebUrl = getWebUrl;
exports.getDisplayName = getDisplayName;
exports.changeSign = changeSign;
exports.handleNewSign = handleNewSign;
exports.displayCodePage = displayCodePage;
exports.createLoginCode = createLoginCode;



/* end of module sign */

