<template>
  <div class="home-sidebar">
    <!-- <p class="panel-heading">Create a component</p> -->
    <br />
    <form v-on:submit.prevent="handleClick" v-on:click="resetActiveComponent">
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
      <Icons @getClickedIcon="addToSelectedElementList" @activeElement="addToComponentElementList"/>
    </div>
    <ParentMultiselect />
    <br />
    <q-btn id="add-component-btn" class="primary" color="secondary" label="Create Component" icon-right="add" @click="handleClick" :disabled="!componentNameInputValue" />
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
    ...mapState(['componentMap', 'selectedElementList', 'activeComponent']),
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
      'addToComponentElementList'
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
    },
    resetActiveComponent () {
      this.setActiveComponent('')
    },
    handleIconClick () {
      if (this.activeComponent === '') this.setClickedElementList()
      else this.setComponentHtmlList()
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
