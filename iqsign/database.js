/********************************************************************************/
/*										*/
/*		database.js							*/
/*										*/
/*	Database access for iQsign						*/
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

var pgpromise = require("pg-promise")();
var os = require("os");
var util = require("util");

var config = require("./config.js");




/********************************************************************************/
/*										*/
/*	Variables								*/
/*										*/
/********************************************************************************/

var connect_string = config.dbConnect();

const pg = pgpromise(connect_string);

console.log("CONNECTING TO " + connect_string);


/********************************************************************************/
/*										*/
/*	Local callback function generator					*/
/*										*/
/********************************************************************************/

function logDbQuery(q,prms)
{
   if (prms == undefined || prms instanceof Function) console.log("DB","QUERY0",q);
   else console.log("DB","QUERY",q,prms);
}



/********************************************************************************/
/*										*/
/*	Query access								*/
/*										*/
/********************************************************************************/

async function query1(q,prms)
{
   return query(q,prms,"one");
}


async function query0(q,prms)
{
   return query(q,prms,"none");
}


async function query01(q,prms)
{
   return query(q,prms,"one?");
}


async function queryN(q,prms)
{
   return query(q,prms,"many");
}


async function query(q,prms,typ)
{
   logDbQuery(q,prms);
   
   q = fixQuery(q);
   
   if (typ != null) {
      switch (typ) {
         case "one" :
            typ = pgpromise.queryResult.one;
            break;
         case "many" :
            typ = pgpromise.queryResult.many;
            break;
         case "none" :
            typ = pgpromise.queryResult.none;
         case "any" :
            typ = pgpromise.queryResult.any;
            break;
         case "one?" :
            typ = pgpromise.queryResult.none + pgpromise.queryResult.one;
            break;
       }
    }

   let rslt = pg.query(q,prms,typ);
  
   return rslt;
}



/********************************************************************************/
/*										*/
/*	Handle mysql - postgresql differences on parameters			*/
/*										*/
/********************************************************************************/

function fixQuery(q)
{
   if (connect_string.substring(0,5) == "mysql") {
      q = q.replace(/\$\d+/g,"?");
    }

   return q;
}




/********************************************************************************/
/*										*/
/*	Exports 								*/
/*										*/
/********************************************************************************/

exports.query = query;
exports.query0 = query0;
exports.query1 = query1;
exports.query01 = query01;
exports.queryN = queryN;




/* end of database.js */

