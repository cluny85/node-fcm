const path = require('path');

module.exports = {
  firebase: {
    cert: path.normalize(__dirname + '/../config/firebase/react-fcm-firebase-adminsdk-oeefp-7fb56ebe2b.json'),
    url : 'https://react-fcm.firebaseio.com'
  }
};
