<template>
  <section id="basicFunctions">
    <h6 class="tutorialHeading">Get Started with OverVue</h6>
    <p class="tutorialContent">
      Prototyping in OverVue is designed to be quick and efficient. Learning how
      to use OverVue will help you integrate this tool into your design process
      to more seamlessly create Vue applications.
    </p>
    <h class="tutorial-sub-heading">Navigate OverVue</h>
    <p class="tutorialContent">
      If you ever want to navigate back to this page, click the gear icon
      <img
        style="vertical-align: middle"
        alt="Gear"
        src="../../../assets/gear.png"
        class="tut-image"
      />
      in the top navigation bar, all the way to the right, and select "Welcome
      Page" to return to the landing page.
    </p>
    <h class="tutorial-sub-heading">Set up your project</h>
    <p class="tutorialContent">
      Begin by clicking the gear icon
      <img
        style="vertical-align: middle"
        alt="Gear"
        src="../../../assets/gear.png"
        class="tut-image"
      />
      to customize your project.You can also toggle TypeScript to make your
      project TypeScript compatible, or add OAuth for Google or GitHub.
      Boilerplate code for these configurations will be reflected in your
      exported project.
    </p>
    <h class="tutorial-sub-heading">Create components</h>
    <p class="tutorialContent">
      Under the Create Component menu in the left sidebar, set a component name
      (required) and optionally select a parent component, and/or HTML elements
      to be nested inside the component (see Advanced Functionality to add
      deeper nesting to HTML elements).
    </p>
    <img
      alt="Create Component Menu"
      src="../../../assets/create_component_box.png"
      class="tut-screenshot"
    />
    <p class="tutorialContent">
      To use components from the Vue 3 compatible library Vuetensils, you can
      switch the tab from Elements to Vuetensils. Finally, click create
      component!
    </p>
    <h class="tutorial-sub-heading">Customize your components</h>
    <p class="tutorialContent">
      To capture component styling, be sure to add a class attribute. You can
      further customize your components in the sidebar by adding an ID, parents,
      children, props, state, or actions - all of which will be included in your
      exported code. To update a component after its creation, select the
      component on the tree and the Update Component Menu will appear in the
      left sidebar.
    </p>
    <h class="tutorial-sub-heading">Build out your prototype</h>
    <p class="tutorialContent">
      To manipulate your prototype, you can drag and drop your components on the
      tree. This will alter the component relationships and the code will
      reflect the changes. To control the tree view, you focus on the tree
      background by clicking it, and use keyboard controls to move around and
      zoom in.
    </p>
    <h class="controls">Tree Mode Controls:</h>
    <p class="tutorialContent">
      Directional Movement: Arrow Keys
      <br />
      Zoom: Scroll Wheel | Comma ( , ) | Period ( . )
      <br />
      Return to Root: Slash ( / )
    </p>
    <img
      alt="Tree View"
      src="../../../assets/tree.png"
      class="tut-screenshot"
    />
    <h class="tutorial-sub-heading">Delete components</h>
    <p class="tutorialContent">
      To delete a component, select it and click ‘Delete Current Component’ in
      the Update Component menu.
    </p>
    <img
      alt="Delete Component button"
      src="../../../assets/delete-component.png"
      class="tut-screenshot"
    />
    <h class="tutorial-sub-heading">View component details</h>
    <p class="tutorialContent">
      In the right sidebar, there is a component details tab where you can
      access details about the active/selected component. Here, you can toggle
      between a dynamically-updated code preview, HTML element hierarchy
      diagram, and project routing visualization.
    </p>
    <img
      alt="Component Details"
      src="../../../assets/component-details.png"
      class="tut-screenshot"
    />
    <h class="tutorial-sub-heading">View routes</h>
    <p class="tutorialContent">
      You can find all of your routes in the Routes tab. To add a route, enter
      the name in the input field and click the ‘+’, or press enter. Once added,
      you can click on a route to navigate to it. To delete a route, click on
      the ‘x’ on the right side of the route block. (Note: The default route
      HomeView cannot be deleted.)
    </p>
    <img
      alt="Routes tab"
      src="../../../assets/routes.png"
      class="tut-screenshot"
    />
    <h class="tutorial-sub-heading">Save or export your project</h>
    <p class="tutorialContent">
      When you are satisfied with your project, you can save or export it using
      the buttons in the upper-right corner of the nav bar.
    </p>
    <p class="tutorialContent">
      <img
        style="vertical-align: middle"
        alt="save"
        src="../../../assets/save.png"
        class="tut-image"
      />Save your current OverVue project layout as a JSON file to access it
      again later<br />
      <img
        style="vertical-align: middle"
        alt="import"
        src="../../../assets/import.png"
        class="tut-image"
      />Open an existing JSON project file or import an existing Vue component
      <br />
      <img
        style="vertical-align: middle"
        alt="export"
        src="../../../assets/export.png"
        class="tut-image"
      />Export boilerplate code for your whole project, or just for a single
      component<br />
    </p>
    <q-btn
      class="tut-btn"
      color="secondary"
      id="version-btn"
      label="New Features in Version 10"
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
import { useStore } from "../../../stores/main.js";

const emit = defineEmits(["nextTab"]);
const nextTab = () => emit("nextTab");

const store = useStore();
const toggleTutorial = () => store.toggleTutorial();
</script>

<style scoped lang="scss">
#basicFunctions {
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

.controls {
  align-self: flex-start;
  font-size: 1.2rem;
  margin: 0.75rem;
  margin-bottom: 0px;
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
  max-width: 300px;
}

#advanced-btn {
  margin-top: 30px !important;
  margin-bottom: 50px !important;
}
</style>
../../../stores/main.js
