<template>
  <div class="add-item">
    <form action="#" method="post" v-on:submit.prevent="submitForm">
      <input type="text" v-model="itemText" placeholder="Add something to the backlog">
    </form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "NewItemForm",
  props: ["libraryId", "topicMapId", "item"],
  data() {
    return {
      itemText: "",
      selItem: ""
    };
  },
  computed: mapGetters("users", ["user"]),
  watch: {
    item: {
      handler: function(newVal, oldVal) {
        if (newVal) {
          this.itemText = newVal.text;
          this.selItem = JSON.parse(JSON.stringify(this.item));
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions("board", ["addItem", "updateItem"]),
    submitForm() {
      if (this.selItem) {
        this.selItem.text = this.itemText;
        this.updateItem({
          ...JSON.parse(JSON.stringify(this.selItem)),
          libraryId: this.libraryId,
          topicMapId: this.topicMapId
        });
        this.selItem = "";
        this.itemText = "";
      } else if (this.itemText) {
        // this.$store.commit('addItem', {
        //   text: this.itemText
        // });
        this.addItem({
          item: {
            text: this.itemText,
            user: this.user.uid,
            status: "todo"
          },
          libraryId: this.libraryId,
          topicMapId: this.topicMapId
        });
        this.itemText = "";
      }
    }
  }
};
</script>

<style>
.add-item input {
  outline: none;
  border: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  width: 100%;
  transition: all 0.25s;
  background: inherit;
  color: white;
}
.add-item input:focus {
  border-bottom-color: rgba(255, 255, 255, 1);
}
.add-item {
  margin: 30px 0;
}
</style>
