const electron = require('electron')
const ipc = electron.ipcRenderer
const $ = (selector) => document.querySelector(selector)
const htmlView = $('.rendered-html')
const screenshotBtn = $('#get-screenshots')
const remote = electron.remote
const mainProcess = remote.require('./main')
const screenShotImg = $('.screenshot')
const selectAll = $('#select-all')
const deleteSelected = $('.delete-selected')
const deleteScreens = require('./delete-screens')


let currentFile = null

function renderImgsToHTML (imgs) {
	let newImgs = []
  if(htmlView.children.length >= 1) {
    while(htmlView.firstChild) {
      htmlView.removeChild(htmlView.firstChild)
    }
  }
  imgs.forEach((i) => {
    htmlView.appendChild(document.createElement('img'))
    let arr = Array.from(htmlView.children)
    arr[arr.length - 1].className = 'screenshot'
    arr[arr.length - 1].src = i
  })
  let screenshotsInDom = document.querySelectorAll('.screenshot')
  Array.from(screenshotsInDom).forEach((s) => {
    s.addEventListener('click', (event) => {
      let el = event.target
      el.classList.toggle('active')
    })
  })
  attachSelectAllButton()
}

function attachSelectAllButton() {
  selectAll.addEventListener('click', () => {
    let screenshotsInDom = document.querySelectorAll('.screenshot')
    for(var i = 0; i < 2; i++) {
      screenshotsInDom[i].classList.toggle('active')
    }
  })
}

screenshotBtn.addEventListener('click', () => {
  mainProcess.getScreens()
})



deleteSelected.addEventListener('click', () => {
  let screenshotsInDom = document.querySelectorAll('.screenshot')
  let screens = Array.from(screenshotsInDom).filter((s) => {
    if(s.classList.contains('active')) {
      return s
    }
  }).map(s => s.getAttribute('src'))
  deleteScreens(screens)
  mainProcess.getScreens()
})




