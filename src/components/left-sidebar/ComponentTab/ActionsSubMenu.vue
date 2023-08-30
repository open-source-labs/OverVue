<!-- 
  LOCATION IN APP:
  [left sidebar] COMPONENT > Update Component > Actions

  FUNCTIONALITY:
  - Displays dropdown selection of actions added to store
  - Allows user to select actions and map them to current active component
-->

<template>
  <div class="selection-container">
    <div id="action-select">
      <VueMultiselect
        v-model="selectAction"
        class="multiselect"
        placeholder="Select action for component"
        :multiple="true"
        :close-on-select="false"
        :max-height="180"
        :option-height="20"
        open-direction="top"
        :options="userActions"
        :searchable="false"
        @search-change="stopDelete($event)"
      >
      </VueMultiselect>
      <q-btn
        v-if="selectAction.length"
        id="add-actions-btn"
        class="add-btn"
        color="secondary"
        label="Map Action(s)"
        @click="addActionToComp"
      />
    </div>
    <a
      v-for="action in (componentMap[activeComponent] as Component).actions"
      :key="action"
    >
      <q-list class="list-item" dense bordered separator>
        <q-item clickable v-ripple class="list-item">
          <q-item-section>
            <div class="component-container">
              <div class="component-info">
                {{ action }}
              </div>
              <q-btn
                round
                flat
                icon="highlight_off"
                v-on:click.stop="deleteAction(action)"
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
import { useStore } from "../../../store/main.js";
import { Component } from "../../../../types";

/* COMPUTED VALUES */
const store = useStore();
const componentMap = computed(() => store.componentMap);
const activeComponent = computed(() => store.activeComponent);
const selectedActions = computed(() => store.selectedActions);
const userActions = computed(() => store.userActions);
const selectAction = computed({
  get() {
    return [...selectedActions.value];
  },
  set(value) {
    addActionSelected(value);
  },
});

/* STORE ACTIONS */
const addActionSelected: typeof store.addActionSelected = (payload) =>
  store.addActionSelected(payload);
const addActionToComponent: typeof store.addActionToComponent = (payload) =>
  store.addActionToComponent(payload);
const deleteActionFromComponent: typeof store.deleteActionFromComponent = (
  payload
) => store.deleteActionFromComponent(payload);

/* COMPONENT METHODS */
const stopDelete = (e: KeyboardEvent) => {
  if (e.code === "Backspace") e.stopPropagation();
};

const addActionToComp = () => {
  addActionToComponent([...selectedActions.value]);
};

const deleteAction = (action: string) => {
  deleteActionFromComponent(action);
};
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
