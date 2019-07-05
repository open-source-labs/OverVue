<template>
  <div class="home-sidebar">
    <!-- <p class="panel-heading">Create a component</p> -->
    <br />
    <form v-on:submit.prevent="handleClick">
      <q-input
        standout="bg-teal text-white"
        bottom-slots
        v-model="componentNameInputValue"
        label="Component Name"
        :dense="dense"
        class="input-add"
      >
      </q-input>
    </form>

    <div class="icon-container">
      <Icons @getClickedIcon="addToSelectedElementList" />
    </div>
    <!-- <ChildrenMultiselect /> -->
    <br />
    <!-- <button
      class="button is-primary"
      id="add-component-btn"
      @click="handleClick"
      :disabled="!componentNameInputValue"
    >Add Component</button> -->
    <q-btn id="add-component-btn" class="primary" color="secondary" label="Create Component" icon-right="add" @click="handleClick" :disabled="!componentNameInputValue" />
  </div>
</template>

<script>
import Icons from './Icons'
// import ChildrenMultiselect from '@/components/ChildrenMultiselect';
import { mapState, mapActions } from 'vuex'
// import * as types from '../store/types.js'

export default {
  name: 'HomeSidebar',
  components: {
    // ChildrenMultiselect,
    Icons
  },
  computed: {
    ...mapState(['componentMap', 'selectedElementList']),
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
      'updateComponentNameInputValue'
    ]),
    handleClick () {
      const component = {
        componentName: this.componentNameInputValue,
        x: 0,
        y: 0,
        w: 200,
        h: 200,
        htmlList: this.selectedElementList,
        children: [],
        isActive: false
      }

      this.registerComponent(component)
    }
  }
}
</script>
<style scoped>
.is-primary {
  height: 45px;
}
form {
  margin-bottom: 2em;
}
#add-component-btn {
  height: 15px;
  margin: 0.75rem;
  width: 90%;
}
.home-sidebar {
  margin: 1rem;
  padding: 0.5rem;
  border: 1px solid rgba(215, 215, 215, 0.728);
  border-radius: 5px;
}
</style>
