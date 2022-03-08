<template>
<!--Basic functionality here, add component, copy/paste, undo/redo, add html, saving, loading, exporting-->
  <section id="basicFunctions">
    <h6 class="tutorialHeading">Getting Started in OverVue</h6>
    <p class="tutorialContent">Prototyping in OverVue is designed to be quick and efficient. Learning how to use OverVue will help
      you to integrate this tool into your design process for creating Vue applications. 
    </p>
    <p class="tutorialContent">If you ever want to navigate back to this page, click the gear icon<img style="vertical-align:middle" alt="Gear" src="../../../assets/gear.png" id="tut-image"> in the top right and select "Getting Started"
      to return to the landing page.
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
  border: 1px solid white;
}
</style>
