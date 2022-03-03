<template>
<!--Basic functionality here, add component, copy/paste, undo/redo, add html, saving, loading, exporting-->
  Basic Functions Here!
    <q-btn
      id="tut-btn"
      color="secondary"
      label="Advanced Functionality"
      @click="nextTab"
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
