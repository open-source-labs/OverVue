<!-- 
Description:
  Displays routes in home-sidebar Routes dropdown
  Functionality includes: selects active route || deletes route on click
  -->

<template>
  <div>
    <p>Click to view route</p>
    <a
      v-for="route in Object.keys(routes)"
      :key="route"
      @click="selectRoute(route)"
    >
      <q-list bordered separator class="list-item">
        <q-item
          clickable
          dense
          v-ripple
          :class="
            route === activeRoute
              ? 'panel-block is-active list-item'
              : 'panel-block list-item'
          "
        >
          <q-item-section>
            <div class="block-container">
              <div class="block-info">
                {{ route }}
              </div>
              <span v-if="route !== 'HomeView'">
                <q-btn
                  round
                  flat
                  icon="highlight_off"
                  v-on:click.stop="deleteSelectedRoute(route)"
                />
              </span>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </a>
  </div>
</template>

<script>
export default {
  name: "Routes",
};
</script>

<script setup>
import { useStore } from "../../store/main.js";
import { computed } from "vue";

const store = useStore();

const routes = computed(() => store.routes);
const activeRoute = computed(() => store.activeRoutes);

const setActiveRoute = (payload) => store.setActiveRoute(payload);
const deleteRoute = (payload) => store.deleteRoute(payload);

const selectRoute = (route) => {
  setActiveRoute(route);
};
// deletes route
const deleteSelectedRoute = (route) => {
  deleteRoute(route);
};
</script>

<!-- old options API script -->

<!-- <script>
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
  </script> -->

<style lang="scss" scoped>
.panel-block {
  background: $secondary !important;
  color: $menutext !important;
  min-height: 45px;
}
.is-active {
  background: $secondary !important;
  color: $menutext !important;
  border: 2px solid $menutext !important;
}
</style>
