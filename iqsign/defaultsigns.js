/********************************************************************************/
/*										*/
/*		defaultsigns.js 						*/
/*										*/
/*	Load/update default sign definitions					*/
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


const db = require("./database");
const config = require("./config");
const fs = require("fs/promises");


/********************************************************************************/
/*										*/
/*	Local variables 							*/
/*										*/
/********************************************************************************/

var last_update = 0;


/********************************************************************************/
/*										*/
/*	Update default signs on startup 					*/
/*										*/
/********************************************************************************/

async function update() {
   await doUpdate();
}



async function doUpdate() {
   console.log("defaultSign: doUpdate: start.");
   let fn = config.getDefaultSignsFile();
   let stat = await fs.stat(fn);
   let dlm = stat.mtimeMs;
   if (last_update > dlm) return;

   let cnts = await fs.readFile(fn, 'utf8');

   // remove old definitions
   await db.query("DELETE FROM iQsignDefines WHERE userid IS NULL");
   console.log("defaultSigns: doUpdate: remove old definitions");
   
   let cnts1 = cnts.toString();
   let lines = cnts1.split("\n");
   let name = null;
   let body = null;
   let eqok = true;
   for (let i = 0; i < lines.length; ++i) {
      let line = lines[i].trim();
      if (line == '') {
         eqok = true;
      }
      else if (line.startsWith('=') && eqok) {
         if (body != null) {
            await saveSign(name, body, dlm);
            body = null;
         }
         name = line.substring(1);
         eqok = false;
      }
      else {
         if (body == null) body = "";
         body += line + "\n";
         eqok = false;
      }
   }
   if (body != null) {
      await saveSign(name, body, dlm);
      body = null;
   }
   
   console.log("defaultSign: doUpdate: done.");
}


async function saveSign(name, body, dlm) {
   console.log("SAVE SIGN", name, body, dlm);

   let rows0 = await db.query("SELECT * FROM iQsignDefines WHERE name = $1 and userid IS NULL",
      [name]);
   if (rows0.length == 0) {
      await db.query("INSERT INTO iQsignDefines (id, userid, name, contents) " +
         "VALUES ( DEFAULT, NULL, $1, $2 )",
         [name, body]);
      rows0 = await db.query("SELECT * FROM iQsignDefines WHERE name = $1 and userid IS NULL",
         [name]);
      console.log("Added DEFAULT SIGN", rows0);
   }
   else {
      let r = rows0[0];
      console.log("DATE COMPARE ", dlm, r.lastupdate);
      await db.query("UPDATE iQsignDefines SET contents = $1 WHERE id = $2",
         [body.trim(), r.id]);
      console.log("Updated DEFAULT SIGN");
   }
}



/********************************************************************************/
/*										*/
/*	Exports 								*/
/*										*/
/********************************************************************************/

exports.update = update;




/* end of module defaultsigns */

