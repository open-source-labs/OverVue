<template>
  <!--Basic functionality here, add component, copy/paste, undo/redo, add html, saving, loading, exporting-->
  <section id="basicFunctions">
    <h6 class="tutorialHeading">Getting Started in OverVue</h6>
    <p class="tutorialContent">Prototyping in OverVue is designed to be quick and efficient. Learning how to use OverVue
      will help
      you to integrate this tool into your design process for creating Vue applications.
    </p><br>
    <h class="tutorial-sub-heading">Navigating OverVue</h>
    <p class="tutorialContent">If you ever want to navigate back to this page, click the gear icon <img
        style="vertical-align:middle" alt="Gear" src="../../../assets/gear.png" class="tut-image"> in the top navigation
      bar, all the way to the right, and select "Getting Started"
      to return to the landing page.
    </p>
    <p class="tutorialContent">Almost any action in OverVue can be reversed with 'undo' or recreated with 'redo' <img
        style="vertical-align:middle" alt="Undo-redo" src="../../../assets/undo_redo.png" class="tut-image"> found on
      the left side of the top navigation bar. You can also utilize keyboard shortcuts (cmd-z or ctrl-z to undo; cmd-y
      or ctrl-y to redo) to accomplish the same thing as clicking the buttons.
    </p>
    <p class="tutorialContent">There are three additional buttons on the top navigation bar to utilize: Save, Import and
      Export.
    </p>
    <p class="tutorialContent">
      <img style="vertical-align:middle" alt="save" src="../../../assets/save.png" class="tut-image">Save your OverVue
      project progress as a JSON file to access it again later<br>
      <img style="vertical-align:middle" alt="import" src="../../../assets/import.png" class="tut-image">Open an
      existing JSON project file or import an existing Vue component <br>
      <img style="vertical-align:middle" alt="export" src="../../../assets/export.png" class="tut-image">Export
      boilerplate code for your whole project or a single component<br>
    </p>
    <p class="tutorialContent">In the right sidebar, you'll find the Routes, Project Tree, and Component Details tabs:
    </p>
    <img alt="Right Sidebar tabs" src="../../../assets/rightsidebar.png" class="tut-screenshot">
    <h class="tutorial-sub-heading">Routes</h>
    <p class="tutorialContent">You can find all of your routes in the Routes tab. To add a route, enter the name in the
      input field and click the ‘+’, or press enter. Once added, you can click on a route to navigate to it. To delete a
      route, click on the ‘x’ on the right side of the route block. (Note: The default route HomeView cannot be
      deleted.)
    </p>
    <img alt="Routes tab" src="../../../assets/routes.png" class="tut-screenshot">
    <h class="tutorial-sub-heading">Uploading mockups</h>
    <p class="tutorialContent">You can upload a design mockup in the Routes tab of the right sidebar menu (one mockup
      per route). Select the route in the Routes tab, open the ‘Upload Mockup’ sub-menu and click ‘Upload Mockup’. To
      clear the image, click the ‘Clear Image’ button.
    </p>
    <img alt="Upload Mockup buttons" src="../../../assets/upload-mockups.png" class="tut-screenshot">
    <h class="tutorial-sub-heading">Project Tree</h>
    <p class="tutorialContent">You can find a visualization of your app hierarchy in the Project Tree tab of the right
      sidebar. Routes are blue, components are green. You can also navigate to a component or route by clicking on it in
      the project tree.
    </p>
    <img alt="Project Tree" src="../../../assets/project-tree.png" class="tut-screenshot">
    <h class="tutorial-sub-heading">Component Details</h>
    <p class="tutorialContent">Under the component details tab, you can access details about the active/selected
      component - including a code snippet (live generated boilerplate code), the HTML elements, state, actions or props
      in the component.
    </p>
    <img alt="Component Details" src="../../../assets/component-details.png" class="tut-screenshot">
    <p class="tutorialContent">In the left sidebar, you’ll find the Component and Store tabs:</p>

    <h class="tutorial-sub-heading">Creating a component from scratch</h>
    <p class="tutorialContent">Under the Create Component menu in the left sidebar, set a component name (required) and
      optionally select a parent component, and/or html elements to be nested inside the component (see Advanced
      Functionality to add deeper nesting to html elements).
    </p>
    <img alt="Create Component Menu" src="../../../assets/create_component_box.png" class="tut-screenshot">
    <h class="tutorial-sub-heading">Editing a component</h>
    <p class="tutorialContent">To update a component, select the component on the canvas and an Update Component menu
      will appear in the left sidebar. To update the name, enter the new name in the field and click enter.
    </p>
    <h class="tutorial-sub-heading">Deleting a component</h>
    <p class="tutorialContent">To delete a component, select it and click ‘Delete Currently Selected’ in the Update
      Component menu or press the delete key.
    </p>
    <img alt="Delete Component button" src="../../../assets/delete-component.png" class="tut-screenshot">
    <q-btn class="tut-btn" color="secondary" id="version-btn" label="New Features" @click="nextTab" />
  </section>
</template>

<script>
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
  margin: .75rem;
  font-size: 2rem;
  padding-top: 15px;
}

.tutorial-sub-heading {
  align-self: flex-start;
  font-size: 1.4rem;
  margin: .75rem;
  margin-bottom: 0px;
}

.tutorialContent {
  margin: .75rem;
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
  max-width: 300px;
}

#advanced-btn {
  margin-top: 30px !important;
  margin-bottom: 50px !important;
}
</style>
