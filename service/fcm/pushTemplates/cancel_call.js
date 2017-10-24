module.exports = (payload)=>{
    return {
        android: {
            options: {
                priority: "high",        
                timeToLive: 0// in seconds, max 4weeks: 2419200: default
            },
            payload: {
                data: {
                    event: "cancel_call",
                    custom_notification: JSON.stringify({
                        "body": "test body",
                        "title": "test title",
                        "color":"#00ACD4",
                        "priority":"high",
                        "id": "id",
                        "show_in_foreground": true,
                        "badge": 2
                    })
                }
            }
        },
        ios: {
            options: {
                priority: "high",        
                timeToLive: 0// in seconds, max 4weeks: 2419200: default
            },
            payload: {
                data: {
                    event: "cancel_call",
                    content_available: "true", // para que ios la reciba en segundo plano,
                    badge: "3"
                }
            }
        }
        // notification: {
        //     title: "CANCEL call",
        //     body: "Maddafakkaaaa !",
        //     click_action: ACTIONS.CALL,
        //     icon: 'icon', // android only
        //     sound: "default", // android default only, iOS: Sound files can be in the main bundle of the client app or in the Library/Sounds folder of the app's data container
        //     tag: "cancel_call", // android only
        //     color: "#ff0000", // android only, in #rrggbb format.
        // },
    };
}