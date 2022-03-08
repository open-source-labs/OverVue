<template>
  <!--Typescript option, mock image?, nested HTML elements, import component/limitations -->
    <section id="advancedFunctions">
      <h6 class="tutorialHeading">Advanced Functions Here!</h6>
      <p class="tutorialContent">Some fancier functionality here</p>
      <q-btn
        class="tut-btn"
        color="secondary"
        label="Get Started with OverVue"
        @click="toggleTutorial"
      />
    </section>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions(["toggleTutorial"]),
  }
}
</script>

<style scoped>
#advancedFunctions{
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
}

.tut-btn {
  margin: 0.75rem;
  width: 50%;
  min-height: 42px;
  height: auto;
}
</style>