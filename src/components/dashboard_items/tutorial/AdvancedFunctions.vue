<template>
  <!--Typescript option, mock image?, nested HTML elements, import component/limitations -->
  Advanced Functions Here!
      <q-btn
      id="tut-btn"
      color="secondary"
      label="Get Started with OverVue"
      @click="toggleTutorial"
    />
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
#tut-btn {
  height: 15px;
  margin: 0 0.75rem;
  width: 50%;
}
</style>