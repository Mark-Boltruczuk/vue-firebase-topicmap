<template>
  <v-container class="container">
    <v-layout row wrap>
      <v-flex xs12>
        <file-modal :topicMapId="topicMapId" :childId="childId" :libraryId="libraryId"></file-modal>
        <folder-modal :topicMapId="topicMapId" :childId="childId" :libraryId="libraryId"></folder-modal>
        <root-modal :topicMapId="topicMapId" :childId="childId" :libraryId="libraryId"></root-modal>
        <component v-if="topicMap" v-bind:is="component" :topicMap="topicMap" :topicMapId="topicMapId" :libraryId="libraryId"
          @select-node-id="selectNodeId" @view-topicmap="viewTopicmap"></component>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import HyperTree from "./ui/hyperGraph/Hypertree";
import CirclePack from "./ui/circleGraph/Circlepack";
import TreeList from "./ui/treeGraph/treelist";

import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    "circle-pack": CirclePack,
    "hyper-tree": HyperTree,
    "tree-list": TreeList
  },
  props: ["id", "libraryId"],
  data() {
    return {
      component: "circle-pack",
      nodeId: null
    };
  },
  computed: {
    ...mapGetters("users", ["user", "users", "isUserSignedIn", "curLibId"]),
    ...mapGetters("libraries", ["library", "libraries"]),
    topicMap() {
      if (this.libraries[this.libraryId])
        return this.libraries[this.libraryId].topicMaps[this.id];
      return null;
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
    ...mapActions("users", ["setCurLibId", "setSnackbar"]),
    selectNodeId(id) {
      this.nodeId = id;
    },
    viewTopicmap(component) {
      this.component = component;
    }
  },
  mounted: function() {
    this.setCurLibId(this.libraryId);
    this.setSnackbar({
      color: "info",
      timeout: "7000",
      message: "Click the right button on the topic map to edit."
    });
  }
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
