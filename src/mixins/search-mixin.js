export default {
  computed: {
    filteredTopicMaps () {
      return this.loadedTopicmaps.filter((topicMap) => {
        return topicMap.name.match(this.search)
      })
    }
  }
}
