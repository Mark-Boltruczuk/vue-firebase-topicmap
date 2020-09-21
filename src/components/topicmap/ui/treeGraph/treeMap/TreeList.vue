<template>
  <div>
    <v-menu offset-y v-model="showMenu" absolute :position-x="x" :position-y="y" :close-on-content-click="false" dark min-width="350px" max-width="350px">
      <v-card>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">{{title}}</h3>
            <div class="mt-1 mb-0" style="color: gray; font-size: 15px;">{{topictype}} file</div>
            <div>{{nodedescription}}</div>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="orange" @click="navigate">Explore</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12 sm6>
          <v-text-field
          single-line
          label="Search"
          prepend-icon="search"
          @keyup="inputKeyUp"
          v-model="searchText"
        ></v-text-field>    
        </v-flex>
        <v-flex lg12>
          <v-jstree :data="data" 
            :item-events="itemEvents"
            :text-field-name="textFieldName" 
            multiple 
            allow-batch
            whole-row
            draggable
            @item-drop="itemDrop"
            ref="tree"
            ></v-jstree>
          </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { VueTreeList, Tree, TreeNode } from "vue-tree-list";
import VJstree from "vue-jstree";
import { mapActions, mapGetters } from "vuex";
import { findObject } from "../../../utils";
import { ADD, EDIT, REMOVE } from "../../../../home/store/types";

export default {
  components: {
    "vue-tree-list": VueTreeList,
    "v-jstree": VJstree
  },
  props: ["topicMap", "topicMapId", "libraryId"],
  data() {
    return {
      searchText: "",
      textFieldName: "name",
      showRootAction: false,
      jitHypertree: {},
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
      itemEvents: {},
      editingNode: {},
      editingItem: {},
      data: null
    };
  },
  mounted() {},
  methods: {
    ...mapActions("topicMaps", ["showModal"]),
    ...mapActions("libraries", ["dragAndDropTopicMap"]),
    navigate() {
      this.showMenu = false;
      window.open(this.nodeurl);
    },
    getTopicNodeById(id) {
      var node;
      findObject(this.data, id, function(d) {
        node = d;
      });
      return node;
    },
    itemDrop(node, item) {
      let topicMap = JSON.parse(JSON.stringify(this.data[0]));
      this.dragAndDropTopicMap({
        libraryId: this.libraryId,
        topicMapId: this.topicMapId,
        topicMap: topicMap
      });
    },
    inputKeyUp: function() {
      var text = this.searchText.toLowerCase();
      const patt = new RegExp(text);
      this.$refs.tree.handleRecursionNodeChilds(this.$refs.tree, function(
        node
      ) {
        if (text !== "" && node.model !== undefined) {
          node.model.closeChildren();
          const str = node.model.name.toLowerCase();
          if (patt.test(str)) {
            var parent = [];
            var _node = node.$parent;
            var i = -1;
            while (_node.model && i < 10) {
              if (!_node.$parent.model) break;
              _node = _node.$parent;
              parent.push(_node);
              i++;
            }

            while (_node.model) {
              _node.model.openChildren();
              var index = _node.$children.indexOf(parent[i]);
              if (index == -1) break;
              _node = _node.$children[index];
              i--;
            }
            node.$el.querySelector(".tree-anchor").style.color = "#fff";
            node.$el.querySelector(".tree-anchor").style.backgroundColor =
              "#04DDFB";
          } else {
            node.$el.querySelector(".tree-anchor").style.color = "#fff";
            node.$el.querySelector(".tree-anchor").style.backgroundColor =
              "transparent";
          } // or other operations
        } else {
          node.$el.querySelector(".tree-anchor").style.color = "#fff";
          node.$el.querySelector(".tree-anchor").style.backgroundColor =
            "transparent";
        }
      });
    }
  },
  computed: {
    ...mapGetters("libraries", ["repaint", "library", "createdTopicmap"]),
    ...mapGetters("users", ["user", "users", "isUserSignedIn"]),
    // data() {
    //   var data = [Object.assign({}, this.topicMap)];
    //   return data;
    // },
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
  beforeMount() {
    let self = this;
    var contextmenu = function() {
      arguments[2].preventDefault();
      self.editingNode = arguments[0];
      self.editingItem = arguments[1];
      self.$emit("select-node-id", self.editingItem.id);
      if (self.editingItem.type == "root") {
        self.showModal("root");
      } else if (
        self.editingItem.type == "sub" ||
        self.editingItem.type == "main"
      ) {
        self.showModal("folder");
      } else {
        self.showModal("file");
      }
    };
    var mouseover = function() {
      var e = arguments[2];
      var editingItem = arguments[1];

      if (
        editingItem.type != "root" &&
        editingItem.type != "sub" &&
        editingItem.type != "main"
      ) {
        self.title = editingItem.name;
        self.topictype = editingItem.type;
        self.nodedescription = "";
        self.nodeurl = "";
        if (editingItem.description) {
          self.nodedescription = editingItem.description;
        }
        if (editingItem.url) {
          self.nodeurl = editingItem.url;
        }
        e.preventDefault();
        self.showMenu = false;
        self.x = e.clientX + 25;
        self.y = e.clientY + 10;
        self.$nextTick(() => {
          self.showMenu = true;
        });
      }
    };
    this.itemEvents["contextmenu"] = contextmenu;
    this.itemEvents["mouseover"] = mouseover;
    this.data = [];
    let data = JSON.parse(JSON.stringify(this.topicMap));
    this.data.push(data);
  },
  watch: {
    // whenever question changes, this function will run
    createdTopicmap: {
      handler: function(newVal, oldVal) {
        if (newVal.action == ADD) {
          if (this.editingItem.id !== undefined) {
            this.editingItem.addChild({
              id: newVal.id,
              isLeaf: newVal.isLeaf,
              description: newVal.description,
              name: newVal.name,
              type: newVal.type,
              url: newVal.url
            });
          }
        } else if (newVal.action == EDIT) {
          this.editingItem.name = newVal.name;
          if (newVal.description)
            this.editingItem.description = newVal.description;
          if (newVal.url) this.editingItem.url = newVal.url;
          if (newVal.type) this.editingItem.type = newVal.type;
        } else if (newVal.action == REMOVE) {
          var index = this.editingNode.parentItem.indexOf(this.editingItem);
          this.editingNode.parentItem.splice(index, 1);
        }
      },
      deep: true
    }
  }
};
</script>

<style>
.treeclass .nodetree circle {
  cursor: pointer;
  fill: black;
  r: 6;
}
.treeclass .node--root circle {
  cursor: pointer;
  fill: firebrick;
  r: 6;
}
.treeclass .node--mainFolder circle {
  cursor: pointer;
  fill: orangered;
  r: 6;
}
.treeclass .node--subFolder circle {
  cursor: pointer;
  fill: green;
  r: 6;
}
.treeclass .nodetree text {
  font: 14px sans-serif;
  cursor: pointer;
}
.treeclass .nodetree.selected text {
  font-weight: bold;
}
.treeclass .linktree {
  fill: none;
  stroke: white;
  stroke-opacity: 1;
  stroke-width: 1.5px;
}
.tree-icon.fa {
  color: aqua;
}
.viewport.treeclass {
  background: blue-grey darken;
}
.normal #infovis {
  height: 500px;
}
.normal #infovis-canvaswidget {
  background-color: #455a64;
}
</style>
<style>
.dialog__content {
  z-index: 1000;
}
</style>
