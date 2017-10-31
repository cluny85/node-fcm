const EVENTS = {
    UNINSTALLED      : "onUninstalled",
    RENEW_CREDENTIALS: "onRenewCredentials",
    FIREBASE_ERROR   : "onFirebaseError",
    ERROR            : "onError",
    SUCCESS          : "onSuccess",
},
FCM_RESPONSES = {
    'messaging/invalid-registration-token'       : EVENTS.UNINSTALLED,
    'messaging/registration-token-not-registered': EVENTS.UNINSTALLED,
    'messaging/server-unavailable'               : EVENTS.FIREBASE_ERROR,
    'messaging/invalid-apns-credentials'         : EVENTS.RENEW_CREDENTIALS,
};
module.exports = { EVENTS, FCM_RESPONSES }

/*
const EVENTS = {
    UNINSTALLED      : "onUninstalled",
    RENEW_CREDENTIALS: "onRenewCredentials",
    FIREBASE_ERROR   : "onFirebaseError",
    ERROR            : "onError",
    SUCCESS          : "onSuccess",
},
FCM_RESPONSES = {
    'messaging/invalid-registration-token'       : EVENTS.UNINSTALLED,
    'messaging/registration-token-not-registered': EVENTS.UNINSTALLED,
    'messaging/server-unavailable'               : EVENTS.FIREBASE_ERROR,
    'messaging/invalid-apns-credentials'         : EVENTS.RENEW_CREDENTIALS,
};
module.exports = { EVENTS, FCM_RESPONSES }
*/
