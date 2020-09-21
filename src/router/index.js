import Vue from 'vue'
import Router from 'vue-router'
import Landingpage from '@/components/Landingpage' //@ means src the root folder
import Home from '@/components/home/Home'
import MapControl from '@/components/topicmap/MapControl'
import TopicmapList from '@/components/topicmap/TopicmapList'
import CreateTopicmap from '@/components/topicmap/CreateTopicmap'
import Topicmap from '@/components/topicmap/Topicmap'
import IframeTopicmap from '@/components/topicmap/IframeTopicmap'
import SubjectGate from '@/components/topicmap/SubjectGate'
import SubjectTopicMap from '@/components/topicmap/SubjectTopicmapList'
import Profile from '@/components/user/Profile'
import KanbanBoard from '@/components/board/KanbanBoard'
import Backlog from '@/components/board/Backlog'
import PendingList from '@/components/user/PendingList'
import Signin from '@/components/user/Signin'
import Signup from '@/components/user/Signup'
import AuthGuard from './auth-guard'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Landingpage', //Optional
      component: Landingpage
    },
    {
      path: '/:libraryId/home',
      name: 'Home',
      component: Home,
      props: true
    },
    {
      path: '/:libraryId/topicmap/mapcontrol',
      name: 'MapControl',
      component: MapControl,
      props: true
    },
    {
      path: '/:libraryId/topicmaps',
      name: 'TopicmapList',
      component: TopicmapList,
      props: true
    },
    {
      path: '/iframe/:libraryId/topicmaps/:id/:view',
      name: 'IframeTopicmap',
      props: true,
      component: IframeTopicmap,
      meta: {
        plainLayout: true,
      }
    },
    {
      path: '/:libraryId/topicmaps/:id',
      name: 'Topicmap',
      props: true,
      component: Topicmap,
      beforeEnter: AuthGuard
    },
    {
      path: '/:libraryId/topicmap/edit/:topicMapId',
      name: 'EditTopicmap',
      props: true,
      component: CreateTopicmap,
      beforeEnter: AuthGuard
    },
    {
      path: '/:libraryId/topicmap/new',
      name: 'CreateTopicmap',
      component: CreateTopicmap,
      beforeEnter: AuthGuard,
      props: true
    },
    {
      path: '/:libraryId/topicmaps/:id/board',
      name: 'KanbanBoard',
      props: true,
      component: KanbanBoard
    },
    {
      path: '/:libraryId/topicmaps/:id/backlog',
      name: 'Backlog',
      props: true,
      component: Backlog
    },
    {
      path: '/:libraryId/subjectgate',
      name: 'SubjectGate',
      component: SubjectGate,
      props: true
    },
    {
      path: '/:libraryId/profile',
      name: 'Profile',
      component: Profile,
      // beforeEnter: AuthGuard,
      props: true
    },
    {
      path: '/:libraryId/pendinglist',
      name: 'PendingList',
      component: PendingList,
      beforeEnter: AuthGuard,
      props: true
    },
    {
      path: '/:libraryId/subjectmap/:subjectId',
      name: 'CommunityTopicMap',
      component: SubjectTopicMap,
      props: true
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin,
      props: true
    }
  ],
  mode: 'history',
  base: __dirname
})
