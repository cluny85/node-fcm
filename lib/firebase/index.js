var admin = require("firebase-admin");

module.exports = config =>{
    if(!(config.cert&&config.url))
        throw new Error("Invalid firebase initialization object.");

    admin.initializeApp({
        credential: admin.credential.cert(config.cert),
        databaseURL: config.url
    });

    return admin.messaging();
}