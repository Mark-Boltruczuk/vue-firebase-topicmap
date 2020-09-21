<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex
        mb-3 xs12 sm6
        offset-sm1
        class="text-xs-center text-sm-right"
      >
        <v-btn
          large
          :to="'/' + libraryId + '/topicmap/new'"
          class="info">Create Topic Map</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title class="red lighten-1 dark">
            <span class="title white--text">Public Topic Maps</span>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 sm4 md4 lg4>
        <v-card-title v-if="publicTopicMaps.length === 0" class="white--text">
          There is no public topic maps
        </v-card-title>
        <v-expansion-panel expand dark>
          <v-expansion-panel-content dark
            v-for="(topicMap, i) in publicTopicMaps"
            :key="topicMap.id"
            v-if="i < publicTopicMaps.length/3"
          >
            <div slot="header">{{topicMap.name|toUppercase}}</div>
            <v-card class="blue-grey darken-1 dark">
              <v-card-text>{{topicMap.description}}</v-card-text>
            </v-card>
            <v-card class="blue-grey darken-1 dark">
              <v-card-text>Creator: {{users[topicMap.creatorId].firstname + ' ' + users[topicMap.creatorId].lastname}}</v-card-text>
            </v-card>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-tooltip bottom >
                <v-btn :to="'/' + libraryId + '/topicmap/edit/' + topicMap.id" slot="activator" dark icon>
                  <v-icon dark>edit</v-icon>
                </v-btn>
                <span>Edit TopicMap</span>
              </v-tooltip>
              <v-tooltip  v-if="user.uid === libraryId" bottom >
                <v-btn @click="onDelete(topicMap)" slot="activator" dark icon>
                  <v-icon dark>delete</v-icon>
                </v-btn>
                <span>Delete TopicMap</span>
              </v-tooltip>
              <v-tooltip bottom >
                <v-btn @click="onDownload(topicMap)" slot="activator" dark icon>
                  <v-icon dark>cloud_download</v-icon>
                </v-btn>
                <span>Download TopicMap</span>
              </v-tooltip>
              <v-btn :to="'/' + libraryId + '/topicmaps/' + topicMap.id" class="info--text" flat>View Topic Map</v-btn>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
      <v-flex xs12 sm4 md4 lg4>
        <v-expansion-panel expand dark>
          <v-expansion-panel-content dark
            v-for="(topicMap, i) in publicTopicMaps"
            :key="topicMap.id"
            v-if="publicTopicMaps.length/3 <= i && i < publicTopicMaps.length/3 * 2"
          >
            <div slot="header">{{topicMap.name|toUppercase}}</div>
            <v-card class="blue-grey darken-1 dark">
              <v-card-text>{{topicMap.description}}</v-card-text>
            </v-card>
            <v-card class="blue-grey darken-1 dark">
              <v-card-text>Creator: {{users[topicMap.creatorId].firstname + ' ' + users[topicMap.creatorId].lastname}}</v-card-text>
            </v-card>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-tooltip bottom >
                <v-btn :to="'/' + libraryId + '/topicmap/edit/' + topicMap.id" slot="activator" dark icon>
                  <v-icon dark>edit</v-icon>
                </v-btn>
                <span>Edit TopicMap</span>
              </v-tooltip>
              <v-tooltip  v-if="user.uid === libraryId" bottom >
                <v-btn @click="onDelete(topicMap)" slot="activator" dark icon>
                  <v-icon dark>delete</v-icon>
                </v-btn>
                <span>Delete TopicMap</span>
              </v-tooltip>
              <v-tooltip bottom >
                <v-btn @click="onDownload(topicMap)" slot="activator" dark icon>
                  <v-icon dark>cloud_download</v-icon>
                </v-btn>
                <span>Download TopicMap</span>
              </v-tooltip>
              <v-btn :to="'/' + libraryId + '/topicmaps/' + topicMap.id" class="info--text" flat>View Topic Map</v-btn>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
      <v-flex xs12 sm4 md4 lg4>
        <v-expansion-panel expand dark>
          <v-expansion-panel-content dark
            v-for="(topicMap, i) in publicTopicMaps"
            :key="topicMap.id"
            v-if="publicTopicMaps.length/3*2 <= i"
          >
            <div slot="header">{{topicMap.name|toUppercase}}</div>
            <v-card class="blue-grey darken-1 dark">
              <v-card-text>{{topicMap.description}}</v-card-text>
            </v-card>
            <v-card class="blue-grey darken-1 dark">
              <v-card-text>Creator: {{users[topicMap.creatorId].firstname + ' ' + users[topicMap.creatorId].lastname}}</v-card-text>
            </v-card>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-tooltip bottom >
                <v-btn :to="'/' + libraryId + '/topicmap/edit/' + topicMap.id" slot="activator" dark icon>
                  <v-icon dark>edit</v-icon>
                </v-btn>
                <span>Edit TopicMap</span>
              </v-tooltip>
              <v-tooltip v-if="user.uid === libraryId" bottom >
                <v-btn @click="onDelete(topicMap)" slot="activator" dark icon>
                  <v-icon dark>delete</v-icon>
                </v-btn>
                <span>Delete TopicMap</span>
              </v-tooltip>
              <v-tooltip bottom >
                <v-btn @click="onDownload(topicMap)" slot="activator" dark icon>
                  <v-icon dark>cloud_download</v-icon>
                </v-btn>
                <span>Download TopicMap</span>
              </v-tooltip>
              <v-btn :to="'/' + libraryId + '/topicmaps/' + topicMap.id" class="info--text" flat color="orange">View Topic Map</v-btn>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-if="user.uid === libraryId">
      <v-flex xs12 class="mt-3">
        <v-card>
          <v-card-title class="red lighten-1 dark">
            <span class="title white--text">Private Topic Maps</span>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-if="user.uid === libraryId">
      <v-flex xs12 sm4 md4 lg4>
        <v-card-title v-if="privateTopicMaps.length === 0" class="white--text">
          There is no private topic maps
        </v-card-title>
        <v-expansion-panel expand dark>
          <v-expansion-panel-content dark v-for="(topicMap, i) in privateTopicMaps" :key="topicMap.id" v-if="i < privateTopicMaps.length/3">
            <div slot="header">{{topicMap.name|toUppercase}}</div>
            <v-card class="blue-grey darken-1 dark">
              <v-card-text>{{topicMap.description}}</v-card-text>
            </v-card>
            <v-card class="blue-grey darken-1 dark">
              <v-card-text>Creator: {{users[topicMap.creatorId].firstname + ' ' + users[topicMap.creatorId].lastname}}</v-card-text>
            </v-card>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-tooltip bottom >
                <v-btn :to="'/' + libraryId + '/topicmap/edit/' + topicMap.id" slot="activator" dark icon>
                  <v-icon dark>edit</v-icon>
                </v-btn>
                <span>Edit TopicMap</span>
              </v-tooltip>
              <v-tooltip bottom >
                <v-btn @click="onDelete(topicMap)" slot="activator" dark icon>
                  <v-icon dark>delete</v-icon>
                </v-btn>
                <span>Delete TopicMap</span>
              </v-tooltip>
              <v-tooltip bottom >
                <v-btn @click="onDownload(topicMap)" slot="activator" dark icon>
                  <v-icon dark>cloud_download</v-icon>
                </v-btn>
                <span>Download TopicMap</span>
              </v-tooltip>
              <v-btn :to="'/' + libraryId + '/topicmaps/' + topicMap.id" class="info--text" flat>View Topic Map</v-btn>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
      <v-flex xs12 sm4 md4 lg4>
        <v-expansion-panel expand dark>
          <v-expansion-panel-content dark v-for="(topicMap, i) in privateTopicMaps" :key="topicMap.id" v-if=" privateTopicMaps.length/3 <= i && i < privateTopicMaps.length/3 * 2">
            <div slot="header">{{topicMap.name|toUppercase}}</div>
            <v-card class="blue-grey darken-1 dark">
              <v-card-text>{{topicMap.description}}</v-card-text>
            </v-card>
            <v-card class="blue-grey darken-1 dark">
              <v-card-text>Creator: {{users[topicMap.creatorId].firstname + ' ' + users[topicMap.creatorId].lastname}}</v-card-text>
            </v-card>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-tooltip bottom >
                <v-btn :to="'/' + libraryId + '/topicmap/edit/' + topicMap.id" slot="activator" dark icon>
                  <v-icon dark>edit</v-icon>
                </v-btn>
                <span>Edit TopicMap</span>
              </v-tooltip>
              <v-tooltip bottom >
                <v-btn @click="onDelete(topicMap)" slot="activator" dark icon>
                  <v-icon dark>delete</v-icon>
                </v-btn>
                <span>Delete TopicMap</span>
              </v-tooltip>
              <v-tooltip bottom >
                <v-btn @click="onDownload(topicMap)" slot="activator" dark icon>
                  <v-icon dark>cloud_download</v-icon>
                </v-btn>
                <span>Download TopicMap</span>
              </v-tooltip>
              <v-btn :to="'/' + libraryId + '/topicmaps/' + topicMap.id" class="info--text" flat>View Topic Map</v-btn>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
      <v-flex xs12 sm4 md4 lg4>
        <v-expansion-panel expand dark>
          <v-expansion-panel-content dark v-for="(topicMap, i) in privateTopicMaps" :key="topicMap.id" v-if="privateTopicMaps.length/3*2 <= i">
            <div slot="header">{{topicMap.name|toUppercase}}</div>
            <v-card class="blue-grey darken-1 dark">
              <v-card-text>{{topicMap.description}}</v-card-text>
            </v-card>
            <v-card class="blue-grey darken-1 dark">
              <v-card-text>Creator: {{users[topicMap.creatorId].firstname + ' ' + users[topicMap.creatorId].lastname}}</v-card-text>
            </v-card>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-tooltip bottom >
                <v-btn :to="'/' + libraryId + '/topicmap/edit/' + topicMap.id" slot="activator" dark icon>
                  <v-icon dark>edit</v-icon>
                </v-btn>
                <span>Edit TopicMap</span>
              </v-tooltip>
              <v-tooltip bottom >
                <v-btn @click="onDelete(topicMap)" slot="activator" dark icon>
                  <v-icon dark>delete</v-icon>
                </v-btn>
                <span>Delete TopicMap</span>
              </v-tooltip>
              <v-tooltip bottom >
                <v-btn @click="onDownload(topicMap)" slot="activator" dark icon>
                  <v-icon dark>cloud_download</v-icon>
                </v-btn>
                <span>Download TopicMap</span>
              </v-tooltip>
              <v-btn :to="'/' + libraryId + '/topicmaps/' + topicMap.id" class="info--text" flat>View Topic Map</v-btn>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-if="user.uid === libraryId">
      <v-flex xs12 class="mt-3">
        <v-card>
          <v-card-title class="red lighten-1 dark">
            <span class="title white--text">Joined Topic Maps</span>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-if="user.uid === libraryId">
      <v-flex xs12 sm4 md4 lg4>
        <v-card-title v-if="joinedTopicMaps.length === 0" class="white--text">
          There is no joined topic maps
        </v-card-title>
        <v-expansion-panel expand dark>
          <v-expansion-panel-content dark v-for="(topicMap, i) in joinedTopicMaps" :key="topicMap.id" v-if="i < joinedTopicMaps.length/3">
            <div slot="header">{{topicMap.name|toUppercase}}</div>
            <v-card class="blue-grey darken-1 dark">
              <v-card-text>{{topicMap.description}}</v-card-text>
            </v-card>
            <v-card class="blue-grey darken-1 dark">
              <v-card-text>Creator: {{users[topicMap.creatorId].firstname + ' ' + users[topicMap.creatorId].lastname}}</v-card-text>
            </v-card>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-tooltip bottom >
                <v-btn @click="copyToMyLibrary(topicMap.libraryId, topicMap.id)" slot="activator" dark icon>
                  <v-icon dark>file_copy</v-icon>
                </v-btn>
                <span>Copy TopicMap</span>
              </v-tooltip>
              <v-tooltip  bottom >
                <v-btn @click="onUnjoin(topicMap)" slot="activator" dark icon>
                  <v-icon dark>not_interested</v-icon>
                </v-btn>
                <span>Unjoin TopicMap</span>
              </v-tooltip>
              <v-tooltip bottom >
                <v-btn @click="onDownload(topicMap)" slot="activator" dark icon>
                  <v-icon dark>cloud_download</v-icon>
                </v-btn>
                <span>Download TopicMap</span>
              </v-tooltip>
              <v-btn :to="'/' + topicMap.libraryId + '/topicmaps/' + topicMap.id" class="info--text" flat>View Topic Map</v-btn>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
      <v-flex xs12 sm4 md4 lg4>
        <v-expansion-panel expand dark>
          <v-expansion-panel-content dark v-for="(topicMap, i) in joinedTopicMaps" :key="topicMap.id" v-if=" joinedTopicMaps.length/3 <= i && i < joinedTopicMaps.length/3 * 2">
            <div slot="header">{{topicMap.name|toUppercase}}</div>
            <v-card class="blue-grey darken-1 dark">
              <v-card-text>{{topicMap.description}}</v-card-text>
            </v-card>
            <v-card class="blue-grey darken-1 dark">
              <v-card-text>Creator: {{users[topicMap.creatorId].firstname + ' ' + users[topicMap.creatorId].lastname}}</v-card-text>
            </v-card>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-tooltip bottom >
                <v-btn @click="copyToMyLibrary(topicMap.libraryId, topicMap.id)" slot="activator" dark icon>
                  <v-icon dark>file_copy</v-icon>
                </v-btn>
                <span>Copy TopicMap</span>
              </v-tooltip>
              <v-tooltip  bottom >
                <v-btn @click="onUnjoin(topicMap)" slot="activator" dark icon>
                  <v-icon dark>not_interested</v-icon>
                </v-btn>
                <span>Unjoin TopicMap</span>
              </v-tooltip>
              <v-tooltip bottom >
                <v-btn @click="onDownload(topicMap)" slot="activator" dark icon>
                  <v-icon dark>cloud_download</v-icon>
                </v-btn>
                <span>Download TopicMap</span>
              </v-tooltip>
              <v-btn :to="'/' + topicMap.libraryId + '/topicmaps/' + topicMap.id" class="info--text" flat>View Topic Map</v-btn>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
      <v-flex xs12 sm4 md4 lg4>
        <v-expansion-panel expand dark>
          <v-expansion-panel-content dark v-for="(topicMap, i) in joinedTopicMaps" :key="topicMap.id" v-if="joinedTopicMaps.length/3*2 <= i">
            <div slot="header">{{topicMap.name|toUppercase}}</div>
            <v-card class="blue-grey darken-1 dark">
              <v-card-text>{{topicMap.description}}</v-card-text>
            </v-card>
            <v-card class="blue-grey darken-1 dark">
              <v-card-text>Creator: {{users[topicMap.creatorId].firstname + ' ' + users[topicMap.creatorId].lastname}}</v-card-text>
            </v-card>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-tooltip bottom >
                <v-btn @click="copyToMyLibrary(topicMap.libraryId, topicMap.id)" slot="activator" dark icon>
                  <v-icon dark>file_copy</v-icon>
                </v-btn>
                <span>Copy TopicMap</span>
              </v-tooltip>
              <v-tooltip  bottom >
                <v-btn @click="onUnjoin(topicMap)" slot="activator" dark icon>
                  <v-icon dark>not_interested</v-icon>
                </v-btn>
                <span>Unjoin TopicMap</span>
              </v-tooltip>
              <v-tooltip bottom >
                <v-btn @click="onDownload(topicMap)" slot="activator" dark icon>
                  <v-icon dark>cloud_download</v-icon>
                </v-btn>
                <span>Download TopicMap</span>
              </v-tooltip>
              <v-btn :to="'/' + topicMap.libraryId + '/topicmaps/' + topicMap.id" class="info--text" flat>View Topic Map</v-btn>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-if="user.uid === libraryId">
      <v-flex xs12 class="mt-3">
        <v-card>
          <v-card-title class="red lighten-1 dark">
            <span class="title white--text">Following Topic Maps</span>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-if="user.uid === libraryId">
      <v-flex xs12 sm4 md4 lg4>
        <v-card-title v-if="followingTopicMaps.length === 0" class="white--text">
          There is no following topic maps
        </v-card-title>
        <v-expansion-panel expand dark>
          <v-expansion-panel-content dark v-for="(topicMap, i) in followingTopicMaps" :key="topicMap.id" v-if="i < followingTopicMaps.length/3">
            <div slot="header">{{topicMap.name|toUppercase}}</div>
            <v-card class="blue-grey darken-1 dark">
              <v-card-text>{{topicMap.description}}</v-card-text>
            </v-card>
            <v-card class="blue-grey darken-1 dark">
              <v-card-text>Creator: {{users[topicMap.creatorId].firstname + ' ' + users[topicMap.creatorId].lastname}}</v-card-text>
            </v-card>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-tooltip  bottom >
                <v-btn @click="onUnfollow(topicMap)" slot="activator" dark icon>
                  <v-icon dark>not_interested</v-icon>
                </v-btn>
                <span>Unfollow TopicMap</span>
              </v-tooltip>
              <v-btn :to="'/' + topicMap.libraryId + '/topicmaps/' + topicMap.id" class="info--text" flat>View Topic Map</v-btn>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
      <v-flex xs12 sm4 md4 lg4>
        <v-expansion-panel expand dark>
          <v-expansion-panel-content dark v-for="(topicMap, i) in followingTopicMaps" :key="topicMap.id" v-if=" followingTopicMaps.length/3 <= i && i < followingTopicMaps.length/3 * 2">
            <div slot="header">{{topicMap.name|toUppercase}}</div>
            <v-card class="blue-grey darken-1 dark">
              <v-card-text>{{topicMap.description}}</v-card-text>
            </v-card>
            <v-card class="blue-grey darken-1 dark">
              <v-card-text>Creator: {{users[topicMap.creatorId].firstname + ' ' + users[topicMap.creatorId].lastname}}</v-card-text>
            </v-card>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-tooltip  bottom >
                <v-btn @click="onUnfollow(topicMap)" slot="activator" dark icon>
                  <v-icon dark>not_interested</v-icon>
                </v-btn>
                <span>Unfollow TopicMap</span>
              </v-tooltip>
              <v-btn :to="'/' + topicMap.libraryId + '/topicmaps/' + topicMap.id" class="info--text" flat>View Topic Map</v-btn>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
      <v-flex xs12 sm4 md4 lg4>
        <v-expansion-panel expand dark>
          <v-expansion-panel-content dark v-for="(topicMap, i) in followingTopicMaps" :key="topicMap.id" v-if="followingTopicMaps.length/3*2 <= i">
            <div slot="header">{{topicMap.name|toUppercase}}</div>
            <v-card class="blue-grey darken-1 dark">
              <v-card-text>{{topicMap.description}}</v-card-text>
            </v-card>
            <v-card class="blue-grey darken-1 dark">
              <v-card-text>Creator: {{users[topicMap.creatorId].firstname + ' ' + users[topicMap.creatorId].lastname}}</v-card-text>
            </v-card>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-tooltip  bottom >
                <v-btn @click="onUnfollow(topicMap)" slot="activator" dark icon>
                  <v-icon dark>not_interested</v-icon>
                </v-btn>
                <span>Unfollow TopicMap</span>
              </v-tooltip>
              <v-btn :to="'/' + topicMap.libraryId + '/topicmaps/' + topicMap.id" class="info--text" flat>View Topic Map</v-btn>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  props: ["libraryId"],
  data() {
    return {
      dialog: false,
      show: false,
      publicTopicMaps: Array,
      privateTopicMaps: Array,
      userPrivateTopicMaps: Array,
      followingTopicMaps: Array,
      joinedTopicMaps: Array
    };
  },
  computed: {
    ...mapGetters("users", ["user", "users"]),
    ...mapGetters({
      loadedLibrary: "libraries/library",
      loading: "libraries/loading",
      error: "libraries/error",
      loadedLibraries: "libraries/libraries",
      copied: "libraries/copied"
    }),
    userHasPrivateTopicMaps() {}
  },
  methods: {
    ...mapActions("libraries", [
      "download",
      "deleteTopicMap",
      "loadLibraries",
      "loadLibrary",
      "copy",
      "unfollowTopicMap",
      "unjoinTopicMap"
    ]),
    ...mapActions("users", ["setCurLibId"]),
    copyToMyLibrary(libraryId, topicMapId) {
      let userId = this.user.uid;
      this.copy({ libraryId, topicMapId, userId });
    },
    onUnfollow(topicMap) {
      this.unfollowTopicMap({ libraryId: this.libraryId, topicMap: topicMap });
      this.followingTopicMaps = [];
      for (let libraryId in this.loadedLibrary.followingTopicmaps) {
        for (let key in this.loadedLibrary.followingTopicmaps[libraryId]) {
          var topicMapId = this.loadedLibrary.followingTopicmaps[libraryId][
            key
          ];
          this.followingTopicMaps.push({
            ...this.loadedLibraries[libraryId].topicMaps[topicMapId],
            libraryId,
            topicMapId,
            id: topicMapId
          });
        }
      }
    },
    onUnjoin(topicMap) {
      this.unjoinTopicMap({ libraryId: this.libraryId, topicMap: topicMap });
    },
    onDelete(topicMap) {
      if (confirm("Are you sure to delete this topicmap?")) {
        this.deleteTopicMap({
          libraryId: this.libraryId,
          topicMapId: topicMap.id
        });
        setTimeout(() => {
          if (topicMap.mapType === "public") {
            let i;
            for (i = 0; i < this.publicTopicMaps.length; i++) {
              if (this.publicTopicMaps[i].id === topicMap.id) {
                break;
              }
            }
            this.publicTopicMaps.splice(i, 1);
          } else if (topicMap.mapType === "private") {
            let i;
            for (i = 0; i < this.privateTopicMaps.length; i++) {
              if (this.privateTopicMaps[i].id === topicMap.id) {
                break;
              }
            }
            this.privateTopicMaps.splice(i, 1);
          }
        }, 200);
      }
    },
    onDownload(topicMap) {
      let filename = topicMap.name + ".json";
      let text = JSON.stringify(topicMap);
      let element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(text)
      );
      element.setAttribute("download", filename);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  },
  filters: {
    toUppercase(value) {
      if (value) 
        return value.toUpperCase();
    }
  },
  watch: {
    loadedLibrary: {
      handler: function(newVal, oldVal) {
        this.followingTopicMaps = [];
        if (newVal.followingTopicmaps) {
          for (let libraryId in newVal.followingTopicmaps) {
            for (let key in newVal.followingTopicmaps[libraryId]) {
              var topicMapId = newVal.followingTopicmaps[libraryId][key];
              this.followingTopicMaps.push({
                ...this.loadedLibraries[libraryId].topicMaps[topicMapId],
                libraryId,
                topicMapId,
                id: topicMapId
              });
            }
          }
        }
        this.joinedTopicMaps = [];
        if (newVal.joinedTopicmaps) {
          for (let libraryId in newVal.joinedTopicmaps) {
            for (let key in newVal.joinedTopicmaps[libraryId]) {
              var topicMapId = newVal.joinedTopicmaps[libraryId][key];
              this.joinedTopicMaps.push({
                ...this.loadedLibraries[libraryId].topicMaps[topicMapId],
                libraryId,
                topicMapId,
                id: topicMapId
              });
            }
          }
        }
        this.privateTopicMaps = [];
        this.userPrivateTopicMaps = [];
        for (let key in this.loadedLibrary.topicMaps) {
          if (this.loadedLibrary.topicMaps[key].mapType == "private") {
            this.privateTopicMaps.push({
              ...this.loadedLibrary.topicMaps[key],
              id: key
            });
            if (this.loadedLibrary.topicMaps[key].creatorId === this.user.uid) {
              this.userPrivateTopicMaps.push({
                ...this.loadedLibrary.topicMaps[key],
                id: key
              });
            }
          }
        }
        this.publicTopicMaps = [];
        for (let key in this.loadedLibrary.topicMaps) {
          if (this.loadedLibrary.topicMaps[key].mapType == "public") {
            this.publicTopicMaps.push({
              ...this.loadedLibrary.topicMaps[key],
              id: key
            });
          }
        }
      },
      deep: true
    }
    // copied: {
    //   handler: function(newVal, oldVal) {
    //     this.privateTopicMaps = [];
    //     this.userPrivateTopicMaps = [];
    //     for (let key in this.loadedLibrary.topicMaps) {
    //       if (this.loadedLibrary.topicMaps[key].mapType == "private") {
    //         this.privateTopicMaps.push({
    //           ...this.loadedLibrary.topicMaps[key],
    //           id: key
    //         });
    //         if (this.loadedLibrary.topicMaps[key].creatorId === this.user.uid) {
    //           this.userPrivateTopicMaps.push({
    //             ...this.loadedLibrary.topicMaps[key],
    //             id: key
    //           });
    //         }
    //       }
    //     }
    //     this.publicTopicMaps = [];
    //     for (let key in this.loadedLibrary.topicMaps) {
    //       if (this.loadedLibrary.topicMaps[key].mapType == "public") {
    //         this.publicTopicMaps.push({
    //           ...this.loadedLibrary.topicMaps[key],
    //           id: key
    //         });
    //       }
    //     }
    //   },
    //   deep: true
    // }
  },
  created: function() {
    this.setCurLibId(this.libraryId);
    this.loadLibrary(this.libraryId);
    this.privateTopicMaps = [];
    this.userPrivateTopicMaps = [];
    for (let key in this.loadedLibrary.topicMaps) {
      if (this.loadedLibrary.topicMaps[key].mapType == "private") {
        this.privateTopicMaps.push({
          ...this.loadedLibrary.topicMaps[key],
          id: key
        });
        if (this.loadedLibrary.topicMaps[key].creatorId === this.user.uid) {
          this.userPrivateTopicMaps.push({
            ...this.loadedLibrary.topicMaps[key],
            id: key
          });
        }
      }
    }
    this.publicTopicMaps = [];
    for (let key in this.loadedLibrary.topicMaps) {
      if (this.loadedLibrary.topicMaps[key].mapType == "public") {
        this.publicTopicMaps.push({
          ...this.loadedLibrary.topicMaps[key],
          id: key
        });
      }
    }

    this.followingTopicMaps = [];
    for (let libraryId in this.loadedLibrary.followingTopicmaps) {
      for (let key in this.loadedLibrary.followingTopicmaps[libraryId]) {
        var topicMapId = this.loadedLibrary.followingTopicmaps[libraryId][key];
        this.followingTopicMaps.push({
          ...this.loadedLibraries[libraryId].topicMaps[topicMapId],
          libraryId,
          topicMapId,
          id: topicMapId
        });
      }
    }

    this.joinedTopicMaps = [];
    for (let libraryId in this.loadedLibrary.joinedTopicmaps) {
      for (let key in this.loadedLibrary.joinedTopicmaps[libraryId]) {
        var topicMapId = this.loadedLibrary.joinedTopicmaps[libraryId][key];
        this.joinedTopicMaps.push({
          ...this.loadedLibraries[libraryId].topicMaps[topicMapId],
          libraryId,
          topicMapId,
          id: topicMapId
        });
      }
    }
  }
};
</script>
<style scoped>
#public-title {
  cursor: pointer;
}
#private-title {
  cursor: pointer;
}
.application--light .card {
  background-color: inherit;
  color: white;
}
</style>
