const fsPromise = require("fs").promises

const serverLogging = async (error, fileName, code) => {
  const date = new Date()
  const logContent = `Date: ${date.toISOString()}\t Code: ${code}\t Filename: ${fileName}\t Error: ${error}.\n`

  // Write to log file //
  try {
    await fsPromise.appendFile('./src/logging/serverLog.txt', logContent)
    console.error("Server Error:", fileName)
  } catch (err) {
    console.log("500 - Logging Error:", err)
  }
}

module.exports = serverLogging