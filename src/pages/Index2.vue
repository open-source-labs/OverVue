 <!--
Description:
  Displays componentDisplay
  Functionality includes: N/A
  -->

<template>
  <q-page class="flex flex-center" id="compDisplay">
    <ComponentDisplay />
  </q-page>
</template>

<style>
</style>

<script>
import ComponentDisplay from '../components/ComponentDisplay.vue'

export default {
  name: 'PageIndex',
  components: {
    ComponentDisplay
  }
}
</script>

<style scoped>
 #compDisplay{
   overflow-x: scroll;
   overflow-y: scroll;
   margin: 0px;
   padding: 0px;
 }
</style>