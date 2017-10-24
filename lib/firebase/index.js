var admin = require("firebase-admin"),
    config = require("../../config").firebase;

admin.initializeApp({
    credential: admin.credential.cert(__dirname + "/../.."+config.cert),
    databaseURL: config.url
});

module.exports = {
    push: admin.messaging()
}