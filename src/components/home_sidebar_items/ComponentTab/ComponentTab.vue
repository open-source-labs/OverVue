<!-- Component Tab Container that holds components for creating components, editing and deleting, and adding props.
Functionality includes: if active component is selected, will switch view to editing mode. If not, it will be in create mode -->
<template>
  <q-card id="store-cards">
    <!-- display component name if there is active component selected -->
    <!-- <q-tabs
      v-model="tab"
      dense
      class="bg-subaccent text-white"
      active-color="secondary"
      indicator-color="secondary"
    >
      <q-tab name="details" label="details"/>
      <q-tab name="vuex" label="vuex"/>
    </q-tabs>
    <q-tab-panels v-model="tab" animated class="html-bg text-white" >
      <q-tab-panel name="details">
        <CreateComponent v-if="activeComponent === ''"></CreateComponent>
        <EditDeleteComponents v-if="activeComponent !== ''"></EditDeleteComponents>
      </q-tab-panel>
      <q-tab-panel name="vuex">
        <h6>Vuex Mapping State and Actions</h6>
      </q-tab-panel>
    </q-tab-panels> -->
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