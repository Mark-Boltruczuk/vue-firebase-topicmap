<template>
  <div class="card">
      <h3 class="card-header">{{ title }}</h3>
      <div class="card-body">
        <draggable v-model="draggables" :options="{ group: 'default' }">
          <div v-for="item in items" :key="item.id">
              <item :item="item"></item>
          </div>
        </draggable>
      </div>
      <div class="card-footer text-muted">
          {{itemCount}}
      </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex';
import Draggable from 'vuedraggable';
import TaskLaneItem from './TaskLaneItem';
export default {
  name: 'TaskLane',
  props: ['items', 'title', 'id', 'libraryId', 'topicMapId'],
  components: {
    item: TaskLaneItem,
    draggable: Draggable
  },
  methods: mapActions('board', ['updateItems']),
  computed: {
    itemCount() {
      if (!this.items) return '';
      if (this.items.length === 1) return '1 task';
      return `${this.items.length} tasks`;
    },
    draggables: {
      get() {
        return this.items;
      },
      set(items) {
        this.updateItems({
          items,
          id: this.id,
          libraryId: this.libraryId,
          topicMapId: this.topicMapId
        });
      }
    }
  }
};
</script>

<style>
.card-body > * {
  min-height: 50px;
}
</style>

