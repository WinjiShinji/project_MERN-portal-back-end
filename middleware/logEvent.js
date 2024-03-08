const fsPromises = require('fs').promises
const path = require('path')

const logEvent = async (req, res, next) => {
  const date = new Date().toUTCString()
  const logItem = `${date}\t${req.url}\t${req.headers.origin}\n`

  try {
    await fsPromises.mkdir(path.join(__dirname, '..', 'logs'),  { recursive: true })
    await fsPromises.appendFile(path.join(__dirname, '..', 'logs', 'logEvents.log'), logItem)
  } catch (error) {
    console.error(error)
  }
  next()
}


module.exports = logEvent