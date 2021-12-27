<!--
Description:
  Handles create component menu on left-side
  Functionality includes: creating a component, preventing users from entering invalid component file names
  -->
<!-- 4.0 adjustment: conditional render to switch between new comp name input and editing active comp name, moved from EditDeleteComponents -->


<template>
  <div class="inner-div drawer-menu">
    <br />
    <form
      v-on:submit.prevent="createComponent"
    >
    <!-- will render if creating new component -->
      <q-input
        v-if="activeComponent === ''"
        standout="bg-secondary text-white"
        bottom-slots
        v-on:keyup.delete.stop
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
    <ParentMultiselect v-if="activeComponent === ''"></ParentMultiselect>
    <br />

    <q-btn
      v-if="activeComponent ===''"
      id="add-component-btn"
      color="secondary"
      label="Create Component"
      @click="createComponent"
      :disabled="!componentNameInputValue.trim()"
    />

</div>
</template>

<script>
import Icons from '../Icons'
import ParentMultiselect from '../ParentMultiselect.vue'
import { mapState, mapActions } from 'vuex'


export default {
  name: 'HomeSidebar',
  components: {
    Icons,
    ParentMultiselect
  },
  computed: {
    ...mapState([
      'componentMap',
      'selectedElementList',
      'activeComponent',
      'activeHTML'
    ]),
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
      'addNestedNoActive',
      'editComponentName',
    ]),

    createComponent () {
      if (!this.componentNameInputValue.replace(/[^a-z0-9-_.]/gi, '')) {
        event.preventDefault()
        return false
      }
      // boilerplate properties for each component upon creation
      const component = {
        componentName: this.componentNameInputValue.replace(
          /[^a-z0-9-_.]/gi,
          ''
        ),
        x: 0,
        y: 20,
        z: 0,
        w: 200,
        h: 200,
        htmlList: this.selectedElementList,
        children: [],
        actions: [],
        props: [],
        state: [],
        parent: {},
        isActive: false
      }

      console.log(component)
      if (!this.componentMap[component.componentName]) {
        console.log('line119')
        this.registerComponent(component)
        console.log(this.setActiveComponent)
        // this.setActiveComponent(component.componentName)
      }
    },
  },
}

</script>

<style lang="scss" scoped>
.is-primary {
  height: 45px;
}
#add-component-btn {
  height: 15px;
  margin: 0.75rem;
  width: 90%;
}

.inner-div {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-left: 15px;
  padding-right: 15px;
  height: 100%;
}
</style>