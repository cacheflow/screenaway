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
  markAllAsDeleteText: "Select All To Delete",
  selectAllScreenShots: false, 
}

const mutations = {
  [types.ADD_IMAGES] (state, {images}) {
    if(state.images.length >= 1) {
      state.images.length = 0
    }
    images.forEach(img => state.images.push({delete: false, key: 
      Math.random().toString(16).slice(2), img
    }))
  },

  [types.MARK_TO_DELETE] (state, {img}) {
    let updatedImg = state.images.findIndex((image) => {
      return image === img
    })
    let arr = []
    arr = state.images.slice(0)
    arr[updatedImg].delete = !arr[updatedImg].delete
    state.images = arr
  },


  [types.MARK_ALL_AS_DELETE] (state) {
    let copyOfImages = state.images.slice()
    copyOfImages.forEach(img => img.delete = !img.delete)
    state.images = copyOfImages
  },

  [types.SHOW_LOADING_GIF] (state) {
    state.showLoadingGif = !state.showLoadingGif
  },

   [types.DELETE_IMAGES] (state) {
    const imgsToDelete = state.images.filter(img => img.delete === true)
    if(imgsToDelete.length) {
      ipc.send('delete-screens', imgsToDelete)
    }
  },

  [types.ADD_NUMBER_OF_SCREENSHOTS] (state, {numberOfScreenShots}) {
    state.numberOfScreenShots = numberOfScreenShots
  },

  [types.ADD_SIZE_OF_SCREENSHOTS] (state, {sizeOfScreenShots}) {
    state.sizeOfScreenShots = sizeOfScreenShots
  },

  [types.CHANGE_MARK_AS_DELETE_TEXT] (state) {
    if(state.markAllAsDeleteText == 'Select All To Delete') {
      state.markAllAsDeleteText = 'Unselect all'
    }
    else {
      state.markAllAsDeleteText = 'Select All to Delete'
    }
   
  }
}

const actions = {
  getScreenshots({ commit }) {
    commit(types.SHOW_LOADING_GIF)
    ipc.send('get-screenshots')
    getScreenShotData(commit)
  },

  markAllAsDelete({commit}) {
    commit(types.MARK_ALL_AS_DELETE)
    commit(types.CHANGE_MARK_AS_DELETE_TEXT)
  },

  deleteSelectedScreens({commit}) {
    commit(types.DELETE_IMAGES)
    const dispatch = this.dispatch
    if(!ipc.listeners('screens-removed').length) {
      ipc.on('screens-removed', (event) => {
        dispatch('getScreenshots')
      })
    }
  },

  addToDelete({commit}, img) {
    commit(types.MARK_TO_DELETE, {img})
  }
}

const map = {
  screenShotFoundEventExists: () => ipc.listeners('screenshots-found').length,
  screenShotRemovedEventExists: () => ipc.listeners('screens-removed').length
}

function getScreenShotData(commit) {
  const screenShotEventPresent = ipc.listeners('screenshots-found').length > 0 ? true : false 
  if(!ipc.listeners('screenshots-found').length) {
    ipc.on('screenshots-found', (event, data) => {
      commit(types.ADD_IMAGES, { images: data.screenShots })
      commit(types.ADD_NUMBER_OF_SCREENSHOTS, {numberOfScreenShots: data.numberOfScreenShots})
      commit(types.ADD_SIZE_OF_SCREENSHOTS, {sizeOfScreenShots: data.sizeOfScreenShots})
    })
  }
}

const getters = {
  images: state => state.images,
  showLoadingGif: state => state.showLoadingGif,
  markAllAsDeleteText: state => state.markAllAsDeleteText,
  numberOfScreenShots: state => state.numberOfScreenShots,
  sizeOfScreenShots: state => state.sizeOfScreenShots,
  imgsToDelete: state => {
    return state.images.filter(img => img.delete === true)
  }
}

export default new Vuex.Store({
  state, 
  getters, 
  actions, 
  mutations
})