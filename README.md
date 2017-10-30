# node-fcm-hero
FCM interface with super powers. Send push notifications to android/ios in a simple way

## Installation

## How it works

To use this lib, you have to import:

```javascript
var fcm    = require('node-fcm-hero'),
    config = require("./your.config.file").firebase,
    push   = require('../index').init(config);
```

The config file must have this format:

```
{
    "firebase": {
        "cert": "/config/firebase/react-fcm-firebase-adminsdk-oeefp-7fb56ebe2b.json",
        "url" : "https://react-fcm.firebaseio.com"
    }
}
```

The cert param has to be the route of your fcm certificate.

### Send notification

To send a push notification you need to call 'push.send'. EX:

```javascript
push.send(token,type).
then( res=>{
    console.log(res)
}).
catch( err=>{
    console.log(err)
});
```

### Custom templates

You can override the default types and templates for your own, passing path through the initialization:
```javascript
var fcm    = require('node-fcm-hero'),
    config = require("./your.config.file").firebase,
    templatesPath = "your.templates.path",
    push   = require('../index').init(config,templatesPath);
```

You can find examples of the templates format under the folder 'pushTemplates'.
