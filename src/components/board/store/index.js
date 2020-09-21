import * as firebase from 'firebase'

const state = {
  items: {
    todo: [],
    inProgress: [],
    done: []
  },
  nextId: 1,
  snackbar: {}
}

const mutations = {
  loadItems(state, items) {
    if (items) {
      state.items = {
        todo: [],
        inProgress: [],
        done: []
      }
      for (const key in items) {
        if (items.hasOwnProperty(key)) {
          const element = items[key];
          if (element.status == "inProgress") {
            state.items.inProgress.push({ text: element.text, key: key, user: element.user })
          } else if (element.status == "done") {
            state.items.done.push({ text: element.text, key: key, user: element.user })
          } else {
            state.items.todo.push({ text: element.text, key: key, user: element.user })
          }
        }
      }
    }
  },
  addItem(state, item) {
    // state.items.todo.push(Object.assign(item, { id: state.nextId }));
    // state.nextId += 1;
  },
  updateItems(state, { items, id }) {
    // state.items[id] = items;
  },
  removeItem(state, item) {
    if (state.items.todo.findIndex((e) => { return e.key == item.key }) != -1) {
      state.items.todo.splice(state.items.todo.findIndex((e) => { return e.key == item.key }), 1);
    } else if (state.items.inProgress.findIndex((e) => { return e.key == item.key }) != -1) {
      state.items.inProgress.splice(state.items.inProgress.findIndex((e) => { return e.key == item.key }), 1);
    } else if (state.items.done.findIndex((e) => { return e.key == item.key }) != -1) {
      state.items.done.splice(state.items.done.findIndex((e) => { return e.key == item.key }), 1);
    }
  },
  updateItem(state, item) {

  },
  setSnackbar(state, payload) {
    state.snackbar = JSON.parse(JSON.stringify(payload));
  }
}

const getters = {
  snackbar(state) {
    return state.snackbar
  }
}

const actions = {
  loadItems({ commit }, payload) {
    firebase.database().ref('libraries').child(payload.libraryId).child('topicMaps').child(payload.topicMapId).child('progress').on('value', data => {
      if (data.val() !== null) {
        commit("loadItems", data.val())
      } else {
        commit("loadItems", null)
      }
    }, error => {
    })
  },
  addItem({ commit }, payload) {
    firebase.database().ref('libraries').child(payload.libraryId)
      .child('topicMaps').child(payload.topicMapId)
      .child('progress').push(payload.item);
    commit("addItem", payload.item);
  },
  removeItem({ commit }, payload) {
    firebase.database().ref('libraries').child(payload.libraryId)
      .child('topicMaps').child(payload.topicMapId)
      .child('progress').child(payload.key).remove();
    commit("removeItem", payload);
  },
  updateItem({ commit }, payload) {
    firebase.database().ref('libraries').child(payload.libraryId)
      .child('topicMaps').child(payload.topicMapId).child('progress')
      .child(payload.key).update({ text: payload.text });
    commit("setSnackbar", { color: 'success', message: 'Updated successfully.' });
  },
  updateItems({ commit }, payload) {
    let status = payload.id;
    let libraryId = payload.libraryId;
    let topicMapId = payload.topicMapId;
    payload.items.forEach(element => {
      firebase.database().ref('libraries').child(libraryId)
        .child('topicMaps').child(topicMapId).child('progress')
        .child(element.key).update({ status });
    });
    commit("updateItems", payload)
    commit("setSnackbar", { color: 'success', message: 'Updated successfully.' });
  },
  setSnackbar({ commit }, payload) {
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}


