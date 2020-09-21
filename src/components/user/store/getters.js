export function user(state) {
    return state.user
}

export function isUserSignedIn(state) {
    if (state.user) {
        if (state.user.uid) {
            return true
        }
    }
    return false
}

export function error(state) {
    return state.error
}

export function loading(state) {
    return state.loading
}

export function snackbar(state) {
    return state.snackbar
}

export function users(state) {
    return state.users
}

export function curLibId(state) {
    return state.curLibId
}

export function updating(state) {
    return state.updating
}