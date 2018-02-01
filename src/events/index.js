const events = {
  UNINSTALLED      : 'onUninstalled',
  RENEW_CREDENTIALS: 'onRenewCredentials',
  FIREBASE_ERROR   : 'onFirebaseError',
  ERROR            : 'onError',
  SUCCESS          : 'onSuccess'
};
const FCM_RESPONSES = {
  'messaging/invalid-registration-token'       : events.UNINSTALLED,
  'messaging/registration-token-not-registered': events.UNINSTALLED,
  'messaging/server-unavailable'               : events.FIREBASE_ERROR,
  'messaging/invalid-apns-credentials'         : events.RENEW_CREDENTIALS
};

module.exports = { events, FCM_RESPONSES };
