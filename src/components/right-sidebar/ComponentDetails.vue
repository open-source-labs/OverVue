<!-- 
  LOCATION IN APP:
  [right sidebar] COMPONENT DETAILS

  FUNCTIONALITY:
  - Displays HTML elements, code preview, and properties of current active component in sub-tabs
-->

<template>
  <div class="inner-div">
    <q-card id="code-window" class="no-shadow" v-if="activeComponentObj">
      <!-- sub-tab labels -->
      <q-tabs
        v-model="tab"
        class="bg-subaccent text-white"
        active-color="secondary"
        indicator-color="secondary"
        align="left"
      >
        <q-tab name="newhtml" label="HTML Elements" class="label-text" />
        <q-tab name="code" label="Code Preview" class="label-text" />
        <q-tab name="state" label="Properties" class="label-text" />
      </q-tabs>

      <!-- tab panels (where components are rendered) -->
      <q-tab-panels v-model="tab" animated class="html-bg text-white">
        <!-- HTML Elements -->
        <q-tab-panel name="newhtml">
          <V10HTMLQueue />
        </q-tab-panel>

        <!-- Code Preview -->
        <q-tab-panel name="code">
          <CodeSnippet />
        </q-tab-panel>

        <!-- Properties -->
        <q-tab-panel name="state">
          {{
            activeComponent
              ? `${activeRoute} / ${activeComponent}.vue`
              : "Select a component to see its state variables, actions, and props."
          }}

          <!-- State Variables -->
          <div class="componentProperties">
            <br />
            <q-expansion-item default-closed label="State Variables">
              <p v-if="!(activeComponentObj as Component)?.state?.length">
                {{
                  activeComponent
                    ? `Add state variables to ${activeComponent}.vue to see them here.`
                    : null
                }}
              </p>
              <ul id="stateList">
                <li
                  v-for="comp in (activeComponentObj as Component).state"
                  :key="comp"
                >
                  {{ comp }}
                </li>
              </ul>
            </q-expansion-item>
          </div>

          <!-- Actions -->
          <div class="componentProperties">
            <q-expansion-item default-closed label="Actions">
              <p v-if="!(activeComponentObj as Component)?.actions?.length">
                {{
                  activeComponent
                    ? `Add actions to ${activeComponent}.vue to see them here.`
                    : null
                }}
              </p>
              <ul id="actionList">
                <li
                  v-for="comp in (activeComponentObj as Component)?.actions"
                  :key="comp"
                >
                  {{ comp }}
                </li>
              </ul>
            </q-expansion-item>
          </div>

          <!-- Props -->
          <div class="componentProperties">
            <q-expansion-item default-closed label="Props">
              <p v-if="!(activeComponentObj as Component)?.props?.length">
                {{
                  activeComponent
                    ? `Add props to ${activeComponent}.vue to see them here.`
                    : null
                }}
              </p>
              <!-- <p v-else>Props in {{ activeComponent }}:</p> -->
              <ul id="propsList">
                <li
                  v-for="comp in (activeComponentObj as Component)?.props"
                  :key="comp"
                >
                  {{ comp }}
                </li>
              </ul>
            </q-expansion-item>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
    <q-card id="blank-card" v-else
      >Create a component to see its details</q-card
    >
  </div>
</template>

<script setup lang="ts">
/* IMPORTS */
import { computed } from "vue";
import { useStore } from "../../store/main.js";
import { Component } from "../../../types";
import V10HTMLQueue from "./V10HTMLQueue.vue";
import CodeSnippet from "./CodeSnippet.vue";

/* COMPUTED VALUES */
const store = useStore();
const activeComponentObj = computed(() => store.activeComponentObj);
const activeComponent = computed(() => store.activeComponent);
const activeRoute = computed(() => store.activeRoute);
const tab = computed({
  get: () => store.componentDetailsTab,
  set: (newTab) => {
    setComponentDetailsTab(newTab);
  },
});

/* STORE ACTIONS */
const setComponentDetailsTab: typeof store.setComponentDetailsTab = (payload) =>
  store.setComponentDetailsTab(payload);
</script>

<style lang="scss" scoped>
i {
  font-size: 11px;
}

.q-btn {
  font-size: 8px;
  margin: 5px;
}

// styling for the entire dashboard
.q-footer {
  transition-timing-function: ease-in;
  transition: 0.2s;
  background: $subsecondary;
}

// changes the dashboard toolbar height
.q-toolbar {
  min-height: 25px !important;
  padding: 0 6px !important;
}

.q-toolbar__title {
  font-size: 14px;
  text-transform: uppercase;
  padding: 5px;
}

// this class selector does not change anything
.q-tab__label {
  // font-size not changing
  font-size: 10px !important;
  line-height: 1.718em;
  font-weight: 500;
}

// changes the tab label styling
.label-text {
  font-size: 4px !important;
  text-transform: capitalize;
}

.q-tab-panel {
  height: 100%;
  background: $subprimary;
  padding-top: 20px !important;
}

// changes the length of the tab panels
.q-tab-panels {
  height: 100%;
  padding: 0 !important;
}

.q-tabs {
  background: #11120f;
}

.toolbar-background {
  background: black;
}

#code-window {
  height: 100%;
  border-radius: 0;
  background: #737578;
}

#blank-card {
  height: 100%;
  border-radius: 0;
  background-color: #202122;
  box-shadow: none;
}

.html-bg {
  // give html background color of grey
  background-color: #202122;
}

.inner-div {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: stretch;
  max-height: 95%;
}

.componentProperties {
  margin-bottom: 2em;
}
</style>
