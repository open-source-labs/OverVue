<template>
  <section id="newFeatures">
    <h6 class="infoHeading">What's New in OverVue 11.0?</h6>
    <p class="info-sub-heading">Interactive Tree View</p>
    <p class="infoContent">
      Drag and drop tree nodes to change the component structure! Changes made
      within the tree view will be reflected in the Code Preview. This view
      replaces the previous grid view. Although Grid Mode is considered
      deprecated, it can still be found within the application (see Advanced
      Functionality).
    </p>
    <img
      alt="Interactive Tree View"
      src="../../../assets/interactive-tree.png"
      class="tut-screenshot"
    />
    <p class="info-sub-heading">Updated HTML Elements Section</p>
    <p class="infoContent">
      OverVue 10.0 comes with a new and revamped HTML elements section. You can
      now change the order of and nest the HTML elements that are within your
      components by interacting with its tree list structure. From this section,
      you can also delete and edit HTML elements.
    </p>
    <img
      alt="HTML Elements Section"
      src="../../../assets/nested-elements.png"
      class="tut-screenshot"
    />
    <p class="info-sub-heading">Component Focus Modal</p>
    <p class="infoContent">
      If you're going to be spending a lot of time organizing HTML elements in
      any one component, use the component focus modal. The modal can be opened
      by double-clicking on a component within the main tree view.
    </p>
    <img
      alt="Component Focus Modal"
      src="../../../assets/modal.png"
      class="tut-screenshot"
    />
    <p class="info-sub-heading">Vuetensils Component Library</p>
    <p class="infoContent">
      Quickly create accessible HTML elements by adding components from the
      Vuetensils Component Library! These naked components are designed to have
      bare minimum styles, to avoid bloat while including accessibility. Learn
      more about Vuetensils in their official
      <a
        class="link"
        @click="openUrl('https://vuetensils.com/Introduction.html')"
      >
        <u>documentation</u> </a
      >.
    </p>
    <img
      alt="Vuetensils"
      src="../../../assets/vuetensils.png"
      class="tut-screenshot"
    />
    <q-btn
      class="tut-btn"
      color="secondary"
      id="advanced-btn"
      label="Advanced Functionality"
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
import { useStore } from "../../../store/main.js";

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
