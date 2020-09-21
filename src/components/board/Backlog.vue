<template>
  <v-container class="container">
    <v-layout row wrap>
      <v-flex xs12>
        <div>
          <menu-bar></menu-bar>
          <div>
            <h2>Create Todo</h2>
          </div>
          <div class="backlog-view">
            <new-item :libraryId="libraryId" :topicMapId="id" :item="item"></new-item>

            <div class="card" v-for="item in items" :key="item.id">
              <div class="card-block">
                <span class="card-title">
                  <span class="text-muted">#{{item.id}}</span>
                  {{item.text}}
                  <span :class="badgeClass(item)">{{badgeText(item)}}</span>
                </span>
                <v-btn class="action-button" color="error" flat @click.stop="remove(item)">Delete</v-btn>
                <v-btn class="action-button" color="warning" flat @click.stop="edit(item)">Edit</v-btn>
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
import NewItemForm from "./NewItemForm";
import MenuBar from "./MenuBar";
const badgeDetail = {
  todo: {
    text: "todo",
    class: "badge badge-light"
  },
  inProgress: {
    text: "in progress",
    class: "badge badge-info"
  },
  done: {
    text: "done",
    class: "badge badge-success"
  }
};
export default {
  props: ["libraryId", "id"],
  name: "Backlog",
  components: {
    "new-item": NewItemForm,
    "menu-bar": MenuBar
  },
  data() {
    return {
      item: ""
    };
  },
  computed: mapState("board", {
    items: s => [...s.items.todo, ...s.items.inProgress, ...s.items.done],
    todo: s => s.items.todo,
    inProgress: s => s.items.inProgress
  }),
  methods: {
    ...mapActions("board", ["removeItem"]),
    itemLane(item) {
      if (this.todo.includes(item)) {
        return "todo";
      } else if (this.inProgress.includes(item)) {
        return "inProgress";
      }
      return "done";
    },
    badgeText(item) {
      const lane = this.itemLane(item);
      return badgeDetail[lane].text;
    },
    badgeClass(item) {
      const lane = this.itemLane(item);
      return badgeDetail[lane].class;
    },
    remove(item) {
      if (confirm("Are you sure to delete this item")) {
        this.removeItem({
          ...item,
          libraryId: this.libraryId,
          topicMapId: this.id
        });
      }
    },
    edit(item) {
      this.item = JSON.parse(JSON.stringify(item));
    }
  }
};
</script>
<style>
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
<style scoped>
h2 {
  color: white;
}
span.card-title {
  font-size: 16px;
}
.action-button {
  float: right;
}
</style>
