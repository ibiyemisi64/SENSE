/********************************************************************************/
/*										*/
/*		email.js							*/
/*										*/
/*	Code for handling email sending 					*/
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


var nodemailer = require('nodemailer-promise');

var config = require('./config.js');




/********************************************************************************/
/*										*/
/*	Setup mail								*/
/*										*/
/********************************************************************************/

var emaildata = config.emailData();
var configdata = { host : emaildata.host,
      auth: { user: emaildata.user, pass: emaildata.password } };
configdata = { service: "Gmail",
      auth: { user: emaildata.user, pass: emaildata.password } };
var sender = nodemailer.config(configdata);

var defaultOptions = {
   from: emaildata.fromid
};


/********************************************************************************/
/*										*/
/*	Send mail								*/
/*										*/
/********************************************************************************/

async function sendMail(addr,subj,cnts)
{
   console.log("SENDMAIL",addr,cnts);

   var opts = { };
   for (var opt in defaultOptions) {
      opts[opt] = defaultOptions[opt];
    }

   opts.to = addr;
   opts.subject = subj;
   opts.text = cnts;

   console.log("EMAIL ",configdata,opts);
   let rslt = await sender(opts);
   console.log("MAIL RESULT",rslt);

   return rslt;
}


async function sendMailToiQsign(addr,subj,cnts,cb)
{
   console.log("SENDMAILTO",addr,cnts);

   var opts = { to : emaildata.toid, from: addr, subject: subj, text: cnts };

   return await sender(opts,cb);
}



/********************************************************************************/
/*										*/
/*	Exports 								*/
/*										*/
/********************************************************************************/

exports.sendMail = sendMail;
exports.sendMailToiQsign = sendMailToiQsign;


/* end of email.js */

