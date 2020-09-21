import {
    LOAD, CREATE, LOADING, CLEAR_ERROR, SET_ERROR, SNACKBAR, SAVEFOLDER, ADD, REPAINT, EDIT, REMOVE, DONOTFIICATION, UPDATE, UPDATING, CREATING, UNREGISTER,
    LOAD_LIBRARIES, LOAD_LIBRARY, CREATE_LIBRARY, UPDATE_LIBRARY, CREATE_TOPICMAP, UPDATE_TOPICMAP, DELETE_TOPICMAP, CREATE_TOPIC, UPDATE_TOPIC, DELETE_TOPIC,
    COPY_TOPICMAP, INIT, UNFOLLOW, DRAGANDDROP
} from './types'

import * as getters from './getters'
import * as actions from './actions'
import { uid } from '../../../utils'

const state = {
    libraries: {},
    library: null,
    error: null,
    loading: true,
    creating: null,
    updating: null,
    snackbar: {},
    message: '',
    repaint: null,
    file: false,
    folder: false,
    root: false,
    node: null,
    copied: 0,
    createdTopicmap: null
}

const mutations = {
    [LOADING](state, payload) {
        state.loading = payload
    },
    [UPDATING](state, payload) {
        state.updating = payload
    },
    [CREATING](state, payload) {
        state.creating = payload
    },
    [LOAD_LIBRARIES](state, payload) {
        state.libraries = JSON.parse(JSON.stringify(payload))
    },
    [LOAD_LIBRARY](state, payload) {
        state.library = JSON.parse(JSON.stringify(payload))
    },
    [CREATE_LIBRARY](state, payload) {
        state.library = payload
    },
    [UPDATE_LIBRARY](state, payload) {
        state.library.title = payload.title
        state.library.description = payload.description
        state.library.category = payload.category
        state.library.address = Object.assign({}, payload.address)
        state.library.contacts = Object.assign({}, payload.contacts)
        if (payload.imageUrl) {
            state.library.imageUrl = payload.imageUrl
        }
    },
    [CREATE_TOPICMAP](state, payload) {
        if (!state.library.topicMaps) {
            state.library.topicMaps = []
        }
        state.library.topicMaps[payload.topicMapKey] = Object.assign({}, payload.topicmap)
    },
    [UPDATE_TOPICMAP](state, payload) {
        state.library.topicMaps[payload.topicMapId].name = payload.name
        state.library.topicMaps[payload.topicMapId].description = payload.description
        state.library.topicMaps[payload.topicMapId].tags = payload.tags
        state.library.topicMaps[payload.topicMapId].subject = payload.subject
        state.library.topicMaps[payload.topicMapId].date = payload.date
        state.library.topicMaps[payload.topicMapId].mapType = payload.mapType
        state.createdTopicmap = Object.assign({}, payload.topicmap)
        state.createdTopicmap.isNew = false
    },
    [DELETE_TOPICMAP](state, payload) {
        delete state.library.topicMaps[payload.topicMapId]
    },
    [LOAD](state, payload) {
        state.library = Object.assign({}, payload)
    },
    [CREATE](state, payload) {
        if (state.library) {
            state.library.title = payload.title
            state.library.description = payload.description
            state.library.category = payload.category
            state.library.address = Object.assign({}, payload.address)
            state.library.contacts = Object.assign({}, payload.contacts)
            if (payload.imageUrl) {
                state.library.imageUrl = payload.imageUrl
            }
            state.library.topicMaps = payload.topicMaps
        } else {
            state.library = Object.assign({}, payload)
        }
    },
    [CLEAR_ERROR](state) {
        state.error = null
    },
    [SET_ERROR](state, payload) {
        state.error = payload
    },
    [SNACKBAR](state, payload) {
        state.snackbar = JSON.parse(JSON.stringify(payload));
    },
    [SAVEFOLDER](state, payload) {
        var root = state.library.topicMaps[payload.topicMapId].children
        root.push(payload.folder)
    },
    [ADD](state, payload) {
        payload.item.push(payload.topic)
        state.createdTopicmap = Object.assign({}, payload.topic)
        state.createdTopicmap.action = ADD
    },
    [EDIT](state, payload) {
        payload.item.name = payload.topic.name
        if (payload.item.description)
            payload.item.description = payload.topic.description
        if (payload.item.url)
            payload.item.url = payload.topic.url
        if (payload.item.type)
            payload.item.type = payload.topic.type

        state.createdTopicmap = JSON.parse(JSON.stringify(payload.topic))
        state.createdTopicmap.action = EDIT
    },
    [REMOVE](state, payload) {
        payload.item.children.splice(payload.index, 1)
        state.createdTopicmap = {}
        state.createdTopicmap.action = REMOVE
    },
    [DRAGANDDROP](state, payload) {
        state.library.topicMaps[payload.topicMapId].children = JSON.parse(JSON.stringify(payload.topicMap.children));
        state.createdTopicmap = {}
        state.createdTopicmap.action = DRAGANDDROP
    },
    [REPAINT](state, payload) {
        state.repaint = uid()
    },
    [DONOTFIICATION](state, payload) {
        state.library.teamMembers[payload.id].status = payload.status
    },
    [UNREGISTER](state, payload) {
        state.library.teamMembers[payload.id].status = -1;
    },
    [COPY_TOPICMAP](state, payload) {
        state.library.topicMaps[payload.topicMapId] = JSON.parse(JSON.stringify(payload.copiedTopicMap));
        state.copied = Math.random() * 10000;
    },
    [INIT](state) {
        state.libraries = {}
        state.library = null
        state.error = null
        state.loading = true
        state.creating = null
        state.updating = null
        state.snackbar = {}
        state.message = ''
        state.repaint = null
        state.file = false
        state.folder = false
        state.root = false
        state.node = null
        state.copied = 0       
    },
    [UNFOLLOW](state, payload) {
        // console.log(payload)
        // console.log(state.library.followingTopicmaps)
        // delete state.library.followingTopicmaps[payload.topicMap.libraryId][payload.topicMap.topicMapId]
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
