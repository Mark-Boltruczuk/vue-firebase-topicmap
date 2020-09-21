// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import firebase from 'firebase'
import store from './store'
import router from './router'
import VueParticles from 'vue-particles'
import d3 from 'd3'
import 'vuetify/dist/vuetify.min.css'
import Vuex from 'vuex'
import AlertCmp from './components/shared/Alert.vue'
import FileModal from './components/shared/modal/File.vue'
import FolderModal from './components/shared/modal/Folder.vue'
import RootModal from './components/shared/modal/Root.vue'
import VueLocalStorage from 'vue-localstorage'
Vue.use(VueLocalStorage)

// import BootstrapVue from 'bootstrap-vue'

Vue.use(Vuex)
Vue.use(Vuetify)
Vue.use(VueParticles)
//Global
Vue.component('app-alert', AlertCmp)
Vue.component('file-modal', FileModal)
Vue.component('folder-modal', FolderModal)
Vue.component('root-modal', RootModal)


Vue.config.productionTip = false

/* eslint-disable no-new */

var app = new Vue({
  el: '#app',
  router,
  store,
  localStorage: {
    authenticated: {
      type: Boolean,
      default: false
    }
  },
  render: h => h(App),
  created() {
    firebase.initializeApp({
      apiKey: "AIzaSyAaZ8-X6mKYEO7HXwuzR6wRA00gAi2fdq8",
      authDomain: "web-ripple-d7fdb.firebaseapp.com",
      databaseURL: "https://web-ripple-d7fdb.firebaseio.com",
      projectId: "web-ripple-d7fdb",
      storageBucket: "gs://web-ripple-d7fdb.appspot.com",
      messagingSenderId: "438663775895"
    })
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('users/autoSignIn', user)
      }
    })
  }
})
