import * as firebase from 'firebase'
import uuidv1 from 'uuid/v1'

import { LOADING, CREATE, CLEAR_ERROR, SET_ERROR, LOAD, UPDATE, SNACKBAR, SHOWMODAL, SAVEFOLDER, DONOTFIICATION } from './types';

export const download = ({ commit }, payload) => {
    commit(LOADING, true)
    commit(CLEAR_ERROR)
    var libraries = firebase.database().ref('libraries')
    libraries.child(payload.uid).on('value', data => {
        if (data.val() !== null) {
            commit(LOAD, data.val())
        }
        commit(LOADING, false)
    }, error => {
        commit(SET_ERROR, error)
        commit(LOADING, false)
    })
}

export const update = ({ commit }, payload) => {
    commit(LOADING, true)
    commit(CLEAR_ERROR)
    const topicmap = {
        name: payload.title,
        description: payload.description,
        tags: payload.tags,
        subject: payload.subject,
        date: payload.date.toISOString(),
        mapType: payload.mapType,
    }
    firebase.database().ref('libraries/' + payload.uid + '/topicMaps/').child(payload.topicMapId).update(topicmap)
        .then((data) => {
            commit(UPDATE, topicmap)
            setSnackbar({ commit }, { color: 'success', message: 'Topicmap is updated successfuly.' })
        })
        .catch((error) => {
            setSnackbar({ commit }, { color: 'success', message: 'Topicmap updating failed.' })
        })
}

export const save = ({ commit }, payload) => {
    commit(LOADING, true)
    commit(CLEAR_ERROR)
    var imageUrl;
    var libraries = firebase.database().ref('libraries')
    const newData = {
        title: payload.title,
        description: payload.description,
        creatorId: payload.creatorId,
        category: payload.category,
        address: payload.address,
        contacts: payload.contacts
    }
    libraries.child(payload.creatorId).set(newData)
        .then((data) => {
            if (payload.image) {
                const filename = payload.image.name;
                const ext = filename.slice(filename.lastIndexOf('.'));
                return firebase.storage().ref('libraries/' + payload.creatorId + '.' + ext).put(payload.image)
            } else {
                return;
            }
        })
        .then((fileData) => {
            if (fileData) {
                imageUrl = fileData.metadata.downloadURLs[0];
                return firebase.database().ref('libraries').child(payload.creatorId).update({ imageUrl: imageUrl })
            } else {
                return;
            }
        })
        .then(() => {
            if (imageUrl) {
                commit(CREATE, {
                    ...newData,
                    imageUrl: imageUrl
                })
            } else {
                commit(CREATE, {
                    ...newData
                })
            }

            commit(LOADING, false)
        })
        .catch((error) => {
            commit(SET_ERROR, error)
            commit(LOADING, false)
        })
}

export const create = ({ commit }, payload) => {
    const topicmap = {
        name: payload.name,
        description: payload.description,
        tags: payload.tags,
        subject: payload.subject,
        children: payload.children,
        date: payload.date.toISOString(),
        creatorId: payload.uid,
        type: payload.type,
        mapType: payload.mapType,
        id: payload.id
    }
    firebase.database().ref('libraries/' + payload.uid + '/topicMaps/').push(topicmap)
        .then((data) => {
            commit(CREATE, { ...topicmap, id: data.key })
            setSnackbar({ commit }, { color: 'success', message: 'Topicmap is saved successfuly.' })
        })
        .catch((error) => {
            console.log(error)
            setSnackbar({ commit }, { color: 'success', message: 'Topicmap saving failed.' })
        })
}

export const clearError = ({ commit }) => {
    commit(CLEAR_ERROR)
}

export const setSnackbar = ({ commit }, payload) => {
    commit(SNACKBAR, { visible: true, color: payload.color, message: payload.message })
}

export const showModal = ({ commit }, payload) => {
    commit(SHOWMODAL, payload);
}

export const doNotification = ({ commit }, payload) => {
    firebase.database().ref('users').child(payload.uid).child('teamMembers').child(payload.id).update({ status: payload.status })
        .then(() => {
            commit(DONOTFIICATION, payload)
        })
}
