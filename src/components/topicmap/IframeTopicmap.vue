<template>
  <v-container class="container">
    <v-layout row wrap>
      <v-flex xs12>
        <file-modal :topicMapId="topicMapId" :childId="childId"></file-modal>
        <folder-modal :topicMapId="topicMapId" :childId="childId"></folder-modal>
        <root-modal :topicMapId="topicMapId" :childId="childId"></root-modal>
        <div v-if="userIsTeamMember" class="text-lg-right">
        </div>
        <keep-alive>
          <component v-bind:is="component" :topicMap="topicMap" :topicMapId="topicMapId" :libraryId="libraryId" @select-node-id="selectNodeId"></component>
        </keep-alive>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import HyperTree from "./iframe_ui/hyperGraph/Hypertree";
import CirclePack from "./iframe_ui/circleGraph/Circlepack";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    "circle-pack": CirclePack,
    "hyper-tree": HyperTree
  },
  props: ["id", "libraryId", "view"],
  data() {
    return {
      component: this.view,
      nodeId: null
    };
  },
  computed: {
    ...mapGetters("users", ["user", "users", "isUserSignedIn", "curLibId"]),
    ...mapGetters("libraries", ["library"]),
    topicMap() {
      return this.library.topicMaps[this.id];
    },
    topicMapId() {
      return this.id;
    },
    childId() {
      return this.nodeId;
    },
    userIsCreator() {
      if (!this.isUserSignedIn) {
        return false;
      }
      return this.user.uid === this.libraryId;
    },
    userIsTeamMember() {
      for (let key in this.teamMembers) {
        if (this.user.uid === this.teamMembers[key].uid) {
          return true;
        }
      }
      return false;
    },
    teamMembers() {
      if (this.isUserSignedIn && this.library) {
        let teamMembers = [];
        for (let key in this.library.teamMembers) {
          if (this.library.teamMembers[key].status >= 1) {
            teamMembers.push({
              ...this.users[key],
              status: this.library.teamMembers[key].status,
              uid: key
            });
          }
        }
        return teamMembers;
      }
      return [];
    }
  },
  methods: {
    ...mapActions("libraries", ["create", "save", "download"]),
    ...mapActions("users", ["setCurLibId"]),
    selectNodeId(id) {
      this.nodeId = id;
    }
  },
  mounted: function() {
    this.setCurLibId(this.libraryId);
  }
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
<style>
.blue-grey.darken-2, .blue-grey.darken-2--after:after {
    background-color: #263238!important;
}
</style>
