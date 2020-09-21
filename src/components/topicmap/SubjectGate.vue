<template>
  <v-container grid-list-md>
   <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-text class="red lighten-1 dark">
            <span class="title white--text">Community Maps By Subjects</span>
            <v-spacer></v-spacer>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout> 
    <v-layout row wrap>
      <v-flex xs12 sm4
        v-for="(subject, index) in subjects"
        :key=subject.name
      >
        <v-card class="blue-grey darken-1 dark" height="200px">
          <v-card-title
            class="orange--text blue-grey darken-2 dark"
          >{{subject.name | toUppercase}}</v-card-title>
          <v-card-text 
            class="white--text"
            style="min-height: 90px;cursor: pointer;"
            @click="onNavigate(index)"
          >
            {{subject.subcategories}}
          </v-card-text>
        </v-card>
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
      subjects: [
        {
          name: "General Works",
          subcategories: [
            "Encyclopedia",
            "Yearbooks",
            "Almanacs",
            "Directories"
          ]
        },
        {
          name: "Philosophy, Psychology, Religion",
          subcategories: [
            "Metaphysics",
            "Ethics",
            "Logic",
            "Epistemology",
            "Mental Physiology",
            "Comparative Psychology",
            "Abnormal Psychology",
            "Religion"
          ]
        },
        {
          name: "Language & Literature",
          subcategories: ["Language", "Linguistics", "Literature"]
        },
        {
          name: "Social Sciences",
          subcategories: [
            "Statistics",
            "Politics",
            "Economics",
            "Law",
            "Education",
            "Demograph",
            "Sociology"
          ]
        },
        {
          name: "Mathematics & Natural Sciences",
          subcategories: [
            "Mathematics",
            "Astronomy",
            "Astrophysics",
            "Physics",
            "Chemistry",
            "Earth Sciences",
            "Biology",
            "Botany",
            "Zoology",
            "Geology"
          ]
        },
        {
          name: "Applied Sciences & Technology",
          subcategories: [
            "Biotechnology",
            "Chemical Technology",
            "Engineering",
            "Business Management",
            "Accountancy",
            "Patents",
            "Information Technology",
            "Computer Science"
          ]
        },
        {
          name: "Arts, Sports, Entertainment",
          subcategories: [
            "Architecture",
            "Drawings",
            "Paintings",
            "Graphic Arts",
            "Photography",
            "Music",
            "performing Arts",
            "Sports",
            "Entertainment",
            "Game"
          ]
        },
        {
          name: "Medicine & Health",
          subcategories: [
            "Anatomy",
            "Public Health",
            "Phamacology",
            "Pathology",
            "Orthopaedics",
            "Gynaecology"
          ]
        },
        {
          name: "History & Area Studies",
          subcategories: [
            "History",
            "Archaeology",
            "Prehistory",
            "Area Studies",
            "Regional Geography"
          ]
        }
      ]
    };
  },
  computed: {
    ...mapGetters("libraries", ["loading", "libraries"]),
    topicMaps() {
      let topicMaps = {};
      for (let key in this.libraries) {
        for (let id in this.libraries[key].topicMaps) {
          topicMaps[id] = {
            topicMap: this.libraries[key].topicMaps[id],
            libraryId: key,
            topicMapId: id
          };
        }
      }
      return topicMaps;
    }
  },
  methods: {
    ...mapActions("libraries", ["loadLibraries"]),
    ...mapActions("users", ["setCurLibId"]),
    onNavigate(id) {
      this.$router.push("/" + this.libraryId + "/subjectmap/" + id);
    }
  },
  filters: {
    toUppercase(value) {
      return value.toUpperCase();
    }
  },
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
</style>
