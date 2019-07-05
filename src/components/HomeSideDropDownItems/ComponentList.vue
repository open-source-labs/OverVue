<template>
  <ul id="comp-list" class="component-list">
    <h3>hello world</h3>
    <li
      v-for="item in componentMap"
      :key="item.indexOf()"
      class="component-container"
    >{{ component }} </li>
  </ul>
</template>

<script>
import { mapState } from 'vuex'

export default {
  el: '#comp-list',
  computed: {
    ...mapState(['componentMap']),
    componentMap () {
      return Object.keys(this.componentMap)
    }
  }
}
</script>

<style>
</style>
