import * as firebase from 'firebase'

import {
    LOADING, CREATE, CLEAR_ERROR, SET_ERROR, LOAD, UPDATE, SNACKBAR, DOWNLOAD, DOJOIN,
    UPDATING, SET_CUR_LIB_ID, UNREGISTER, SET_LIB_ID, INIT
} from './types';

export const signIn = ({ commit, getters }, payload) => {
    commit(LOADING, true)
    commit(CLEAR_ERROR)
    let signedUser = {}
    firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
            signedUser = {
                uid: user.user.uid,
                email: user.user.email,
                displayName: user.user.displayName,
                photoURL: user.user.photoURL,
            }
            firebase.database().ref('users').on('value', function (data1) {
                commit(DOWNLOAD, data1.val())
                firebase.database().ref('users').child(signedUser.uid).on('value', function (data) {
                    signedUser.firstname = data.val() && data.val().firstname || ''
                    signedUser.lastname = data.val() && data.val().lastname || ''
                    signedUser.jobTitle = data.val() && data.val().jobTitle || ''
                    signedUser.jobDescription = data.val() && data.val().jobDescription || ''
                    signedUser.joinedLibraries = data.val() && data.val().joinedLibraries
                    commit(LOAD, signedUser)
                    commit(SET_CUR_LIB_ID, signedUser.uid)
                    commit(LOADING, false)
                    setSnackbar({ commit }, { color: 'success', message: 'You signed in successfuly.' })
                    payload.localStorage.set('authenticated', true);
                }, function (error) {
                    commit(LOADING, false)
                    if (getters.LOAD)
                        setSnackbar({ commit }, { color: 'cyan darken-2', message: error.message })
                })
            }, function (error) {
                commit(LOADING, false)
                if (getters.LOAD)
                    setSnackbar({ commit }, { color: 'cyan darken-2', message: error.message })
            })
        })
        .catch(error => {
            commit(LOADING, false)
            setSnackbar({ commit }, { color: 'cyan darken-2', message: error.message });
        })
}

export const googleSignIn = ({ commit }, payload) => {
    var provider = new firebase.auth.GoogleAuthProvider();
    let newUser;
    firebase
        .auth()
        .signInWithPopup(provider)
        .then(function (result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            let user = result.user;
            firebase.database().ref('users').child(user.uid).on("value", snapshot => {
                payload.localStorage.set('authenticated', true);
                if (!snapshot.exists()) {
                    newUser = {
                        uid: user.uid,
                        email: user.email,
                        displayName: '',
                        photoURL: '',
                        firstname: '',
                        lastname: '',
                        jobTitle: '',
                        jobDescription: '',
                        registeredTopicmaps: []
                    }
                    firebase.database().ref('users').child(user.uid).set(newUser).then(function () {
                        if (newUser) {
                            let library = {
                                title: "",
                                description: "",
                                imageUrl: "../static/library.png",
                                category: "",
                                creatorId: newUser.uid,
                                address: {
                                    street: "",
                                    city: ""
                                },
                                contacts: {
                                    email: "",
                                    phone: ""
                                },
                                teamMembers: {}
                            }
                            library.teamMembers[newUser.uid] = { status: 2 }
                            firebase.database().ref('libraries').child(newUser.uid).set(library)
                            commit(CREATE, newUser)
                        }
                    });
                }
            })
        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
}

export const signOut = ({ commit }, payload) => {
    firebase.auth().signOut()
    commit(LOAD, null)
    payload.localStorage.remove('authenticated')
}

export const initUser = ({ commit }) => {
    commit(INIT)
}
export const signUp = ({ commit }, payload) => {
    commit(LOADING, true)
    commit(CLEAR_ERROR)
    let newUser = null
    firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(firebaseUser => {
            newUser = {
                uid: firebaseUser.user.uid,
                email: firebaseUser.user.email,
                displayName: '',
                photoURL: '',
                firstname: '',
                lastname: '',
                jobTitle: '',
                jobDescription: '',
                registeredTopicmaps: []
            }
            return firebase.database().ref('users').child(firebaseUser.user.uid).set(newUser)
        })
        .then(() => {
            let library = {
                title: "",
                description: "",
                imageUrl: "../static/library.png",
                category: "",
                creatorId: newUser.uid,
                address: {
                    street: "",
                    city: ""
                },
                contacts: {
                    email: "",
                    phone: ""
                },
                teamMembers: {}
            }
            library.teamMembers[newUser.uid] = { status: 2 }
            return firebase.database().ref('libraries').child(newUser.uid).set(library)
        })
        .then(() => {
            commit(CREATE, newUser)
            commit(LOADING, false)
            setSnackbar({ commit }, { color: 'success', message: 'You signed up successfuly.' })
        })
        .catch((error) => {
            setSnackbar({ commit }, { color: 'cyan darken-2', message: error.message });
            commit(LOADING, false)
        })
}

export const updateUser = ({ commit }, payload) => {
    commit(UPDATING, true)
    var users = firebase.database().ref('users')
    var user = firebase.auth().currentUser
    users.child(payload.uid).update(payload)
    user.updateProfile(payload)
        .then((data) => {
            if (user.email != payload.email) {
                user.updateEmail(payload.email)
                    .then((data) => {
                        commit(UPDATE, payload)
                        commit(UPDATING, false)
                        setSnackbar({ commit }, { color: 'success', message: 'Your profile is updated successfuly.' })
                    })
                    .catch((error) => {
                        commit(UPDATING, false)
                        setSnackbar({ commit }, { color: 'info', message: error })
                    })
            } else {
                commit(UPDATE, payload)
                commit(UPDATING, false)
                setSnackbar({ commit }, { color: 'success', message: 'Your profile is updated successfuly.' })
            }
        })
        .catch((error) => {
            commit(UPDATING, false)
            setSnackbar({ commit }, { color: 'info', message: error.message })
        })
}

export const autoSignIn = ({ commit }, payload) => {
    commit(LOADING, true)
    const user = {
        uid: payload.uid,
        email: payload.email,
        displayName: payload.displayName,
        photoURL: payload.photoURL,
        firstname: payload.firstname,
        lastname: payload.lastname,
        jobTitle: payload.jobTitle,
        jobDescription: payload.jobDescription
    }
    var users = firebase.database().ref('users')
    users.on('value', function (data1) {
        commit(DOWNLOAD, data1.val())
        firebase.database().ref('users').child(payload.uid).on('value', function (data) {
            user.firstname = data.val() && data.val().firstname || 'Anonymous'
            user.lastname = data.val() && data.val().lastname || 'Anonymous'
            user.jobTitle = data.val() && data.val().jobTitle || 'Job Title'
            user.jobDescription = data.val() && data.val().jobDescription || 'Job Description'
            user.joinedLibraries = data.val() && data.val().joinedLibraries || null
            commit(LOAD, user)
            commit(SET_LIB_ID, user.uid)
            commit(LOADING, false)
            //setSnackbar({ commit }, { color: 'success', message: 'You signed in successfuly.' });
        })
    }, error => {
        //setSnackbar({ commit }, { color: 'cyan darken-2', message: error });
        commit(LOADING, false)
    })
}

export const changePassword = ({ commit }, payload) => {
    var auth = firebase.auth();
    auth.sendPasswordResetEmail(payload).then(function (data) {
        setSnackbar({ commit }, { color: 'success', message: 'We sent you email for reset password.' });
    }).catch(function (error) {
        // An error happened.
    });
}

export const save = ({ commit }, payload) => {
    commit(LOADING, true)
    commit(CLEAR_ERROR)
    var users = firebase.database().ref('users')
    var user = firebase.auth().currentUser
    users.child(payload.uid).update(payload)
    user.updateProfile(payload)
        .then((data) => {
            if (user.email != payload.email) {
                user.updateEmail(payload.email)
                    .then((data) => {
                        commit(UPDATE, payload)
                        commit(LOADING, false)
                        setSnackbar({ commit }, { color: 'success', message: 'Your profile is updated successfuly.' })
                    })
                    .catch((error) => {
                        commit(SET_ERROR, error)
                        commit(LOADING, false)
                    })
            } else {
                commit(UPDATE, payload)
                commit(LOADING, false)
            }
        })
        .catch((error) => {
            commit(SET_ERROR, error)
            commit(LOADING, false)
        })
}

export const setSnackbar = ({ commit }, payload) => {
    commit(SNACKBAR, { color: payload.color, message: payload.message })
}

export const sendInvite = ({ commit }, payload) => {
    var users = firebase.database().ref('users')
    users.child(payload.key).child('joinedLibraries').child(payload.library).set({
        status: 0,
        library: payload.library
    }).then(() => {
        return firebase.database().ref('libraries').child(payload.library).child('teamMembers').child(payload.key).set({ status: 0 })
    }).then(() => {
        commit(SNACKBAR, { color: "success", message: "Invitation has sent successfully" })
    });
}

export const doJoinLibrary = ({ commit }, payload) => {
    var users = firebase.database().ref('users')
    users.child(payload.uid).child('joinedLibraries').child(payload.id).update({
        status: payload.status
    }).then(() => {
        return firebase.database().ref('libraries').child(payload.id).child('teamMembers').child(payload.uid).update({ status: payload.status })
    }).then(() => {
        commit(DOJOIN, payload)
    })
    setSnackbar({ commit }, { color: 'success', message: 'Joined library is upated successfuly.' })
}

export const unregister = ({ commit }, payload) => {
    var users = firebase.database().ref('users')
    users.child(payload.uid).child('joinedLibraries').child(payload.id).update({
        status: payload.status
    }).then(() => {
        return firebase.database().ref('libraries').child(payload.id).child('teamMembers').child(payload.uid).update({ status: payload.status })
    }).then(() => {
        commit(UNREGISTER, payload)
    })
    setSnackbar({ commit }, { color: 'success', message: 'Team members are upated successfuly.' })
}

export const setCurLibId = ({ commit }, payload) => {
    commit(SET_CUR_LIB_ID, payload)
}

export const bookmark = ({ commit, getters }, payload) => {
    commit(LOADING, true)
    let user = getters["user"]
    var libraries = firebase.database().ref('libraries')
    libraries.child(user.uid).child('followingTopicmaps').child(payload.libraryId).child(payload.topicMapId).set(payload.topicMapId).then(() => {
        // commit(BOOKMARK, payload)
        setSnackbar({ commit }, { color: 'success', message: 'This topic map bookmarked in your following topic maps.' })
    }).catch((error) => {
        commit(SET_ERROR, error)
        setSnackbar({ commit }, { color: 'info', message: error })
        commit(LOADING, false)
    })
}

export const join = ({ commit, getters }, payload) => {
    commit(LOADING, true)
    let user = getters["user"]
    var libraries = firebase.database().ref('libraries')
    libraries.child(user.uid).child('joinedTopicmaps').child(payload.libraryId).child(payload.topicMapId).set(payload.topicMapId).then(() => {
        // commit(JOIN, payload)
        commit(LOADING, false)
        setSnackbar({ commit }, { color: 'success', message: 'This topic map linked in your joined topic maps.' })
    }).catch((error) => {
        commit(SET_ERROR, error)
        commit(LOADING, false)
        setSnackbar({ commit }, { color: 'info', message: error })
    })
}
