/********************************************************************************/
/*                                                                              */
/*              samsung.js                                                      */
/*                                                                              */
/*      Interface to Smartthings using core-sdk                                 */
/*                                                                              */
/*      Written by spr                                                          */
/*                                                                              */
/********************************************************************************/
"use strict";
   
const {SmartThingsClient,BearerTokenAuthenticator} = require('@smartthings/core-sdk');   

const config = require("./config");



/********************************************************************************/
/*                                                                              */
/*      Global storage                                                          */
/*                                                                              */
/********************************************************************************/

var users = { };
var capabilities = { };
var skip_capabilities = new Set();

skip_capabilities.add("ocf");
skip_capabilities.add("custom.disabledCapabilities");
skip_capabilities.add("execute");
skip_capabilities.add("healthCheck");


/********************************************************************************/
/*										*/
/*	Setup Router								*/
/*										*/
/********************************************************************************/

function getRouter(restful)
{
   restful.use(authenticate);
   
   restful.all("*",config.handle404)
         restful.use(config.handleError);
   
   return restful;
}


/********************************************************************************/
/*										*/
/*	Authentication for iqsign						*/
/*										*/
/********************************************************************************/

function authenticate(req,res,next)
{
   next();
}



async function addBridge(authdata,bid)
{
   console.log("SAMSUNG ADD BRIDGE",authdata.uid,authdata.token);
   
   let username = authdata.uid;
   let pat = authdata.token;
   let user = users[username];
   if (user == null) {
      let client = new SmartThingsClient(new BearerTokenAuthenticator(pat));
      user = { username: username, client: client, bridgeid: bid, 
            devices: [], locations: { }, rooms: { } };
      users[username] = user;
    }   
 
   getDevices(username);
   
   return false;
}


async function handleCommand(bid,uid,devid,command,values)
{}


/********************************************************************************/
/*                                                                              */
/*      List devices                                                            */
/*                                                                              */
/********************************************************************************/

async function getDevices(username)
{
   let user = users[username];
   let client = user.client;
   await setupLocations(user);
   
   let devs = await client.devices.list();
   console.log("FOUND DEVICES",devs.length,devs);
   for (let dev of devs) {
      defineDevice(user,dev);
    }
}


function defineDevice(user,dev)
{
   let devid = dev.deviceId;
   let devname = dev.name;
   let devlabel = dev.label;
   for (let comp of dev.components) {
      console.log("DEVICE ",devid,comp);
      for (let capid of comp.capabilities) {
         console.log("FOUND CAPABILITY",capid);
         let cap = findCapability(user,capid);
         if (cap != null) {
            // add capability to device
          }
       }
    }
}



async function setupLocations(user)
{
   let client = user.client;
   let locs = await client.locations.list();
   console.log("FOUND LOCATIONS",locs);
   
   for (let loc of locs) {
      console.log("WORK ON LOCATION",loc);
      user.locations[loc.locationId] = loc;
      let rooms = await client.rooms.list(loc.locationId);
      console.log("FOUND ROOMS",rooms);
      for (let room of rooms) {
         room.locationName = loc.name;
         user.rooms[room.roomId] = room;
         console.log("ADD ROOM",room);
       }
    }
}



async function findCapability(user,capid)
{
   if (skip_capabilities.has(capid.id)) return null;
   
   console.log("LOOKUP CAPABILITY",capid);
   
   let key = capid.id + "_" + capid.version;
   let cap = capabilities[key];
   if (cap != null) return cap;
   
   let client = user.client;
   let cap0= await client.capabilities.get(capid.id,capid.version);
   console.log("FOUND",cap0);
   
   capabilities[key] = cap0;
   
   return cap0;
}



/********************************************************************************/
/*                                                                              */
/*      Exports                                                                 */
/*                                                                              */
/********************************************************************************/

exports.getRouter = getRouter;
exports.addBridge = addBridge;
exports.handleCommand = handleCommand;



/* end of module samsung */
