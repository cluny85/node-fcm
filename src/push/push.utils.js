module.exports = {
  createFCMAndroidPayload
};
// https://developer.android.com/reference/android/support/v4/app/NotificationCompat.Builder.html
// https://developer.android.com/reference/android/support/v4/app/NotificationCompat.BigPictureStyle.html
// http://androidbash.com/firebase-push-notification-android/
// https://stackoverflow.com/questions/38504078/firebase-expandable-notification-show-image-when-app-is-in-background

/**
 * Recomended leave it empty and finish the constructor with the build function
 * @param {JSONObject} payload
 */
function createFCMAndroidPayload(payload = {}) {
  return {
    setEvent: (event) => {
        if (!(event && typeof event === 'string'))
            return new Error('Error setting event field. Must be a string.');
        if (!payload.extras) payload.extras = {};
        payload.extras.event = event;
        return createFCMAndroidPayload(payload);
    },
    setState: (state) => {
        if (!(state && typeof state === 'string'))
            return new Error('Error setting state field. Must be a string.');
        if (!payload.extras) payload.extras = {};
        payload.extras.state = state;
        return createFCMAndroidPayload(payload);
    },
    setTitle: (title) => {
        if (!(title && typeof title === 'string'))
            return new Error('Error setting title field. Must be a string.');
        payload.title = title;
        return createFCMAndroidPayload(payload);
    },
    setText: (text) => {
        if (!(text && typeof text === 'string'))
            return new Error('Error setting text field. Must be a string.');
        payload.body = text;
        return createFCMAndroidPayload(payload);
    },
    setBigTtext: (big_text) => {
        if (!(big_text && typeof big_text === 'string'))
            return new Error('Error setting big_text field. Must be a string.');
        payload.big_text = big_text;
        return createFCMAndroidPayload(payload);
    },
    setIcon: (icon) => {
        if (!(icon && typeof icon === 'string'))
            return new Error('Error setting icon field. Must be a string.');
        payload.icon = (icon === 'default') ? 'ic_launcher' : icon;
        return createFCMAndroidPayload(payload);
    },
    setImage: (image) => {
        // TODO: NEED TO BE IMPLEMENTED ON REACT NATIVE FIREBASE PLUIGIN
        // https://developer.android.com/reference/android/support/v4/app/NotificationCompat.BigPictureStyle.html
        if (!(image && typeof image === 'string'))
            return new Error('Error setting image field. Must be a string.');
        payload.image = image;
        return createFCMAndroidPayload(payload);
    },
    setColor: (color) => {
        if (!(color && typeof color === 'string'))
            return new Error('Error setting color field. Must be a string with format #rrggbb');
        payload.color = color;
        return createFCMAndroidPayload(payload);
    },
    setLights: (lights,tOn,tOff) => {
        // on android argb: 0xff00FF00, onMs: 2000, offMs: 3000
        //Set the argb value that you would like the LED on the device to blink,
        //as well as the rate. The rate is specified in terms of the number of milliseconds
        //to be on and then the number of milliseconds to be off.
        if (!(lights && typeof lights === 'string' && lights.length === 8))
            return new Error('Error setting lights field. Must be a string with format aarrggbb');
        if (tOn  && typeof tOn === 'number') payload.onMs = tOn;
        if (tOff && typeof tOff === 'number') payload.offMs = tOff;
        payload.lights=lights;
        return createFCMAndroidPayload(payload);
    },
    setSound: (sound) => {
        if (!(sound && typeof sound === 'string'))
            return new Error('Error setting sound field. Must be a string.');
        payload.sound = (sound === 'default') ? 'default' : sound;
        return createFCMAndroidPayload(payload);
    },
    setVibrate: (ms) => {
        if (!((typeof ms === 'number'&&ms>0) || ms===null))
            return new Error('Error setting vibrate field. Must be a number gt 0 or null.');
        payload.vibrate=ms;
        return createFCMAndroidPayload(payload);
    },
    setGroup: (gruop) => {
        if (!(gruop && typeof gruop === 'string'))
            return new Error('Error setting gruop field. Must be a string.');
        payload.gruop = gruop;
        return createFCMAndroidPayload(payload);
    },
    setCategory: (category) => {
      if (!(category && typeof category === 'string'))
        return new Error('Error setting category field. Must be a string.');
      payload.category = category;
      return createFCMAndroidPayload(payload);
    },
    setPriority: (priority) => {
      if (!(priority && typeof priority === 'string'))
        return new Error('Error setting priority field. Must be a string.');
      payload.priority = priority;
      return createFCMAndroidPayload(payload);
    },
    setShowInForeground: (foregroud) => {
      if (!(foregroud && typeof foregroud === 'boolean'))
        return new Error('Error setting foregroud field. Must be a string.');
      payload.show_in_foreground = foregroud;
      return createFCMAndroidPayload(payload);
    },
    // setClickAction: (foregroud)=>{
    //     if (!(foregroud && typeof foregroud === 'boolean'))
    //         return new Error("Error setting foregroud field. Must be a string.");
    //     payload.show_in_foreground = foregroud;
    //     return createFCMAndroidPayload(payload);
    // },
    build: () => ({
      android: {
        data: {
          custom_notification: JSON.stringify(payload)
        }
      }
    })
  };
}

// ANDROID
// payload.event --> extras
// payload.state --> extras
// payload.title
// payload.text
// payload.big_text
// payload.icon
// payload.image
// payload.color
// payload.lights
// payload.sound
// payload.vibrate
// payload.notId
// payload.group
// payload.category
// payload.priority
// //tag
// payload.show_in_foreground
// payload.click_action
// //repeat_interval
// //sub_text
// //large_icon