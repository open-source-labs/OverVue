<!--
  LOCATION IN APP:
  [left sidebar] COMPONENT > default view > Set parent component (dropdown)

  FUNCTIONALITY:
  - Enables user to set a parent component for the component they are creating
-->

<template>
  <div id="parent-select">
    <VueMultiselect
      v-model="value"
      placeholder="Set parent component"
      :multiple="false"
      :close-on-select="true"
      :options="options"
      @select="selectParent"
      @open="resetActiveComponent"
      :max-height="150"
      :option-height="20"
      :searchable="true"
    >
      <template v-slot:noResult>No components found</template>
    </VueMultiselect>
  </div>
</template>

<script setup lang="ts">
/* IMPORTS */
import { ref, computed, watch } from "vue";
import VueMultiselect from "vue-multiselect";
import { useStore } from "../../../stores/main";

/* EMITS */
const emit = defineEmits(["addparent"]);

/* DATA */
const value = ref("");

/* COMPUTED VALUES */
const store = useStore();

const componentMap = computed(() => store.componentMap);
const activeComponent = computed(() => store.activeComponent);
const routes = computed(() => store.routes);
const activeRoute = computed(() => store.activeRoute);
const options = routes.value[activeRoute.value].map(
  (component) => component.componentName
);

/* STORE ACTIONS */
const parentSelect: typeof store.parentSelect = (payload) =>
  store.parentSelect(payload);
const setActiveComponent: typeof store.setActiveComponent = (payload) =>
  store.setActiveComponent(payload);

/* METHODS */
const selectParent = (value: string) => {
  parentSelect(value);
  emit("addparent", value);
};

const resetActiveComponent = (): void => {
  if (activeComponent.value !== "") setActiveComponent("");
};

/* WATCHES */
watch(componentMap, () => (value.value = ""));
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style scoped lang="scss">
.parent-select {
  margin-right: 20px;
}

:global(.multiselect__tags) {
  background-color: $subprimary;
  border: 1px solid rgb(180, 180, 180);
}

:global(.multiselect__input) {
  background-color: $subprimary;
  color: $menutext;
}

:global(.multiselect__content) {
  background-color: $subprimary;
  color: $menutext;
}

:global(.multiselect__option) {
  color: $menutext;
}

:global(.multiselect__option--selected) {
  background-color: $accent;
  color: #155158;
}

:global(.multiselect__single) {
  background-color: $subprimary;
  color: $menutext;
}

:global(.multiselect__single:focus) {
  background-color: $subprimary;
  color: $menutext;
}

:global(.multiselect__input::placeholder) {
  color: $menutext;
}
</style>
../../../stores/main
