<template>
  <div id="parent-select">
    <br />
    <multiselect
      v-model="value"
      placeholder="Parent Component"
      :multiple="false"
      :close-on-select="true"
      :options="options"
      @input="handleSelect"
      @open="resetActiveComponent"
      :max-height="90"
      :option-height="20"
      :searchable="true"
    >
    <span slot='noResult'>No components found.</span>
    </multiselect>
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
  data () {
    return { value: '' }
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
    ...mapActions([
      // 'addParent',
      'parentSelected', 'setActiveComponent'
    ]),
    handleSelect (value) {
      // Set Active Component to selected Parent
      // this.setActiveComponent(value)
      // this.addParent(value)
      // Set parentSelected to true IF VALUE IS A VALID PARENT (not null)
      this.parentSelected(value)
    },
    resetActiveComponent () {
      if (this.activeComponent !== '') {
        this.setActiveComponent('')
      }
    }
  },
  watch: {
    componentMap: {
      handler () {
        // console.log('activeComponent has changed')
        this.value = ''
      }
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
  #parent-select {
    height: 30px;
    margin: 0.75rem;
    width: 90%;
  }
</style>
