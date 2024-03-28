<!--
  LOCATION IN APP:
  [left sidebar] COMPONENT > default view > VUETENSILS

  FUNCTIONALITY:
  - Displays Vuetensils components from Vuetensils library
  - Enables user to select Vuetensils components and add them to current active component
-->

<template>
  <section class="icon-grid">
    <button
      @click.prevent="changeState(elementName)"
      v-for="([elementName, iconString], idx) in Object.entries(vtIcons)"
      :key="idx + Date.now()"
    >
      <!-- number badge -->
      <span class="badge"> {{ elementStorage[elementName] }}</span>
      <br />

      <!-- icon -->
      <i :class="iconString"></i>
      <br />

      <!-- element name -->
      <span>{{ elementName }}</span>
    </button>
  </section>
</template>

<script setup lang="ts">
/* IMPORTS */
import { computed, ref } from "vue";
import { useStore } from "../../../stores/main.js";
import { HtmlElement } from "app/types";

/* EMITS */
const emit = defineEmits([
  "getClickedIcon",
  "activeElement",
  "activeLayer",
  "activeHTML",
]);

/* COMPUTED VALUES */
const store = useStore();
const vtIcons = computed(() => store.vtIcons);
const activeComponent = computed(() => store.activeComponent);
const componentMap = computed(() => store.componentMap);
const selectedElementList = computed(() => store.selectedElementList);
const activeHTML = computed(() => store.activeHTML);
const activeLayer = computed(() => store.activeLayer);

// increments number badge when elements are added to component
const elementStorage = computed(() => {
  let computedElementalStorage: { [key: string]: number } = {};

  if (activeComponent.value) {
    computedElementalStorage = {};

    const checkHtmlElements = (array: HtmlElement[]) => {
      for (let html of array) {
        if (html.children === undefined) continue;
        else checkHtmlElements(html.children);

        if (!computedElementalStorage[html.text]) {
          computedElementalStorage[html.text] = 1;
        } else {
          ++computedElementalStorage[html.text];
        }
      }
    };

    checkHtmlElements(componentMap.value[activeComponent.value].htmlList);
  } else if (activeComponent.value === "") {
    computedElementalStorage = {};

    selectedElementList.value.forEach((el) => {
      if (!computedElementalStorage[el.text]) {
        computedElementalStorage[el.text] = 1;
      } else {
        computedElementalStorage[el.text] += 1;
      }
    });
  }

  return computedElementalStorage;
});

/* METHODS */
const changeState = (elementName: string) => {
  // if no active component & creating a new component: add html to selectedElement list
  if (activeComponent.value === "") {
    emit("getClickedIcon", { elementName, date: Date.now() });
  } else {
    if (activeHTML.value === "" && activeLayer.value.id === "") {
      // if active component & no active html: add html to component's htmlList no nesting
      emit("activeElement", { elementName, date: Date.now() });
    } else if (activeLayer.value.id !== "" && activeHTML.value === "") {
      // if active component & in a different layer: add html to current layers htmlList
      emit("activeLayer", { elementName, date: Date.now() });
    } else {
      // if active component, active layer is not selected, but have active html: add html to active html's htmlList
      emit("activeHTML", { elementName, date: Date.now() });
    }
  }
};
</script>

<style scoped lang="scss">
.icon-grid {
  display: grid;
  grid-template-columns: 33% 33% 33%;
  grid-row-gap: 1em;
  padding-top: 10px;
}

@media (max-width: 680px) {
  .icon-grid {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-row-gap: 1em;
    width: 100%;
  }
}

button {
  background: none;
  color: $menutext;
  border: none;
}

button:hover {
  cursor: pointer;
  color: $secondary;
}

button:focus {
  outline: none;
  color: $secondary;
}

button:active {
  box-shadow: 0 5px inherit;
  transform: translateY(4px);
}

.badge {
  width: 15px;
  line-height: 15px;
  text-align: center;
  font-size: 10px;
  font-weight: bold;
  float: right;
  border-radius: 50%;
  background-color: $secondary;
  color: $menutext;
}
</style>

