import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './types'
const ipc = window.require('electron').ipcRenderer


Vue.use(Vuex)

const state = {
  images: [],
  numberOfScreenShots: '',
  sizeOfScreenShots: ''
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

   [types.DELETE_IMAGES] (state) {
    const imgsToDelete = state.images.filter(img => img.delete === true)
    if(imgsToDelete.length) {
      ipc.send('delete-screens', imgsToDelete)
    }
  }
}

const actions = {
  getScreenshots({ commit }) {
    ipc.send('get-screenshots')
    ipc.on('screenshots-found', (event, data) => {
      commit(types.ADD_IMAGES, { images: data.screenShots, 
        numberOfScreenShots: data.screenShots, 
        sizeOfScreenShots: data.sizeOfScreenShots,
       })
    })
  },

  deleteSelectedScreens({commit}) {
    commit(types.DELETE_IMAGES)
    const dispatch = this.dispatch
    ipc.on('screens-removed', (event) => {
      dispatch('getScreenshots')
    })
  },

  addToDelete({commit}, img) {
    commit(types.MARK_TO_DELETE, {img})
  }
}


const getters = {
  images: state => state.images,
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