<!--
Description:
  Handles create component menu on left-side
  Functionality includes: creating a component, preventing users from entering invalid component file names
  -->

<template>
  <div class="home-sidebar drawer-menu">
    <br />
    <form v-on:submit.prevent="createComponent" v-on:click="resetActiveComponent">
      <q-input
        standout="bg-secondary text-white"
        bottom-slots
        v-model="componentNameInputValue"
        label="Component Name"
        dense
        class="input-add"
      ></q-input>
    </form>
    <div class="icon-container">
      <Icons
        class="icons"
        @getClickedIcon="addToSelectedElementList"
        @activeElement="addToComponentElementList"
        @activeHTML="addNestedHTML"
        @activeLayer="addNestedNoActive"
      />
    </div>
    <ParentMultiselect />
    <br />

    <q-btn
      id="add-component-btn"
      color="secondary"
      label="Create Component"
      @click="createComponent"
      :disabled="!componentNameInputValue.trim()"
    />
  </div>
</template>

<script>
import Icons from './Icons'
import ParentMultiselect from '../components/ParentMultiselect'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'HomeSidebar',
  components: {
    Icons,
    ParentMultiselect
  },
  computed: {
    ...mapState(['componentMap', 'selectedElementList', 'activeComponent', 'activeHTML']),
    componentNameInputValue: {
      get () {
        return this.$store.state.componentNameInputValue
      },
      set (value) {
        this.updateComponentNameInputValue(value)
      }
    }
  },
  methods: {
    ...mapActions([
      'registerComponent',
      'addToSelectedElementList',
      'updateComponentNameInputValue',
      'setActiveComponent',
      'addToComponentElementList',
      'addNestedHTML',
      'addNestedNoActive'
    ]),

    createComponent () {
      if (!this.componentNameInputValue.replace(/[^a-z0-9-_.]/gi, '')) {
        event.preventDefault()
        return false
      }
      const component = {
        componentName: this.componentNameInputValue.replace(/[^a-z0-9-_.]/gi, ''),
        x: 0,
        y: 20,
        z: 0,
        w: 200,
        h: 200,
        htmlList: this.selectedElementList,
        children: [],
        parent: {},
        isActive: false
      }

      this.registerComponent(component)
    },

    // clears active component during component creation
    resetActiveComponent () {
      if (this.activeComponent !== '') {
        this.setActiveComponent('')
      }
    }
  }
}
</script>

<style type="stylus" scoped>
.is-primary {
  height: 45px;
}
#add-component-btn {
  height: 15px;
  margin: 0.75rem;
  width: 90%;
}
.home-sidebar {
  margin: 1rem;
  padding: 0.5rem;
  border-radius: 5px;
}
</style>
