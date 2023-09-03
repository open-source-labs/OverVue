<!--
  LOCATION IN APP:
  [right sidebar] default view upon booting/refreshing app

  FUNCTIONALITY:
  - Displays introductory information for user
-->

<template>
  <q-card id="dashboard-cards">
    <q-tabs
      v-model="tutorialPage"
      class="bg-subaccent text-white"
      active-color="secondary"
      indicator-color="secondary"
      align="left"
      dense
      breakpoint="950"
    >
      <!-- tab labels -->
      <q-tab name="landing" label="Welcome" id="label-text"></q-tab>
      <q-tab name="version" label="What's New" id="label-text"></q-tab>
      <q-tab name="basics" label="The Basics" id="label-text"></q-tab>
      <q-tab
        name="advanced"
        label="Advanced Functionality"
        id="label-text"
      ></q-tab>
    </q-tabs>

    <!-- panels (where components are rendered) -->
    <q-tab-panels v-model="tutorialPage" animated>
      <!-- welcome to overvue -->
      <q-tab-panel name="landing">
        <Landing @nextTab="tutorialPage = 'version'" />
      </q-tab-panel>

      <!-- what's new -->
      <q-tab-panel name="version">
        <NewVersionInfo @nextTab="tutorialPage = 'basics'" />
      </q-tab-panel>

      <!-- the basics -->
      <q-tab-panel name="basics">
        <BasicFunctions @nextTab="tutorialPage = 'advanced'" />
      </q-tab-panel>

      <!-- advanced functionality -->
      <q-tab-panel name="advanced">
        <AdvancedFunctions />
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<!-- COMPOSITION API SYNTAX -->
<script setup lang="ts">
/* IMPORTS */
import { ref } from "vue";
import Landing from "./tutorial/Landing.vue";
import NewVersionInfo from "./tutorial/NewVersionInfo.vue";
import BasicFunctions from "./tutorial/BasicFunctions.vue";
import AdvancedFunctions from "./tutorial/AdvancedFunctions.vue";

/* DATA */
const tutorialPage = ref("landing");
</script>

<style lang="scss" scoped>
.q-btn {
  font-size: 8px;
  margin: 5px;
}

.q-toolbar__title {
  font-size: 14px;
  text-transform: uppercase;
  padding: 5px;
}

/* this class selector does not change anything */
.q-tab__label {
  /* // font-size not changing */
  font-size: 10px !important;
  line-height: 1.718em;
  font-weight: 500;
}

/* // changes the tab label styling */
#label-text {
  font-size: 4px !important;
  text-transform: capitalize;
}

.q-tab-panel {
  /* // matchs the code editor bg */
  background: $subprimary;
}

.q-tab-panels {
  padding: 0px !important;
  background: $subprimary;
}

.q-tabs {
  background: $subprimary;
}

.inner-div {
  height: 100%;
}
</style>
