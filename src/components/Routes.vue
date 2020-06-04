<template>
  <div class="home-sidebar">
    <!--<div class="route-view">-->
    <a
      :class="route === activeRoute ? 'panel-block is-active' : 'panel-block'"
      v-for="route in Object.keys(routes)"
      :key="route"
      @click="handleClick(route)"
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
    handleClick (route) {
      this.setActiveRoute(route)
    },
    deleteSelectedRoute (route) {
      this.setActiveRoute(route)
      this.deleteRoute(route)
      this.setActiveRoute('')
    }
  }
}
</script>

<style scoped>
.route-view {
  margin: 1rem;
  display: flex;
  flex-direction: column;
}
</style>
