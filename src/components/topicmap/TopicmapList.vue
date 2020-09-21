<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 mt-3>
        <v-card>
          <v-card-text class="red lighten-1 dark">
            <span class="title white--text">Topic Maps</span>
            <v-spacer></v-spacer>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
      <v-layout row wrap>
        <v-flex xs12 sm4 md4 lg4>
          <v-card-title v-if="publicTopicMaps.length === 0" class="white--text">
            There is no public topic maps
          </v-card-title>
          <v-expansion-panel expand dark>
            <v-expansion-panel-content dark v-for="(topicMap, i) in publicTopicMaps" :key="topicMap.id" v-if="i < publicTopicMaps.length/3">
              <div slot="header">{{topicMap.name|toUppercase}}</div>
              <v-card class="blue-grey darken-1 dark">
                <v-card-text>{{topicMap.description}}</v-card-text>
              </v-card>
              <v-card class="blue-grey darken-1 dark">
                <v-card-text>Creator: {{users[topicMap.creatorId].firstname + ' ' + users[topicMap.creatorId].lastname}}</v-card-text>
              </v-card>         
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :to="'/' + libraryId + '/topicmaps/' + topicMap.id" class="info--text" flat>View Topic Map</v-btn>
              </v-card-actions>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-flex>
        <v-flex xs12 sm4 md4 lg4>
          <v-expansion-panel expand dark>
            <v-expansion-panel-content dark v-for="(topicMap, i) in publicTopicMaps" :key="topicMap.id" v-if="publicTopicMaps.length/3 <= i && i < publicTopicMaps.length/3 * 2">
              <div slot="header">{{topicMap.name|toUppercase}}</div>
              <v-card class="blue-grey darken-1 dark">
                <v-card-text>{{topicMap.description}}</v-card-text>
              </v-card>
              <v-card class="blue-grey darken-1 dark">
                <v-card-text>Creator: {{users[topicMap.creatorId].firstname + ' ' + users[topicMap.creatorId].lastname}}</v-card-text>
              </v-card>         
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :to="'/' + libraryId + '/topicmaps/' + topicMap.id" class="info--text" flat>View Topic Map</v-btn>
              </v-card-actions>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-flex>
        <v-flex xs12 sm4 md4 lg4>
          <v-expansion-panel expand dark>
            <v-expansion-panel-content dark v-for="(topicMap, i) in publicTopicMaps" :key="topicMap.id" v-if="publicTopicMaps.length/3*2 <= i">
              <div slot="header">{{topicMap.name|toUppercase}}</div>
              <v-card class="blue-grey darken-1 dark">
                <v-card-text>{{topicMap.description}}</v-card-text>
              </v-card>
              <v-card class="blue-grey darken-1 dark">
                <v-card-text>Creator: {{users[topicMap.creatorId].firstname + ' ' + users[topicMap.creatorId].lastname}}</v-card-text>
              </v-card>         
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :to="'/' + libraryId + '/topicmaps/' + topicMap.id" flat class="info--text">View Topic Map</v-btn>
              </v-card-actions>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-flex>
      </v-layout>
  </v-container>
</template>

<script>
import searchMixin from "../../mixins/search-mixin";
import { mapGetters, mapActions } from "vuex";

export default {
  props: ["libraryId"],
  data() {
    return {
      search: "",
      show: false,
      currentTransform: null,
      maxTextLenght: {
        first: 0,
        last: 0
      },
      showRootAction: false,
      showMenu: false,
      x: 0,
      y: 0,
      items: [
        { title: "Click Me" },
        { title: "Click Me" },
        { title: "Click Me" },
        { title: "Click Me 2" }
      ],
      title: "",
      topictype: "",
      nodedescription: "",
      nodeurl: "",
      fav: true,
      menu: false,
      message: false,
      hints: true
    };
  },
  computed: {
    ...mapGetters({ loadedLibrary: "libraries/library" }),
    ...mapGetters("users", ["users"]),
    publicTopicMaps() {
      var topicMaps = [];
      if (this.loadedLibrary) {
        for (var key in this.loadedLibrary.topicMaps) {
          if (this.loadedLibrary.topicMaps[key].mapType == "public") {
            topicMaps.push({ ...this.loadedLibrary.topicMaps[key], id: key });
          }
        }
      }
      return topicMaps;  
    }
  },
  filters: {
    toUppercase(value) {
      return value.toUpperCase();
    }
  },
  mixins: [searchMixin],
  methods: {
    ...mapActions("users", ["setCurLibId"]),
  },
  created() {
    this.setCurLibId(this.libraryId);
  }
};
</script>

<style scoped>
#public-title {
  cursor: pointer;
}
.application--light .card {
  background-color: inherit;
  color: white;
}
</style>

