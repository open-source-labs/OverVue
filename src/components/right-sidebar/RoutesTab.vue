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
    <Routes></Routes>
    <!-- <UploadMockup></UploadMockup>  -->
  </div>
</template>

<script setup lang="ts">
import Routes from "./Routes.vue";
import { mapState, mapActions } from "vuex";
import UploadMockup from "./UploadMockup.vue";
import { useStore } from "../../store/main.js";
import { ref, computed } from "vue";

const store = useStore();
const newRoute = ref("");
const activeComponent = ref("");

const routes = computed(() => store.routes);
const componentMap = computed(() => store.componentMap);
// const activeComponent = computed(() => store.state.activeComponent)

const addRouteToRouteMap: typeof store.addRouteToRouteMap = (payload) => store.addRouteToRouteMap(payload);
const setRoutes: typeof store.setRoutes = (payload) => store.setRoutes(payload);
const setActiveComponent: typeof store.setActiveComponent = (payload) => store.setActiveComponent(payload);

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
  addRouteToRouteMap(newRouteName)
    newRoute.value = "";
};
const resetActiveComponent = () => {
  if (activeComponent.value !== "") {
    setActiveComponent("");
  }
};
</script>

<!-- Old options API script -->
<!-- <script>
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
</script> -->

<style scoped>
.route-display {
  overflow: auto;
}

i:hover {
  cursor: pointer;
}
</style>
