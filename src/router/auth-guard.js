// import {store} from '../components/user/store'
import store from '../components/user/store'
import * as firebase from 'firebase'

export default (to, from, next) => {
  var authenticated = window.localStorage.authenticated
  if (authenticated == 'true') {
    next()
  } else {
    next({
      path: '/signin',
      query: { nextUrl: to.fullPath }
    })
  }
}


