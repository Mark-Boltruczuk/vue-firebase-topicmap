import Vue from 'vue'
import Vuex from 'vuex'
//import persistedState from 'vuex-persistedstate'

Vue.use(Vuex)

import users from '../components/user/store'
import libraries from '../components/home/store'
import topicMaps from '../components/topicmap/store'
import board from '../components/board/store'


export default new Vuex.Store({
  // state: {
  //   items: {
  //     todo: [],
  //     inProgress: [],
  //     done: []
  //   },
  //   nextId: 1
  // },
  // mutations: {
  //   addItem(state, item) {
  //     state.items.todo.push(Object.assign(item, { id: state.nextId }));
  //     state.nextId += 1;
  //   },
  //   updateItems(state, { items, id }) {
  //     state.items[id] = items;
  //   }
  // },
  modules: {
    users,
    libraries,
    topicMaps,
    board
  }
  // plugins: [
  //   persistedState({
  //     key: "users",
  //     paths: [
  //       "users"
  //     ]
  //   })
  // ]
})
