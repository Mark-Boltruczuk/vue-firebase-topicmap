<template>
  <v-container class="container">
    <v-layout row wrap>
      <v-flex xs12>
        <div>
          <menu-bar></menu-bar>
          <div class="page-header">
            <h2>Project Board</h2>
          </div>
          <div class="board">
            <div class="row">
              <div class="col-md">
                <task-lane
                  id="todo"
                  title="Todo"
                  :items="items.todo"
                  :libraryId="libraryId"
                  :topicMapId="id"
                ></task-lane>
              </div>
              <div class="col-md">
                <task-lane
                  id="inProgress"
                  title="In progress"
                  :items="items.inProgress"
                  :libraryId="libraryId"
                  :topicMapId="id"
                ></task-lane>
              </div>
              <div class="col-md">
                <task-lane
                  id="done"
                  title="Done"
                  :items="items.done"
                  :libraryId="libraryId"
                  :topicMapId="id"
                ></task-lane>
              </div>
            </div>
          </div>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import MenuBar from "./MenuBar";
import TaskLane from "./TaskLane";
export default {
  name: "KanbanBoard",
  props: ["libraryId", "id"],
  components: {
    "task-lane": TaskLane,
    "menu-bar": MenuBar
  },
  methods: mapActions("board", ["loadItems"]),
  computed: mapState("board", ["items"]),
  created() {
    this.loadItems({ libraryId: this.libraryId, topicMapId: this.id });
  }
};
</script>

<style>
h2 {
  color: white;
}
.card {
  margin-bottom: 10px;
}
.card:last-child {
  margin-bottom: 25px;
}
.card-block {
  padding: 15px;
}
</style>

 
