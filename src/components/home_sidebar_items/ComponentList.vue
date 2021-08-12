<!--
Description:
  Displays list of components in the active route.
  Functionality includes: delete component, set active component, search for component via multiselect.
  -->

<template>
  <div class="edit-sidebar">
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
      class="multiselect"
      v-model="value"
      :options="options"
      :searchable="true"
      :close-on-select="true"
      :max-height="90"
      :option-height="20"
      @input="handleSelect(value)"
      @open="resetActiveComponent"
      placeholder="Select a component"
    >
      <span slot="noResult">No components found.</span>
    </multiselect>
    <br />
    <p class="editName" v-if="this.activeComponentObj">
      Currently selected component: {{ this.activeComponentObj.componentName }}
    </p>
    <p class="editName" v-else>Select a component</p>
    <q-btn id="deleteButton" @click="deleteSelectedComp(activeComponentData)" label = 'Delete currently selected'/>
    <div v-if="this.activeComponentData">
<p>Toggle to edit state</p>
    <toggle-button v-model="showState"/>
    <a
      v-for="s in this.activeComponentData.state"
      :key="s"
    >
      <q-list v-if="showState" class="list-item" dense bordered separator>
        <q-item clickable v-ripple class="list-item">
          <q-item-section>
            <div class="component-container">
              <div class="component-info">
                {{s}}
              </div>
              <q-btn round flat icon="highlight_off" v-on:click="deleteState(s)" />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
      </a>
    </br>
    <p>Toggle to edit actions</p>
    <toggle-button v-model="showActions" />
        <a
      v-for="action in this.activeComponentData.actions"
      :key="action"
    >
      <q-list v-if="showActions" class="list-item" dense bordered separator>
        <q-item clickable v-ripple class="list-item">
          <q-item-section>
            <div class="component-container">
              <div class="component-info">
                {{action}}
              </div>
              <q-btn round flat icon="highlight_off" v-on:click="deleteAction(action)" />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
      </a>
    <br/>
    <p>Toggle to edit props</p>
    <toggle-button v-model="showProps"/>
    <a
      v-for="prop in this.activeComponentData.props"
      :key="prop"
    >
          <!-- v-on:click="onActivated(prop)" -->

      <q-list v-if="showProps" class="list-item" dense bordered separator>
        <q-item clickable v-ripple class="list-item">
          <q-item-section>
            <div class="component-container">
              <div class="component-info">
                {{prop}}
              </div>
              <q-btn round flat icon="highlight_off" v-on:click.stop="deleteProp(prop)" />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
      </a>
    </div>
    <p v-else> Select Component to Enable Edit </p>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Multiselect from "vue-multiselect";
import { ToggleButton } from "vue-js-toggle-button";

export default {
  data() {
    return {
      value: "",
      newName: "",
      showState: false,
      showActions: false,
      showProps: false,
    };
  },
  components: { Multiselect, ToggleButton },
  computed: {
    ...mapState([
      "routes",
      "activeRoute",
      "activeComponent",
      "activeComponentObj",
      "componentMap",
    ]),
    activeRouteDisplay() {
      let component = this.routes[this.activeRoute];
      // console.log('component', component)
      return component;
    },
    activeComponentData() {
      return this.activeComponentObj;
    },
    options() {
      const val = this.activeRouteDisplay.map(
        (component) => component.componentName
      );
      return val;
    },
  },
  methods: {
    ...mapActions([
      "setActiveComponent",
      "deleteComponent",
      "deleteActiveComponent",
      "editComponentName",
      "deleteActionFromComponent",
      "deletePropsFromComponent",
      "deleteStateFromComponent"
    ]),

    deleteState (state) {
      this.deleteStateFromComponent(state)
      console.log(this.activeComponentObj)
    },

    deleteAction (action) {
      this.deleteActionFromComponent(action)
      console.log(this.activeComponentObj)
    },
    
    deleteProp (prop) {
      this.deletePropsFromComponent(prop)
      console.log(this.activeComponentObj)
    },
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
    deleteSelectedComp(componentData) {
      if (componentData) {
        // this.setActiveComponent(componentData.componentName)
        this.deleteActiveComponent(componentData.componentName);
      }
    },
    // Select active component from multi-select input
    handleSelect(componentName) {
      this.setActiveComponent(componentName);
      this.value = "";
      this.activeComponentData.isActive = true;
    },
    // Deselects active component
    resetActiveComponent() {
      if (this.activeComponent !== "") {
        this.setActiveComponent("");
      }
    },
    editCompName(name) {
      if (name && name !== this.activeComponent && this.activeComponent)
        this.editComponentName(name);
      this.setActiveComponent(this.activeComponent);
      console.log(this.componentMap);
    },
  },
  watch: {
    activeComponentObj: function () {
      if (this.activeComponentObj) this.newName = this.activeComponentObj.componentName
    }
  },
};
</script>

<style>
/* modifies entire container */
.edit-sidebar {
  padding: 0.5rem;
  border-radius: 5px;
  margin: 1rem;
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
p {
  color: white;
}
.editName {
  color: white;
}

#deleteButton {
  background-color: #289ead;
  color: white;
}
</style>
