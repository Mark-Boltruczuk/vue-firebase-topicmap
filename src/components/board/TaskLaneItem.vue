<template>
  <div class="card task-lane-item">
    <div class="card-block">
        <h5 class="card-title">
            <span class="text-muted">#{{item.id}}</span>
            {{item.text}}  
        </h5>
        <h6>Creator: {{users[item.user].firstname}} {{users[item.user].lastname}}</h6>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "TaskLaneItem",
  props: ["item"],
  computed: mapGetters("users", ["users"]),
};
</script>

<style>
.card.task-lane-item {
  background: #627180;
}
</style>
