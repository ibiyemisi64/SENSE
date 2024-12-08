/****************************************************************************************/
/*											*/
/*		iqsign.js								*/
/*											*/
/*	Internal JavaScript for iQsign							*/
/*											*/
/****************************************************************************************/



/****************************************************************************************/
/*											*/
/*	Login methods									*/
/*											*/
/****************************************************************************************/

function handleLoginEnter(evt) {
   if (evt.keyCode == 13 || evt.keyCode == 9) {
      evt.preventDefault();
      $('#login-submit').click();
   }
}

function handleLoginSubmit(evt) {
   evt.preventDefault();
   hideLoginError();
   let x = $('#login-username').val();
   if (x == null || x == "") return setLoginError('Must specify user name');
   x = x.toLowerCase();
   let p = $('#login-password').val();
   if (p == null || p == '') return setLoginError('Must specify password');
   let s = $('#login-padding').val();
   if (s == null || s == '') return setLoginError('Page not loaded correctly');

   let p1 = hasher(p);
   let p2 = hasher(p1 + x);
   let p3 = hasher(p2 + s);

   let data = { username: x, password: p3, padding: s };
   fetch('/login', {
	 method: 'POST',
	 headers: {
	    'Content-Type': 'application/json'
	 },
	 body: JSON.stringify(data)
      })
      .then((resp) => { let v = resp.json(); return v; })
      .then(handleLoginStatus)
      .catch((e) => { setLoginError(e) });
}


function handleLoginStatus(sts) {
   let redir = $("#login-redirect").val();
   console.log("LOGIN STATUS",sts,redir)
   if (sts.status == 'OK') {
      if (redir == null || redir == '') redir = '/index';
      window.location.href = redir;
   }
   else if (sts.status == 'ERROR') {
      setLoginError(sts.message);
   }
   else setLoginError("Problem logging in");
}



function setLoginError(msg) {
   setErrorField(msg, 'login-error');
}


function hideLoginError(msg) {
   hideErrorField('login-error');
}




/****************************************************************************************/
/*											*/
/*	Registration methods								*/
/*											*/
/****************************************************************************************/

function handleRegisterSubmit(evt) {
   console.log("REGISTER SUBMIT", evt);

   evt.preventDefault();
   hideRegisterError();
   let email = $("#register-email").val();
   if (!validateEmail(email)) {
      return setRegisterError("Invalid email address");
   }

   email = email.toLowerCase();
   let uid = $("#register-username").val();
   if (uid == null || uid == '') uid = email;
   else {
      uid = uid.toLowerCase();
      if (validateEmail(uid) && uid != email) {
	 return setRegisterError("User id can't be an email address");
      }
   }

   let pwd1 = $("#register-password").val();
   if (!validatePassword(pwd1)) {
      return setRegisterError("Invalid password");
   }
   let pwd2 = $("#register-password2").val();
   if (pwd1 != pwd2) {
      return setRegisterError("Passwords don't match");
   }

   let sign = $("#register-signname").val();
   if (sign == null || sign == '') {
      return setRegisterError("Sign name must be given");
   }

   let p1 = hasher(pwd1);
   let p2 = hasher(p1 + email);
   let p3 = hasher(p1 + uid);

   let data = { email: email, username: uid, password: p2, altpassword: p3, signname: sign };
   fetch('/register', {
	 method: "POST",
	 headers: {
	    'Content-Type': "application/json"
	 },
	 body: JSON.stringify(data)
      })
      .then((resp) => {
	 let v = resp.json();
	 console.log("RESP", resp, v);
	 return v;
      })
      .then(handleRegisterStatus)
      .catch((e) => { setRegisterError(e) });
}


function handleRegisterStatus(sts) {
   console.log("REGISTER STATUS", sts);

   if (sts.status == 'OK') {
      $("#post-register").show();
   }
   else if (sts.status == 'ERROR') {
      setRegisterError(sts.message);
   }
   else setRegisterError("Problem logging in");
}



function setRegisterError(msg) {
   setErrorField(msg, 'register-error');
}


function hideRegisterError(msg) {
   hideErrorField('register-error');
}



/****************************************************************************************/
/*											*/
/*	Handle forgot password								*/
/*											*/
/****************************************************************************************/

function handleForgotSubmit(evt) {
   evt.preventDefault();
   let email = $("#forgot-email").val();
   if (!validateEmail(email)) {
      return setForgotError("Invalid email address");
   }
   email = email.toLowerCase();

   let data = { email: email };
   fetch('/resetpassword', {
	 method: "POST",
	 headers: {
	    'Content-Type': "application/json"
	 },
	 body: JSON.stringify(data)
      })
      .then((resp) => { let v = resp.json(); return v; })
      .then(handleRegisterStatus)
      .catch((e) => { setRegisterError(e) });
}


function handleForgotStatus(sts) {
   if (sts.status == 'OK') {
      $("#post-forgot").show();
   }
   else if (sts.status == 'ERROR') {
      setForgotError(sts.message);
   }
   else setForgotError("Problem logging in");
}



function setForgotError(msg) {
   setErrorField(msg, 'forgot-error');
}




/****************************************************************************************/
/*											*/
/*	Handle changing password							*/
/*											*/
/****************************************************************************************/

function handleNewPasswordSubmit(evt) {
   evt.preventDefault();
   let email = $("#newpwd-email").val();
   if (!validateEmail(email)) {
      return setNewPasswordError("Invalid email address");
   }

   email = email.toLowerCase();
   let uid = $("#newpwd-username").val();
   uid = uid.toLowerCase();
   if (validateEmail(uid) && uid != email) {
      return setNewPasswordError("User id can't be an email address");
   }

   let pwd1 = $("#newpwd-password").val();
   if (!validatePassword(pwd1)) {
      return setNewPasswordError("Invalid password");
   }
   let pwd2 = $("#newpwd-password2").val();
   if (pwd1 != pwd2) {
      return setNewPasswordError("Passwords don't match");
   }

   let p1 = hasher(pwd1);
   let p2 = hasher(p1 + email);
   let p3 = hasher(p1 + uid);

   let data = { email: email, username: uid, password: p2, altpassword: p3 };
   fetch('/newpassword', {
	 method: "POST",
	 headers: {
	    'Content-Type': "application/json"
	 },
	 body: JSON.stringify(data)
      })
      .then((resp) => { let v = resp.json(); return v; })
      .then(handleNewPasswordStatus)
      .catch((e) => { setNewPasswordError(e) });
}


function handleNewPasswordStatus(sts) {
   if (sts.status == 'OK') {
      window.location.href = "/index";
   }
   else if (sts.status == 'ERROR') {
      setNewPasswordError(sts.message);
   }
   else setNewPasswordError("Problem logging in");
}



function setNewPasswordError(msg) {
   setErrorField(msg, 'newpwd-error');
}




/****************************************************************************************/
/*											*/
/*	login/register utility methods							*/
/*											*/
/****************************************************************************************/

function setErrorField(msg, fld) {
   console.log("SET ERROR", msg, fld);

   let fldid = "#" + fld;
   $(fldid).text(msg);
   $(fldid).show();
}



function hideErrorField(fld) {
   console.log("HIDE ERROR", fld);

   let fldid = "#" + fld;
   $(fldid).hide();
}



function hasher(msg) {
   let bits = sjcl.hash.sha512.hash(msg);
   let str = sjcl.codec.base64.fromBits(bits);
   return str;
}



function validateEmail(email) {
   const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   return res.test(String(email).toLowerCase());
}


function validatePassword(pwd) {
   if (pwd == null || pwd == '') return false;

   // check length, contents

   return true;
}


/****************************************************************************************/
/*											*/
/*	Sign page methods								*/
/*											*/
/****************************************************************************************/

function changeSignSize(what) {
   let w = parseInt($("#signwidth").val());
   let h = parseInt($("#signheight").val());
   let dim = $("#signdim").val().toLowerCase().trim();
   let w0 = 0;
   let h0 = 0;

   switch (what) {
      case 'DIM':
      case 'WIDTH':
	 switch (dim) {
	    case "16x9":
	    case "16by9":
	       h0 = w / 16 * 9;
	       break;
	    case "4x3":
	    case "4by3":
	       h0 = w / 4 * 3;
	       break;
	    case "16by10":
	    case "16x10":
	       h0 = w / 16 * 10;
	       break;
	    default:
	       break;
	 }
	 break;
      case 'HEIGHT':
	 switch (dim) {
	    case "16x9":
	    case "16by9":
	       w0 = h / 9 * 16;
	       break;
	    case "4x3":
	    case "4by3":
	       w0 = h / 3 * 4;
	       break;
	    case "16by10":
	    case "16x10":
	       w0 = h / 10 * 16;
	       break;
	    default:
	       break;
	 }
	 break;
   }

   if (w0 != 0) $("#signwidth").val(w0);
   if (h0 != 0) $("#signheight").val(h0);
}


var changecount = 0;

function handleSignChanged() {
   console.log("Signdata", $("#signdata").val());
   if (++changecount > 0) {
      //    $("#signsaved").val("");
      checkSaveEnabled();
   }
}

function checkSaveEnabled() {
   let dis = false;

   let name = $("#savename").val();
   if (name == null || name == '') dis = true;
   if (changecount > 0) dis = true;

   $("#savesignbtn").prop("disabled", dis);
}



function handleSaveSignImage(evt) {
   console.log("SAVE SIGN IMAGE", evt);

   evt.preventDefault();

   let nm = $("#savename").val();
   if (nm == '') return;
   $("#signsaved").val(nm);
   let data = {
      name : nm,
      signid: $("#signid").val(),
      signuser: $("#signuserid").val(),
      signnamekey: $("#signnamekey").val(),
      code : $("#codeid").val()
   };
   fetch('/savesignimage', {
      method: "POST",
      headers: {
	 'Content-Type': "application/json"
      },
      body: JSON.stringify(data)
   });
}



function handleLoadSignImage(evt) {
   console.log("LOAD SIGN IMAGE", evt);

   evt.preventDefault();
   let data = {
      nameid: $("#loadnameid").val(),
      signid: $("#signid").val(),
      signuser: $("#signuserid").val(),
      signnamekey: $("#signnamekey").val(),
      code: $("#codeid").val(),
   };
   fetch("/loadsignimage", {
	 method: "POST",
	 headers: {
	    'Content-Type': "application/json"
	 },
	 body: JSON.stringify(data)
      })
      .then((resp) => { let v = resp.json(); return v; })
      .then(handleLoadedSign)
      .catch((e) => { console.log(e); });
}


function handleLoadedSign(sts) {
   console.log("SIGN LOADED", sts);

   if (sts.status == 'OK') {
      $("#signdata").val(sts.contents);
      $("#savename").val(sts.name);
   }
}


function handleSignPaste(event) {
   event.preventDefault();
   let evt = event;
   if (evt.originalEvent != null) evt = evt.originalEvent;
   let data = evt.clipboardData;
   handleSignDataTransfer(data);
}


function handleSignDrop(event) {
   event.preventDefault();
   let evt = event;
   if (evt.originalEvent != null) evt = evt.originalEvent;
   let data = evt.dataTransfer;
   handleSignDataTransfer(data);
}

function handleSignDataTransfer(data) {
   let ref1 = data.items;
   console.log("DROP", data.getData("text"));
   let item = ref1[0];
   console.log("ITEM", item.kind, item.type);
   let txt = data.getData("text");
   let fld = $("#signdata");
   const fare = /<[a-z_]* class=.*fa-.*/i;

   if (txt != null) {
      if (item.type.match(/^image\//) || txt.startsWith("http://") ||
	 txt.startsWith("https://")) {
	 // check for <i ... for font-awesome
	 // check for http:// and add @
	 // else ignore/error
	 // remove browser prefix form http string
	 let t1 = "@ " + txt + "\n";
	 fld.selection('replace', { text: t1 });
      }
      else if (txt.match(/<[a-z_]* class=.*fa-.*/i)) {
	 const far1 = /fa-[a-z]*/i;
	 let cls = txt.matchAll(far1);
	 let t1 = null;
	 for (let i = 0; i < cls.length; ++i) {
	    let c1 = cls[i][0];
	    switch (c1) {
	       case "fa-solid":
	       case "fa-regular":
	       case "fa-light":
	       case "fa_duotone":
	       case "fa-thin":
	       case "fa-brands":
		  break;
	       default:
		  if (t1 == null) t1 = c1;
		  break;
	    }
	 }
	 fld.selection('replace', { text: t1 });
      }
      else if (txt.startsWith("@ sv-")) {
	 // consider adding new line
	 fld.selection('replace', { text: txt });
      }
      else {
	 fld.selection('replace', { text: txt });
      }
   }
}


function handleImagePaste(event) {
   event.preventDefault();
   let evt = event;
   if (evt.originalEvent != null) evt = evt.originalEvent;
   let data = evt.clipboardData;
   handleImageDataTransfer(data);
}


function handleImageDrop(event) {
   event.preventDefault();
   let evt = event;
   if (evt.originalEvent != null) evt = evt.originalEvent;
   let data = evt.dataTransfer;
   handleImageDataTransfer(data);
}


function handleImageDataTransfer(input) {
   $("#imagevalue").val("");
   $("#imageurl").val("");
   $("#imagefile").val("");
   $("#imagestatus").hide();

   let uri = input.getData("text/uri-list");
   console.log("IMAGE URI", uri);
   let img = input.getData("image");
   console.log("IMAGE IMG", img);
   let txt = input.getData("text");
   console.log("IMAGE TXT", txt);
   let html = input.getData("text/html");
   console.log("IMAGE HTML", html);

   if (img != null && img != '') {
      $("#imageurl").val(img);
      let html = '<img width="150" height="150" src="' + img + '" />' +
	 '<p>' + img + '</p>';
      imagePreview(html);
   }
   else if (input.files && input.files[0]) {
      imageReadFile(input.files[0]);
   }
}

function imageReadFile(file) {
   var reader = new FileReader();
   reader.onload = function (e) {
      var html =
	 '<img width="150" height="150" src="' + e.target.result + '" />' +
	 '<p>' + file.name + '</p>';
      $("#imagevalue").val(e.target.result);
      $("#imagefile").val(file.name);
      console.log("ONLOAD", file, e.target);
      imagePreview(html);
   };

   reader.readAsDataURL(file);
}


function imagePreview(html) {
   var wrapperZone = $(".imagedropper");
   var previewZone = $('.preview-zone');
   var boxZone = $(".box-body");

   wrapperZone.removeClass('dragover');
   previewZone.removeClass('hidden');
   boxZone.empty();
   boxZone.append(html);
}


function imageReset(e) {
   $("#imagename").val("");
   $("#imagevalue").val("");
   $("#imageurl").val("");
   $("#imagefile").val("");
   $("#imagestatus").hide();
   $('.preview-zone').hide();
}


function handleLoadImage(event) {
   event.preventDefault();
   let name = $("#imagename").val();
   if (name == null || name == '') {
      return loadImageError("Image name must be specified");
   }
   let v2 = $("#imageurl");
   let v3 = $("#imagefile");
   if (v2 == null && v3 == null) {
      return loadImageError("Image not provided");
   }
   let data = {
      imageuser: $("#imageuser").val(),
      imageemail: $("#imageemail").val(),
      imagevalue: $("#imagevalue").val(),
      imageurl: $("#imageurl").val(),
      imagefile: $("#imagefile").val(),
      imagename: $("#imagename").val(),
   }

   console.log("IMAGE DATA", data);
   loadImageError("Uploading image ...");

   fetch('/loadimage', {
	 method: "POST",
	 headers: {
	    'Content-Type': "application/json"
	 },
	 body: JSON.stringify(data)
      })
      .then((resp) => { let v = resp.json(); return v; })
      .then(handleImageUploaded)
      .catch((e) => { loadImageError(e) });
}


function handleImageUploaded(sts) {
   if (sts.status == 'OK') {
      imageReset();
      loadImageError("Image successfully uploaded");
   }
   else if (sts.status == 'ERROR') {
      loadImageError(sts.message);
   }
   else loadImageError("Problem uploading image");
}

function handleImageNameChange(event)
{
   $("#imagestatus").hide();
}

function loadImageError(msg) {
   $("#imagestatus").text(msg);
   $("#imagestatus").show();
}



function handleCreateCode(event)
{
   console.log("GENERATE LOGIN CODE", event);

   event.preventDefault();

   $("#logincode").val("");

     let img = $("#loadnameid").val();
     let data = {
	signid: $("#signid").val(),
	signuser: $("#signuserid").val(),
	signkey: $("#signnamekey").val(),
     };
     fetch("/createcode", {
	   method: "POST",
	   headers: {
	      'Content-Type': "application/json"
	   },
	   body: JSON.stringify(data)
	})
	.then((resp) => { let v = resp.json(); return v; })
	.then(handleCodeGenerated)
	.catch((e) => { console.log(e); });
}


function handleCodeGenerated(sts) {
   console.log("CODE GENERATED", sts);
   if (sts.status == 'OK') {
      $("#logincode").val(sts.code);
   }
}

export default hasher;
/* end of iqsign.js */

