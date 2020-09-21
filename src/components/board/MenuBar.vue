<template>
  <div class="menubar">
      <div class="btn-group" role="group" aria-label="Menu bar">
        <router-link to="board">Project Board <i class="fa fa-th-large" aria-hidden="true"></i></router-link>
        <router-link to="backlog">Create Todo <i class="fa fa-list" aria-hidden="true"></i></router-link>
      </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  props: ['libraryId'],
  name: 'MenuBar',
  computed: {
    ...mapGetters({ loadedLibrary: "libraries/library"})
  },
  methods: {
    buttonClass(path) {
      return {
        btn: true,
        'btn-primary': this.$route.path === path,
        'btn-secondary': this.$route.path !== path
      };
    }
  }
};
</script>

<style>
.menubar {
    margin-bottom: 16px;
}
</style>
<style scoped>
.menubar .btn-group a {
  margin-right: 30px;
}
</style>
