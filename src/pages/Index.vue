<!--
Description:
  Displays componentDisplay
  Functionality includes: N/A
  -->

<template>
  <q-page class="flex flex-center">
    <ComponentDisplay />
  </q-page>
</template>

<style>
</style>

<script>
import ComponentDisplay from '../components/ComponentDisplay'

export default {
  name: 'PageIndex',
  components: {
    ComponentDisplay
  }
}
</script>
