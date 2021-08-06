<!--
Description:
  Displays list of components in the active route.
  Functionality includes: delete component, set active component, search for component via multiselect.
  -->

<template>
  <div class="home-sidebar">
     <q-input
      @keyup.enter.native="editCompName(newName)"
      standout="bg-secondary text-white"
      bottom-slots
      v-on:keyup.delete.stop
      v-model="newName"
      label="Edit name"
      dense
      class="input-add"
    />
      <!-- <template v-slot:append>
        <q-btn
          round
          dense
          flat
          icon="fas fa-edit"
          @click="editCompName(newName)"
        />
      </template> -->
    <multiselect
      class='multiselect'
      v-model="value"
      :options='options'
      :searchable="true"
      :close-on-select="true"
      :max-height="90"
      :option-height="20"
      @input="handleSelect(value)"
      @open="resetActiveComponent"
      placeholder="Select a component">
      <span slot='noResult'>No components found.</span>
      </multiselect>
      <br/>
    <h v-if="this.activeComponentObj"> Currently selected component: {{ activeComponentObj.componentName }} </h>
    <h v-else> Select a component </h>
    <q-btn id="deleteButton" @click="deleteSelectedComp(activeComponentData)" label = 'Delete currently selected'/>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Multiselect from 'vue-multiselect'

export default {
  data () {
    return {
      value: '',
      newName: ''
    }
  },
  components: { Multiselect },
  computed: {
    ...mapState(['routes', 'activeRoute', 'activeComponent', 'activeComponentObj']),
    activeRouteDisplay () {
      let component = this.routes[this.activeRoute]
      // console.log('component', component)
      return component
    },
    activeComponentData () {
      return this.activeComponentObj
      // set(name){
      //   this.editComponentName(name)
      // }
    },
    options () {
      const val = this.activeRouteDisplay.map(component => component.componentName)
      // console.log('options', val)
      return val
    }
  },
  methods: {
    ...mapActions([
      'setActiveComponent',
      'deleteComponent',
      'deleteActiveComponent',
      'editComponentName'
    ]),
    // Set component as active component from left side dropdown
    // onActivated (componentData) {
    //   this.setActiveComponent(componentData.componentName)
    //   this.activeComponentData.isActive = true
    // },
    //
    // deleteCircumvent (e) {
    //   e.preventDefault()
    // },
    // Deletes the selected component
    deleteSelectedComp (componentData) {
      if (componentData) {
        // this.setActiveComponent(componentData.componentName)
        this.deleteActiveComponent(componentData.componentName)
      }
    },
    // Select active component from multi-select input
    handleSelect (componentName) {
      this.setActiveComponent(componentName)
      this.value = ''
      this.activeComponentData.isActive = true
    },
    // Deselects active component
    resetActiveComponent () {
      if (this.activeComponent !== '') {
        this.setActiveComponent('')
      }
    },
    editCompName (name) {
      if (name) this.editComponentName(name)
      console.log(this.routes[this.activeRoute])
      console.log(this.activeComponentObj)
      console.log(this.activeComponent)
    }
  },
  watch: {
    activeComponentObj: function () {
      if (this.activeComponentObj) this.newName = this.activeComponentObj.componentName
    }
  }
}
</script>

<style>
/* modifies entire container */
.home-sidebar {
  padding: 0.5rem;
  border-radius: 5px;
}
/* modifies top label */
.component {
  text-transform: uppercase;
}
/* modifies each list element */
.q-list {
  margin-bottom: 0.5rem;
  border-radius: 5px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 3px 6px 0 rgba(0, 0, 0, 0.13);
}
.component-info {
  margin: auto 0;
}
/* modifies content in list element */
.component-container {
  display: flex;
  justify-content: space-between;
}

h {
  color: white;
}

#deleteButton {
 background-color: #289ead;
 color: white;
}
</style>
