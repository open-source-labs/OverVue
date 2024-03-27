<template>
  <section id="newFeatures">
    <h6 class="infoHeading">What's New in OverVue 11.0?</h6>
    <p class="info-sub-heading">Toggle between Options/Composition API</p>
    <p class="infoContent">
      OverVue 11.0 adds the ability to display your code generated in the code 
      preview in both options and composition API, taking advantage of the pinia
      state management library. You can now toggle back and forth between each
      API format.
    </p>
    <img
      alt="Toggle between Options/Composition API"
      src="../../../assets/options-composition-API.png"
      class="tut-screenshot"
    />
    <p class="info-sub-heading">Updated Export Functionality</p>
    <p class="infoContent">
      Export now provides support for the pinia state management library. Now, you 
      can choose which API formtat you want exported to your local machine, just 
      select the desired format, hit export, and voilà!

    </p>
    <img
      alt="Updated Export Functionality"
      src="../../../assets/export-API.png"
      class="tut-screenshot"
    />
    <p class="info-sub-heading">Patched Save Functionality</p>
    <p class="infoContent">
      You can now save the current state of your entire application into a JSON file 
      on your local machine.
    </p>
    <q-btn
      class="tut-btn"
      color="secondary"
      id="advanced-btn"
      label="The Basics"
      @click="nextTab"
    />
    <q-btn
      class="tut-btn closeAction"
      label="Start Building Now"
      @click="toggleTutorial"
    />
  </section>
</template>

<script setup lang="ts">
// @ts-nocheck
// No check for the shell
import { useStore } from "../../../stores/main.js";

const { shell } = window;

const store = useStore();
const emit = defineEmits(["nextTab"]);

const toggleTutorial = () => store.toggleTutorial();
const nextTab = () => emit("nextTab");
const openUrl = (url: string) => shell.openExternal(url, { activate: true });
</script>

<style scoped lang="scss">
#newFeatures {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px;
}

.link {
  color: $secondary;
}

.dead-link {
  color: greenyellow;
}

.infoHeading {
  margin: 0.75rem;
  font-size: 2rem;
  padding-top: 15px;
}

.info-sub-heading {
  align-self: flex-start;
  font-size: 1.4rem;
  margin: 0.75rem;
  margin-bottom: 0px;
}

.html-tag {
  margin: 4px;
  max-width: 150px;
}

.z-index {
  margin: 4px;
  border: 1px solid $primary;
  max-width: 200px;
}

.infoContent {
  margin: 0.75rem;
  align-self: flex-start;
  font-size: 1rem;
}

.tut-btn {
  margin: 0.75rem;
  width: 50%;
  min-height: 42px;
  height: auto;
}

.tut-image {
  margin: 4px;
}

.tut-screenshot {
  margin: 4px;
  border: 1px solid $primary;
  max-width: 200px;
}

#advanced-btn {
  margin-top: 30px !important;
  margin-bottom: 0.75rem !important;
}
</style>
../../../stores/main.js
