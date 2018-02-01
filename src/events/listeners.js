const listeners = {
  onUninstalled     : [],
  onRenewCredentials: [],
  onFirebaseError   : [],
  onError           : [],
  onSuccess         : []
};

const errors = {
  onFunction: {
    unknownType: ': Unknown event type.',
    noCallback : 'No function callback passed to subscribe on the listener.'
  }
};

module.exports = {
  on,
  remove,
  notify
};

const assertNotify = (type, data) => (data && listeners[type] && listeners[type].length);

function notify(type, data) {
  if (!assertNotify(type, data)) return false;
  for (let i = 0; i < listeners[type].length; i++)
    listeners[type][i](data);
}

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
function remove(type, cb) {
  if (!listeners[type])         throw new Error(type + errors.onFunction.unknownType);
  if (typeof cb !== 'function') throw new Error(errors.onFunction.noCallback);
  const index = listeners[type].indexOf(cb);
  if (index !== -1) listeners[type].splice(index, 1);
}
