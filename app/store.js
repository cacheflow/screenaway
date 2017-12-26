import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './types'

const ipc = window.require('electron').ipcRenderer


Vue.use(Vuex)

const state = {
  images: [],
  numberOfScreenShots: '',
  sizeOfScreenShots: '',
  showLoadingGif: false,
  showScreenshotNotFoundText: false,
  selectAllScreenShots: false,
}

function getScreenShotData(commit) {
  if (!ipc.listeners('screenshots-found').length) {
    ipc.on('screenshots-found', (event, data) => {
      const updateScreenShotNotFoundBool = data.screenShots.length === 0 ? true : false
      commit(types.CHANGE_SCREENSHOT_NOT_FOUND_TEXT, {
        showScreenshotNotFoundText: updateScreenShotNotFoundBool
      })
      commit(types.ADD_IMAGES, { images: data.screenShots })
      commit(types.ADD_NUMBER_OF_SCREENSHOTS, { numberOfScreenShots: data.numberOfScreenShots })
      commit(types.ADD_SIZE_OF_SCREENSHOTS, { sizeOfScreenShots: data.sizeOfScreenShots })
    })
  }
}

const mutations = {
  [types.ADD_IMAGES] (state, { images }) {
    if (state.images.length >= 1) {
      state.images.length = 0
    }
    images.forEach(img => state.images.push({
      delete: false,
      key: Math.random().toString(16).slice(2),
      img
    }))
  },

  [types.MARK_TO_DELETE] (state, { img }) {
    const updatedImg = state.images.findIndex(image => image === img)
    let arr = []
    arr = state.images.slice(0)
    arr[updatedImg].delete = !arr[updatedImg].delete
    state.images = arr
  },


  [types.MARK_ALL_AS_DELETE] (state) {
    const copyOfImages = state.images.slice()
    copyOfImages.forEach((img) => {
      return img.delete = !img.delete
    })
    state.images = copyOfImages
  },

  [types.SHOW_LOADING_GIF] (state) {
    state.showLoadingGif = !state.showLoadingGif
  },

  [types.DELETE_SCREEN_SHOT] (state, { imgToDelete }) {
    const imgsToDelete = state.images.filter(img => img.key === imgToDelete)
    if (imgsToDelete.length) {
      ipc.send('delete-screens', imgsToDelete)
    }
  },

  [types.DELETE_ALL_SCREEN_SHOTS] (state) {
    const imgsToDelete = state.images.slice()
    if (imgsToDelete.length) {
      ipc.send('delete-screens', imgsToDelete)
    }
  },


  [types.ADD_NUMBER_OF_SCREENSHOTS] (state, { numberOfScreenShots }) {
    state.numberOfScreenShots = numberOfScreenShots
  },

  [types.ADD_SIZE_OF_SCREENSHOTS] (state, { sizeOfScreenShots }) {
    state.sizeOfScreenShots = sizeOfScreenShots
  },

  [types.SELECT_ALL_SCREEN_SHOTS] (state) {
    state.selectAllScreenShots = !state.selectAllScreenShots
  },

  [types.CHANGE_SCREENSHOT_NOT_FOUND_TEXT] (state, { showScreenshotNotFoundText }) {
    state.showScreenshotNotFoundText = showScreenshotNotFoundText
  }
}

const actions = {
  getScreenshots({ commit }) {
    commit(types.SHOW_LOADING_GIF)
    ipc.send('get-screenshots')
    getScreenShotData(commit)
  },

  markAllAsDelete({ commit }) {
    commit(types.MARK_ALL_AS_DELETE)
    commit(types.SELECT_ALL_SCREEN_SHOTS)
  },

  deleteSelectedScreenShot({ commit }, img) {
    commit(types.DELETE_SCREEN_SHOT, { imgToDelete: img })
    const dispatch = this.dispatch
    if (!ipc.listeners('screens-removed').length) {
      ipc.on('screens-removed', () => {
        dispatch('getScreenshots')
      })
    }
  },

  deleteAllScreenShots({ commit }) {
    commit(types.DELETE_ALL_SCREEN_SHOTS)
    const dispatch = this.dispatch
    if (!ipc.listeners('screens-removed').length) {
      ipc.on('screens-removed', () => {
        dispatch('getScreenshots')
      })
    }
  }
}

const getters = {
  images: state => state.images,
  showLoadingGif: state => state.showLoadingGif,
  selectAllScreenShots: state => state.selectAllScreenShots,
  showScreenshotNotFoundText: state => state.showScreenshotNotFoundText,
  markAllAsDeleteText: state => state.markAllAsDeleteText,
  numberOfScreenShots: state => state.numberOfScreenShots,
  sizeOfScreenShots: state => state.sizeOfScreenShots,
  imgsToDelete: (state) => {
    return state.images.filter(img => img.delete === true)
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
