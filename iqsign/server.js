 /********************************************************************************/
/*										*/
/*		server.js							*/
/*										*/
/*	 Main server code of iQsign web service 				*/
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

const http = require('http');
const https = require('https');
const path = require('path');


const express = require('express');

const errorhandler = require('errorhandler');
const logger = require('morgan');
const bodyparser = require('body-parser');
const axios = require("axios");
const cors = require("cors");
const exphbs = require("express-handlebars");
const handlebars = exphbs.create( { defaultLayout : 'main'});
const favicons = require("connect-favicons");
const session = require('express-session');
const cookieparser = require('cookie-parser');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const redisClient = redis.createClient();
const uuid = require('node-uuid');
const bearerToken = require('express-bearer-token');
const fspromise = require('fs/promises');

const { StateRefreshResopnse, StateUpdateRequest } = require('st-schema');

const connector = require('./connector');
const config = require("./config");
const auth = require("./auth");
const db = require("./database");
const sign = require("./sign");
const defaultsigns = require("./defaultsigns");
const images = require("./images");
const smartthings = require("./smartthings");
const rest = require("./rest");




/********************************************************************************/
/*										*/
/*	Express setup								*/
/*										*/
/********************************************************************************/

function setup()
{
    const app = express();
    const restful = rest.restRouter(express.Router());

    app.engine('handlebars', handlebars.engine);
    app.set('view engine','handlebars');
    
    app.use(cors());

    app.use(logger('combined'));

    app.use(favicons(__dirname + config.STATIC));

    app.use(initialize);

    app.use(bodyparser.urlencoded({ extended: true } ));
    app.use(bodyparser.json());
    app.use(bearerToken());

    console.log("IMAGEDIR",config.getWebDirectory() + "/signs/");
    app.use('/static',express.static(__dirname + config.STATIC));
    app.use('/signimage',express.static(config.getWebDirectory() + "/signs/"));
    app.get('/robots.txt',(req1,res1) => { res1.redirect('/static/robots.txt')});

    // Serve React static files
    app.use(express.static(path.join(__dirname, '../IQSignSENSE/dist')));

    // React fallback for unmatched routes
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../IQSignSENSE/dist', 'index.html'));
    });

//  app.use(cors({credentials: true, origin: true}));
    app.use(cors());

    app.post('/smartthings',smartthings.handleSmartInteraction);
//  app.post('/smartapp',smartthings.handleSmartThings);
//  app.get('/smartapp',smartthings.handleSmartThingsGet);

    app.all('/rest/*',restful);

    app.use(session( { secret : config.SESSION_KEY,
	  store : new RedisStore({ client: redisClient }),
	  saveUninitialized : true,
	  resave : true }));
    app.use(sessionManager);

    app.get('/login',auth.displayLoginPage);
    app.post('/login',auth.handleLogin);

    app.get('/register',auth.displayRegisterPage);
    app.post('/register',auth.handleRegister);
    app.get('/validate',auth.handleValidate);
    app.get('/forgotpassword',auth.handleForgotPassword);
    app.post('/resetpassword',auth.handleResetPassword);
    app.get('/newpassword',auth.handleGetNewPassword);
    app.post('/newpassword',auth.handleSetNewPassword);

    app.get("/",displayRootPage);
    app.get("/instructions",displayInstructionsPage);
    app.get("/about",displayAboutPage);
    app.get("/default",displayDefaultPage);

    app.use(auth.authenticate);

    app.get("/svgimages",images.displaySvgImagePage);
    app.get("/savedimages",images.displaySavedImagePage);
    app.get("/image",images.displayImage);

    app.get("/index",sign.displayIndexPage);
    app.get("/home",sign.displayHomePage);
    app.get("/sign",sign.displaySignPage);
    app.post("/gencode",sign.displayCodePage);
    app.post("/createcode",sign.createLoginCode);

    app.post("/editsign",sign.handleUpdate);
    app.post("/savesignimage",sign.handleSaveSignImage);
    app.post("/loadsignimage",sign.handleLoadSignImage);
    app.get("/loadimage",images.displayLoadImagePage);
    app.post("/loadimage",images.handleLoadImage);

    app.all('*',handle404);
    app.use(errorHandler);

    const server = app.listen(config.PORT);
    console.log(`HTTP Server listening on port ${config.PORT}`);

    try {
	const httpsserver = https.createServer(config.getHttpsCredentials(),app);
	httpsserver.listen(config.HTTPS_PORT);
	console.log(`HTTPS Server listening on port ${config.HTTPS_PORT}`);
     }
    catch (error) {
	console.log("Did not launch https server",error);
     }
}



 /********************************************************************************/
/*										*/
/*	Static displays 							*/
/*										*/
/********************************************************************************/

function displayRootPage(req,res)
{
   console.log("ROOT PAGE",req.session.user);
   if (req.session.user == null) res.redirect("/login");
   else res.redirect("/home");
}

function displayDefaultPage(req,res)
{
   console.log("DEFAULT PAGE",req.query,req.session,req.oauth);
   res.render("default");
}


function displayAboutPage(req,res)
{
   res.render("about");
}


function displayInstructionsPage(req,res,what)
{
   res.render("instructions");
}




/********************************************************************************/
/*										*/
/*	Session management							*/
/*										*/
/********************************************************************************/

function sessionManager(req,res,next)
{
   if (req.session.uuid == null) {
      req.session.uuid = uuid.v1();
      req.session.save();
      console.log("START SESSION",req.session);
    }
   next();
}



/********************************************************************************/
/*										*/
/*	Error handling								*/
/*										*/
/********************************************************************************/

function handle404(req,res)
{
   res.status(404);
   if (req.accepts('html')) {
      res.render('error404', { title: 'Page Not Found'});
    }
   else if (req.accepts('json')) {
      let rslt = { status : 'ERROR', reason: 'Invalid URL'} ;
      res.end(JSON.stringify(rslt));
    }
   else {
      res.type('txt').send('Not Found');
    }
}



function errorHandler(err,req,res,next)
{
   console.log("ERROR on request %s %s %s",req.method,req.url,err);
   console.log("STACK",err.stack);

   res.status(500);
   let msg = 'Server Error';
   if (req.accepts('html')) {
      res.render('error500', { title: 'Server error' });
    }
   else if (req.accepts('json')) {
      let rslt = { status : 'ERROR' ,reason: msg} ;
      res.end(JSON.stringify(rslt));
    }
   else {
      res.type('txt').send('Server Error');
    }
}

var is_inited = false;

async function initialize(req,res,next)
{
   if (!is_inited) {
      await init();
      is_inited = true;
    }
   next();
}


/********************************************************************************/
/*                                                                              */
/*      Cleanup database and files                                              */
/*                                                                              */
/********************************************************************************/

async function cleanup()
{
   console.log("BEGIN CLEANUP", new Date());

   await db.query("DELETE FROM iQsignRestful WHERE last_used + interval '4 days' < CURRENT_TIMESTAMP");
   
   let rows = await db.query("SELECT namekey FROM iQsignSigns");
   let f = config.getWebDirectory() + "/signs";
   let files = await fspromise.readdir(f);
   console.log("FILES IN ",f,files);
   for (const file of files) {
      let f1 = /image(.*)\.png/.exec(file);
      let f2 = /sign(.*)\.html/.exec(file);
      let f3 = /imagePREVIEW(.*)\.png/.exec(file);
      if (f3 != null) f1 = f3;
      else if (f1 == null) f1 = f2;
      if (f1 == null) continue;
      let key = f1[1];
      let fnd = false;
      for (let i = 0; i < rows.length; ++i) {
         console.log("COMPARE",rows[i].namekey,key);
         if (rows[i] == key) fnd = true;
       }
      let path = f + "/" + file;
      if (fnd) {
         console.log("KEEP SIGN FILE",path);
         continue;
       }
      console.log("REMOVE SIGN FILE",path);
//    fspromise.unlink(path);
   }
   
   console.log("CLEANUP COMPLETE");
}
   

/********************************************************************************/
/*										*/
/*	Main routine								*/
/*										*/
/********************************************************************************/

async function init()
{
   console.log("START INIT");
   await defaultsigns.update();
   await images.loadImages();
   console.log("DONE INIT");
}

// cleanup();

setup();

setInterval(cleanup,1000*60*60)

exports.displayInstructionsPage = displayInstructionsPage;
exports.displayAboutPage = displayAboutPage;


/* end of server.js */


