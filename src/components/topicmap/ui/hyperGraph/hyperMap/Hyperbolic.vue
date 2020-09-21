<template>
    <div class="normal">
      <div id="infovis" class="viewport treeclass"></div>
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
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { findObject } from "../../../utils";

export default {
  props: ["topicMap", "topicMapId", "libraryId"],
  data() {
    return {
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
      hints: true
    };
  },
  mounted() {
    var self = this;

    this.jitHypertree = new $jit.Hypertree({
      injectInto: "infovis",
      Node: {
        dim: 8,
        overridable: true
      },
      Edge: {
        lineWidth: 1,
        color: "#42a5f5"
      },

      onCreateLabel: function(domElement, node) {
        domElement.innerHTML = node.name;
        $jit.util.addEvent(domElement, "click", function() {
          self.jitHypertree.onClick(node.id, {
            onComplete: function() {
              self.jitHypertree.controller.onComplete();
            }
          });
        });

        $jit.util.addEvent(domElement, "contextmenu", function() {
          if (self.user.uid === self.libraryId || self.userIsTeamMember) {
            self.$emit("select-node-id", node.id);
            var selectedNode = self.getTopicNodeById(node.id);
            if (selectedNode.type == "root") {
              self.showModal("root");
            } else if (
              selectedNode.type == "sub" ||
              selectedNode.type == "main"
            ) {
              self.showModal("folder");
            } else {
              self.showModal("file");
            }
          }
        });

        $jit.util.addEvent(domElement, "mouseover", function(e) {
          var selectedNode = self.getTopicNodeById(node.id);
          if (
            selectedNode.type != "root" &&
            selectedNode.type != "sub" &&
            selectedNode.type != "main"
          ) {
            self.title = selectedNode.name;
            self.topictype = selectedNode.type;
            self.nodedescription = "";
            self.nodeurl = "";
            if (selectedNode.description) {
              self.nodedescription = selectedNode.description;
            }
            if (selectedNode.url) {
              self.nodeurl = selectedNode.url;
            }
            e.preventDefault();
            self.showMenu = false;
            self.x = e.clientX + 25;
            self.y = e.clientY + 10;
            self.$nextTick(() => {
              self.showMenu = true;
            });
          }
        });
      },
      onPlaceLabel: function(domElement, node) {
        var style = domElement.style;
        style.cursor = "pointer";
        if (node._depth <= 1) {
          style.fontSize = "0.8em";
          style.fontWeight = "400";
          style.color = "#ddd";
          style.display = "inline";
          style.width = "150px";
          style.textAlign = "center";
          style.whiteSpace = "unset";
        } else if (node._depth == 2) {
          style.display = "block";
          style.width = "90px";
          style.textAlign = "center";
          style.fontSize = "0.7em";
          style.color = "rgb(38, 50, 56)";
          style.textOverflow = "ellipsis";
          style.whiteSpace = "nowrap";
          style.overflow = "hidden";
        } else {
          style.display = "none";
        }
        var left = parseInt(style.left);
        var w = domElement.offsetWidth;
        style.left = left - w / 2 + "px";

        var selectedNode = self.getTopicNodeById(node.id);
        if (node._depth <= 2) {
          if (selectedNode.type == "PDF") {
            domElement.innerHTML =
              "<i class='fa fa-file-pdf fa-2x'></i>&nbsp;&nbsp;" +
              selectedNode.name;
          } else if (selectedNode.type == "Word") {
            domElement.innerHTML =
              "<i class='fa fa-file-word fa-2x'></i>&nbsp;&nbsp;" +
              selectedNode.name;
          } else if (selectedNode.type == "Image") {
            domElement.innerHTML =
              "<i class='fa fa-file-image fa-2x'></i>&nbsp;&nbsp;" +
              selectedNode.name;
          } else if (selectedNode.type == "Text") {
            domElement.innerHTML =
              "<i class='fa fa-file-alt fa-2x'></i>&nbsp;&nbsp;" +
              selectedNode.name;
          } else if (selectedNode.type == "Website") {
            domElement.innerHTML =
              "<i class='fa fa-globe fa-2x'></i>&nbsp;&nbsp;" +
              selectedNode.name;
          } else if (selectedNode.type == "PPT") {
            domElement.innerHTML =
              "<i class='fa fa-file-powerpoint fa-2x'></i>&nbsp;&nbsp;" +
              selectedNode.name;
          } else if (selectedNode.type == "Excel") {
            domElement.innerHTML =
              "<i class='fa fa-file-excel fa-2x'></i>&nbsp;&nbsp;" +
              selectedNode.name;
          } else if (selectedNode.type == "CSV") {
            domElement.innerHTML =
              "<i class='fa fa-file-code fa-2x'></i>&nbsp;&nbsp;" +
              selectedNode.name;
          }
        }
      }
    });
    this.jitHypertree.loadJSON(this.data);
    this.jitHypertree.refresh();
    $jit.Graph.Util.eachNode(this.jitHypertree.graph, function(node) {
      var selectedNode = self.getTopicNodeById(node.id);
      if (selectedNode.isLeaf) {
        node.setData("color", "#000");
      } else {
        if (node._depth == "0") {
          node.setData("color", "#d32f2f");
        } else if (node._depth == "1") {
          node.setData("color", "#ffcb2c");
        } else {
          node.setData("color", "#4f3");
        }
      }
    });
    this.jitHypertree.refresh();
  },
  methods: {
    ...mapActions("topicMaps", ["showModal"]),
    navigate() {
      this.showMenu = false;
      window.open(this.nodeurl);
    },
    refresh() {
      this.jitHypertree.refresh();
    },
    getTopicNodeById(id) {
      var node;
      findObject(this.data, id, function(d) {
        node = d;
      });
      return node;
    }
  },
  computed: {
    ...mapGetters("libraries", ["repaint", "library"]),
    ...mapGetters("users", ["user", "users", "isUserSignedIn"]),
    data() {
      return this.topicMap;
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
  watch: {
    // whenever question changes, this function will run
    repaint: {
      handler: function(newVal, oldVal) {
        this.jitHypertree.loadJSON(this.data);
        var self = this;
        this.jitHypertree.refresh();
        $jit.Graph.Util.eachNode(this.jitHypertree.graph, function(node) {
          var selectedNode = self.getTopicNodeById(node.id);
          if (selectedNode.isLeaf) {
            node.setData("color", "#000");
          } else {
            if (node._depth == "0") {
              node.setData("color", "#d32f2f");
            } else if (node._depth == "1") {
              node.setData("color", "#ffcb2c");
            } else {
              node.setData("color", "#4f3");
            }
          }
        });
        this.jitHypertree.refresh();
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
.viewport.treeclass {
  background: blue-grey darken;
}
svg text {
  font-family: FontAwesome;
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
