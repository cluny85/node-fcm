const admin = require('firebase-admin');

const errors = {
  missingFields: 'Invalid firebase initialization object.'
};
module.exports = (config) => {
  if (!(config.cert && config.url))
    throw new Error(errors.missingFields);

  admin.initializeApp({
    credential : admin.credential.cert(config.cert),
    databaseURL: config.url
  });

  return admin.messaging();
};

// function fcm() {
//   return admin.messaging();
// }

// function closeFirebase() {
//   admin.apps.forEach(instance => admin.removeApp(instance));
// }
