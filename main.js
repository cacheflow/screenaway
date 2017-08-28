const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const dialog = electron.dialog
const fs = require('fs')
const Menu = electron.Menu
const os = require('os')

let mainWindow = null

function getScreens() {
  console.log("hello world")
  let screenDir = path.resolve(os.userInfo().homedir, "Desktop")
  let screenShots = fs.readdirSync(screenDir)
    .filter(f => f.includes("Screen Shot"))
      .map(f => `file://${path.join(screenDir, f)}`)
  mainWindow.webContents.send('screenshots-found', screenShots)
}

app.on('ready', () => {
  console.log("Application is ready")

  mainWindow = new BrowserWindow({height: 300, width: 600, title: 'Screenwipe'})
  mainWindow.loadURL(`file://${path.join(__dirname, 'index.html')}`)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  mainWindow.webContents.openDevTools()

})


// app.on('find-screenshots', (event) => {
//
// })

exports.getScreens = getScreens
