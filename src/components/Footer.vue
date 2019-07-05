<template>
    <q-footer reveal elevated class="primary text-white">
      <q-toolbar>
        <q-btn push color="secondary" round icon="keyboard_arrow_up" />
        <q-toolbar-title>Dashboard</q-toolbar-title>
        <FooterTabView />
      </q-toolbar>
    </q-footer>
</template>

<script>
import FooterTabView from './FooterTabView'

export default {
  components: {
    FooterTabView
  }
}
</script>

<style lang="stylus">
.q-footer {
  height: 20vh;
}
</style>
