/********************************************************************************/
/*										*/
/*		images.js							*/
/*										*/
/*	Manage image pages							*/
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


const config = require("./config");
const db = require("./database");

const fs = require("fs/promises");
const fs0 = require("fs");

const { Buffer } = require("buffer");


/********************************************************************************/
/*										*/
/*	Variables								*/
/*										*/
/********************************************************************************/

var svg_images = [ ];
var last_update = 0;


/********************************************************************************/
/*										*/
/*	Initialization								*/
/*										*/
/********************************************************************************/

async function loadImages()
{
   await doLoadSvgImages();
   await doImageUpdate();
}



/********************************************************************************/
/*										*/
/*	Compute the set of SVG images						*/
/*										*/
/********************************************************************************/

async function doLoadSvgImages()
{
   let top = config.SVG_IMAGE_LIBRARY_DIR;
   let topdir = await fs.opendir(top);
   for await (const dirent of topdir) {
      if (dirent.isDirectory()) {
	 let topic = null;
	 let subdir = await fs.opendir(topdir.path + "/" + dirent.name);
	 for await (const subent of subdir) {
	    if (subent.isFile()) {
	       let name = subent.name;
	       if (name.endsWith(".svg")) {
		  let n1 = name.substring(0,name.length-4);
		  let n2 = "/static/svglibrary/svg/" + dirent.name + "/" + name;
		  let p = { name : n1, svg : n2, topic : dirent.name,
			path : subdir.path + "/" + name };
		  if (topic == null) {
		     topic = { name : dirent.name, tpath : topdir.path,
			   path : subdir.path, items : [] };
		   }
		  topic.items.push(p);
		}
	     }
	  }
	 if (topic != null) svg_images.push(topic);
      }
   }
   svg_images.sort(nameSort);
   for (let top of svg_images) {
      top.items.sort(nameSort);
   }
}


function nameSort(a,b)
{
   return a.name.localeCompare(b.name);
}


/********************************************************************************/
/*										*/
/*	Load initial default images if needed					*/
/*										*/
/********************************************************************************/

async function doImageUpdate()
{
   let fn = config.getDefaultImagesFile();
   let stat = await fs.stat(fn);
   let dlm = stat.mtimeMs;
   if (last_update > dlm) return;
   let cnts = await fs.readFile(fn,'utf8');
   let cnts1 = cnts.toString();
   let lines = cnts1.split("\n");
   for (let line of lines) {
      line = line.trim();
      if (line == '' || line.startsWith("#") || line.startsWith("/")) continue;
      let idx = line.indexOf(":");
      if (idx < 0) continue;
      let name = line.substring(0,idx).trim();
      let file = line.substring(idx+1).trim();
      if (file.startsWith("http:") || file.startsWith("https:")) {
	 let rows = await db.query("SELECT * FROM iqSignImages " +
	       "WHERE userid IS NULL and name = $1 and url = $2",
	       [ name, file]);
	 if (rows.length > 0) continue;
	 await db.query("DELETE FROM iQSignImages " +
	       "WHERE userid IS NULL and name = $1",
	       [name]);
	 await db.query("INSERT INTO iQsignImages ( userid, name, url ) " +
	       "VALUES ( NULL, $1, $2 )",
	       [ name, file ]);
       }
      else {
	 let rows = await db.query("SELECT * FROM iqSignImages " +
	       "WHERE userid IS NULL and name = $1 and file = $2",
	       [ name, file]);
	 if (rows.length > 0) continue;
	 await db.query("DELETE FROM iQSignImages " +
	       "WHERE userid IS NULL and name = $1",
	       [name]);
	 if (!fs0.existsSync(file)) continue;
	 await db.query("INSERT INTO iQsignImages ( userid, name, file ) " +
	       "VALUES ( NULL, $1, $2 )",
	       [ name, file ]);
       }
    }
}

/********************************************************************************/
/*										*/
/*	Image lookup pages							*/
/*										*/
/********************************************************************************/

function displaySvgImagePage(req,res)
{
   let data = { svgimages : svg_images, dir : config.SVG_IMAGE_LIBRARY_DIR };
   res.render("svgimages",data);
}



async function displaySavedImagePage(req,res)
{
    let rows0 = await db.query("SELECT * FROM iQsignImages WHERE userid = $1",
	  [ req.user.id ]);
    let rows1 = await db.query("SELECT * FROM iQsignImages WHERE userid IS NULL AND " +
	  "name NOT In ( SELECT name FROM iQsignImages WHERE userid = $1 )",
	  [ req.user.id ]);
    fixupImageData(rows0,req.user.id);
    fixupImageData(rows1,req.user.id);
    let data = { userimages : rows0, systemimages : rows1,
	  user : req.user.id, email : req.user.email,
	  anyuserimages : (rows0.length > 0),
	  anysystemimages : (rows1.length > 0),
     }
    console.log("SAVED DATA",data);
    res.render("savedimages",data);
}


function fixupImageData(rows,uid)
{
   for (let row of rows) {
      if (row.url != '' && row.url != null) continue;
      row.url = "image?id=" + row.id + "&uid=" + uid;
//    row.url = `/image?id=${row.id}&uid=${uid}`;
    }
}




/********************************************************************************/
/*										*/
/*	Display page for user to upload an image				*/
/*										*/
/********************************************************************************/

function displayLoadImagePage(req,res)
{
   let data = { user : req.user.id, email : req.user.email };
   res.render("loadimage",data);
}


async function handleLoadImage(req,res)
{
   console.log("LOAD IMAGE",req.body);
   let uid = req.body.imageuser;
   let email = req.body.imageemail;
   if (uid != req.user.id || email != req.user.email) {
      return imageError(req,res,"invalid user");
    }
   let typ = req.body.imagefile;
   if (typ == null || typ == '') typ = req.body.imageurl;
   let idx = typ.lastIndexOf(".");
   typ = typ.substring(idx+1);

   if (typ == '' || idx < 0) {
      return imageError(req,res,"can't determine image type");
    }

   let url = req.body.imageurl;
   let data = req.body.imagevalue;
   if (url == '' && data == '') {
      return imageError(req,res,"no image present");
    }

   let name = req.body.imagename;
   if (name == null || name == '') {
      return imageError(req,res,"no name given for image");
    }

   // do we need to convert svg images here?  (Use sharp)

   try {
      let rows0 = await db.query("SELECT * FROM iQsignImages " +
	    "WHERE userid = $1 AND name = $2",
	    [ uid, name ]);
      await db.query("DELETE FROM iQsignImages WHERE userid = $1 AND name = $2",
	    [ uid, name]);
      if (rows0.length > 0) {
	 let row = rows0[0];
	 if (row.file != null && fs0.existsSync(row.file)) {
	    await fs.unlink(row.file);
	  }
       }
      if (url != '') {
	 await db.query("INSERT INTO iQsignImages ( userid, name, url ) " +
	       "VALUES ($1,$2,$3)",
	       [ uid, name, url ]);
       }
      else {
	 let idx1 = data.indexOf(",");
	 if (idx1 > 0) data = data.substring(idx1+1);
	 let buf = Buffer.from(data,'base64');
	 let file = getImageFileName(uid,typ);
	 console.log("RESULT BUFFER",buf,file);
	 await fs.writeFile(file,buf);
	 await db.query("INSERT INTO iQsignImages ( userid, name, file ) " +
	       "VALUES ( $1, $2, $3 )",
	       [ uid, name, file ]);
       }
    }
   catch (e) {
      return imageError(req,res,e.message);
    }

   let rslt = { status: "OK" };
   res.end(JSON.stringify(rslt));
}



function getImageFileName(uid,typ)
{
   let ran = config.randomString(16);
   let tmpname = config.getImageDirectory() + "image_" +
	 uid + "_" + ran + "." + typ;

   return tmpname;
}



function imageError(req,res,msg)
{
   let data = { status: "ERROR", message : msg };
   res.end(JSON.stringify(data));
}



/********************************************************************************/
/*										*/
/*	Display image								*/
/*										*/
/********************************************************************************/

async function displayImage(req,res)
{
   console.log("DISPLAY IMAGE",req.query);
   let iid = req.query.id;
   let userid = req.query.uid;
   let row = await db.query1("SELECT * FROM iQsignImages WHERE id = $1",[iid]);
   console.log("DISPLAY IMAGE ROW",row);

   if (userid != req.user.id ||
	 (row.userid != null && row.userid != userid)) {
      throw "Bad user id";
    }
   if (row.file == null) {
      if (row.url != null) res.redirect(row.url);
    }

   let typ = row.file;
   let idx = typ.lastIndexOf(".");
   typ = typ.substring(idx+1);
   typ = "image/" + typ;
   console.log("TYPE",typ,row.file);
   res.statusCode = 200;
   res.setHeader("Content-Type",typ);
   fs0.createReadStream(row.file).pipe(res);
}



/********************************************************************************/
/*										*/
/*	Exports 								*/
/*										*/
/********************************************************************************/

exports.loadImages = loadImages;
exports.displaySvgImagePage = displaySvgImagePage;
exports.displaySavedImagePage = displaySavedImagePage;
exports.displayLoadImagePage = displayLoadImagePage;
exports.handleLoadImage = handleLoadImage;
exports.displayImage = displayImage;




/* end of module images */

