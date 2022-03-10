<!--
Description:
  Contains edit functionality for selected component
  Functionality includes: delete component, set active component, search for component, change name of component,adjust layer of component,
  delete props, state, actions, HTML elements, or children of component.
  -->

<template>
  <div class="edit-component-div">
    <div>
      <button class="menu-link" @click="resetActiveComponent"><i class="fa fa-arrow-left" aria-hidden="true"></i>&nbsp; &nbsp; Create Component Menu</button>
      <q-card class="no-shadow" dark flat>
      <q-expansion-item default-opened label="Update Component">
      <q-input
        @keyup.enter="editCompName(newName)"
        v-on:keyup.delete.stop
        v-model="newName"
        :placeholder="this.activeComponent"
        color="white"
        dark
        dense
        outlined
        item-aligned
        padding="5px"
        class="input-add"
        style="margin-bottom: 30px"
        no-error-icon
        reactive-rules
        :rules="[ val => !Object.keys(this.componentMap).includes(val) || val === this.activeComponent || 'A component with this name already exists' ]"
      ></q-input>
      <!-- for the icon list -->
      <VueMultiselect
        v-model="childrenSelected"
        placeholder="Add/remove children"
        :multiple="true"
        :close-on-select="false"
        :options="options"
        :show-labels="false"
        @remove="handleAddChild"
        @select="handleAddChild"
        :max-height="300"
        :option-height="20"
        :searchable="false"
      />
      <q-list
        class="accordBorder no-shadow"
        active-color="secondary"
        indicator-color="secondary"
      >
        <q-expansion-item group="accordion" label="HTML Elements">
          <div class="icon-container">
            <Icons
              class="icons"
              @getClickedIcon="addToSelectedElementList"
              @activeElement="addToComponentElementList"
              @activeHTML="addNestedHTML"
              @activeLayer="addNestedNoActive"
            />
          </div>
          <div class="componentHTML">
            <HTMLQueue></HTMLQueue>
          </div>
          <br />
        </q-expansion-item>
        <!-- Props item that has AddProps component in it -->
        <q-expansion-item group="accordion" label="Props">
          <AddProps />
          <p v-if="!this.activeComponentObj.props.length">
            No props in component
          </p>
          <div v-else>
            <a
              v-for="prop in this.activeComponentData.props"
              :key="prop"
              v-on:click="onActivated(prop)"
            >
              <q-list class="list=item" dense bordered separator>
                <q-item clickable v-ripple class="list-item">
                  <q-item-section>
                    <div class="component-container">
                      <div class="component-info">
                        {{ prop }}
                      </div>
                      <q-btn
                        flat
                        icon="highlight_off"
                        v-on:click.stop="deleteProp(prop)"
                      />
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </a>
          </div>
        </q-expansion-item>
        <!-- Vuex State item that will have state displayed and option to delete -->
        <q-expansion-item group="accordion" label="State">
          <ComponentState />
        </q-expansion-item>
        <q-expansion-item group="accordion" label="Actions">
          <ComponentActions />
        </q-expansion-item>
      </q-list>
      <q-btn
        id="exportButton"
        class="sidebar-btn"
        @click="useExportComponentBound"
        label="Export currently selected"
      />
      <q-btn
        id="deleteButton"
        class="sidebar-btn deleteAction"
        @click="deleteSelectedComp(activeComponentData)"
        label="Delete currently selected"
      />
     </q-expansion-item>
     </q-card>  
    </div>
  </div>
</template>

<script setup>
  import { useExportComponent } from "../../composables/useExportComponent.js";
</script>

<script>
import { mapState, mapActions } from "vuex";
import VueMultiselect from "vue-multiselect";
import HTMLQueue from "../../dashboard_items/HTMLQueue.vue";
import Icons from "./Icons.vue";
import AddProps from "./AddProps.vue";
import ComponentState from "./ComponentState.vue";
import ComponentActions from "./ComponentActions.vue";

const cloneDeep = require("lodash.clonedeep");
const { fs, ipcRenderer } = window;

export default {
  data() {
    return {
      value: "",
      newName: "",
      childrenSelected: [],
    };
  },
  components: {
    VueMultiselect,
    HTMLQueue,
    Icons,
    AddProps,
    ComponentState,
    ComponentActions,
  },
  computed: {
    ...mapState([
      "routes",
      "activeRoute",
      "activeComponent",
      "activeComponentObj",
      "componentMap",
      "exportAsTypescript",
    ]),
    
    activeRouteDisplay() {
      let component = this.routes[this.activeRoute];
      return component;
    },

    activeComponentData() {
      return cloneDeep(this.activeComponentObj);
    },

    // returns options for component multiselect
    options() {
      if (this.activeComponent !== '')
        this.newName = this.activeComponentObj.componentName;
        if (this.activeComponent !== ''){
          this.childrenSelected = [];
          this.childrenSelected = this.componentMap[this.activeComponent].children;
        } else {
          this.childrenSelected = [];
      }
      const compMap = this.componentMap;
      const activeComp = this.activeComponent;
      const val = this.activeRouteDisplay.map(
        (component) => component.componentName
      );
      const relatives = [...val]
        //also need to filter out any parents

      let parentalLineage = [];
      findLineage(relatives)
      function findLineage(children){
        children.forEach((el)=>{
          parentalLineage.push(el);
          if (compMap[el].children.length > 0){
            findLineage(compMap[el].children);
          }
          if (el !== activeComp){
            parentalLineage.pop();
          } else {
            return;
          }
        })
      }
      const optionOutput = val.filter(el => !parentalLineage.includes(el)).filter(el => el !== this.activeComponent); 
      return optionOutput;
    },

  },

  methods: {
    ...mapActions([
      "setActiveComponent",
      "deleteComponent",
      "deleteActiveComponent",
      "editComponentName",
      "updateComponentLayer",
      "updateActiveComponentChildrenValue",
      "addToSelectedElementList",
      "addToComponentElementList",
      "addNestedHTML",
      "addNestedNoActive"
    ]),
    useExportComponentBound(){
      useExportComponent.bind(this)();
    },
    handleAddChild(value) { //actually handles adding or deleting
      this.updateActiveComponentChildrenValue(value);
    },

    // Set component as active component from left side dropdown
    onActivated(componentData) {
      if (componentData) {
        this.setActiveComponent(componentData.componentName);
        this.activeComponentData.isActive = true;
      }
    },

    // Deletes the selected component
    deleteSelectedComp(componentData) {
      if (componentData) {
        // this.setActiveComponent(componentData.componentName)
        this.deleteActiveComponent(componentData.componentName);
      }
    },

    // Delete prop
    deleteProp(prop) {
      this.$store.dispatch('deletePropsFromComponent', prop);
    },

    // changes layer of active component
    handleLayer(e) {
      e.preventDefault();
      const payload = {
        activeComponent: this.activeComponent,
        routeArray: this.routes[this.activeRoute],
        activeComponentData: this.activeComponentData,
        z: this.activeComponentData.z,
      };
      if (e.target.innerText === "+") payload.z++;
      if (e.target.innerText === "-" && payload.z > 0) payload.z--;
      this.updateComponentLayer(payload);
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

    // edit name of selected component
    editCompName(name) {
      if (
        name &&
        name !== this.activeComponent &&
        this.activeComponent &&
        !this.componentMap[name]
      )
        this.editComponentName(name);
      this.setActiveComponent(this.activeComponent);
    },
  },
};
</script>

<style lang="scss" scoped>

.edit-component-div {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  margin: 4px;
}

.menu-link{
  background-color: $subprimary;
  color: $menutext;
  border: 1px solid $subprimary;
  margin-bottom: 20px; 
  padding: 0;
}

.menu-link:hover{
  color: $primary;
}

.q-field {
  margin: 30px 0 10px;
}

.q-expansion-item {
  margin-bottom: 10px;
  background-color: $subprimary;
}

.q-expansion-item__content {
  padding: 20px 0;
}

.componentHTML {
  height: 100px;
  margin-top: 20px;
  padding: 10px;
  background-color: rgba($subsecondary, .5);
  overflow-y: scroll;
  border: 1px solid rgba(245, 245, 245, 0.3);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  resize: vertical;
}

.toggleRow {
  display: flex;
  /* align-items: center; */
  justify-content: space-between;
}

/* modifies entire container */
.edit-sidebar {
  padding: 0.5rem;
  border-radius: 5px;
  margin: 1rem;
}

/* modifies each list element */
.q-list {
  margin: 30px 0;
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
  color: $menutext;
}

.title {
  font-size: 20px;
  font-weight: bold;
  color: $menutext;
}

.toggleText {
  color: $menutext;
}

.toggle {
  align-self: flex-end;
}

#deleteButton {
  width: 100%;
  margin-top: 30px;
  margin-bottom: 30px;
}

#exportButton {
  background-color: $secondary;
  color: $menutext;
  width: 100%;
  margin-bottom: 30px;
}

.border-panel {
  display: flex;
  flex-direction: column;
  align-content: stretch;
  justify-content: flex-start;
  padding: 10px;
  border: 3px solid black;
  border-radius: 10px;
  background-color: $subsecondary;
}

.inner-div {
  display: flex;
  flex-direction: column;
  height: 94%;
  margin: 10px;
}
</style>
