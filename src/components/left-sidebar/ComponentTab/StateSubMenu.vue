<!--
  LOCATION IN APP:
  [left sidebar] COMPONENT > Update Component > State

  FUNCTIONALITY:
  - Displays dropdown selection of state variables added to store
  - Allows user to select state variables and map them to current active component
-->

<template>
  <div class="selection-container">
    <div id="state-select">
      <VueMultiselect
        v-model="selectState"
        class="multiselect"
        placeholder="Select state variable for component"
        :multiple="true"
        :close-on-select="false"
        :max-height="180"
        :option-height="20"
        open-direction="top"
        :options="stateOptions"
        :searchable="false"
        @search-change="stopDelete($event)"
      >
      </VueMultiselect>
      <q-btn
        v-if="selectState.length"
        id="add-state-btn"
        class="add-btn"
        color="secondary"
        label="Map State"
        @click="addStateToComp"
      />
    </div>
    <a
      v-for="state in (componentMap[activeComponent] as Component).state"
      :key="state"
    >
      <q-list class="list-item" dense bordered separator>
        <q-item clickable v-ripple class="list-item">
          <q-item-section>
            <div class="component-container">
              <div class="component-info">
                {{ state }}
              </div>
              <q-btn
                round
                flat
                icon="highlight_off"
                v-on:click.stop="deleteState(state)"
              />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </a>
  </div>
</template>

<script setup lang="ts">
/* IMPORTS */
import { computed } from "vue";
import VueMultiselect from "vue-multiselect";
import { useStore } from "../../../stores/main";
import { Component } from "../../../../types";

/* COMPUTED VALUES */
const store = useStore();
const selectedState = computed(() => store.selectedState);
const userState = computed(() => store.userState);
const componentMap = computed(() => store.componentMap);
const activeComponent = computed(() => store.activeComponent);
const stateOptions = userState.value;
const selectState = computed({
  get() {
    return [...selectedState.value];
  },
  set(value) {
    addStateSelected(value);
  },
});

/* STORE ACTIONS */
const addStateSelected: typeof store.addStateSelected = (payload) =>
  store.addStateSelected(payload);
const addStateToComponent: typeof store.addStateToComponent = (payload) =>
  store.addStateToComponent(payload);
const deleteStateFromComponent: typeof store.deleteStateFromComponent = (
  payload
) => store.deleteStateFromComponent(payload);

/* METHODS */
const stopDelete = (e: KeyboardEvent) => {
  if (e.code === "Backspace") e.stopPropagation();
};

const addStateToComp = () => addStateToComponent([...selectedState.value]);

const deleteState = (state: string) => deleteStateFromComponent(state);
</script>

<style lang="scss" scoped>
.selection-container {
  padding: 30px 0;
}

.component-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
../../../stores/main
