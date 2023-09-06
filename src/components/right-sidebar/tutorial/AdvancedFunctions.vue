<template>
  <section id="advancedFunctions">
    <h6 class="tutorialHeading">Advanced Functionality</h6>
    <h class="tutorial-sub-heading">Import an existing component</h>
    <p class="tutorialContent">
      To import an existing Vue component file, click the import button in the
      upper right hand corner. Note: this feature is specifically intended for
      import of .json files saved in-app. Imports of other file formats is not
      currently supported.
    </p>
    <h class="tutorial-sub-heading">Add props</h>
    <p class="tutorialContent">
      To add props, select the component and click on the Props sub-menu in the
      Update Component menu in the left sidebar. Enter the name of the prop you
      want to add and click ‘+’ or press enter. Then, select the added prop(s)
      from the dropdown and click the 'Add' Prop(s)’ button. To remove a prop,
      click the ‘x’ icon on the right side of the prop.
    </p>
    <img
      alt="Add props"
      src="../../../assets/props.png"
      class="tut-screenshot"
    />
    <h class="tutorial-sub-heading">Add state variables or actions</h>
    <p class="tutorialContent">
      To add state variables or actions to a component, first add them to the
      store. Under the Store tab, click on State or Actions, enter a label, and
      click the ‘+’ or press enter. Then, select the component to which you want
      to add state variables or actions. In the State or Actions sub-menus
      within the Update Component menu in the left sidebar, select your desired
      state variable(s) or action(s) from the dropdown and click on ‘Map State’
      or ‘Map Action(s)’. To remove any, click the ‘x’ icon on the right side of
      the state variable or action.
    </p>
    <img
      alt="Store tab"
      src="../../../assets/state-actions.png"
      class="tut-screenshot"
    />
    <h class="tutorial-sub-heading">Enable TypeScript</h>
    <p class="tutorialContent">
      To enable TypeScript, click on the Settings gear icon in the upper-right
      corner of the nav bar and toggle the "TypeScript" switch.
    </p>
    <img
      alt="Enable TypeScript"
      src="../../../assets/typescript.png"
      class="tut-screenshot"
    />
    <h class="tutorial-sub-heading">Toggle between Tree Mode & Grid Mode</h>
    <p class="tutorialContent">
      To revert the central user interface to the grid view used in previous
      OverVue versions, click on the Settings gear icon in the upper-right
      corner of the nav bar and toggle "Mode" from Tree to Grid.
      <br />
      <br />
      Disclaimer: some functionality may be disabled or broken, as this view is
      now considered deprecated.
    </p>
    <img
      alt="Main View Toggle"
      src="../../../assets/grid-mode.png"
      class="tut-screenshot"
    />
    <q-btn
      class="tut-btn"
      id="getstarted-btn"
      color="secondary"
      label="Get Started Now"
      @click="toggleTutorial"
    />
  </section>
</template>

<script setup lang="ts">
import { useStore } from "../../../store/main.js";

const store = useStore();
const toggleTutorial = () => store.toggleTutorial();
</script>

<style lang="scss" scoped>
#advancedFunctions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px;
}

.tutorialHeading {
  margin: 0.75rem;
  font-size: 2rem;
  padding-top: 15px;
}
.tutorial-sub-heading {
  align-self: flex-start;
  font-size: 1.4rem;
  margin: 0.75rem;
  margin-bottom: 0px;
}
.tutorialContent {
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

.tut-screenshot {
  margin: 4px;
  border: 1px solid $primary;
  max-width: 300px;
}

#getstarted-btn {
  margin-top: 30px !important;
  margin-bottom: 50px !important;
}
</style>
