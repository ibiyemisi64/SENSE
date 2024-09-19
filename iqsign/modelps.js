/********************************************************************************/
/*										*/
/*		modelps.js							*/
/*										*/
/*	Oauth server model using postgres					*/
/*										*/
/*	Written by spr, based on express-oauth-server				*/
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
   
const config = require('./config');
const db = require("./database");



/********************************************************************************/
/*										*/
/*	Constants								*/
/*										*/
/********************************************************************************/

let oauthconfig = config.getOauthCredentials();

const CLIENTS = { };

CLIENTS["testing"] =  {
      client : "Testing",
      secret : "XXXXXX",
      redirects: [ "https://localhost:3336/default",
	    "http://localhost:3335/default",
	    "https://sherpa.cs.brown.edu:3336/default" ],
      grants: [ "authorization_code", "device_code",
		  "refresh_token", "code"  ],
};


CLIENTS[oauthconfig.id]  = {
      client : "SmartThings",
      secret : oauthconfig.secret,
      redirects : [ "https://c2c-us.smartthings.com/oauth/callback",
	    "https://c2c-eu.smartthings.com/oauth/callback",
	    "https://c2c-ap.smartthings.com/oauth/callback",
	    "https://oauthdebugger.com/debug" ],
      grants: [ "authorization_code", "device_code",
		  "refresh_token",  "code" ],
};





/********************************************************************************/
/*										*/
/*	Set up class								*/
/*										*/
/********************************************************************************/

class ModelPs {

   constructor() { }

   async getAccessToken(bearertoken) {
      return handleGetToken(bearertoken);
   }

   async getClient(clientid,clientsecret) {
      return handleGetClient(clientid,clientsecret);
   }

   async saveAccessToken(token,client,user) {
      return handleSaveToken(token,client,user);
   }

   async saveToken(token,client,user) {
      return handleSaveToken(token,client,user);
    }

   async revokeToken(token) {
      return handleRevokeToken(token);
    }

   async saveAuthorizationCode(code,client,user) {
      return handleSaveAuthorizationCode(code,client,user);
    }

   async getAuthorizationCode(code) {
      return handleGetAuthorizationCode(code);
    }

   async revokeAuthorizationCode(code) {
      return handleRevokeAuthorizationCode(code);
    }

   async getRefreshToken(bearertoken) {
      return handleGetRefreshToken(bearertoken);
    }

   async verifyScope(token,scope) {
      return handleVerifyScope(token,scope);
    }

}	// end of class ModelPs



/********************************************************************************/
/*										*/
/*	Work methods								*/
/*										*/
/********************************************************************************/

async function handleGetClient(clientid,clientsecret)
{
   console.log("OAUTH GETCLIENT",clientid,clientsecret);

   let cinfo = CLIENTS[clientid];
   if (cinfo == null) return;
   if (clientsecret != null && cinfo.secret != clientsecret) return;

   let rslt = {
	 id : clientid,
	 client : cinfo.client,
	 redirectUris : cinfo.redirects,
	 grants : cinfo.grants
    }

   console.log("RESULT",rslt);

   return rslt;
}




async function handleSaveAuthorizationCode(code,client,user)
{
   console.log("OAUTH SAVEAUTHORIZATIONCODE",code,client,user);

   await db.query("DELETE FROM OauthCodes WHERE auth_code = $1",
	 [ code.authorizationCode ]);
   await db.query("INSERT INTO OauthCodes " +
	 "(auth_code, expires_at, redirect_uri, scope, client, userid, signid ) " +
	 "VALUES ( $1, $2, $3, $4, $5, $6, $7 )",
	 [ code.authorizationCode, code.expiresAt, code.redirectUri, code.scope,
	     client.id, user.id, user.signid ]);

   let rslt = {
	 authorizationCode : code.authorizationCode,
	 expiresAt : code.expiresAt,
	 redirectUri : code.redirectUri,
	 scope : code.scope,
	 client : { id : client.id },
	 user : { id : user.id }
    }

   console.log("SAVECODE RETURN",rslt);

   return rslt;
}


async function handleGetAuthorizationCode(code)
{
   console.log("OAUTH GETAUTHORIZATIONCODE",code);

   let row = await db.query1("SELECT * FROM OauthCodes WHERE auth_code = $1",
	 [ code ]);

   let rslt = {
	 code : code,
	 expiresAt : row.expires_at,
	 redirectUri : row.redirect_uri,
	 scope : row.scope,
	 client : { id : row.client },
	 user : { id : row.userid }
    };

   console.log("GETCODE RETURN",rslt);

   return rslt;
}


async function handleRevokeAuthorizationCode(code)
{
   console.log("OAUTH REVOKEAUTHORIZATIONCODE",code);
   
   let rows = await db.query("DELETE FROM OauthCodes WHERE auth_code = $1",
	 [ code.code ]);

   console.log("OAUTH REVOKE CHECK",rows);

   return true;
}




async function handleSaveToken(token,client,user)
{
   console.log("OAUTH SAVETOKEN",token,client,user);

   await db.query("DELETE FROM OauthTokens WHERE access_token = $1",[ token.accessToken ]);

   await db.query("INSERT INTO OauthTokens " +
	 "( access_token, access_expires_on, refresh_token, refresh_expires_on, scope, client_id, userid ) " +
	 "VALUES ( $1,$2,$3,$4,$5,$6,$7 )",
	 [ token.accessToken, token.accessTokenExpiresAt,
	   token.refreshToken, token.refreshTokenExpiresAt,
	   token.scope, client.id, user.id ]);

   let rslt = {
	 accessToken : token.accessToken,
	 accessTokenExpiresAt : token.accessTokenExpiresAt,
	 refreshToken : token.refreshToken,
	 refreshTokenExpiresAt : token.refreshTokenExpiresAt,
	 scope : token.scope,
	 client : { id : client.id } ,
	 user : { id : user.id }
    };

   console.log("SAVETOKEN RESULT",rslt);

   return rslt;
}



async function handleGetToken(token)
{
   console.log("OAUTH GETTOKEN",token);

   let row = await db.query1("SELECT * FROM OauthTokens WHERE access_token = $1",
	 [ token ]);

   let rslt = {
	 accessToken : row.access_token,
	 accessTokenExpiresAt : row.access_expires_on,
	 refreshToken : row.refresh_token,
	 refreshTokenExpiresAt : row.refresh_expires_on,
	 scope : row.scope,
	 client : { id : row.client_id },
	 user : { id : row.userid }
    };

   console.log("GETTOKEN RESULT",rslt);

   return rslt;
}



async function handleRevokeToken(token)
{
   console.log("OAUTH REVOKETOKEN",token);

   let rows = await db.query("DELETE FROM OauthTokens WHERE refresh_token = $1",
	 [ token.refreshToken ]);

   console.log("REVOKETOKEN RESULT",rows);

   return true;
}



async function handleGetRefreshToken(token)
{
   console.log("OAUTH GETREFRESH",token);

   let row = await db.query1("SELECT * FROM OauthTokens WHERE refresh_token = $1",
	 [ token ]);

   let rslt = {
	 refreshToken : row.refresh_token,
	 refreshTokenExpiresAt : row.refresh_expires_on,
	 scope : row.scope,
	 client : { id : row.client_id },
	 user : { id : row.userid }
    }

   console.log("GETREFRESH RETURNS",rslt);

   return rslt;
}


async function handleVerifyScope(token,scope)
{
   console.log("OAUTH VERIFYSCOPE",token,scope);

   return true;
}



/********************************************************************************/
/*										*/
/*	Exports 								*/
/*										*/
/********************************************************************************/

exports.Model = ModelPs;

