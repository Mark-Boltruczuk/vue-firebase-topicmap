<template>
  <v-container fluid grid-list-xs>
    <v-layout row wrap>
      <v-flex d-flex xs12 sm12 md12>
        <v-container class="blue-grey darken-2 dark">
          <circle-ui
            id="circle-ui"
            :topicMap="topicMap"
            :topicMapId="topicMapId"
          ></circle-ui>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { Circleui } from "./circleMap";
import { mapActions, mapGetters } from "vuex";

export default {
  props: ["topicMap", "topicMapId"],
  components: {
    "circle-ui": Circleui
  },
  data() {
    return {};
  },
  methods: {
    selectNodeId(id) {
      this.$emit("select-node-id", id);
    }
  }
};
</script>
<style scoped>
#circle-ui {
  height: 700px;
}
</style>
