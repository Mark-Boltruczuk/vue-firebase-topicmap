import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import uuidv1 from 'uuid/v1'

Vue.use(Vuex)
Vue.use(firebase)
import './utils'

export const store = new Vuex.Store({
  state: {
    loadedTopicmaps: [],
    user: null,
    loading: false,
    error: null,
    topicmapData: {},
    topicmapId: '',
    rootActionDisplay: false,
    mainFolderActionDisplay: false,
    fileActionDisplay: false,
    rootHyperActionDisplay: false,
    mainHyperFolderActionDisplay: false,
    fileHyperActionDisplay: false,
    selectedNode: {},
    selectedNodeId: '',
    hypertree: {},
    circle: {},
    view: ''
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
    },
    setLoading(state, payload) {
      state.loading = payload
    },
    setError(state, payload) {
      state.error = payload
    },
    clearError(state) {
      state.error = null
    },
    setLoadedTopicmaps(state, payload) {
      state.loadedTopicmaps = payload
    },
    setHypertree(state, tree) {
      state.hypertree = tree
    },
    setCircle(state, circle) {
      state.circle = Object.assign({}, circle)
    },
    createTopicmap(state, payload) {
      state.loadedTopicmaps.push(payload)
    },
    setRootActionDisplay(state, display) {
      state.rootActionDisplay = display
    },
    setMainFolderActionDisplay(state, display) {
      state.mainFolderActionDisplay = display
    },
    setFileActionDisplay(state, display) {
      state.fileActionDisplay = display
    },
    setSelectedNode(state, node) {
      state.selectedNode = node
    },
    setSelectedNodeId(state, id) {
      state.selectedNodeId = id;
    },
    setHyperRootActionDisplay(state, display) {
      state.rootHyperActionDisplay = display
    },
    setHyperMainFolderActionDisplay(state, display) {
      state.mainHyperFolderActionDisplay = display
    },
    setHyperFileActionDisplay(state, display) {
      state.fileHyperActionDisplay = display
    },
    setSelectedNode(state, node) {
      state.selectedNode = node
    },
    setTopicmapId(state, id) {
      state.topicmapId = id
    },
    saveMainFolder(state, folder) {
      var index = 0
      var dataIndex = getIndex(this.getters.loadedTopicmaps, this.getters.topicmapId)
      if (this.getters.loadedTopicmaps[dataIndex].children) {
        index = this.getters.loadedTopicmaps[dataIndex].children.length
      }
      if (!state.loadedTopicmaps[dataIndex].children) {
        state.loadedTopicmaps[dataIndex].children = []
      }

      state.loadedTopicmaps[dataIndex].children.push(folder)
      state.hypertree.loadJSON(state.loadedTopicmaps[dataIndex])
      state.hypertree.refresh()
      $jit.Graph.Util.eachNode(state.hypertree.graph, function (node) {
        if (node._depth == "0") {
          node.setData("color", "#d32f2f  ");
        } else if (node._depth == "1") {
          node.setData("color", "#ffcb2c");
        } else if (!node.isLeaf) {
          node.setData("color", "#4f3");
        } else {
          node.setData('color', '#000')
        }
      })
      state.hypertree.refresh()
    },
    setView(state, view) {
      state.view = view
    },
    redrawTree(state) {
      var self = this
      var index = 0
      var dataIndex = getIndex(this.getters.loadedTopicmaps, this.getters.topicmapId)
      if (this.getters.loadedTopicmaps[dataIndex].children) {
        index = this.getters.loadedTopicmaps[dataIndex].children.length
      }

      state.hypertree.loadJSON(state.loadedTopicmaps[dataIndex])
      state.hypertree.refresh()
      $jit.Graph.Util.eachNode(state.hypertree.graph, function (node) {
        var _selectedNode = self.getters.selectedTopicmapNode(node.id)
        if (_selectedNode.isLeaf) {
          node.setData("color", "#000");
        } else {
          if (node._depth == "0") {
            node.setData("color", "#d32f2f");
          } else if (node._depth == "1") {
            node.setData("color", "#ffcb2c");
          } else {
            node.setData("color", "#4f3");
          }
        }
      })
      state.hypertree.refresh()
    }

  },
  actions: {
    editLibrary({ commit }) {
      
    },
    createLibrary({ commit }) {
      firebase.database().ref('topicMapData/').child(this.getters.topicmapId).child('children').child(index).set(mainFolder)
        .then((data) => {
          commit('saveMainFolder', {
            ...mainFolder,
            children: []
          })
        })
    },
    loadTopicmaps({ commit }) {
      commit('setLoading', true)
      firebase.database().ref('topicMapData/').on('value')
        .then((data) => {
          const topicmaps = []
          const obj = data.val()
          for (let key in obj) {
            topicmaps.push({
              id: key,
              name: obj[key].name,
              description: obj[key].description,
              subject: obj[key].subject,
              children: obj[key].children,
              date: obj[key].date,
              creatorId: obj[key].creatorId,
              tags: obj[key].tags,
              type: obj[key].type,
              mapType: obj[key].mapType
            })
          }
          commit('setLoadedTopicmaps', topicmaps)
          commit('setLoading', false)
        })
        .catch(
          (error) => {
            console.log(error)
            commit('setLoading', true)
          }
        )
    },
    createTopicmap({ commit, getters }, payload) {
      const topicmap = {
        name: payload.title,
        description: payload.description,
        tags: payload.tags,
        subject: payload.subject,
        children: payload.children,
        date: payload.date.toISOString(),
        creatorId: getters.user.id,
        type: payload.type,
        mapType: payload.mapType
      }
      firebase.database().ref('topicMapData/').push(topicmap)
        .then((data) => {
          commit('createTopicmap', {
            ...topicmap,
            id: data.key
          })
        })
        .catch((error) => {
          console.log(error)
        })
    },
    signUserUp({ commit }, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            const newUser = {
              id: user.uid,
              registeredTopicmaps: []
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
          }
        )
    },
    signUserIn({ commit }, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            const newUser = {
              id: user.uid,
              registeredTopicmaps: []
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        )
    },
    autoSignIn({ commit }, payload) {
      commit('setUser', { id: payload.uid, registeredTopicmaps: [] })
    },
    logout({ commit }) {
      firebase.auth().signOut()
      commit('setUser', null)
    },
    clearError({ commit }) {
      commit('clearError')
    },
    setView({ commit }, view) {
      commit('setView', view)
    },
    setHypertree({ commit }, tree) {
      commit('setHypertree', tree)
    },
    setRootActionDisplay({ commit }, display) {
      commit('setRootActionDisplay', display)
    },
    setMainFolderActionDisplay({ commit }, display) {
      commit('setMainFolderActionDisplay', display)
    },
    setFileActionDisplay({ commit }, display) {
      commit('setFileActionDisplay', display)
    },
    setHyperRootActionDisplay({ commit }, display) {
      commit('setHyperRootActionDisplay', display)
    },
    setHyperMainFolderActionDisplay({ commit }, display) {
      commit('setHyperMainFolderActionDisplay', display)
    },
    setHyperFileActionDisplay({ commit }, display) {
      commit('setHyperFileActionDisplay', display)
    },
    setSelectedNode({ commit }, node) {
      commit('setSelectedNode', node)
    },
    setSelectedNodeId({ commit }, id) {
      commit('setSelectedNodeId', id)
    },
    setTopicmapId({ commit }, id) {
      commit('setTopicmapId', id)
    },
    saveMainFolder({ commit }, folder) {
      const mainFolder = {
        name: folder,
        id: uuidv1(),
        children: [],
        isLeaf: false,
        type: 'main'
      }
      var index = 0
      var dataIndex = getIndex(this.getters.loadedTopicmaps, this.getters.topicmapId)
      if (this.getters.loadedTopicmaps[dataIndex].children) {
        index = this.getters.loadedTopicmaps[dataIndex].children.length
      }
      firebase.database().ref('topicMapData/').child(this.getters.topicmapId).child('children').child(index).set(mainFolder)
        .then((data) => {
          commit('saveMainFolder', {
            ...mainFolder,
            children: []
          })
        })
    },
    saveD3MainFolder({ commit }, folder) {
      const mainFolder = {
        name: folder,
        id: uuidv1(),
        children: [],
        isLeaf: false,
        type: 'main'
      }
      var index = 0
      var dataIndex = getIndex(this.getters.loadedTopicmaps, this.getters.topicmapId)
      if (this.getters.loadedTopicmaps[dataIndex].children) {
        index = this.getters.loadedTopicmaps[dataIndex].children.length
      }
      firebase.database().ref('topicMapData/').child(this.getters.topicmapId).child('children').child(index).set(mainFolder)
        .then((data) => {
          commit('saveD3MainFolder', {
            ...mainFolder,
            children: []
          })
        })
    },
    saveEditFolderName({ commit }, name) {
      var id = this.getters.selectedNode.id
      var self = this
      var index = 0
      var dataIndex = getIndex(this.getters.loadedTopicmaps, this.getters.topicmapId)
      if (this.getters.loadedTopicmaps[dataIndex].children) {
        index = this.getters.loadedTopicmaps[dataIndex].children.length
      }
      getObject(this.getters.loadedTopicmaps[dataIndex], id, false, '', function (item, child) {
        firebase.database().ref('topicMapData/' + self.getters.topicmapId + child).update({
          name: name
        })
        item.name = name
        if (self.getters.view === 'hypergraph') {
          commit('redrawTree')
        } else {
          commit('redrawD3Tree')
        }
      })
    },
    saveSubFolderFile({ commit }, file) {
      var id = this.getters.selectedNode.id
      var self = this
      var index = 0
      var dataIndex = getIndex(this.getters.loadedTopicmaps, this.getters.topicmapId)
      if (this.getters.loadedTopicmaps[dataIndex].children) {
        index = this.getters.loadedTopicmaps[dataIndex].children.length
      }
      getObject(this.getters.loadedTopicmaps[dataIndex], id, false, '', function (item, child) {
        var index = 0
        if (item.children) {
          index = item.children.length
        } else {
          item.children = []
        }
        firebase.database().ref('topicMapData/' + self.getters.topicmapId + child).child('children/' + index).set({
          ...file,
          id: uuidv1(),
          isLeaf: true
        }).then(() => {
          item.children.push({
            ...file,
            id: uuidv1(),
            isLeaf: true
          })
          if (self.getters.view === 'hypergraph') {
            commit('redrawTree')
          } else {
            commit('redrawD3Tree')
          }
        })
      })
    },
    saveSubFolder({ commit }, name) {
      var id = this.getters.selectedNode.id
      var self = this
      const subFolder = {
        name: name,
        id: uuidv1(),
        children: [],
        isLeaf: false,
        type: 'sub'
      }
      var index = 0
      var dataIndex = getIndex(this.getters.loadedTopicmaps, this.getters.topicmapId)
      getObject(this.getters.loadedTopicmaps[dataIndex], id, false, '', function (item, child) {
        var index = 0
        if (item.children) {
          index = item.children.length
        } else {
          item.children = []
        }
        firebase.database().ref('topicMapData/' + self.getters.topicmapId + child).child('children/' + index).set(subFolder).then(() => {
          item.children.push(subFolder)
          if (self.getters.view === 'hypergraph') {
            commit('redrawTree')
          } else {
            commit('redrawD3Tree')
          }
        })
      })
    },
    deleteFolder({ commit }) {
      var id = this.getters.selectedNode.id
      var self = this
      var index = 0
      var dataIndex = getIndex(this.getters.loadedTopicmaps, this.getters.topicmapId)
      if (this.getters.loadedTopicmaps[dataIndex].children) {
        index = this.getters.loadedTopicmaps[dataIndex].children.length
      }
      getObject(this.getters.loadedTopicmaps[dataIndex], id, true, '', function (item, child) {
        for (var i = 0; i < item.children.length; i++) {
          if (item.children[i].id === id) break
        }
        item.children.splice(i, 1)
        firebase.database().ref('topicMapData/' + self.getters.topicmapId + child + '/children/' + i).remove().then(() => {
          firebase.database().ref('topicMapData/' + self.getters.topicmapId + child).on('value', function (data) {
            var childrens = data.val().children
            var temp = []
            if (childrens) {
              childrens.forEach(element => {
                temp.push(element)
              })
              firebase.database().ref('topicMapData/' + self.getters.topicmapId + child + '/children').set(temp).then(() => {
                if (self.getters.view === 'hypergraph') {
                  commit('redrawTree')
                } else {
                  commit('redrawD3Tree')
                }
              })
            } else {
              if (self.getters.view === 'hypergraph') {
                commit('redrawTree')
              } else {
                commit('redrawD3Tree')
              }
            }
          })
        })
      })
    },
    editFile({ commit }, edit) {
      var id = this.getters.selectedNode.id
      var self = this
      var t = {
        name: edit.name,
        type: edit.type,
        url: edit.url,
        description: edit.description
      }
      var index = 0
      var dataIndex = getIndex(this.getters.loadedTopicmaps, this.getters.topicmapId)
      if (this.getters.loadedTopicmaps[dataIndex].children) {
        index = this.getters.loadedTopicmaps[dataIndex].children.length
      }
      getObject(this.getters.loadedTopicmaps[dataIndex], id, false, '', function (item, child) {
        firebase.database().ref('topicMapData/' + self.getters.topicmapId + child).update(t).then(() => {
          item.name = t.name
          item.description = t.description
          item.type = t.type
          item.url = t.url
          if (self.getters.view === 'hypergraph') {
            commit('redrawTree')
          } else {
            commit('redrawD3Tree')
          }
        })
      })
    },
    deleteFile({ commit }) {
      var id = this.getters.selectedNode.id
      var self = this
      var index = 0
      var dataIndex = getIndex(this.getters.loadedTopicmaps, this.getters.topicmapId)
      if (this.getters.loadedTopicmaps[dataIndex].children) {
        index = this.getters.loadedTopicmaps[dataIndex].children.length
      }
      getObject(this.getters.loadedTopicmaps[dataIndex], id, true, '', function (item, child) {
        for (var i = 0; i < item.children.length; i++) {
          if (item.children[i].id === id) break
        }
        item.children.splice(i, 1)
        firebase.database().ref('topicMapData/' + self.getters.topicmapId + child + '/children/' + i).remove().then(() => {
          firebase.database().ref('topicMapData/' + self.getters.topicmapId + child).on('value', function (data) {
            var childrens
            if (data.val().children) {
              childrens = data.val().children
            }
            var temp = []
            if (childrens) {
              childrens.forEach(element => {
                temp.push(element)
              })
              firebase.database().ref('topicMapData/' + self.getters.topicmapId + child + '/children').set(temp).then(() => {
                if (self.getters.view === 'hypergraph') {
                  commit('redrawTree')
                } else {
                  commit('redrawD3Tree')
                }
              })
            } else {
              if (self.getters.view === 'hypergraph') {
                commit('redrawTree')
              } else {
                commit('redrawD3Tree')
              }
            }
          })
        })
      })
    },
    setCircle({ commit }, circle) {
      commit('setCircle', circle)
    }
  },
  getters: {
    view(state) {
      return state.view
    },
    loadedTopicmaps(state) {
      return state.loadedTopicmaps.sort((topicmapA, topicmapB) => {
        return topicmapB.date > topicmapA.date
      })
    },
    featuredTopicmaps(state, getters) {
      return getters.loadedTopicmaps.slice(0, 9)
    },
    loadedTopicmap(state) {
      return (topicmapId) => {
        return state.loadedTopicmaps.find((topicmap) => {
          return topicmap.id === topicmapId
        })
      }
    },
    selectedTopicmapNode(state) {
      return (nodeId) => {
        var currentTopicmap = state.loadedTopicmaps.find((topicmap) => {
          return topicmap.id === state.topicmapId
        })
        var _find = {}
        findObject(currentTopicmap, nodeId, function (obj) {
          _find = obj
        })
        return _find
      }
    },
    loadedCircle(state) {
      return state.circle
    },
    topicmapId(state) {
      return state.topicmapId;
    },
    user(state) {
      return state.user
    },
    loading(state) {
      return state.loading
    },
    error(state) {
      return state.error
    },
    rootActionDisplayed(state) {
      return state.rootActionDisplay
    },
    mainFolderActionDisplayed(state) {
      return state.mainFolderActionDisplay
    },
    fileActionDisplayed(state) {
      return state.fileActionDisplay
    },
    rootHyperActionDisplayed(state) {
      return state.rootHyperActionDisplay
    },
    mainHyperFolderActionDisplayed(state) {
      return state.mainHyperFolderActionDisplay
    },
    fileHyperActionDisplayed(state) {
      return state.fileHyperActionDisplay
    },
    selectedNode(state) {
      return state.selectedNode
    },
    selectedNodeId(state) {
      return state.selectedNodeId
    }
  }
})
