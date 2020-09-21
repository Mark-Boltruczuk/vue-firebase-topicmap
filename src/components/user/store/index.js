import {
    LOAD, UPDATE, CREATE, LOADING, CLEAR_ERROR, SET_ERROR, SNACKBAR, DOWNLOAD, DOJOIN,
    SET_CUR_LIB_ID, UPDATING, BOOKMARK, JOIN, INIT, SET_LIB_ID
} from './types'

import * as getters from './getters'
import * as actions from './actions'

const state = {
    user: {},
    error: null,
    loading: false,
    updating: false,
    curLibId: null,
    snackbar: {},
    message: '',
    users: null
}

const mutations = {
    [DOWNLOAD](state, payload) {
        state.users = payload
    },
    [LOAD](state, payload) {
        if (payload === null) {
            state.user = null
            state.error = null
            state.loading = false
            state.updating = false
            state.curLibId = null
            state.snackbar = {}
            state.message = ''
            state.users = null
        } else {
            state.user = JSON.parse(JSON.stringify(payload))
        }
    },
    [UPDATE](state, payload) {
        state.user = JSON.parse(JSON.stringify(payload))
    },
    [CREATE](state, payload) {
        state.user = JSON.parse(JSON.stringify(payload))
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
        state.snackbar = JSON.parse(JSON.stringify(payload))
    },
    [DOJOIN](state, payload) {
        state.user.joinedLibraries[payload.id].status = payload.status
    },
    [SET_CUR_LIB_ID](state, payload) {
        state.curLibId = payload
    },
    [SET_LIB_ID](state, payload) {
        if (!state.curLibId)
            state.curLibId = payload
    },
    [UPDATING](state, payload) {
        state.updating = payload
    },
    [BOOKMARK](state, payload) {
        state.user['followingTopicmaps'][payload.libraryId].push(payload.topicMapId);
    },
    [JOIN](state, payload) {
        state.user['joinedTopicmaps'][payload.libraryId].push(payload.topicMapId);
    },
    [INIT](state) {
        state.user = {}
        state.error = null
        state.loading = false
        state.updating = false
        state.curLibId = null
        state.snackbar = {}
        state.message = ''
        state.users = null
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}