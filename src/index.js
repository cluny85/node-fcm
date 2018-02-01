const firebase      = require('./lib/firebase');
const utils         = require('./push/push.utils');
let pushTemplates   = './exampleTemplates/';
let pushTypes       = require(pushTemplates);
const { EVENTS, FCM_RESPONSES } = require('./push/push.const');

const listeners = {
  onUninstalled     : [],
  onRenewCredentials: [],
  onFirebaseError   : [],
  onError           : [],
  onSuccess         : []
};

const errors = {
  firebaseConfig: {
    notProvided: 'Must provide an object with the firebase initialization.',
    notCert    : 'Firebase config must provide a cert field.',
    notUrl     : 'Firebase config must provide a url field.'
  },
  onFunction: {
    unknownType: ': Unknown event type.',
    noCallback : 'No function callback passed to subscribe on the listener.'
  },
  send: {
    notFCM    : 'FCM must be initialized',
    noTemplate: 'No template found for this event',
    noEvent   : 'Send function must receive an event object.',
    noTokens  : 'Send function must receive a tokens field with a string or an array of strings'
  },
  transformResponse: 'Error sending tokens'
};

/**
 * Optional firebase initialization. Use it to change the default configuration.
 * @param {*} firebaseConfig Object with fcm params: cert & url and pathTemplates (optional)
 * @param {*} firebaseAdmin (Optional) If you already have your own instance of firebase-admin initializated, pass here the firebase.messaging function
 */
module.exports = (firebaseConfig, firebaseMessaging) => {
  assertConfigFields(firebaseConfig);
  const push = firebaseMessaging || firebase(firebaseConfig);
  if (firebaseConfig.pathTemplates) overwriteTemplates(firebaseConfig.pathTemplates);

  return {
    events   : EVENTS,
    on,
    remove   : removeListener,
    send,
    utils,
    templates: pushTypes
  };

  /**
   * Listener setter
   * @param {string} type const event type 
   * @param {function} cb function callback
   */
  function on(type, cb) {
    if (!listeners[type])         throw new Error(type + errors.onFunction.unknownType);
    if (typeof cb !== 'function') throw new Error(errors.onFunction.noCallback);
    listeners[type].push(cb);
  }

  /**
   * Remove listener
   * @param {string} type const event type 
   * @param {function} cb function callback
   */
  function removeListener(type, cb) {
    if (!listeners[type])         throw new Error(type + errors.onFunction.unknownType);
    if (typeof cb !== 'function') throw new Error(errors.onFunction.noCallback);
    const index = listeners[type].indexOf(cb);
    if (index !== -1) listeners[type].splice(index, 1);
  }

  /**
   * Send notification/s to the token/device/s. To cathc the errors you need to be subscribed to the error events.
   * @param {object} event a plain json object that *must* containt at least this fields: tokens & type. Optional field: payload. You can pass in this field extra params to build the notification payload.
   * - tokens: could be a single string token or an array of string tokens
   * - type: the kind of notification you want to send. The event must be defined on the 'push.types' file
   * - payload (optional): json object with extra params to build the notification payload
   */
  async function send(event) {
    if (!push) throw new Error(errors.send.notFCM);
    assertMandatoryEventFields(event);
    try {
      if (typeof event.tokens === 'string') event.tokens = [event.tokens];
      return await safeSend(event);
    } catch (err) {
      notifyListeners(EVENTS.ERROR, err);
      return {
        success: 0,
        error  : err
      };
      // throw new Error(err);
    }
  }

  // async function safeSend(tokens, type, payload) {
  async function safeSend(event) {
    const { tokens, payload, pushType, type } = event;
    const template = getTemplate(pushType, type);
    const incrementIndex = (x,y) => (x+999<y-1) ? x+999  : y-1;
    const slice          = (x,y) => (x+999<y-1) ? x+1000 : y;
    const so = ['android', 'ios'];
    let index  = 0;
    const result = { tokens: 0, success: 0, failures: 0 };
    // About while loop vs funtional programing => while loop so much faster
    // https://stackoverflow.com/a/43596323/7043613
    do {
      let tokensByLoop = tokens.slice(index, slice(index, tokens.length));
      let tokensToSend = splitTokensByPlatform(tokensByLoop);
      let payloads     = template(payload);
      for (let i = 0; i < so.length; i++) {
        if (tokensToSend[so[i]]) {
          const response = await push.sendToDevice(
            tokensToSend[so[i]],
            payloads[so[i]].payload,
            payloads[so[i]].options
          );
          transformResponse(response, result, tokensToSend[so[i]]);
        }
      }
      index = incrementIndex(index, tokens.length);
    } while (index < tokens.length - 1);

    notifyListeners(EVENTS.SUCCESS, result);
    return result;
  }

  function notifyListeners(event, data) {
    if (!listeners[event] && listeners[event].length === 0) return;
    for (let i = 0; i < listeners[event].length; i++)
      listeners[event][i](data);
  }

  function splitTokensByPlatform(tokens) {
    const isAndroidPush = token => token.indexOf(':') !== -1;
    const object = { ios: [], android: [] };
    for (let i = 0; i < tokens.length; i++) {
      const platform = (isAndroidPush(tokens[i])) ? 'android' : 'ios';
      object[platform].push(tokens[i]);
    }
    if (object.android.length === 0) delete object.android;
    if (object.ios.length     === 0) delete object.ios;
    return object;
  }

  function transformResponse(response, result, tokens) {
    if (!(response && 'results' in response))
      throw new Error(errors.transformResponse);
    errorFCMFilter(tokens, response.results);
    result.success  += response.successCount;
    result.failures += response.failureCount;
    result.tokens   += tokens.length;
  }

  /**
   * INFO: https://firebase.google.com/docs/cloud-messaging/admin/errors
   * @param {String, Array} tokens 
   * @param {Array} result 
   */
  function errorFCMFilter(tokens, result) {
    if (typeof tokens === 'string') tokens = [tokens];
    for (let i = 0; i < result.length; i++)
      if (result[i].error && FCM_RESPONSES[result[i].error.code])
        notifyListeners(FCM_RESPONSES[result[i].error.code], tokens[i]);
  }

  function assertMandatoryEventFields(event) {
    if (!event || typeof event !== 'object') throw new Error(errors.send.noEvent);
    if (!event.tokens) throw new Error(errors.send.noTokens);
    // if (!pushTypes[event.pushType]) throw new Error(type + ": this type of notification are not defined.");
  }

  function overwriteTemplates(pathTemplates) {
    if (pathTemplates && typeof pathTemplates === 'string') {
      pushTemplates = pathTemplates;
      pushTypes     = require(pushTemplates);
    }
  }

  function getTemplate(pushType, type) {
    try {
      return require(pushTemplates + pushTypes[pushType]);
    } catch (error) {}
    try {
      return require(pushTemplates + pushTypes[type]);
    } catch (error) {}
    throw new Error(errors.send.noTemplate);
  }

  function assertConfigFields() {
    if (!firebaseConfig)      throw new Error(errors.firebaseConfig.notProvided);
    if (!firebaseConfig.cert) throw new Error(errors.firebaseConfig.notCert);
    if (!firebaseConfig.url)  throw new Error(errors.firebaseConfig.notUrl);
  }
};
