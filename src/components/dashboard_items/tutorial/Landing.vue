<template>
<!--Landing page-->
  <section id="welcomeTab">
  <h6 class="tutorialHeading">Welcome to OverVue!</h6>
    <q-btn
      class="tut-btn"
      color="secondary"
      label="Learn More"
      @click="nextTab"
    />
      <q-btn
      class="tut-btn"
      id="closeTutorialButton"
      label="Close Tutorial"
      @click="toggleTutorial"
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

<style lang="scss" scoped>
#welcomeTab{
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

#closeTutorialButton {
  background-color: $subprimary;
  color: $menutext;
  border: 1px solid $menutext;
}

</style>
