<!-- 
  LOCATION IN APP:
  [right sidebar] ROUTES > under 'Add a route' input field

  FUNCTIONALITY:
  - Displays user-created routes
-->

<template>
  <div>
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

<script setup lang="ts">
/* IMPORTS */
import { computed } from "vue";
import { useStore } from "../../store/main.js";

/* COMPUTED VALUES */
const store = useStore();
const routes = computed(() => store.routes);
const activeRoute = computed(() => store.activeRoute);

/* STORE ACTIONS */
const setActiveRoute: typeof store.setActiveRoute = (payload) =>
  store.setActiveRoute(payload);
const deleteRoute: typeof store.deleteRoute = (payload) =>
  store.deleteRoute(payload);

/* METHODS */

const selectRoute = (route: string) => {
  setActiveRoute(route);
};

const deleteSelectedRoute = (route: string) => {
  deleteRoute(route);
};
</script>

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
