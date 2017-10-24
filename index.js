var fcm       = require("./lib/firebase"),
    push      = fcm.push,
    pushTemplates = "./pushTemplates/",
    pushTypes = require(pushTemplates),
    utils     = require("./push/push.utils");
const { EVENTS, FCM_RESPONSES } = require("./push/push.const");

var listeners = {
    onUninstalled     : [],
    onRenewCredentials: [],
    onFirebaseError   : [],
    onError           : [],
    onSuccess         : []
}

module.exports = {
    init  : init,
    events: EVENTS,
    on    : on,
    remove: removeListener,
    send  : send,
    utils : utils
}
/**
 * Optional firebase initialization. Use it to change the default configuration.
 * @param {*} fcmData Object with fcm params: cert & url
 * @param {*} pathTemplates Optional. Change the default push templates.
 */
function init(fcmData,pathTemplates){
    if(!fcmData) throw new Error("Must provide an object with the firebase initialization.")
    fcm.init(fcmData);
    if(pathTemplates && typeof pathTemplates === 'string'){
        pushTemplates = pathTemplates;
        pushTypes     = require(pushTemplates);
    }
}

function notify(event,data){
    if(!listeners[event]&&listeners[event].length===0) return;
    for (var i = 0; i < listeners[event].length; i++)
        listeners[event][i](data);
}
/**
 * Listener setter
 * @param {string} type const event type 
 * @param {function} cb function callback
 */
function on(type,cb){
    if(!listeners[type])          throw new Error("Event "+type+" unknown.");
    if(!typeof cb === 'function') throw new Error("No function callback passed to subscribe on the listener.");
    listeners[type].push(cb);
}
/**
 * Remove listener
 * @param {string} type const event type 
 * @param {function} cb function callback
 */
function removeListener(type,cb){
    if(!listeners[type])          throw new Error("Event "+type+" unknown.");
    if(!typeof cb === 'function') throw new Error("No function callback passed to unsubscribe on the listener.");
    let index = listeners[type].indexOf(cb);
    if(index != -1) listeners[type].splice(index,1);
}
/**
 * You can subscribe to the events or get the returned object
 * @param {String,Array} tokens could be a single string token or an array of string tokens
 * @param {string} type the kind of notification you want to send. The event must be defined on the 'push.types' file
 * @param {JSONObject} data json object with extra params to build the notification payload
 */
async function send(tokens, type, data){
    try{
        if(!tokens)          throw new Error("Tokens not defined");
        if(!pushTypes[type]) throw new Error("Type of notification "+type+" not defined.");
        if(typeof tokens=="string") tokens=[tokens];

        var index = 0,
        result = {tokens: 0, success: 0, failures: 0};
        const incrementIndex = (x,y)=>(x+999<y-1) ? x+999  : y-1,
              slice          = (x,y)=>(x+999<y-1) ? x+1000 : y,
              so = ["android","ios"];
        // About while loop vs funtional programing => while loop so much faster
        // https://stackoverflow.com/a/43596323/7043613
        do {
            let tokensByLoop = tokens.slice(index,slice(index,tokens.length));
            let tokensToSend = divideTokensByPlatform(tokensByLoop);
            let payloads     = require(pushTemplates+pushTypes[type])(data);
            for (var i = 0; i < so.length; i++) {
                if(tokensToSend[so[i]]){
                    let response = await push.sendToDevice(tokensToSend[so[i]], 
                        payloads[so[i]].payload, payloads[so[i]].options);
                    transformResponse(response,result,tokensToSend[so[i]]);
                }
            }
            index = incrementIndex(index,tokens.length);
        } while (index<tokens.length-1);

        notify(EVENTS.SUCCESS,result);
        return result;
    }catch(err){
        console.log("------- send catch --------")
        console.log(EVENTS.ERROR,err);
        notify(EVENTS.ERROR, err);
        throw new Error(err);
    }
}

function divideTokensByPlatform(tokens){
    let object = {ios:[],android:[]};
    for (let i = 0; i < tokens.length; i++)
        (tokens[i].indexOf(":")!== -1)
        ? object.android.push(tokens[i]) 
        : object.ios.push(tokens[i]);
    if(object.android.length===0) delete object.android;
    if(object.ios.length    ===0) delete object.ios;
    return object;
}

function transformResponse(response,result,tokens){
    if(!(response && 'results' in response))
        throw new Error("Error sending tokens");
    errorFCMFilter(tokens,response.results);
    //console.log("[Sended Pushes] ",JSON.stringify(response,null,2));
    result.success  = result.success  + response.successCount;
    result.failures = result.failures + response.failureCount;
    result.tokens   = result.tokens   + tokens.length;
}
/**
 * INFO: https://firebase.google.com/docs/cloud-messaging/admin/errors
 * @param {String, Array} tokens 
 * @param {Array} result 
 */
function errorFCMFilter(tokens,result){
    if(typeof tokens=='string') tokens = [tokens];
    for (var i = 0; i < result.length; i++)
        if(result[i].error && FCM_RESPONSES[result[i].error.code])
            notify(FCM_RESPONSES[result[i].error.code],tokens[i]);
}