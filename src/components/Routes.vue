<template>
<div>
  <!--<div class="route-view">-->
    <a
      :class="route === activeRoute ? 'panel-block is-active' : 'panel-block'"
      v-for="route in Object.keys(routes)"
      :key="route"
      @click="handleClick(route)"
      v-on:keyup.delete="deleteRoute(route)"
    >
<!--
      <span class="panel-icon">
        <i class="fas fa-location-arrow" aria-hidden="true"></i>
      </span>
      -->
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
    ...mapActions(['setActiveRoute']),
    handleClick (route) {
      this.setActiveRoute(route)
    },
    deleteRoute (route) {
      console.log('routes', route)
      console.log('this', this)
    }
  }
}
</script>

<style scoped>
.route-view {
  margin: 1rem;
}
</style>
