<!--
Description:
  Displays routes in home-sidebar Routes dropdown
  Functionality includes: selects active route || deletes route on click
  -->

<template>
  <div>
    <p>Click to view route</p>
    <a
      :class="route === activeRoute ? 'panel-block is-active' : 'panel-block'"
      v-for="route in Object.keys(routes)"
      :key="route"
      @click="selectRoute(route)"
    >
      <q-list bordered separator class="list-item">
        <q-item clickable v-ripple class="list-item">
          <q-item-section>{{route}}</q-item-section>
          <span v-if="route !== 'HomeView'">
            <q-btn round flat icon="highlight_off" v-on:click.stop="deleteSelectedRoute(route)" />
          </span>
        </q-item>
      </q-list>
    </a>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Routes',
  computed: {
    ...mapState(['routes', 'activeRoute'])
  },
  methods: {
    ...mapActions(['setActiveRoute', 'deleteRoute']),
    // selects active route
    selectRoute (route) {
      this.setActiveRoute(route)
    },
    // deletes route
    deleteSelectedRoute (route) {
      this.deleteRoute(route)
    }
  }
}
</script>

<style scoped>

</style>
