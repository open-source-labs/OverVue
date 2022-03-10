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
      :rules="[val => !Object.keys(this.componentMap).includes(val) || 'A component/route with this name already exists' ]"
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
    <UploadMockup></UploadMockup>
  </div>
  
</template>

<script>
import Routes from "./Routes";
import { mapState, mapActions } from "vuex";
import UploadMockup from "./UploadMockup.vue";

export default {
  name: "RoutesTab",
  components: {
    Routes,
    UploadMockup
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
}

i:hover {
  cursor: pointer;
}
</style>
