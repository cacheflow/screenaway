const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const dialog = electron.dialog
const Menu = electron.Menu
const os = require('os')
const fs = require('fs')
const {ipcMain} = require('electron')
const bytes = require('bytes')
const deleteScreens = require('./delete-screens')

let mainWindow = null

let screenShotInFName = (fname) => {
    let j = 0
    let nameToSearchAgainst = 'Screen Shot'
    for(let i = 0; i < nameToSearchAgainst.length; i++) {
      while(nameToSearchAgainst[i] != fname[j]) {
          j++
          if(j == fname.length) {
              return false 
          }
      }
    }
    return true
}

function getScreens() {
  let foldersToCheck = ['Documents', 'Desktop', 'Downloads', 'Pictures']
    .map(f => path.resolve(os.userInfo().homedir, f))
  let allFiles = []
  foldersToCheck.forEach((screenDir) => {
    fs.readdirSync(screenDir).forEach(f => {
      allFiles = allFiles.concat(path.resolve(screenDir, f))
    })
  })
  let screenShots = allFiles.filter(f => screenShotInFName(f))
  let data = screenShots.map((s) => { 
    let stats = fs.statSync(s)
    let fileSizeInBytes = stats['size'] 
    return fileSizeInBytes
  })
  let sizeOfScreenShots = bytes(data.reduce((acc, curr) => {
    return acc + curr
  }, 0))
  let screenshotStats = {numberOfScreenShots: data.length, sizeOfScreenShots, screenShots}
  mainWindow.webContents.send('screenshots-found', screenshotStats)
}

app.on('ready', () => {
  mainWindow = new BrowserWindow({height: 600, width: 800, title: 'Screenwipe', frame: false})
  mainWindow.loadURL(`file://${path.join(__dirname, 'index.html')}`)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  mainWindow.webContents.openDevTools()

})

app.on('window-all-closed', () => {
  if(process.platform != 'darwin') {
    app.quit()
  }
})

function getScreenListener() {
  ipcMain.on('get-screenshots', (event, imgs) => {
    getScreens()
  })
}

function deleteScreenListener() {
  ipcMain.on('delete-screens', (event, imgs) => {
    deleteScreens(imgs)
    mainWindow.webContents.send('screens-removed')
  })
}

getScreenListener()
deleteScreenListener()

const cleanUpListeners = () => {
  ipcMain.removeListener('get-screenshots', getScreenListener)
  ipcMain.removeListener('delete-screens', deleteScreenListener)
}

exports.getScreens = getScreens
