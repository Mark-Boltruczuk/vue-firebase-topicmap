<template>
  <v-container fluid grid-list-xs>
    <v-layout row wrap>
      <v-flex d-flex xs12 sm6 md9>
        <v-layout row wrap>
          <v-flex xs12 sm6>
            <v-card id="create">
              <v-speed-dial v-model="fab" :top="top" :bottom="bottom" :right="right" :left="left" :direction="direction"
                :hover="hover" :transition="transition">
                <v-btn slot="activator" dark color="secondary" fab hover v-model="fab" small>
                  <v-icon>add</v-icon>
                  <v-icon>close</v-icon>
                </v-btn>
                <v-tooltip bottom>
                  <v-btn :href="'/iframe/' + libraryId + '/topicmaps/' + topicMapId + '/circle-pack'" target="_blank"
                  slot="activator" small dark fab color="pink"><v-icon>open_in_new</v-icon></v-btn>
                  <span>New Window</span>
                </v-tooltip>
                <v-tooltip bottom v-if="userIsTeamMember && !userIsCreator">
                  <v-btn slot="activator" v-on:click.native="copy(libraryId, topicMapId)" small dark fab color="teal"><v-icon>swap_vertical_circle</v-icon></v-btn>
                  <span>Link</span>
                </v-tooltip>
                <v-tooltip bottom v-if="userIsTeamMember">
                  <v-btn slot="activator" v-on:click.native="showIframeLink(libraryId, topicMapId)" small dark fab color="cyan"><v-icon>hdr_weak</v-icon></v-btn>
                  <span>Ripple</span>
                </v-tooltip>
                <v-tooltip bottom v-if="userIsTeamMember">
                  <v-btn slot="activator" 
                    small dark fab 
                    color="green"
                    :to="'/' + libraryId + '/topicmaps/' + topicMapId +'/board'"
                    >
                    <v-icon>blur_linear</v-icon>
                  </v-btn>
                  <span>Project Board</span>
                </v-tooltip>

                <v-tooltip bottom v-if="!userIsCreator && !userIsTeamMember">
                  <v-btn slot="activator" v-on:click.native="setBookmark(libraryId, topicMapId)" small dark fab color="purple"><v-icon>bookmark</v-icon></v-btn>
                  <span>Follow</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <v-btn slot="activator" v-on:click.native="viewTopicmapUI('circle-pack')" small dark fab color="red"><v-icon>group_work</v-icon></v-btn>
                  <span>CircleView</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <v-btn slot="activator" v-on:click.native="viewTopicmapUI('hyper-tree')" small dark fab color="orange"><v-icon>ac_unit</v-icon></v-btn>
                  <span>HyperView</span>
                </v-tooltip>
              </v-speed-dial>
            </v-card>
          </v-flex>
        </v-layout>
        <v-container class="blue-grey darken-2 dark">
          <tree-list
            ref="treelist"
            id="tree-list"
            :topicMap="topicMap"
            :topicMapId="topicMapId"
            :libraryId="libraryId"
            v-on:select-node-id="selectNodeId"
          ></tree-list>
        </v-container>
      </v-flex>
      <v-flex d-flex xs12 sm6 md3>
        <v-layout row wrap>
          <v-flex d-flex xs12 mb-0>
            <v-card class="blue-grey darken-2" dark>
              <v-card-actions class="red lighten-1" dark>
                <span class="subheading">Topic Map</span>
                <v-spacer></v-spacer>
                <v-tooltip v-if="userIsTeamMember" left>
                  <v-btn 
                    :to="'/' + libraryId + '/topicmap/edit/' + topicMapId"
                    slot="activator"
                    dark icon
                  >
                    <v-icon dark>edit</v-icon>
                  </v-btn>
                  <span>Map Control</span>
                </v-tooltip>
              </v-card-actions>
              <v-card-text>Title: {{topicMap.name !== undefined? topicMap.name : ""}}</v-card-text>
              <v-card-text>Description: {{topicMap.description !== undefined ? topicMap.description : ""}}</v-card-text>
              <v-card-text>Subject: {{topicMap.subject !== undefined ? topicMap.subject : ""}}</v-card-text>
              <v-card-text>Tags: {{topicMap.tags !== undefined ? topicMap.tags : ""}}</v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { TreeList } from "./treeMap";
import { mapActions, mapGetters } from "vuex";

export default {
  props: ["topicMap", "libraryId", "topicMapId"],
  components: {
    "tree-list": TreeList
  },
  data() {
    return {
      isLoading: false,
      events: [],
      direction: "right",
      fab: false,
      fling: false,
      hover: false,
      tabs: null,
      top: true,
      right: false,
      bottom: false,
      left: true,
      transition: "slide-x-transition"
    };
  },
  computed: {
    ...mapGetters("users", ["user", "users", "isUserSignedIn", "curLibId"]),
    ...mapGetters("libraries", ["library"]),
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
    ...mapActions("users", ["bookmark", "join"]),
    setBookmark(libraryId, topicMapId) {
      this.bookmark({ libraryId, topicMapId });
    },
    copy(libraryId, topicMapId) {
      this.join({ libraryId, topicMapId });
    },
    selectNodeId(id) {
      this.$emit("select-node-id", id);
    },
    viewTopicmapUI(component) {
      this.$emit("view-topicmap", component);
    },
    showIframeLink(libraryId, topicMapId) {
      var protocol = window.location.protocol;
      var hostname = window.location.hostname;
      var port = window.location.port;
      var currentUrl =
        protocol +
        "//" +
        hostname +
        ":" +
        port +
        "/iframe/" +
        libraryId +
        "/topicmaps/" +
        topicMapId +
        "/tree-list";
      alert(
        "<iframe src='" +
          currentUrl +
          "' id='iframe' scrolling='no' allowtransparency='true' frameborder='no' height='600' width='800'></iframe>"
      );
    }
  }
};
</script>
<style scoped>
#tree-list {
  overflow: auto;
  height: 500px;
  height: 500px;
  padding-top: 20px;
}
#create .speed-dial {
  position: absolute;
  z-index: 5;
}
#create .v-speed-dial {
  position: absolute;
  z-index: 5;
}
#create .btn--floating {
  position: relative;
}
</style>
<style>
#tree-list .node-content {
  /* color: white; */
}
</style>
