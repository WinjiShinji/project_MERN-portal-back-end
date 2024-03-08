const fsPromises = require('fs').promises
const path = require('path')

const logError = async (code, message, url, origin) => {
  const date = new Date().toUTCString()
  const logItem = `${date}\t${code}\t${url}\t${origin}\n${message}\n\n`

  try {
    await fsPromises.mkdir(path.join(__dirname, '..', 'logs'), {recursive: true})
    await fsPromises.appendFile(path.join(__dirname, '..', 'logs', 'logError.log'), logItem)
    console.log(code, origin)
  } catch (error) {
    console.error(error)
  }
}

module.exports = logError