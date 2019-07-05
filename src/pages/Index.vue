<template>
  <q-page class="flex flex-center">
    <!-- <img alt="Quasar logo" src="~assets/quasar-logo-full.svg"> -->
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
