<template>
  <div id="child-select">
    <br />
    <multiselect
      id="dropdown"
      placeholder="Select child components"
      :multiple="true"
      :close-on-select="false"
      :options="options"
      :value="componentChildrenMultiselectValue"
      @input="handleSelect"
      :max-height="150"
      :option-height="20"
      :searchable="false"
    ></multiselect>
    <!-- <q-select
      :options="options"
      label="Select children"
      multiple
    /> -->
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Multiselect from 'vue-multiselect'

export default {
  components: {
    Multiselect
  },
  computed: {
    ...mapState([
      'routes',
      // comes from store/state/index.js
      'componentMap',
      'activeComponent',
      'componentChildrenMultiselectValue',
      'modalOpen'
    ]),
    options () {
      const routes = Object.keys(this.routes)
      const exceptions = new Set(['App', this.activeComponent, ...routes])
      console.log('exceptions', exceptions)
      return Object.keys(this.componentMap).filter(component => {
        if (!exceptions.has(component)) return component
      })
    }
  },
  methods: {
    ...mapActions([
      'updateComponentChildrenMultiselectValue',
      'updateActiveComponentChildrenValue'
    ]),
    //
    handleSelect (value) {
      // if (this.modalOpen) this.updateActiveComponentChildrenValue(value)
      console.log('Multiselect: ', value)
      this.updateActiveComponentChildrenValue(value)
      this.updateComponentChildrenMultiselectValue(value)
    }
  }
}
</script>

<!-- New step!
     Add Multiselect CSS. Can be added as a static asset or inside a component. -->
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
  #child-select {
    min-width: 300px;
    min-height: 200px;
  }
</style>
