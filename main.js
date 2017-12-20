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
  let foldersToCheck = ['Documents', 'Desktop', 'Pictures', 'Downloads']
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
  mainWindow = new BrowserWindow({height: 600,
    width: 800,
    title: 'Screenaway',
    frame: false,
    icon: setIcon(os.platform())
  })
  mainWindow.loadURL(`file://${path.join(__dirname, 'index.html')}`)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  mainWindow.webContents.openDevTools()

})

function setIcon(platform) {
  let imgPath = ""
  if(platform == 'linux' || platform == 'win32') {
    imgPath = "/Users/lexalexander/Documents/codestuff/screenaway/assets/icons/png/64x64.png"
  }
  else {
    imgPath = "/Users/lexalexander/Documents/codestuff/screenaway/assets/icons/mac/icon.icns"
  }
  return imgPath
}

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

function encodeLoader(loader) {
	if (typeof loader === "string") {
		return loader;
	}

	if (typeof loader.options !== "undefined") {
		const query = Object
			.keys(loader.options)
			.map(function map(param) {
				return `${encodeURIComponent(param)}=${encodeURIComponent(loader.options[param])}`;
			})
			.join("&");
		return `${loader.loader}?${query}`;
	}
	return loader.loader;
}

module.exports = function buildExtractStylesLoader(loaders) {
	const extractTextLoader = encodeLoader(loaders[0]);
	const fallbackLoader = encodeLoader(loaders[1]);

	const restLoaders = loaders
		.slice(2)
		.map(function map(loader) {
			if (typeof loader === "string") {
				return loader;
			}
			return encodeLoader(loader);
		});

	return [
		extractTextLoader,
		fallbackLoader,
		...restLoaders,
	].join("!");
};

exports.getScreens = getScreens
