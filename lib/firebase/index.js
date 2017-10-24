var admin = require("firebase-admin"),
    config = require("../../config").firebase;

admin.initializeApp({
    credential: admin.credential.cert(__dirname + "/../.."+config.cert),
    databaseURL: config.url
});

module.exports = {
    init: init,
    push: admin.messaging(),
}

function init(fcmData){
    if(!(fcmData.cert&&fcmData.url))
        throw new Error("Invalid firebase initialization object.");
    admin.initializeApp({
        credential: admin.credential.cert(__dirname + "/../.."+fcmData.cert),
        databaseURL: fcmData.url
    });
}