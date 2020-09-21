<template>
  <v-container fluid grid-list-xs>
    <v-layout row wrap>
      <v-flex d-flex xs12 sm12 md12>
        <v-container class="blue-grey darken-2 dark">
          <hyper-bolic
            :topicMap="data"
            :topicMapId="topicMapId"
            :libraryId="libraryId"
            v-on:select-node-id="selectNodeId"
          ></hyper-bolic>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { Hyperbolic } from "./hyperMap";
import { mapActions, mapGetters } from "vuex";

export default {
  props: ["topicMap", "topicMapId", "libraryId"],
  components: {
    "hyper-bolic": Hyperbolic
  },
  data() {
    return {};
  },
  methods: {
    selectNodeId(id) {
      this.$emit("select-node-id", id);
    }
  },
  computed: {
    data() {
      return this.topicMap;
    }
  }
};
</script>
<style scoped>
</style>
