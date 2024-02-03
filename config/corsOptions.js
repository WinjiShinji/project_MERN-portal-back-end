const allowedList = require('./allowedList')

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedList.indexOf(origin) !== -1 || !origin) { // @DEV: !origin
      callback(null, true)
    } else {
      callback(new Error('not allowed by CORS'))
    }
  },
  credentials: true //  @FIX: Access-Control-Allow-Credentials

}

module.exports = corsOptions