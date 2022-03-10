 <!--
Description:
  Displays Canvas
  Functionality includes: N/A
  -->

<template>
  <q-page class="flex flex-center" id="compDisplay">
    <Canvas />
  </q-page>
</template>

<style>
</style>

<script>
import Canvas from '../components/Canvas.vue'

export default {
  name: 'PageIndex',
  components: {
    Canvas
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