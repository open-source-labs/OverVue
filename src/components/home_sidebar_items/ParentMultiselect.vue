<!--
Description:
  Displays multiselect dropdown for already existing components in CreateComponent
  Functionality includes: selects parent for created component
  -->

<template>
  <div id="parent-select">
    <br />
    <VueMultiselect
      v-model="selected"
      placeholder="Parent Component"
      :multiple="false"
      :close-on-select="true"
      :options="options"
      @input="selectParent"
      @open="resetActiveComponent"
      :max-height="90"
      :option-height="20"
      :searchable="true"
    >
    <!-- refactor slot syntax here -->
    <!-- <span slot='noResult'>No components found.</span> -->
    <span class='noResult'>
      <slot></slot>
    </span>
    </VueMultiselect>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import VueMultiselect from 'vue-multiselect'

export default {
  name: 'ParentMultiselect',
  components: {
    VueMultiselect
  },
  data () {
    return { selected: '' }
  },
  computed: {
    ...mapState([
      'routes',
      'componentMap',
      'activeComponent',
      'activeRoute',
      'routes'
    ]),
    options () {
      return this.routes[this.activeRoute].map(component => component.componentName)
    }
  },
  methods: {
    ...mapActions(['parentSelected', 'setActiveComponent']),
    selectParent (selected) {
      this.parentSelected(selected)
    },
    // when multiselect is opened activeComponent is deselected to allow for parentSelected action
    resetActiveComponent () {
      if (this.activeComponent !== '') {
        this.setActiveComponent('')
      }
    }
  },
  // clears out selected in mutiselect on creation of component
  watch: {
    componentMap: {
      handler () {
        // console.log('componentMap has changed')
        this.selected = ''
      }
    }
  }
}

</script>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style scoped>
  #parent-select {
    height: 30px;
    margin: 0.75rem;
    width: 90%;
  }
</style>
