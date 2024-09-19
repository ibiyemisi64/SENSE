/********************************************************************************/
/*										*/
/*		config.js							*/
/*										*/
/*	Constants for smartthings implentation of the smartsign 		*/
/*										*/
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


/********************************************************************************/
/*										*/
/*	Imports 								*/
/*										*/
/********************************************************************************/

const fs = require('fs');
const crypto = require('crypto');



/********************************************************************************/
/*										*/
/*	Connection constants							*/
/*										*/
/********************************************************************************/

const PORT = 3335;
const HTTPS_PORT = 3336;

const OAUTH_PORT = 3337;
const OAUTH_HTTPS_PORT = 3338;

const APP_PORT = 3333;
const APP_HTTPS_PORT = 3334;

const DATABASE = "postgres://spr:XXXXXX@db.cs.brown.edu/iqsign";
const DEV_DATABASE = "postgres://spr:XXXXXX@db.cs.brown.edu/iqsigndev";
const DATABASE_PWD_FILE = "dbpassword";
const DEV_DATABASE_FILE = "dbdev";
const DB_POOL_SIZE = 4;

const SESSION_KEY = "iot-iQsign-9467";
const OAUTH_SESSION_KEY = "iot-iQsign-oauth-9467";
const APP_SESSION_KEY = "iot-iQsign-app-9467";

const EMAIL_FILE = "emailpassword";
const EMAIL_FROM = "iQsign <spr@cs.brown.edu>";
const EMAIL_TO = 'spr@cs.brown.edu';

const SERVER_KEY_FILE = "serverkey";
const SERVER_CERT_FILE = "servercert";

const WEB_DIRECTORY_FILE = "/webdirectory";
const WEB_HOST_FILE = "/webhost";

const OAUTH_FILE = "stoauthtokens";
const SMART_THINGS_ID = "smartthingstokens";
const DEVICE_FILE = "deviceconfig";

const PASSWORD_DIR = __dirname + "/../secret/";
const RESOURCE_DIR = __dirname + "/../resources/";

const DEFAULT_SIGNS_FILE = "defaultsigns";
const DEFAULT_IMAGES_FILE = "defaultimages";

const SVG_IMAGE_LIBRARY_DIR = __dirname + "/../svgimagelib/svg";

const TEMPLATE_FILE = __dirname + "/views/webpage.handlebars";

const MAKER_PORT = 3399;

const STATIC = '/web/';

const INITIAL_SIGN = `
%bg ccccff %serif %fg black
@ fa-hippo
@ sv-animals/sheep
#red Initial iQsign
#blue Customize# able
#green Updatable`;


const SESSION_TIMEOUT = 1000*60*60*24*3;



/********************************************************************************/
/*                                                                              */
/*      Utility functions                                                       */
/*                                                                              */
/********************************************************************************/

function dbConnect()
{
   let dbstr = DATABASE;
   if (fs.existsSync(PASSWORD_DIR + DEV_DATABASE_FILE)) dbstr = DEV_DATABASE;

   let pwd = fs.readFileSync(PASSWORD_DIR + DATABASE_PWD_FILE,'utf8');
   pwd = pwd.toString().trim();
   let conn = dbstr.replace("XXXXXX",pwd);

   return conn;
}

function emailData()
{
   // this should be a Google APP password, not the account password
    let data = fs.readFileSync(PASSWORD_DIR + EMAIL_FILE,'utf8');
    data = data.toString().trim();
    
    let dataarr = data.split(" ");
    // console.log("EMAIL",dataarr[0],dataarr[1]);
    return { host: "smtp.gmail.com",  user : dataarr[0], password: dataarr[1],
	  fromid : EMAIL_FROM, toid: EMAIL_TO };
}


function getHttpsCredentials()
{
    let keydata = fs.readFileSync(PASSWORD_DIR + SERVER_KEY_FILE,'utf8');
    let certdata = fs.readFileSync(PASSWORD_DIR + SERVER_CERT_FILE,'utf8');
    const creds = {
	  key : keydata,
	  cert: certdata,
     };
    return creds;
}

function getWebDirectory()
{
   let dir = fs.readFileSync(PASSWORD_DIR + WEB_DIRECTORY_FILE,'utf8');
   dir = dir.toString().trim();
   return dir;
}


function getImageDirectory()
{
   let dir = __dirname + "/../savedimages/";
   return dir;
}

function getWebHost()
{
   let host = fs.readFileSync(PASSWORD_DIR + WEB_HOST_FILE,'utf8');
   host = host.toString().trim();
   return host;
}


function getSignBuilder()
{
   let x = __dirname + "/../bin/signmaker";
   return x;
}


function getDefaultSignsFile()
{
   return RESOURCE_DIR + DEFAULT_SIGNS_FILE;
}

function getDefaultImagesFile()
{
   return RESOURCE_DIR + DEFAULT_IMAGES_FILE;
}


function getOauthCredentials()
{
   let data = fs.readFileSync(PASSWORD_DIR + OAUTH_FILE,'utf8');
   data = data.toString().trim();
   return JSON.parse(data);
}


function getSmartThingsCredentials()
{
   let data = fs.readFileSync(PASSWORD_DIR + SMART_THINGS_ID,'utf8');
   data = data.toString().trim();
   return JSON.parse(data);
}


function getSignDeviceData()
{
   let data = fs.readFileSync(PASSWORD_DIR + DEVICE_FILE,'utf8');
   data = data.toString().trim();
   return JSON.parse(data);
}


/********************************************************************************/
/*										*/
/*	Utility functions							*/
/*										*/
/********************************************************************************/

function randomString(length = 48,chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' )
{
   // Pick characers randomly
   let str = '';
   for (let i = 0; i < length; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
   return str;
}

const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay))



/********************************************************************************/
/*										*/
/*	Exports 								*/
/*										*/
/********************************************************************************/

exports.PORT = PORT;
exports.HTTPS_PORT = HTTPS_PORT;
exports.OAUTH_PORT = OAUTH_PORT;
exports.OAUTH_HTTPS_PORT = OAUTH_HTTPS_PORT;
exports.APP_PORT = APP_PORT;
exports.APP_HTTPS_PORT = APP_HTTPS_PORT;
exports.STATIC = STATIC;
exports.SESSION_KEY = SESSION_KEY;
exports.OAUTH_SESSION_KEY = OAUTH_SESSION_KEY;
exports.APP_SESSION_KEY = APP_SESSION_KEY;
exports.INITIAL_SIGN = INITIAL_SIGN;
exports.dbConnect = dbConnect;
exports.DB_POOL_SIZE = DB_POOL_SIZE;
exports.randomString = randomString;
exports.emailData = emailData;
exports.getHttpsCredentials = getHttpsCredentials;
exports.getWebDirectory = getWebDirectory;
exports.getWebHost = getWebHost;
exports.getSignBuilder = getSignBuilder;
exports.TEMPLATE_FILE = TEMPLATE_FILE;
exports.MAKER_PORT = MAKER_PORT;
exports.SESSION_TIMEOUT = SESSION_TIMEOUT;
exports.getDefaultSignsFile = getDefaultSignsFile;
exports.getDefaultImagesFile = getDefaultImagesFile;
exports.SVG_IMAGE_LIBRARY_DIR = SVG_IMAGE_LIBRARY_DIR;
exports.getImageDirectory = getImageDirectory;
exports.getOauthCredentials = getOauthCredentials;
exports.getSmartThingsCredentials = getSmartThingsCredentials;
exports.getSignDeviceData = getSignDeviceData;
exports.sleepNow = sleepNow;




/* end of module config */

