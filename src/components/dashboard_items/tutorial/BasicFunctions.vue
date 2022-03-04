<template>
<!--Basic functionality here, add component, copy/paste, undo/redo, add html, saving, loading, exporting-->
  <section id="basicFunctions">
    <h6 class="tutorialHeading">Basic Functions Here!</h6>
    <p class="tutorialContent">Explain some basic functionality here</p>
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

<style scoped>
#basicFunctions{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.tutorialHeading {
  margin: .75rem;
}

.tutorialContent {
  margin: .75rem;
}

.tut-btn {
  margin: 0.75rem;
  width: 50%;
  min-height: 42px;
  height: auto;
}
</style>
