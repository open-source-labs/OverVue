<template>
  <div id="parent-select">
    <br />
    <multiselect
      placeholder="Choose Parent (if applicable)"
      :multiple="false"
      :close-on-select="true"
      :options="options"
      @input="handleSelect"
      :max-height="150"
      :option-height="20"
      :searchable="false"
    ></multiselect>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Multiselect from 'vue-multiselect'

export default {
  name: 'ParentMultiselect',
  components: {
    Multiselect
  },
  computed: {
    ...mapState([
      'routes',
      'componentMap',
      'activeComponent'
    ]),
    options () {
      const routes = Object.keys(this.routes)
      const exceptions = new Set(['App', ...routes])
      return Object.keys(this.componentMap).filter(component => {
        if (!exceptions.has(component)) return component
      })
    }
  },
  methods: {
    ...mapActions([
      'setActiveComponent',
      'parentSelected'
    ]),
    handleSelect (value) {
      // Set Active Component to selected Parent
      this.setActiveComponent(value)
      // Set parentSelected to true IF VALUE IS A VALID PARENT (not null)
      this.parentSelected(true)
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>

</style>
