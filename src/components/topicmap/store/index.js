import { LOAD, UPDATE, CREATE, LOADING, CLEAR_ERROR, SET_ERROR, SNACKBAR, SHOWMODAL, SAVEFOLDER, DONOTFIICATION } from './types'

import * as getters from './getters'
import * as actions from './actions'

const state = {
    library: null,
    error: null,
    loading: false,
    snackbar: {},
    created: false,
    file: false,
    folder: false,
    root: false,
    node: null
}

const mutations = {
    [LOAD](state, payload) {
        state.library = Object.assign({}, payload)
    },
    [UPDATE](state, payload) {
        state.library = Object.assign({}, payload)
    },
    [CREATE](state, payload) {
        state.created = true
    },
    [LOADING](state, payload) {
        state.loading = payload
    },
    [CLEAR_ERROR](state) {
        state.error = null
    },
    [SET_ERROR](state, payload) {
        state.error = payload
    },
    [SNACKBAR](state, payload) {
        state.snackbar = Object.assign({}, payload)
    },
    [SHOWMODAL](state, payload) {
        if (payload === 'file') {
            state.folder = state.root = false
            state.file = !state.file
        } else if (payload == 'folder') {
            state.file = state.root = false
            state.folder = !state.folder
        } else if (payload == 'root') {
            state.file = state.folder = false
            state.root = !state.root
        }
    },
    [DONOTFIICATION](state, payload) {
        
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}