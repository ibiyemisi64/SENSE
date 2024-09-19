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
let express = require('express');
let bodyParser = require('body-parser');

let app = express();
app.use(bodyParser.json({type: 'application/json'}));
 

// Mock the ST-schema Discovery and refresh response
// for this Glitch webhook connector example
let discoveryResponse = require("./discoveryResponse.json");
const refreshResponse = require("./refreshResponse.json");

// Helper functions from ST-schema package to build st-schema responses
const {partnerHelper, CommandResponse} = require("st-schema");
const stPartnerHelper = new partnerHelper({}, {}); 

/**
* Handle discovery request interaction type from SmartThings
*/
function discoveryRequest(requestId) {
  discoveryResponse.headers.requestId = requestId
  console.log(discoveryResponse);
  return discoveryResponse
}

/**
* Handle command request interaction type from SmartThings
*/
function commandRequest(requestId, devices) {
  let response = new CommandResponse(requestId)
  devices.map(({ externalDeviceId, deviceCookie, commands }) => {
    const device = response.addDevice(externalDeviceId, deviceCookie);
    stPartnerHelper.mapSTCommandsToState(device, commands)
  }); 
  console.log("response: %j", response);
  return response;
}

/**
* Handle state refresh request interaction type from SmartThings
*/
function stateRefreshRequest(requestId, devices) {
  let response = { "headers": { "schema": "st-schema", "version": "1.0", "interactionType": "stateRefreshResponse", "requestId": requestId }, "deviceState": [] }
  devices.map(({ externalDeviceId, deviceCookie }) => {
    console.log("externalDeviceId: ", externalDeviceId)
    let deviceResponse = refreshResponse[externalDeviceId]
    response.deviceState.push(deviceResponse)
    console.log("deviceResponse: ", deviceResponse)
  });
  
  console.log(response);
  return response;
}

// Mock method to log out the callback credentials issued by SmartThings
function grantCallbackAccess(callbackAuthentication) {
  console.log("grantCallbackAccess token is:", callbackAuthentication.code)
  console.log("grantCallbackAccess clientId is:", callbackAuthentication.clientId)
  return {}
}


// Renders the homepage
app.get('/', function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.write(JSON.stringify(discoveryResponse))
  res.end()
});


// [START Action]
app.post('/', function (req, res) {
  console.log('Request received: ' + JSON.stringify(req.body))
  
  let response
  const {headers, authentication, devices, callbackAuthentication, globalError, deviceState} = req.body
  const {interactionType, requestId} = headers;
  console.log("request type: ", interactionType);
  try {
    switch (interactionType) {
      case "discoveryRequest":
        response = discoveryRequest(requestId)
        break
      case "commandRequest":
        response = commandRequest(requestId, devices)
        break
      case "stateRefreshRequest":
        response = stateRefreshRequest(requestId, devices)
        break
      case "grantCallbackAccess":
        response = grantCallbackAccess(callbackAuthentication)
        break
      case "integrationDeleted":
        console.log("integration to SmartThings deleted");
        break
      default:
        response = "error. not supported interactionType" + interactionType
        console.log(response)
        break;
    }
  } catch (ex) {
    console.log("failed with ex", ex)
  }

  res.send(response)

})


if (module === require.main) {
  // [START server]
  let server = app.listen(process.env.PORT || 3000, function () {
    let port = server.address().port
    console.log('App listening on port %s', port)
  })
  // [END server]
}

module.exports = app


