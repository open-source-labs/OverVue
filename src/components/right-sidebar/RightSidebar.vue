<!--
  LOCATION IN APP:
  [right sidebar]

  FUNCTIONALITY:
  - Conditionally renders landing page/introductory information or component details + routes
-->

<template>
  <span v-if="showTutorial === true">
    <GetStarted />
  </span>

  <span v-else>
    <q-card id="dashboard-cards">
      <!-- sub tabs -->
      <q-tabs
        v-model="tab"
        class="bg-subaccent text-white"
        active-color="secondary"
        indicator-color="secondary"
        align="left"
        dense
        breakpoint="1050"
      >
        <!-- component details -->
        <q-tab
          name="detail"
          label="Component Details"
          class="label-text"
        ></q-tab>

        <!-- [OverVue v.10.0] 'Project Tree' (only shows sub-tab IF grid mode enabled) -->
        <q-tab
          name="tree"
          label="Project Tree"
          class="label-text"
          v-if="mode === 'canvas'"
        ></q-tab>

        <!-- routes -->
        <q-tab name="routes" label="Routes" class="label-text"></q-tab>
      </q-tabs>

      <!-- tab panels (where components are rendered) -->
      <q-tab-panels v-model="tab" animated>
        <!-- component details -->
        <q-tab-panel name="detail">
          <ComponentDetails />
        </q-tab-panel>

        <!-- [OverVue v.10.0] project tree -->
        <q-tab-panel name="tree">
          <Tree />
        </q-tab-panel>

        <!-- routes -->
        <q-tab-panel name="routes">
          <RoutesTab />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </span>
</template>

<script setup lang="ts">
/* IMPORTS */
import { ref, computed, watch } from "vue";
import { useStore } from "../../store/main.js";
import GetStarted from "./GetStarted.vue";
import ComponentDetails from "./ComponentDetails.vue";
import Tree from "./Tree.vue";
import RoutesTab from "./RoutesTab.vue";

/* DATA */
const tab = ref("routes");

/* COMPUTED VALUES */
const store = useStore();
const activeComponent = computed(() => store.activeComponent);
const componentNameInputValue = computed(() => store.componentNameInputValue);
const selectedElementList = computed(() => store.selectedElementList);
const showTutorial = computed(() => store.showTutorial);
const mode = computed(() => store.mode);

/* WATCHES */
watch(componentNameInputValue, () => {
  if (componentNameInputValue.value !== "" && activeComponent.value === "") {
    tab.value = "detail";
  }
});
watch(selectedElementList, () => {
  if (
    activeComponent.value === "" &&
    [...selectedElementList.value].length !== 0
  ) {
    tab.value = "detail";
  }
});
</script>

<style lang="scss" scoped>
.home-sidebar {
  padding: 1rem;
  justify-content: center;
  border-radius: 5px;
  background: $subsecondary;
}

.q-btn {
  font-size: 8px;
  margin: 5px;
}

.q-toolbar__title {
  font-size: 14px;
  text-transform: uppercase;
  padding: 5px;
}

/* // changes the tab label styling */
.label-text {
  font-size: 4px !important;
  text-transform: uppercase;
}

.q-tab-panel {
  /* // matches the code editor bg */
  background: $subprimary;
  padding: 16px;
}

// changes the length of the tab panels
.q-tab-panels {
  padding: 0px !important;
  background: $subprimary;
}

.q-tabs {
  background: $subprimary;
}

.toolbar-background {
  background: $subprimary;
}

#dashboard-cards {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 0px;
  background: $subprimary;
}

.inner-div {
  height: 100%;
}
</style>
