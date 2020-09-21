<template>
  <div>
    <v-layout row justify-center>
      <v-dialog v-model="showDeleteFileModal" persistent width="500px">
        <v-card>
          <v-toolbar class="red" color="indigo" dark>
            <v-toolbar-side-icon></v-toolbar-side-icon>
            <v-toolbar-title>Alert</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <h3 class="headline mb-0">Are you sure want to delete this file?</h3>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.stop="showDeleteFileModal=false">Cancel</v-btn>
            <v-btn color="primary" flat @click.stop="deleteFile">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="showEditFileModal" persistent width="500px">
        <v-card>
          <v-toolbar class="orange" dark>
            <v-toolbar-side-icon></v-toolbar-side-icon>
            <v-toolbar-title>File Information</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-text-field label="File name" required v-model="topic.name"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field label="URL" required v-model="topic.url"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-textarea name="input-7-2" label="Description" v-model="topic.description" class="input-group--focused"></v-textarea>
                </v-flex>
                <v-flex xs6 sm6 md6>
                  <v-radio-group v-model="topic.type" :column="true" xs6 sm6 md6>
                    <v-radio label="PDF" color="red" value="PDF"></v-radio>
                    <v-radio label="Text" color="red darken-3" value="Text"></v-radio>
                    <v-radio label="Image" color="orange" value="Image"></v-radio>
                    <v-radio label="Word" color="orange darken-3" value="Word"></v-radio>
                  </v-radio-group>
                </v-flex>
                <v-flex xs6 sm6 md6>
                  <v-radio-group v-model="topic.type" :column="true" xs6 sm6 md6>
                    <v-radio label="Website" color="indigo darken-3" value="Website"></v-radio>
                    <v-radio label="PPT" color="indigo darken-3" value="PPT"></v-radio>
                    <v-radio label="Excel" color="indigo darken-3" value="Excel"></v-radio>
                    <v-radio label="CSV" color="indigo darken-3" value="CSV"></v-radio>
                  </v-radio-group>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.stop="cancelEdit">Close</v-btn>
            <v-btn color="primary" flat @click.stop="saveEdit">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-layout row justify-center>
      <v-dialog v-model="modalShow" persistent max-width="500px">
        <v-card>
          <v-toolbar class="cyan" dark>
            <v-toolbar-side-icon></v-toolbar-side-icon>
            <v-toolbar-title>Edit File</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-btn color="primary" dark @click.stop="clickEditBtn">Edit</v-btn>
            <v-btn color="primary" dark @click.stop="clickDeleteBtn">Delete</v-btn>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="cancel">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { findObject } from "../../../utils";

export default {
  props: ["topicMapId", "childId", "libraryId"],
  data() {
    return {
      showEditFileModal: false,
      showDeleteFileModal: false,
      topic: {
        name: null,
        url: null,
        description: null,
        type: null
      }
    };
  },
  computed: {
    ...mapGetters("topicMaps", ["file"]),
    ...mapGetters("libraries", ["library"]),
    modalShow: {
      get: function() {
        return this.file;
      },
      set: function(newVal) {
        this.showModal("file");
      }
    }
  },
  methods: {
    ...mapActions("topicMaps", ["showModal"]),
    ...mapActions("libraries", ["deleteTopic", "updateTopic"]),
    getTopicNodeById(id) {
      var node;
      findObject(this.library.topicMaps[this.topicMapId], id, function(d) {
        node = d;
      });
      return node;
    },
    initTopic: function() {
      this.topic.name = this.topic.url = this.topic.description = this.topic.type = null;
    },
    getPayload: function(type = null) {
      return {
        libraryId: this.libraryId,
        topicMapId: this.topicMapId,
        childId: this.childId,
        topic: this.topic,
        type: type
      };
    },
    cancel: function() {
      this.modalShow = false;
    },
    save: function(e) {
      this.modalShow = false;
    },
    cancelEdit: function() {
      this.showEditFileModal = false;
      this.initTopic();
    },
    saveEdit: function() {
      this.showEditFileModal = false;
      this.updateTopic(this.getPayload("file"));
      this.initTopic();
    },
    deleteFile: function() {
      this.deleteTopic(this.getPayload());
      this.showDeleteFileModal = false;
    },
    clickEditBtn: function() {
      this.modalShow = false;
      this.showEditFileModal = true;
      this.topic = Object.assign({}, this.getTopicNodeById(this.childId));
    },
    clickDeleteBtn: function() {
      this.modalShow = false;
      this.showDeleteFileModal = true;
    }
  }
};
</script>
