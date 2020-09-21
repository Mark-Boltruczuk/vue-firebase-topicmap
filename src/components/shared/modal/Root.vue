<template>
  <v-dialog v-model="modalShow" persistent width="400px">
    <v-card>
      <v-toolbar class="cyan" dark>
        <v-toolbar-side-icon></v-toolbar-side-icon>
        <v-toolbar-title>Add Main Folder</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm12 md12>
              <v-text-field label="Main folder name" required v-model="topic.name"></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click.native="cancel">Close</v-btn>
        <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  props: ["topicMapId", "childId", "libraryId"],
  data() {
    return {
      topic: {
        name: ""
      }
    };
  },
  computed: {
    ...mapGetters("topicMaps", ["root"]),
    modalShow: {
      get: function() {
        return this.root;
      },
      set: function(newVal) {
        this.showModal("root");
      }
    }
  },
  methods: {
    ...mapActions("topicMaps", ["showModal"]),
    ...mapActions("libraries", ["createTopic"]),
    getPayload: function(type, action) {
      return {
        libraryId: this.libraryId,
        topicMapId: this.topicMapId,
        childId: this.childId,
        topic: this.topic,
        type: type
      };
    },
    cancel: function() {
      this.initTopic();
    },
    save: function(e) {
      this.createTopic(this.getPayload("main"));
      this.initTopic();
    },
    initTopic: function() {
      this.modalShow = false;
      this.topic.name = null;
    }
  }
};
</script>
<style>
.input-group__input > input {
  text-align: left;
}
</style>
