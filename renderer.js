const electron = require('electron')
const ipc = electron.ipcRenderer
const $ = (selector) => document.querySelector(selector)
const htmlView = $('.rendered-html')
const screenshotBtn = $('#get-screenshots')
const remote = electron.remote
const mainProcess = remote.require('./main')
const screenShotImg = $('.screenshot')
const deleteAll = $('#select-all')
const unSelectAll = $('#select-all')

let currentFile = null

function renderImgsToHTML (imgs) {
	let newImgs = []
  if(htmlView.children.length >= 0) {
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
}


function showImages (imgs) {
  console.log(imgs)
}

screenshotBtn.addEventListener('click', () => {
  mainProcess.getScreens()
})

deleteAll.addEventListener('click', () => {
  let screenshotsInDom = document.querySelectorAll('.screenshot')
  Array.from(screenshotsInDom).forEach((s) => {
    if(s.classList.contains('active')) {
      s = s.classList.filter(f != 'active')
    }
    s.classList.toggle('active')
  })
})

unSelectAll.addEventListener('click', () => {
  let screenshotsInDom = document.querySelectorAll('.screenshot')
  Array.from(screenshotsInDom).forEach((s) => {
    if(s.classList.contains('active')) {
      s.classList.remove('active')
    }
  })
})



ipc.on('screenshots-found', (event, imgs) => {
  renderImgsToHTML(imgs)
})
