<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 mb-3 offset-sm3>
        <h2 v-if="topicMapId" class="primary--text">Edit Topic Map</h2>
        <h2 v-else class="primary--text">Create Topic Map</h2>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <v-form @submit.prevent="onCreateTopicmap" >
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name="title"
                label="Topic Map Title"
                placeholder="Work-related injuries"
                id="title"
                v-model="topicMap.name"
                required
                dark
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-textarea
                name="description"
                label="Descriptions"
                id="description"
                placeholder="How can work-related injuries be reduced, and who should be responsible for implementing reduction strategies?"
                v-model="topicMap.description"
                dark
                required
              ></v-textarea>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name="tags"
                label="Tags"
                placeholder="science biology physics"
                id="tags"
                dark
                v-model="tags"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-select
                label="Subjects"
                v-model="topicMap.subject"
                :items="subjects"
                class="input-group--focused"
                dark
                required
              ></v-select>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <span class="grey--text">Topic Map Type</span>
              <v-radio-group v-model="mapType" row>
                <v-radio
                  label="private"
                  color="red"
                  value="private"
                  dark
                ></v-radio>
                <v-radio
                  label="Public"
                  color="info"
                  value="public"
                  dark
                ></v-radio>
              </v-radio-group>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-btn
                class="primary"
                :disabled="!formIsValid"
                type="submit">Save Topicmap</v-btn>
              <v-btn
                class="primary"
                @click="cancel">Cancel</v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { VueTreeList, Tree, TreeNode } from "vue-tree-list";
import { mapGetters, mapActions } from "vuex";
import { uid } from "../../utils";

export default {
  props: ["libraryId", "topicMapId"],
  components: {
    "vue-tree-list": VueTreeList
  },
  data() {
    return {
      topicMap: {
        id: uid(),
        name: "",
        description: "",
        subject: "",
        tags: "",
        creatorID: "",
        mapType: "private"
      },
      tags: "",
      subjects: [
        "General Works",
        "Philosophy, Psychology, Religion",
        "Language & Literature",
        "Social Sciences",
        "Mathematics & Natural Sciences",
        "Applied Sciences & Technology",
        "Arts, Sports, Entertainment",
        "Medicine & Health",
        "History & Area Studies"
      ],
      mapType: "private",
      collaborators: [],
      newTree: {},
      nodes: new Tree([
        {
          name: "Right click to edit",
          id: uid(),
          isLeaf: false,
          children: [],
          type: "main"
        }
      ])
    };
  },
  computed: {
    ...mapGetters("users", ["user"]),
    ...mapGetters({ loadedLibrary: "libraries/library" }),
    ...mapGetters("libraries", ["creating", "updating"]),
    formIsValid() {
      return (
        this.topicMap.title !== "" &&
        this.topicMap.description !== "" &&
        this.topicMap.subject !== null
      );
    },
    loadedTopicMap() {
      return this.loadedLibrary.topicMaps[this.topicMapId];
    }
  },
  methods: {
    ...mapActions("users", ["setCurLibId"]),
    ...mapActions("libraries", ["createTopicMap", "updateTopicMap"]),
    cancel() {
      this.$router.go(-1);
    },
    onCreateTopicmap() {
      if (!this.formIsValid) {
        return;
      }
      let text = this.tags.trim().split(" ");
      if (text) {
        this.topicMap.tags = [];
        this.topicMap.tags.push(...text);
      }
      this.getNewTree();
      let topicmapData = {
        name: this.topicMap.name,
        description: this.topicMap.description,
        tags: this.topicMap.tags,
        subject: this.topicMap.subject,
        date: new Date(),
        type: "root",
        mapType: this.mapType,
        id: this.topicMap.id,
        uid: this.user.uid,
        libraryId: this.libraryId
      };
      if (!this.topicMapId) {
        topicmapData.children = this.newTree.children;
        this.createTopicMap(topicmapData);
      } else {
        topicmapData.topicMapId = this.topicMapId;
        this.updateTopicMap(topicmapData);
      }
    },
    getNewTree() {
      const vm = this;
      function _dfs(oldNode) {
        let newNode = {};

        newNode.name = oldNode.name;
        newNode.pid = oldNode.pid;
        newNode.isLeaf = oldNode.isLeaf;
        newNode.id = oldNode.id;

        if (oldNode.parent && oldNode.parent.name == "root") {
          newNode.type = "main";
        } else if (oldNode.parent && !oldNode.isLeaf) {
          newNode.type = "sub";
        } else {
          newNode.type = "file";
          newNode.url = "";
          newNode.fileType = "";
          newNode.description = "";
        }

        if (oldNode.children && oldNode.children.length > 0) {
          newNode.children = [];
          for (let i = 0, len = oldNode.children.length; i < len; i++) {
            newNode.children.push(_dfs(oldNode.children[i]));
          }
        }
        return newNode;
      }
      vm.newTree = _dfs(vm.nodes);
    }
  },
  watch: {
    creating: {
      handler: function(newVal, oldVal) {
        if (!newVal) {
          this.$router.push("/" + this.libraryId + "/topicmap/mapcontrol");
        }
      },
      deep: true
    },
    updating: {
      handler: function(newVal, oldVal) {
        if (!newVal) {
          this.$router.push("/" + this.libraryId + "/topicmap/mapcontrol");
        }
      },
      deep: true
    }
  },
  mounted: function() {
    this.setCurLibId(this.libraryId);
    if (this.topicMapId) {
      this.topicMap = Object.assign({}, this.loadedTopicMap);
      let tags = "";
      this.loadedTopicMap.tags.forEach(element => {
        tags += element + " ";
      });
      this.tags = tags;
      this.mapType = this.topicMap.mapType;
    }
  }
};
</script>

<style scoped>
</style>
