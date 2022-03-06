<!--
Description:
  Located in the Dashboard
  Contains the Code Snippet, HTMLQueue Components, and the Component state, actions, and props as well
  Functionality includes: Contains the Code Snippet and HTMLQueue Components,
  as well as tabs to show the Component state, actions, and props

  -->

<template>
  <div class="inner-div">
    <q-card id="store-cards" class="no-shadow" v-if="this.activeComponentObj">
      <q-tabs
        v-model="tab"
        dense
        class="bg-subaccent text-white"
        active-color="secondary"
        indicator-color="secondary"
        align="left"
      >
        <q-tab name="code" label="Code Snippet" id="label-text" />
        <q-tab name="html" label="HTML Elements" id="label-text" />
        <q-tab name="state" label="Component State" id="label-text" />
        <q-tab name="actions" label="Component Actions" id="label-text" />
        <q-tab name="props" label="Component Props" id="label-text" />
      </q-tabs>
      <q-tab-panels v-model="tab" animated class="html-bg text-white">
        <q-tab-panel name="code">
          <CodeSnippet />
        </q-tab-panel>
        <q-tab-panel name="html">
          <HTMLQueue />
        </q-tab-panel>
        <q-tab-panel name="state">
          <p v-if="!this?.activeComponentObj?.state?.length">
            No state in component.
          </p>
          <ul id="stateList">
            <li v-for="comp in compObj.state" :key="comp">
              {{ comp }}
            </li>
          </ul>
        </q-tab-panel>
        <q-tab-panel name="actions">
          <p v-if="!this?.activeComponentObj?.actions?.length">
            No actions in component
          </p>
          <ul id="actionList">
            <li v-for="comp in compObj?.actions" :key="comp">
              {{ comp }}
            </li>
          </ul>
        </q-tab-panel>
        <q-tab-panel name="props">
          <p v-if="!this?.activeComponentObj?.props?.length">
            No props in component
          </p>
          <ul id="propsList">
            <li v-for="comp in compObj?.props" :key="comp">
              {{ comp }}
            </li>
          </ul>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
    <q-card id="blank-card" v-else>Select a component to show details</q-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HTMLQueue from "./HTMLQueue";
import CodeSnippet from "./CodeSnippet";

export default {
  name: "ComponentDetails",
  components: {
    HTMLQueue,
    CodeSnippet
  },
  computed: {
    ...mapState(["activeComponentObj","activeComponent"]),
    compObj: {
      get() {
        return this.activeComponentObj;
      }
    }
  },
  data() {
    return {
      tab: "code"
    };
  }
};
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
  transition: .2s;
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
#label-text {
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
  background: #11120F;
}

.toolbar-background {
  background: black;
  
}

#store-cards {
  height: 100%;
  border-radius: 0;
  background: #737578;
}

#blank-card {
  height: 100%;
  border-radius: 0;
  background-color: #202122;
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
  height: 100%;
}
</style>
