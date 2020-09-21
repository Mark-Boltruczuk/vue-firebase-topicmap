<template>
	<div id="chart"></div>
</template>
<script>
import * as d3 from "d3";
import { mapActions, mapGetters } from "vuex";
import { findObject } from "../../../utils";

export default {
  props: {
    topicMap: Object,
    libraryId: String
  },
  data() {
    return {
      showMenu: false,
      title: "",
      topictype: "",
      nodedescription: "",
      nodeurl: "",
      x: 0,
      y: 0
    };
  },
  watch: {
    // whenever question changes, this function will run
    repaint: {
      handler: function(newVal, oldVal) {
        console.log('circle handler');
        d3.select("svg").remove();
        const size = this.getSize();
        const svg = d3
          .select(this.$el)
          .append("svg")
          .attr("width", size.width)
          .attr("height", size.height)
          .append("g")
          .attr(
            "transform",
            "translate(" + size.width / 2 + "," + size.height / 2 + ")"
          );
        var diameter = Math.min(size.width * 0.9, size.height * 0.9);

        this.internalData = {
          svg,
          diameter
        };
        this.drawZoomableCircles(this.topicMap);
      },
      deep: true
    }
  },
  mounted() {
    const size = this.getSize();
    const svg = d3
      .select(this.$el)
      .append("svg")
      .attr("width", size.width)
      .attr("height", size.height)
      .append("g")
      .attr(
        "transform",
        "translate(" + size.width / 2 + "," + size.height / 2 + ")"
      );
    var diameter = Math.min(size.width * 0.9, size.height * 0.9);

    this.internalData = {
      svg,
      diameter
    };

    this.drawZoomableCircles(this.topicMap);
  },
  computed: {
    ...mapGetters("libraries", ["repaint", "library"]),
    ...mapGetters("users", ["user", "users", "isUserSignedIn"]),
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
  methods: {
    ...mapActions("topicMaps", ["showModal"]),
    getTopicNodeById(id) {
      var node;
      findObject(this.topicMap, id, function(d) {
        node = d;
      });
      return node;
    },
    getSize() {
      var width = this.$el.clientWidth;
      var height = this.$el.clientHeight;
      return { width, height };
    },
    navigate() {
      this.showMenu = false;
      window.open(this.nodeurl);
    },
    onNodeRightClick(node) {
      d3.event.preventDefault();
      if (this.user.uid === this.libraryId || this.userIsTeamMember) {
        this.$emit("select-node-id", node.data.id);
        // var selectedNode = this.getTopicNodeById(node.id);
        if (node.data.type == "root") {
          this.showModal("root");
        } else if (node.data.type == "sub" || node.data.type == "main") {
          this.showModal("folder");
        } else {
          this.showModal("file");
        }
      }
    },
    drawZoomableCircles(data) {
      var margin = 15;
      var me = this;
      var allOccupations = [];
      var overlapNode = [];

      /////////////////////
      ////////////////////
      // You can change color here, the cicle colors are related to the circle depth so
      // 3th children color is #b9b9b9, 2th children color is #a6a6a6
      // and the last children color is always #ffffff(white)
      var color = d3
        .scaleOrdinal()
        .domain([0, 1, 2, 3])
        .range([
          "#b9b9b9",
          "#828282",
          "#a6a6a6",
          "#1c1c1c"
        ]);

      var pack = d3
        .pack()
        .size([
          this.internalData.diameter - margin,
          this.internalData.diameter - margin
        ])
        .padding(20);

      var root = d3
        .hierarchy(data)
        .sum(function(d) {
          return 5;
        })
        .sort(function(a, b) {
          return b.value - a.value;
        });

      var focus = root,
        nodes = pack(root).descendants(),
        view;
      var plotWrapper = this.internalData.svg
        .selectAll("g")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "plotWrapper")
        .attr("id", function(d, i) {
          allOccupations[i] = d.data.name;
          if (d.id != undefined) return "plotWrapper_" + d.id;
          else return "plotWrapper_node";
        });

      var circle = plotWrapper
        .append("circle")
        .attr("class", function(d) {
          return "node node--" + d.data.type;
        })
        .style("fill", function(d) {
          if (
            d.data.type === "root" ||
            d.data.type === "main" ||
            d.data.type === "sub"
          )
            return color(d.depth);
          return null;
        })
        .on("click", function(d) {
          if (focus !== d) zoom(d), d3.event.stopPropagation();
        })
        .on("contextmenu", me.onNodeRightClick);
      //Create a wrapper for everything inside a leaf circle
      var barWrapperOuter = plotWrapper
        .append("g")
        .attr("id", function(d) {
          if (d.id != undefined) return d.id;
          else return "node";
        })
        .style("opacity", 0)
        .attr("class", "barWrapperOuter");

      d3.selectAll(".barWrapperOuter").each(function(d, i) {
        if (
          d.data.type !== "root" &&
          d.data.type !== "main" &&
          d.data.type !== "sub"
        ) {
          //Save current circle data in separate variable
          var current = d,
            currentId = this.id;

          d3
            .select(this)
            .append("text")
            .attr("class", "innerCircleTitle")
            .attr("y", function(d, i) {
              d.titleHeight = (-1 + 0.75) * current.r;
              return d.titleHeight;
            })
            .attr("dy", "0em")
            .style("font-size", function(d) {
              //Calculate best font-size
              d.fontTitleSize = current.r / 7; //this.getComputedTextLength() * 20;
              return Math.round(d.fontTitleSize) + "px";
            });
          d3
            .select(this)
            .append("text")
            .attr("class", "innerCircleFileType")
            .attr("y", function(d, i) {
              d.typeHeight = (-1 + 0.675) * current.r;
              return d.typeHeight;
            })
            .attr("fill", "#455a64")
            .attr("dy", "0em")
            .text(function(d, i) {
              return "File Type: " + d.data.type;
            })
            .style("font-size", function(d) {
              //Calculate best font-size
              d.fontTypeSize = current.r / 7; //this.getComputedTextLength() * 20;
              return Math.round(d.fontTypeSize) + "px";
            })
            .style("font-weight", "bold")
            .each(function(d) {
              d.typeTextLength = current.r * 2 * 0.7;
              me.wrap(this, d.typeTextLength);
            });

          // d3
          //   .select(this)
          //   .append("text")
          //   .attr("class", "innerCircleDescription")
          //   .attr("y", function(d, i) {
          //     d.descriptionHeight = (-1 + 0.675) * current.r;
          //     return d.descriptionHeight;
          //   })
          //   .attr("dy", "0em")
          //   .text(function(d, i) {
          //     return d.data.url;
          //   })
          //   .style("font-size", function(d) {
          //     //Calculate best font-size
          //     d.fontDescriptionSize = current.r / 5; //this.getComputedTextLength() * 20;
          //     return Math.round(d.fontDescriptionSize) + "px";
          //   })
          //   .style("pointer-events", function(d) {
          //     return "auto";
          //   })
          //   .style("cursor", "pointer")
          //   .each(function(d) {
          //     d.descTextLength = current.r * 2 * 0.7;
          //     me.wrap(this, d.descTextLength);
          //   })
          //   .on("click", function(d) {
          //     window.open(d.data.url, "_blank");
          //   });
        }
      });

      // Create a wrapper for the arcs and text
      var hiddenArcWrapper = this.internalData.svg
        .append("g")
        .attr("class", "hiddenArcWrapper")
        .style("opacity", 1);
      // Create the arcs on which the text can be plotted - will be hidden
      var hiddenArcs = hiddenArcWrapper
        .selectAll(".circleArcHidden")
        .data(nodes)
        .enter()
        .append("path")
        .attr("class", "circleArcHidden")
        .attr("id", function(d, i) {
          return "circleArc_" + i;
        })
        .attr("d", function(d, i) {
          return (
            "M" + -d.r + " 0 A " + d.r + " " + d.r + " 0 0 1 " + d.r + " 0"
          );
        })
        .style("fill", "none");
      // Append the text to the arcs
      var arcText = hiddenArcWrapper
        .selectAll(".circleText")
        .data(nodes)
        .enter()
        .append("text")
        .attr("class", "circleText")
        .style("font-size", function(d) {
          d.fontSize = d.r / 6;
          return Math.round(d.fontSize) + "px";
        })
        .append("textPath")
        .attr("startOffset", "50%")
        .attr("xlink:href", function(d, i) {
          return "#circleArc_" + i;
        })
        .text(function(d) {
          return d.data.name;
        });

      //Create a wrapper for everything inside of a leaf circle
      // var barWrapperOuter =
      var node = this.internalData.svg.selectAll("circle");

      this.internalData.svg
        .style("background", color(0))
        .on("click", function() {
          zoom(root);
        });

      zoomTo([root.x, root.y, root.r * 2 + margin]);
      d3.selectAll("text").each(function(d) {
        d.showed = -1;
      });
      function zoom(d) {
        var focus0 = focus;
        focus = d;

        var transition = d3
          .transition()
          .duration(d3.event.altKey ? 7500 : 1500)
          .tween("zoom", function(d) {
            var i = d3.interpolateZoom(view, [
              focus.x,
              focus.y,
              focus.r * 2,
              focus.data.name + margin
            ]);
            return function(t) {
              zoomTo(i(t));
            };
          });

        transition
          .selectAll("text")
          .on("start", function(d) {
            this.style.fillOpacity = 0;
            if (d !== focus) {
              d.showed = -d.showed;
            }
          })
          .on("end", function(d) {
            if (d === focus || d.parent === focus) this.style.fillOpacity = 1;
            else if (d.showed === -1) this.style.fillOpacity = 1;
            // this.style.fillOpacity = 1;
          });
      }

      function zoomTo(v) {
        var k = me.internalData.diameter / v[2];
        view = v;
        node.attr("transform", function(d) {
          return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
        });
        circle.attr("r", function(d) {
          return d.r * k;
        });

        barWrapperOuter.attr("transform", function(d) {
          return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
        });
        d3
          .selectAll(".hiddenArcWrapper")
          .selectAll(".circleArcHidden")
          .attr("d", function(d, i) {
            return (
              "M " +
              -d.r * k +
              " 0 A " +
              d.r * k +
              " " +
              d.r * k +
              " 45 0 1 " +
              d.r * k +
              " 0"
            );
          })
          .attr("transform", function(d, i) {
            return (
              "translate(" +
              (d.x - v[0]) * k +
              "," +
              (d.y - v[1]) * k +
              ")rotate(0)"
            );
          });

        //Update the font sizes and hide those not close the the parent
        d3
          .selectAll(".hiddenArcWrapper")
          .selectAll(".circleText")
          .style("font-size", function(d) {
            return Math.round(d.fontSize * k) + "px";
          })
          .style("opacity", function(d) {
            // return d.fontSize * k / 10 < 3 ? 0 : 1;
          });

        d3
          .selectAll(".hiddenArcWrapper")
          .selectAll(".circleText")
          .filter(function(d) {
            if (
              d.data.type !== "root" &&
              d.data.type !== "main" &&
              d.data.type !== "sub"
            ) {
              return true;
            }
            return false;
          })
          .on("click", function(d) {
            window.open(d.data.url, "_blank");
          });
        // The title inside the circles
        d3
          .selectAll(".innerCircleTitle")
          .style("display", null)
          .text(function(d, i) {
            return d.data.description;
          })
          .attr("y", function(d) {
            return d.titleHeight * k;
          })
          .style("font-size", function(d) {
            return Math.round(d.fontTitleSize * k) + "px";
          })
          .each(function(d) {
            d.titleTextLength = d.r * 2 * 0.7 * k;
            me.wrap(this, d.titleTextLength);
          });

        // d3
        //   .selectAll(".innerCircleDescription")
        //   .style("display", null)
        //   .attr("y", function(d) {
        //     return d.descriptionHeight * k * 1.5;
        //   })
        //   .attr("fill", "blue")
        //   .style("font-size", function(d) {
        //     return Math.round(d.fontDescriptionSize * k) + "px";
        //   })
        //   .each(function(d) {
        //     d.titleTextLength = d.r * 2 * 0.7 * k;
        //     me.wrap(this, d.titleTextLength);
        //   });

        d3
          .selectAll(".innerCircleFileType")
          .style("display", null)
          .attr("y", function(d) {
            return d.typeHeight * k * 1.5;
          })
          .style("font-size", function(d) {
            return Math.round(d.fontTypeSize * k) + "px";
          })
          .each(function(d) {
            d.titleTextLength = d.r * 2 * 0.7 * k;
            me.wrap(this, d.titleTextLength);
          });
        d3
          .selectAll(".innerCircleDescription tspan")
          .style("text-decoration", "underline");
        d3.selectAll(".barWrapperOuter").style("opacity", 1);
      }
    },
    wrap(text, width) {
      var text = d3.select(text),
        words = text
          .text()
          .split(" ")
          .reverse(),
        currentSize = +text.style("font-size").replace("px", ""),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.2, // ems
        extraHeight = 0.2,
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        //First span is different - smaller font
        tspan = text
          .text(null)
          .append("tspan")
          .attr("class", "subTotal")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", dy + "em")
          .style(
            "font-size",
            (Math.round(currentSize * 0.5) <= 5
              ? 0
              : Math.round(currentSize * 0.5)) + "px"
          );
      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width || word === "|") {
          if ((word = "|")) word = "";
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text
            .append("tspan")
            .attr("x", 0)
            .attr("y", y)
            .attr("class", "subTotal")
            .attr("dy", ++lineNumber * lineHeight + extraHeight + dy + "em")
            .text(word)
            .style(
              "font-size",
              (Math.round(currentSize * 0.5) <= 5
                ? 0
                : Math.round(currentSize * 0.5)) + "px"
            );
        }
      }
    }
  }
};
</script>
<style>
.node {
  cursor: pointer;
}

.node:hover {
  stroke: #fff;
  stroke-width: 1.5px;
}

.node--root {
  stroke: #777;
  stroke-width: 2px;
}

.node--CSV,
.node--Excel,
.node--PDF,
.node--Word,
.node--PPT,
.node--Website,
.node--Image,
.node--Text {
  fill: white;
}

.label {
  font: 13px "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  text-anchor: middle;
  text-shadow: 0 1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff, 0 -1px 0 #fff;
}
.circleText {
  font-family: "Oswald", sans-serif;
  text-anchor: middle;
  color: white;
  fill: white;
  cursor: pointer;
  pointer-events: auto;
}
.label,
.innerCircleTitle,
.innerCircleDescription,
.innerCircleFileType {
  text-anchor: middle;
  font-family: "Oswald", sans-serif;
}
</style>
