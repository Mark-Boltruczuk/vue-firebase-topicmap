<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-text class="red lighten-1 dark">
            <span class="title white--text">Community Topic Maps: {{subjects[subjectId].name}}</span>
            <v-spacer></v-spacer>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-progress-circular :size="60" style="width: 100%; margin-top: 250px;" indeterminate color="blue" v-if="loading"></v-progress-circular>
    <div v-if="!loading">
      <v-layout row wrap>
        <v-flex xs12 sm4 md4 lg4>
          <v-card-title v-if="subjectTopicMaps.length === 0" class="white--text">
            There is no {{subjects[subjectId].name}} topic maps
          </v-card-title>
          <v-expansion-panel expand dark>
            <v-expansion-panel-content dark v-for="(topicMap, i) in subjectTopicMaps" :key="topicMap.id" v-if="i < subjectTopicMaps.length/3">
              <div slot="header">{{topicMap.name|toUppercase}}</div>
              <v-card class="blue-grey darken-1 dark">
                <v-card-text>{{topicMap.description}}</v-card-text>
              </v-card>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :to="'/' + topicMap.libraryId + '/topicmaps/' + topicMap.topicMapId" class="info--text" flat>View Topic Map</v-btn>
              </v-card-actions>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-flex>
        <v-flex xs12 sm4 md4 lg4>
          <v-expansion-panel expand dark>
            <v-expansion-panel-content dark v-for="(topicMap, i) in subjectTopicMaps" :key="topicMap.id" v-if="subjectTopicMaps.length/3 <= i && i < subjectTopicMaps.length/3 * 2">
              <div slot="header">{{topicMap.name|toUppercase}}</div>
              <v-card class="blue-grey darken-1 dark">
                <v-card-text>{{topicMap.description}}</v-card-text>
              </v-card>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :to="'/' + topicMap.libraryId + '/topicmaps/' + topicMap.topicMapId" class="info--text" flat>View Topic Map</v-btn>
              </v-card-actions>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-flex>
        <v-flex xs12 sm4 md4 lg4>
          <v-expansion-panel expand dark>
            <v-expansion-panel-content dark v-for="(topicMap, i) in subjectTopicMaps" :key="topicMap.id" v-if="subjectTopicMaps.length/3*2 <= i">
              <div slot="header">{{topicMap.name|toUppercase}}</div>
              <v-card class="blue-grey darken-1 dark">
                <v-card-text>{{topicMap.description}}</v-card-text>
              </v-card>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :to="'/' + topicMap.libraryId + '/topicmaps/' + topicMap.topicMapId" class="info--text" flat>View Topic Map</v-btn>
              </v-card-actions>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-flex>
        <v-flex xs12 sm4 md4 lg4>
          <v-expansion-panel expand dark>
            <v-expansion-panel-content dark v-for="(topicMap, i) in subjectTopicMaps" :key="topicMap.id" v-if="subjectTopicMaps.length/3*2 <= i">
              <div slot="header">{{topicMap.name|toUppercase}}</div>
              <v-card class="blue-grey darken-1 dark">
                <v-card-text>{{topicMap.description}}</v-card-text>
              </v-card>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :to="'/' + topicMap.libraryId + '/topicmaps/' + topicMap.topicMapId" class="info--text" flat>View Topic Map</v-btn>
              </v-card-actions>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-flex>
      </v-layout>
    </div>
  </v-container>
</template>

<script>
import searchMixin from "../../mixins/search-mixin";
import { mapGetters, mapActions } from "vuex";

export default {
  props: ["libraryId", "subjectId"],
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
      hints: true,
      subjects: [
        {
          name: "General Works"
        },
        {
          name: "Philosophy, Psychology, Religion"
        },
        {
          name: "Language & Literature"
        },
        {
          name: "Social Sciences"
        },
        {
          name: "Mathematics & Natural Sciences"
        },
        {
          name: "Applied Sciences & Technology"
        },
        {
          name: "Arts, Sports, Entertainment"
        },
        {
          name: "Medicine & Health"
        },
        {
          name: "History & Area Studies"
        }
      ]
    };
  },
  methods: {
    ...mapActions("libraries", ["loadLibraries"]),
    ...mapActions("users", ["setCurLibId"])
  },
  computed: {
    ...mapGetters("libraries", ["loading", "libraries", "library"]),
    ...mapGetters("users", ["users"]),
    subjectTopicMaps() {
      let topicMaps = [];
      for (let key in this.libraries) {
        if (this.library.category === this.libraries[key].category) {
          for (let id in this.libraries[key].topicMaps) {
            if (
              this.libraries[key].topicMaps[id].subject ===
                this.subjects[this.subjectId].name &&
              this.libraries[key].topicMaps[id].mapType === "public"
            ) {
              topicMaps.push({
                ...this.libraries[key].topicMaps[id],
                libraryId: key,
                topicMapId: id
              });
            }
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
  created: function() {
    this.setCurLibId(this.libraryId);
    this.loadLibraries();
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
