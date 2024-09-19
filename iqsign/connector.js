/********************************************************************************/
/*                                                                              */
/*              connector.js                                                    */
/*                                                                              */
/*      Code for connecting device using st-schema library                      */
/*      From StartThingCommunity/st-schema-nodejs on github                     */
/*                                                                              */
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


const { SchemaConnector, DeviceErrorTypes } = require('st-schema')
const deviceStates = { switch: 'off', level: 100 }
const accessTokens = { }; 

const connector = new SchemaConnector()
   .clientId(process.env.ST_CLIENT_ID)
   .clientSecret(process.env.ST_CLIENT_SECRET)
   .discoveryHandler(handleDiscovery)
   .stateRefreshHandler(handleStateRefresh)
   .commandHandler(handleCommand)
   .callbackAccessHandler(handleCallbackAccess)
   .integrationDeletedHandler(handleIntegrationDeleted);

 

/********************************************************************************/
/*                                                                              */
/*      Action methods                                                          */
/*                                                                              */
/********************************************************************************/

function handleDiscovery(req, res) 
{
    res.addDevice('external-device-1', 'Test Dimmer', 'c2c-dimmer')
      .manufacturerName('Example Connector')
      .modelName('Virtual Dimmer');
}



function handleStateRefresh(accesstoken, res) 
{
    res.addDevice('external-device-1', [
    {
        component: 'main',
        capability: 'st.switch',
        attribute: 'switch',
        value: deviceStates.switch
    },
    {
        component: 'main',
        capability: 'st.switchLevel',
        attribute: 'level',
        value: deviceStates.level
    }
    ])
}


    
function handleCommand(accessToken, response, devices)
{
    for (const device of devices) {
        const deviceResponse = response.addDevice(device.externalDeviceId);
        for (const cmd of device.commands) {
            const state = {
                    component: cmd.component,
                    capability: cmd.capability
            };
            if (cmd.capability === 'st.switchLevel' && cmd.command === 'setLevel') {
                state.attribute = 'level';
                state.value = deviceStates.level = cmd.arguments[0];
                deviceResponse.addState(state);
                
            } 
            else if (cmd.capability === 'st.switch') {
                state.attribute = 'switch';
                state.value = deviceStates.switch = cmd.command === 'on' ? 'on' : 'off';
                deviceResponse.addState(state);
                
            } 
            else {
                deviceResponse.setError(
                        `Command '${cmd.command} of capability '${cmd.capability}' not supported`,
                        DeviceErrorTypes.CAPABILITY_NOT_SUPPORTED)
            }
        }
    }
}


function handleCallbackAccess(accesstoken,callbackauth,callbackurls)
{
    accessTokens[accesstoken] = { callbackauth,callbackurls };
}


function handleIntegrationDeleted(accesstoken)
{
    delete accessTokens[accesstoken];
}



/********************************************************************************/
/*                                                                              */
/*      Exports                                                                 */
/*                                                                              */
/********************************************************************************/

exports.connector = connector;
exports.deviceStates = deviceStates;
exports.accessTokens = accessTokens;


