<template>
  <section id="newFeatures">
    <h6 class="infoHeading">What's New in OverVue?</h6>
    <p class="info-sub-heading">
      Interactive 
    </p>
    <p class="infoContent">
      Level up your prototyping with snap to grid positioning and component
      sizing that is exported as CSS grid styling in exported SFC's. Click on
      these buttons below to access this feature!
    </p>
    <img src="../../../assets/snaptogrid.jpg" class="tut-image" />
    <p class="info-sub-heading">
      Augmented Component Creation with Element+ Component Library
    </p>
    <p class="infoContent">
      Take advantage of the popular Vue 3.0 compatible component library,
      Element+. Manipulate these components in app, and rest easy knowing
      exported code includes both the library elements, and their necessary
      dependencies.
    </p>

    <p class="info-sub-heading">
      Migrated Codebase to Composition API and Pinia State Management
    </p>

    <p class="infoContent">
      With the move of Vuex to maintanenace mode, Pinia has now become Vue's
      official state management library. In addition, Composition API allows for
      an efficient transition from Vuex to Pinia. Pinia provides SSR support,
      Hot Module Replacement, and integration with the Vue Devtools.
    </p>
    <p class="info-sub-heading">Added Typescript Support</p>
    <p class="infoContent">
      Typescript has been taking the world by storm, and aptly so. With the
      added benefit of Pinia having strong type inference, every component and
      piece of state has been typed to allow for a better developer experience
      and scalability.
    </p>

    <p class="info-sub-heading">Parent and Child Component Relationship</p>
    <p class="infoContent">
      Exported code now properly shows the relationship between parent and child
      components. Child components are declared in Parent script and appear
      correctly in templates.
    </p>
    <p class="info-sub-heading">HTML Element Nesting</p>
    <p class="infoContent">
      HTML elements now account for nesting in the exported code. Also the
      ability to include inner text has been added to the HTML elements.
    </p>
    <q-btn
      class="tut-btn"
      color="secondary"
      id="advanced-btn"
      label="Investigate Advanced Functionality"
      @click="nextTab"
    />
    <q-btn
      class="tut-btn closeAction"
      label="Start Building Now"
      @click="toggleTutorial"
    />
  </section>
</template>

<!-- COMPOSITION API SYNTAX -->
<script setup lang="ts">
import { useStore } from "../../../store/main.js";

const store = useStore();
const emit = defineEmits(["nextTab"]);

const toggleTutorial = () => store.toggleTutorial();
const nextTab = () => emit("nextTab");
</script>

<!-- OLD OPTIONS API SYNTAX -->
<!-- <script>
import { mapActions } from 'vuex';

export default {
  emits: ['nextTab'],
  methods: {
    ...mapActions(["toggleTutorial"]),
    nextTab() {
      this.$emit('nextTab')
    }
  }
}
</script> -->

<style scoped lang="scss">
#newFeatures {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px;
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
  margin-bottom: 50px !important;
}
</style>
