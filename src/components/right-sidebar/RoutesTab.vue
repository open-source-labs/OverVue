<!--
  LOCATION IN APP:
  [right sidebar] ROUTES > Add a route (input field)

  FUNCTIONALITY:
  - Enables user to add routes to project structure
  - Displays user-created routes
-->

<template>
  <div class="route-display">
    <!-- input field: add a route -->
    <q-input
      @keyup.enter="handleEnterKeyPress"
      color="white"
      dark
      outlined
      bottom-slots
      v-model="newRoute"
      label="Add a route"
      dense
      no-error-icon
      class="input-add"
      @click="resetActiveComponent"
      reactive-rules
      :rules="[
        (val) =>
          !Object.keys(componentMap).includes(val) ||
          'A component/route with this name already exists',
      ]"
    >
      <template v-slot:append>
        <q-btn flat icon="add" @click="handleEnterKeyPress" />
      </template>
    </q-input>

    <!-- created routes -->
    <Routes />
  </div>
</template>

<script setup lang="ts">
/* IMPORTS */
import { ref, computed } from "vue";
import { useStore } from "../../stores/main.js";
import Routes from "./Routes.vue";

/* DATA */
const newRoute = ref("");
const activeComponent = ref("");

/* COMPUTED VALUES */
const store = useStore();
const routes = computed(() => store.routes);
const componentMap = computed(() => store.componentMap);

/* STORE ACTIONS */
const addRouteToRouteMap: typeof store.addRouteToRouteMap = (payload) =>
  store.addRouteToRouteMap(payload);
const setActiveComponent: typeof store.setActiveComponent = (payload) =>
  store.setActiveComponent(payload);

/* METHODS */

const handleEnterKeyPress = (event: Event) => {
  const newRouteName = newRoute.value.replace(/[^a-z0-9-_.]/gi, "");
  if (
    !newRouteName.trim() ||
    routes.value[newRouteName] ||
    componentMap.value[newRouteName]
  ) {
    event.preventDefault();
    return false;
  }
  addRouteToRouteMap(newRouteName);
  newRoute.value = "";
};

const resetActiveComponent = () => {
  if (activeComponent.value !== "") {
    setActiveComponent("");
  }
};
</script>

<style scoped>
.route-display {
  overflow: auto;
}

i:hover {
  cursor: pointer;
}
</style>
../../stores/main.js
