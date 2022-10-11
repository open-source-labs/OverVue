<template>
  <!--Typescript option, mock image?, nested HTML elements, import component/limitations -->
  <section id="advancedFunctions">
    <h6 class="tutorialHeading">Advanced Functionality</h6>
    <h class="tutorial-sub-heading">Importing an existing component</h>
    <p class="tutorialContent">
      To import an existing Vue component file, click the import button in the
      upper right hand corner. Please note: this feature is specifically
      intended for import of json files saved in-app. Import of other file
      formats is not currently supported.
    </p>
    <h class="tutorial-sub-heading">Adding Props</h>
    <img
      alt="Props sub-menu"
      src="../../../assets/props.png"
      class="tut-screenshot"
    />
    <p class="tutorialContent">
      To add props, select the component and click the Props sub-menu in the
      Update Component menu in the left sidebar. Enter the name of the prop you
      want to add and click ‘+’ or press enter. Then select the added prop(s)
      from the dropdown and click the 'Add' Prop(s)’ button. To remove a prop,
      click the ‘x’ icon on the right side of the prop.
    </p>
    <img
      alt="Add Props"
      src="../../../assets/add-props.png"
      class="tut-screenshot"
    />
    <h class="tutorial-sub-heading">Adding State or Actions</h>
    <p class="tutorialContent">
      To add state or actions to a component, they must first be added to the
      store. Under the Store tab, click on Store State or Store Actions, enter
      the name and click the ‘+’ or press enter. Then, select the component to
      which you want to add state or actions. In the State or Actions sub-menus
      in the Update Component menu of the left sidebar, select your desired
      state(s) or action(s) from the dropdown and click ‘Map State’ or ‘Map
      Actions’. To remove them, click the ‘x’ icon on the right side of the
      state or action.
    </p>
    <img
      alt="Store Tab"
      src="../../../assets/state-actions.png"
      class="tut-screenshot"
    />
    <h class="tutorial-sub-heading">Navigating HTML elements</h>
    <p class="tutorialContent">
      To nest HTML elements, select a component, click the double down arrow
      icon on an HTML element (either in the HTML Elements sub-menu of the
      Update Component menu in the left sidebar or the HTML Elements sub-menu of
      the Component Details tab in the right sidebar). Click the icons to add
      additional HTML elements. To navigate back up a layer, click the up arrow
      icon. (Note: Certain types of HTML elements cannot be nested, these will
      not have a double arrow icon.)
    </p>
    <img
      alt="HTML Queue"
      src="../../../assets/html-queue.png"
      class="tut-screenshot"
    />
    <h class="tutorial-sub-heading">TypeScript Mode</h>
    <p class="tutorialContent">
      To turn TypeScript mode on or off, click on the Settings gear icon in the
      right corner of the nav bar and click the toggle at the bottom of the
      menu.
    </p>
    <img
      alt="TypeScript Toggle"
      src="../../../assets/typescript.png"
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

<!-- COMPOSITION API SYNTAX -->
<script setup>
import { useStore } from "../../../store/index";
const store = useStore();

const toggleTutorial = () => store.toggleTutorial();
</script>

<!-- OLD OPTIONS API SYNTAX -->
<!-- <script>
import { mapActions } from "vuex";

export default {
  methods: {
    ...mapActions(["toggleTutorial"]),
  },
};
</script> -->

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
