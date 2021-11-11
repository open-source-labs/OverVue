<!-- Component Tab Container that holds components for creating components, editing and deleting, and adding props.
Functionality includes: if active component is selected, will switch view to editing mode. If not, it will be in create mode -->
<template>
  <q-card id="store-cards">
    <CreateComponent v-if="activeComponent === ''"/>
    <EditDeleteComponents v-if="activeComponent !== ''"/>
  </q-card>
</template>

<script>
import CreateComponent from './CreateComponent.vue'
import EditDeleteComponents from './EditDeleteComponents.vue'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      // tab: 'details',
    }
  },
  computed: {
    ...mapState([
      'activeComponent',
    ])
  },

  components: {
    CreateComponent,
    EditDeleteComponents,
  }
}
</script>

<style lang="stylus">

// give html background color of grey
.html-bg 
  background-color: #202122

#store-cards 
  height: 100%
  border-radius: 0px
  background-color: #202122

.q-tab-panel 
  height 100%
  // matchs the code editor bg
  background $subprimary

// changes the length of the tab panels
.q-tab-panels
  height 100%
  padding 0 !important

.q-tabs
  background #11120F

</style>