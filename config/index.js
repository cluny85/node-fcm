module.exports = (process.env['NODE_ENV'] === 'production')
               ? require("./prod.env.json")
               : require("./local.env.json");