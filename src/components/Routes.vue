<template>
  <div class="route-view">
    <a
      :class="route === activeRoute ? 'panel-block is-active' : 'panel-block'"
      v-for="route in Object.keys(routes)"
      :key="route"
      @click="handleClick(route)"
    >
      <span class="panel-icon">
        <i class="fas fa-location-arrow" aria-hidden="true"></i>
      </span>
      {{ route }}
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
    ...mapActions(['setActiveRoute']),
    handleClick (route) {
      this.setActiveRoute(route)
    }
  }
}
</script>

<style scoped>
.route-view {
  margin: 1rem;
}
</style>
