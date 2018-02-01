[![Build Status](https://travis-ci.org/cluny85/node-fcm-hero.svg?branch=master)](https://travis-ci.org/cluny85/node-fcm-hero)
[![Coverage Status](https://coveralls.io/repos/github/cluny85/node-fcm-hero/badge.svg?branch=master)](https://coveralls.io/github/cluny85/node-fcm-hero?branch=master)

# node-fcm-hero
FCM interface with super powers. Send push notifications to android/ios in a simple way

## Get Started

### Install

```
npm install --save node-fcm-hero
```

## Usage

To use this lib, you have to import:

```javascript
const fcm          = require('node-fcm-hero');
const { firebase } = require("./your.config.file");
const push         = fcm(config);
```

The config file must have this format:

```json
{
  "firebase": {
    "cert": "/route/to/firebase-adminsdk.json",
    "url" : "https://your-project.firebaseio.com"
  }
}
```

The cert param has to be the path to yor firebase json file.

If you already have an initializated instance of **firebase-admin** module, you can pass directly the messaging function to initialize the **node-fcm-hero**. Ie:

```javascript
const fcm          = require('node-fcm-hero');
const { firebase } = require("./your.config.file");
const push         = fcm(config, myFirebaseAdmin.messaging());
```

### Send notification

To send a push notification you will need to call the **send** method. Ie:

```javascript
const event = {
  token   : '',
  type    : '',
  payload : '',
  pushType: ''
}
push.send(event)
  .then(res => console.log(res))
  .catch(err => console.log(err));
```

### Push notification type

You can set the pushType attribute of the event to define the kind of template to send. This pushType must be a string with the name of one of the custom templates you initialize to the project.

If you do not set any template or it didn't find in the type in the templates folder, the notification will fail.

You can make this work like an event Redux flow, passing the type and defining a template file per event you want to push.

If the event type don't macht with any template, the node-fcm-hero will return a unsuccess json object:

```json
{
  "success": 0,
  "error"  : "No template found for this event"
}
```

### Custom templates

You can override the default types and templates for your own, setting in the firebase config object a **templatesPath** field with the string to the path.

```json
{
  "firebase": {
    "cert": "/route/to/firebase-adminsdk.json",
    "url" : "https://your-project.firebaseio.com",
    "templatesPath": "/path/to/templates"
  }
}
```

You can find examples of the templates format under the folder 'exampleTemplates'.

### Event listeners

node-fcm-hero has a default events pre configured to help you to subscribe to listeners depending of this default events.

This is the list of the default events:

**push.events :**
```
.UNINSTALLED      
.RENEW_CREDENTIALS
.FIREBASE_ERROR   
.ERROR            
.SUCCESS          
```

To subscribe and catch some of this events, you need to add a callback funtion asociated to the event:

```javascript
push.on(push.events.UNINSTALLED, callback1);
push.on(push.events.ERROR, callback2);
push.on(push.events.RENEW_CREDENTIALS, callback3);
```

### UNINSTALLED event

Will return every single token marked as app uninstalled after the called send function.

### Error handling

If any error happends, the node-fcm-hero will return a json object with the success field equal to 0. Also, it will notify to the on error listeners.

## Test

To make the integration test work, you need to provide your own instance of firebase admin messaging or set your configuration file with the route to your **firebase-adminsdk.json**. Also you need to you provide at least one working firebase token and one uninstalled to cover all the best scenarios.
After that, delete the .skip of the nodeFcmHero.e2e.test.js

Sorry for this, but i don't want to see how my phone 💥💥💥 

## Contributing

Please read [CONTRIBUTING.md](https://github.com/cluny85/node-fcm-hero/blob/master/CONTRIBUTING.md) for details on code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
