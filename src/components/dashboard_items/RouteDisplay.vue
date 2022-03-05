<!--
Description: container for route component.
Includes functionality to:
  update route name, update route map, and reset active component upon route creation
-->

<template>
  <div class="route-display">
    <q-input
      @keyup.enter="handleEnterKeyPress"
      color="white"
      dark
      outlined
      bottom-slots
      v-model="newRoute"
      label="Add new route"
      dense
      no-error-icon
      class="input-add"
      @click="resetActiveComponent"
      reactive-rules
      :rules="[val => !Object.keys(this.componentMap).includes(val) || 'A component with this name already exists' ]"
    >
    <template v-slot:append>
      <q-btn
        flat
        icon="add"
        @click="handleEnterKeyPress"
      />
    </template>
    </q-input>
    <Routes></Routes>
    <UploadImage></UploadImage>
  </div>
  
</template>

<script>
import Routes from "./Routes";
import { mapState, mapActions } from "vuex";
import UploadImage from "../home_sidebar_items/ComponentTab/UploadImage.vue";

export default {
  name: "RouteDisplay",
  components: {
    Routes,
    UploadImage
},
  computed: {
    ...mapState(["routes", "componentMap"]),
  },
  data() {
    return {
      newRoute: "",
    };
  },
  methods: {
    ...mapActions(["addRouteToRouteMap", "setRoutes", "setActiveComponent"]),
    handleEnterKeyPress() {
      const newRouteName = this.newRoute.replace(/[^a-z0-9-_.]/gi, "");
      if (
        !newRouteName.trim() ||
        this.routes[newRouteName] ||
        this.componentMap[newRouteName]
      ) {
        event.preventDefault();
        return false;
      }
      this.addRouteToRouteMap(newRouteName).then(() => {
        this.newRoute = "";
      });
    },
    resetActiveComponent() {
      if (this.activeComponent !== "") {
        this.setActiveComponent("");
      }
    },
  },
};
</script>

<style scoped>
.route-display {
  overflow: auto;
  padding: 1rem;
}

i:hover {
  cursor: pointer;
}
</style>
