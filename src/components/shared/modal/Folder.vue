<template>
  <div>
    <v-layout row justify-center>
      <v-dialog v-model="showEditFolderModal" persistent width="500px">
        <v-card>
          <v-toolbar class="orange" dark>
            <v-toolbar-side-icon></v-toolbar-side-icon>
            <v-toolbar-title>Edit Folder Name</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-text-field label="Current folder name" required v-model="topic.name"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="cancelEdit">Close</v-btn>
            <v-btn color="blue darken-1" flat @click.native="saveEdit">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="showRemoveFolderModal" persistent width="500px">
        <v-card>
          <v-toolbar class="red" dark>
            <v-toolbar-side-icon></v-toolbar-side-icon>
            <v-toolbar-title>Are you sure?</v-toolbar-title>
          </v-toolbar>
           <v-card-text>
            <span class="red--text"> All linked folders and data will be deleted</span>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.stop="cancelRemove">Cancel</v-btn>
            <v-btn color="primary" flat @click.stop="removeFolder">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="showAddFolderModal" persistent width="500px">
        <v-card>
          <v-toolbar class="orange" dark>
            <v-toolbar-side-icon></v-toolbar-side-icon>
            <v-toolbar-title>Add Sub folder</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-text-field label="Sub folder name" required v-model="topic.name"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.stop="cancelSubFolder">Close</v-btn>
            <v-btn color="primary" flat @click.stop="saveSubFolder">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="showAddFileModal" persistent width="500px">
        <v-card>
          <v-toolbar class="orange" dark>
            <v-toolbar-side-icon></v-toolbar-side-icon>
            <v-toolbar-title>Add File</v-toolbar-title>
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
            <v-btn color="primary" flat @click.stop="cancelFile">Close</v-btn>
            <v-btn color="primary" flat @click.stop="saveFile">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-layout row justify-center>
      <v-dialog v-model="modalShow" persistent width="500px">
        <v-card>
          <v-toolbar class="cyan" dark>
            <v-toolbar-side-icon></v-toolbar-side-icon>
            <v-toolbar-title>Folder Actions</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-btn color="primary" dark @click.stop="clickSubFolderBtn">Add Sub folder</v-btn>
          </v-card-text>
          <v-card-text>
            <v-btn color="primary" dark @click.stop="clickEditBtn">Edit</v-btn>
            <v-btn color="primary" dark @click.stop="clickAddFileBtn">Add file</v-btn>
            <v-btn color="primary" dark @click.stop="clickRemoveBtn">Delete</v-btn>
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
      showAddFolderModal: false,
      showEditFolderModal: false,
      showRemoveFolderModal: false,
      showAddFileModal: false,
      topic: {
        name: null,
        type: null,
        description: null,
        url: null
      }
    };
  },
  computed: {
    ...mapGetters("topicMaps", ["folder"]),
    ...mapGetters("libraries", ["library"]),
    modalShow: {
      get: function() {
        return this.folder;
      },
      set: function(newVal) {
        this.showModal("folder");
      }
    }
  },
  methods: {
    ...mapActions("topicMaps", ["showModal"]),
    ...mapActions("libraries", ["createTopic", "deleteTopic", "updateTopic"]),
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
    getPayload: function(type) {
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
      this.showEditFolderModal = false;
    },
    saveEdit: function() {
      this.showEditFolderModal = false;
      this.updateTopic(this.getPayload("sub"));
      this.initTopic();
    },
    cancelFile: function() {
      this.showAddFileModal = false;
      this.initTopic();
    },
    saveFile: function() {
      this.showAddFileModal = false;
      this.createTopic(this.getPayload("file"));
      this.initTopic();
    },
    cancelSubFolder: function() {
      this.showAddFolderModal = false;
      this.initTopic();
    },
    saveSubFolder: function() {
      this.showAddFolderModal = false;
      this.createTopic(this.getPayload("sub"));
      this.initTopic();
    },
    cancelRemove: function() {
      this.showRemoveFolderModal = false;
    },
    removeFolder: function() {
      this.showRemoveFolderModal = false;
      this.deleteTopic(this.getPayload());
    },
    clickEditBtn: function() {
      this.showEditFolderModal = true;
      this.modalShow = false;
      this.topic.name = this.getTopicNodeById(this.childId).name;
      this.topic.type = this.getTopicNodeById(this.childId).type;
    },
    clickAddFileBtn: function() {
      this.modalShow = false;
      this.showAddFileModal = true;
    },
    clickSubFolderBtn: function() {
      this.modalShow = false;
      this.showAddFolderModal = true;
    },
    clickRemoveBtn: function() {
      this.modalShow = false;
      this.showRemoveFolderModal = true;
    }
  }
};
</script>
