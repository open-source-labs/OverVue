<template>

<div>
  <!--<div class="route-view">-->
    <a
      :class="route === activeRoute ? 'panel-block is-active' : 'panel-block'"
      v-for="route in Object.keys(routes)"
      :key="route"
      @click="handleClick(route)"
      v-on:keyup.delete="deleteSelectedRoute(route)"
    >
      <q-list bordered separator>
        <q-item clickable v-ripple>
          <q-item-section>{{route}}</q-item-section>
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
