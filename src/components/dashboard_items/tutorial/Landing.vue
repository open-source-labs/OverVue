<template>
<!--Landing page-->
  Welcome to OverVue!
    <q-btn
      id="tut-btn"
      color="secondary"
      label="Learn More"
      @click="nextTab"
    />
      <q-btn
      id="tut-btn"
      color="secondary"
      label="Close Tutorial"
      @click="toggleTutorial"
    />
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

#tut-btn {
  height: 15px;
  margin: 0 0.75rem;
  width: 50%;
}

</style>
