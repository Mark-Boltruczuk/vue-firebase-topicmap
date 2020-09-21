export function libraries(state) {
    return state.libraries
}

export function library(state) {
    return state.library
}

export function error(state) {
    return state.error
}

export function loading(state) {
    return state.loading
}

export function creating(state) {
    return state.creating
}

export function updating(state) {
    return state.updating
}

export function snackbar(state) {
    return state.snackbar
}

export function topicMaps(state) {
    return state.library ? state.library.topicMaps : []
}

export function createdTopicmap(state) {
    return state.createdTopicmap
}

export function repaint(state) {
    return state.repaint
}

export function copied(state) {
    return state.copied
}