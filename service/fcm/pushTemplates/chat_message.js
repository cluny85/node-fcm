module.exports = (payload)=>{        
    if(!payload.user&&!payload.user.name&&!payload.text)
        return new Error("Bad construction of payload for chat_message notification: "+
            JSON.stringify(payload));
    let result = {android:{},ios:{}};
    result.android = result.ios = {
        options: {
            // collapseKey: "CHAT",
            contentAvailable: true,
            priority: "normal",
        },
        payload: {
            notification: {
                title: payload.user.name || "lingbe user",
                body: payload.text || "default message",
                click_action: require("../push.actions").OPEN,
                icon: 'icon', // android only
                sound: "default", // android default only, iOS: Sound files can be in the main bundle of the client app or in the Library/Sounds folder of the app's data container
                tag: ""+Math.floor((Math.random() * 999) + 1), // android only
                color: "#3cb896", // android only, in #rrggbb format.
                //badge: "1" // here ios only
            },
            data: {
                event: "chat_message",
                state: "chat",
                badge: "1"
            }
        }
    }
    return result;
}