const actions = require('../push/push.actions');

module.exports = (payload) => {
  if (!payload.user && !payload.user.name && !payload.text)
    return new Error(`Bad construction of payload 
      for chat_message notification: 
      ${JSON.stringify(payload)}`);
  const result = { android: {}, ios: {} };
  result.android = result.ios = {
    options: {
      contentAvailable: true,
      priority        : 'normal',
    },
    payload: {
      notification: {
        title: payload.user.name || '',
        body : payload.text || '',
        click_action: actions.OPEN,
        icon : 'icon', // android only
        sound: 'default', // android default only, iOS: Sound files can be in the main bundle of the client app or in the Library/Sounds folder of the app's data container
        tag  : `${Math.floor((Math.random() * 999) + 1)}`, // android only
      },
      data: payload.payload || {}
    }
  };
  return result;
};
