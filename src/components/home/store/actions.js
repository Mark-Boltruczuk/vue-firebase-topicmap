import * as firebase from 'firebase'
import { getObject, uid } from '../../../utils'

import {
    LOADING, CREATE, CLEAR_ERROR, SET_ERROR, LOAD, UPDATE, SNACKBAR, ADD, REPAINT, EDIT, REMOVE, DONOTFIICATION, UPDATING, CREATING, UNREGISTER,
    LOAD_LIBRARIES, LOAD_LIBRARY, CREATE_LIBRARY, UPDATE_LIBRARY, CREATE_TOPICMAP, UPDATE_TOPICMAP, DELETE_TOPICMAP, CREATE_TOPIC, UPDATE_TOPIC, DELETE_TOPIC,
    COPY_TOPICMAP, INIT, UNFOLLOW, DRAGANDDROP
} from './types';

export const init = ({ commit }, payload) => {
    commit(INIT);
}

export const download = ({ commit }, payload) => {
    commit(LOADING, true)
    commit(CLEAR_ERROR)
    let libraries = firebase.database().ref('libraries')
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

export const loadLibraries = ({ commit }) => {
    commit(LOADING, true)
    firebase.database().ref('libraries').on('value', data => {
        if (data.val() !== null) {
            commit(LOAD_LIBRARIES, data.val())
            //setSnackbar({ commit }, { color: 'success', message: 'Community library loaded successfully.' })
        } else {
            commit(LOAD_LIBRARIES, null)
            //setSnackbar({ commit }, { color: 'success', message: 'Community library did not exist' })
        }
        commit(LOADING, false)
    }, error => {
        // setSnackbar({ commit }, { color: 'info', message: 'Community library Loading Failed.' })
        commit(LOADING, false)
    })
}

export const loadLibrary = ({ commit }, payload) => {
    if (!payload) {
        return
    }
    commit(LOADING, true)
    firebase.database().ref('libraries').child(payload).on('value', data => {
        if (data.val() !== null) {
            commit(LOAD_LIBRARY, data.val())
            //setSnackbar({ commit }, { color: 'success', message: 'Library loaded successfully.' })
        } else {
            commit(LOAD_LIBRARY, null)
            //setSnackbar({ commit }, { color: 'info', message: 'Library did not created.' })
        }
        commit(LOADING, false)
    }, error => {
        // setSnackbar({ commit }, { color: 'info', message: 'Library Loading Failed.' })
        commit(LOADING, false)
    })
}

export const createLibrary = ({ commit }, payload) => {
    let imageUrl;
    let libraryId = payload.creatorId
    const library = {
        title: payload.title,
        description: payload.description,
        creatorId: payload.creatorId,
        category: payload.category,
        address: payload.address,
        contacts: payload.contacts,
        teamMembers: payload.teamMembers
    }
    commit(CREATING, true)
    firebase.database().ref('libraries').child(libraryId).update(library)
        .then((data) => {
            if (payload.image) {
                const filename = payload.image.name;
                const ext = filename.slice(filename.lastIndexOf('.'));
                var uploadTask = firebase.storage().ref('libraries/' + libraryId + '' + ext).put(payload.image)
                uploadTask.on('state_changed', function (snapshot) {
                    // Observe state change events such as progress, pause, and resume
                }, function (error) {
                    // Handle unsuccessful uploads
                    console.log(error)
                }, function () {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                        imageUrl = downloadURL;
                        firebase.database().ref('libraries').child(libraryId).update({ imageUrl: imageUrl })
                        commit(UPDATE_LIBRARY, { ...library, imageUrl: imageUrl })
                    });
                });
            } else {
                commit(UPDATE_LIBRARY, library)
            }
            setSnackbar({ commit }, { color: 'success', message: 'Library is updated successfully.' })
            commit(UPDATING, false)
        })
        .catch((error) => {
            setSnackbar({ commit }, { color: 'info', message: 'Failed to update the library' })
            commit(UPDATING, false)
        })
}

export const updateLibrary = ({ commit }, payload) => {
    let imageUrl;
    let libraryId = payload.creatorId
    const library = {
        title: payload.title,
        description: payload.description,
        creatorId: payload.creatorId,
        category: payload.category,
        address: payload.address,
        contacts: payload.contacts
    }
    commit(UPDATING, true)
    firebase.database().ref('libraries').child(libraryId).update(library)
        .then((data) => {
            if (payload.image) {
                const filename = payload.image.name;
                const ext = filename.slice(filename.lastIndexOf('.'));
                var uploadTask = firebase.storage().ref('libraries/' + libraryId + '' + ext).put(payload.image)
                uploadTask.on('state_changed', function (snapshot) {
                    // Observe state change events such as progress, pause, and resume
                }, function (error) {
                    // Handle unsuccessful uploads
                    console.log(error)
                }, function () {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                        imageUrl = downloadURL;
                        firebase.database().ref('libraries').child(libraryId).update({ imageUrl: imageUrl })
                        commit(UPDATE_LIBRARY, { ...library, imageUrl: imageUrl })
                    });
                });
            } else {
                commit(UPDATE_LIBRARY, library)
            }
            setSnackbar({ commit }, { color: 'success', message: 'Library is updated successfully.' })
            commit(UPDATING, false)
        })
        .catch((error) => {
            setSnackbar({ commit }, { color: 'info', message: 'Failed to update the library' })
            commit(UPDATING, false)
        })
}

export const createTopicMap = ({ commit, getters }, payload) => {
    commit(CREATING, true)
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
    firebase.database().ref('libraries/' + payload.libraryId + '/topicMaps/').push(topicmap)
        .then((data) => {
            commit(CREATE_TOPICMAP, { topicmap, topicMapKey: data.key })
            setSnackbar({ commit }, { color: 'success', message: 'Topic Map is created sucessfully.' })
            commit(CREATING, false)
        })
        .catch((error) => {
            setSnackbar({ commit }, { color: 'error', message: 'Failed to create the topic map.' })
            commit(CREATING, false)
        })
}

export const updateTopicMap = ({ commit, getters }, payload) => {
    let library = getters["library"]
    commit(UPDATING, true)
    const topicmap = {
        name: payload.name,
        description: payload.description,
        tags: payload.tags,
        subject: payload.subject,
        date: payload.date.toISOString(),
        mapType: payload.mapType,
    }
    firebase.database().ref('libraries/' + payload.libraryId + '/topicMaps/').child(payload.topicMapId).update(topicmap)
        .then((data) => {
            commit(UPDATE_TOPICMAP, payload)
            setSnackbar({ commit }, { color: 'success', message: 'Topicmap is updated sucessfully.' })
            commit(UPDATING, false)
        })
        .catch((error) => {
            setSnackbar({ commit }, { color: 'info', message: 'Failed to update the topic map.' })
            commit(UPDATING, false)
        })
}

export const dragAndDropTopicMap = ({ commit, getters }, payload) => {
    firebase.database().ref('libraries/' + payload.libraryId + '/topicMaps/').child(payload.topicMapId).child('children').set(payload.topicMap.children)
        .then((data) => {
            commit(DRAGANDDROP, payload)
            setSnackbar({ commit }, { color: 'success', message: 'Topicmap is updated sucessfully.' })
            commit(UPDATING, false)
        })
        .catch((error) => {
            setSnackbar({ commit }, { color: 'info', message: 'Failed to update the topic map.' })
            commit(UPDATING, false)
        })
}

export const deleteTopicMap = ({ commit }, payload) => {
    firebase.database().ref('libraries/' + payload.libraryId + '/topicMaps/').child(payload.topicMapId).remove()
        .then(() => {
            commit(DELETE_TOPICMAP, payload)
            setSnackbar({ commit }, { color: 'success', message: 'Topicmap is deleted sucessfully.' })
        })
        .catch((error) => {
            setSnackbar({ commit }, { color: 'success', message: 'Failed to delete the topic map' })
        });
}

export const createTopic = ({ commit, getters }, payload) => {
    let library = getters["libraries"][payload.libraryId]
    let _isLeaf = (payload.type == "sub" || payload.type == "root" || payload.type == "main")
    const topic = {
        id: uid(),
        name: payload.topic.name ? payload.topic.name : null,
        type: payload.topic.type ? payload.topic.type : payload.type,
        description: payload.topic.description ? payload.topic.description : null,
        url: payload.topic.url ? payload.topic.url : null,
        isLeaf: _isLeaf ? false : true
    }
    getObject(library.topicMaps[payload.topicMapId], payload.childId, false, '', (item, child) => {
        let index = 0
        if (item.children) {
            index = item.children.length
        } else {
            item.children = []
        }
        firebase.database().ref('libraries/' + library.creatorId + '/topicMaps/' + payload.topicMapId + '/' + child)
            .child('children/' + index).set(topic);
        commit(ADD, { item: item.children, topic: topic })
        setSnackbar({ commit }, { color: 'success', message: 'Topic Map is updated.' })
        commit(REPAINT)
    })
}

export const updateTopic = ({ commit, getters }, payload) => {
    let library = getters["libraries"][payload.libraryId]
    let _isLeaf = (payload.type == "sub" || payload.type == "root" || payload.type == "main")
    const topic = {
        id: uid(),
        name: payload.topic.name ? payload.topic.name : null,
        type: payload.topic.type ? payload.topic.type : payload.type,
        description: payload.topic.description ? payload.topic.description : null,
        url: payload.topic.url ? payload.topic.url : null,
        isLeaf: _isLeaf ? false : true
    }

    getObject(library.topicMaps[payload.topicMapId], payload.childId, false, '', (item, child) => {
        firebase.database().ref('libraries/' + library.creatorId + '/topicMaps/' + payload.topicMapId + '/' + child)
            .update(topic).then(() => {
                commit(EDIT, { item: item, topic: topic })
                commit(REPAINT)
            })
    })
}

export const deleteTopic = ({ commit, getters }, payload) => {
    let library = getters["libraries"][payload.libraryId]
    getObject(library.topicMaps[payload.topicMapId], payload.childId, true, '', (item, child) => {
        let i;
        for (i = 0; i < item.children.length; i++) {
            if (item.children[i].id === payload.childId) break
        }
        firebase.database().ref('libraries/' + library.creatorId + '/topicMaps/' + payload.topicMapId + '/' + child + '/children/' + i)
            .remove().then(() => {
                commit(REMOVE, { item: item, index: i })
                return firebase.database().ref('libraries/' + library.creatorId + '/topicMaps/' + payload.topicMapId + '/' + child + '/children')
                    .set(item.children)
            }).then(() => {
                commit(REPAINT)
            })
    })
}

export const clearError = ({ commit }) => {
    commit(CLEAR_ERROR)
}

export const setSnackbar = ({ commit }, payload) => {
    commit(SNACKBAR, { visible: true, color: payload.color, message: payload.message })
}

export const doNotification = ({ commit }, payload) => {
    firebase.database().ref('libraries').child(payload.uid).child('teamMembers').child(payload.id).update({ status: payload.status })
        .then(() => {
            commit(DONOTFIICATION, payload)
        })
}

export const unregister = ({ commit }, payload) => {
    var users = firebase.database().ref('users')
    users.child(payload.id).child('joinedLibraries').child(payload.uid).update({
        status: payload.status
    }).then(() => {
        return firebase.database().ref('libraries').child(payload.uid).child('teamMembers').child(payload.id).update({ status: payload.status })
    }).then(() => {
        commit(UNREGISTER, payload)
    })
    setSnackbar({ commit }, { color: 'success', message: 'Team members are upated successfuly.' })
}

export const copy = ({ commit, getters }, payload) => {
    let copiedTopicMap = getters["libraries"][payload.libraryId].topicMaps[payload.topicMapId]
    let libraries = firebase.database().ref('libraries')
    libraries.child(payload.userId).child('topicMaps').child(payload.topicMapId).set(copiedTopicMap)
        .then(() => {
            // commit(COPY_TOPICMAP, { ...payload, copiedTopicMap })
            setSnackbar({ commit }, { color: 'success', message: 'The topicmap is copied successfuly.' })
        })
}


export const unfollowTopicMap = ({ commit, getters }, payload) => {
    let libraries = firebase.database().ref('libraries')
    libraries.child(payload.libraryId).child('followingTopicmaps').child(payload.topicMap.libraryId).child(payload.topicMap.topicMapId).remove()
        .then(() => {
            commit(UNFOLLOW, payload)
            setSnackbar({ commit }, { color: 'success', message: 'Following topicmap is removed successfuly.' })
        })
}

export const unjoinTopicMap = ({ commit, getters }, payload) => {
    let libraries = firebase.database().ref('libraries')
    libraries.child(payload.libraryId).child('joinedTopicmaps').child(payload.topicMap.libraryId).child(payload.topicMap.topicMapId).remove()
        .then(() => {
            setSnackbar({ commit }, { color: 'success', message: 'Joined topicmap is removed successfuly.' })
        })
}
