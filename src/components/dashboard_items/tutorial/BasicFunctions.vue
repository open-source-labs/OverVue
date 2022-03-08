<template>
<!--Basic functionality here, add component, copy/paste, undo/redo, add html, saving, loading, exporting-->
  <section id="basicFunctions">
    <h6 class="tutorialHeading">Getting Started in OverVue</h6>
    <p class="tutorialContent">Prototyping in OverVue is designed to be quick and efficient. Learning how to use OverVue will help
      you to integrate this tool into your design process for creating Vue applications. 
    </p><br>
    <h class="tutorial-sub-heading">Navigating OverVue</h>
    <p class="tutorialContent">If you ever want to navigate back to this page, click the gear icon <img style="vertical-align:middle" alt="Gear" src="../../../assets/gear.png" id="tut-image"> in the top navigation bar, all the way to the right, and select "Getting Started"
      to return to the landing page.
    </p>
    <p class="tutorialContent">Almost any action in OverVue can be reversed with 'undo' or recreated with 'redo' <img style="vertical-align:middle" alt="Undo-redo" src="../../../assets/undo_redo.png" id="tut-image"> found on
      the left side of the top navigation bar. You can also utilize keyboard shortcuts (cmd-z or ctrl-z to undo; cmd-y or ctrl-y to redo) to accomplish the same thing as clicking the buttons.
    </p>
    <p class="tutorialContent">There are three additional buttons on the top navigation bar to utilize: Save, Import and Export.
    </p>
    <p class="tutorialContent">
      <img style="vertical-align:middle" alt="save" src="../../../assets/save.png" id="tut-image">Save text here<br>
      <img style="vertical-align:middle" alt="import" src="../../../assets/import.png" id="tut-image">Import text here<br>
      <img style="vertical-align:middle" alt="export" src="../../../assets/export.png" id="tut-image">Export text here<br>
    </p>
    <q-btn
      class="tut-btn"
      color="secondary"
      label="Advanced Functionality"
      @click="nextTab"
    />
  </section>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  emits: ['nextTab'],
  methods: {
    ...mapActions(["toggleTutorial"]),
    nextTab(){
      this.$emit('nextTab')
    }
  }
}
</script>

<style scoped lang="scss">
#basicFunctions{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.tutorialHeading {
  margin: .75rem;
  font-size: 2rem;
  padding-top: 15px;
}

.tutorial-sub-heading{
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

#tut-image {
  margin: 4px;
}
</style>
