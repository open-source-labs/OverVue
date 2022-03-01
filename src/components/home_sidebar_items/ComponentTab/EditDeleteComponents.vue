<!--
Description:
  Contains edit functionality for selected component
  Functionality includes: delete component, set active component, search for component, change name of component,adjust layer of component,
  delete props, state, actions, HTML elements, or children of component.
  -->

<template>
  <div class="inner-div">
    <div class="border-panel">
      <p class="title">Update Component</p>
      <!-- name editor component -->
      <q-input
        @keyup.enter.native="editCompName(newName)"
        standout="bg-secondary text-white"
        bottom-slots
        v-on:keyup.delete.stop
        v-model="newName"
        label="Edit name"
        dense
        class="input-add"
      >
        <template v-slot:append>
          <q-btn
            round
            dense
            flat
            icon="fas fa-edit"
            @click="editCompName(newName)"
          />
        </template>
      </q-input>
      <!-- for the icon list -->
      <VueMultiselect
        v-model="testModel"
        placeholder="Add/Remove Children"
        multiple
        :close-on-select="true"
        :options="childOptions"
        @select="handleAddChild"
        @remove="handleDeleteChild"
        :max-height="90"
        :option-height="20"
        :searchable="false"
      />

      <q-list
        class="accordBorder"
        active-color="secondary"
        indicator-color="secondary"
      >
        <q-expansion-item group="accordion" label="HTML">
          <div class="icon-container">
            <Icons
              class="icons"
              @getClickedIcon="addToSelectedElementList"
              @activeElement="addToComponentElementList"
              @activeHTML="addNestedHTML"
              @activeLayer="addNestedNoActive"
            />
          </div>
          <br />
        </q-expansion-item>
        <!-- Props item that has AddProps component in it -->
        <q-expansion-item group="accordion" label="Props">
          <br />
          <AddProps />
          <br />
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
                        round
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
          <br />
          <ComponentState />
        </q-expansion-item>
        <q-expansion-item group="accordion" label="Actions">
          <br />
          <ComponentActions />
        </q-expansion-item>
      </q-list>

      <q-btn
        id="deleteButton"
        @click="deleteSelectedComp(activeComponentData)"
        label="Delete currently selected"
      />

      <br />
            <q-btn
        id="deleteButton"
        @click="handleExportComponent"
        label="Export currently selected"
      />

        <br />
      <q-list
        class="accordBorder"
        active-color="secondary"
        indicator-color="secondary"
      >
        <q-expansion-item group="accordion" label="Select another Component">
          <VueMultiselect
            class="multiselect"
            v-model="value"
            :options="options"
            :searchable="true"
            :close-on-select="true"
            :max-height="90"
            :option-height="20"
            @select="handleSelect"
            placeholder="Select/Search component"
          >
            <span slot="noResult">No components found.</span>
          </VueMultiselect>
        </q-expansion-item>
      </q-list>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import VueMultiselect from "vue-multiselect";
import HTMLQueue from "../../dashboard_items/HTMLQueue.vue";
import Icons from "./Icons.vue";
import AddProps from "./AddProps.vue";
import ComponentState from "./ComponentState.vue";
import ComponentActions from "./ComponentActions.vue";
import handleExportComponentMixin from "../../ExportComponentMixin.vue";
const cloneDeep = require("lodash.clonedeep");
const { fs, ipcRenderer } = window;

export default {
  data() {
    return {
      // tab: 'details',
      value: "",
      testModel: [],
      newName: "",
      // showState: false,
      // showActions: false,
      // showProps: false,
      // showHTML: false
    };
  },
  components: {
    VueMultiselect,
    // ToggleButton,
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
      const val = this.activeRouteDisplay.map(
        (component) => component.componentName
      );
      return val;
    },

    childOptions() {
      // checks if component has any parents and pushes them into lineage
      const checkParents = (component, lineage = [component.componentName]) => {
        if (!Object.keys(component.parent).length) return lineage;
        for (var parents in component.parent) {
          lineage.push(parents);
          checkParents(component.parent[parents], lineage);
        }
        return lineage;
      };
      let lineage = [this.activeComponent];
      // checks to see if there are any existing children
      if (this.componentMap[this.activeComponent]) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.testModel = this.componentMap[this.activeComponent].children;
        lineage = checkParents(this.componentMap[this.activeComponent]);
      }
      const routes = Object.keys(this.routes);
      const exceptions = new Set([
        "App",
        ...lineage,
        ...routes,
        ...this.testModel,
      ]);
      return Object.keys(this.componentMap).filter((component) => {
        if (!exceptions.has(component)) return component;
      });
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
      "addNestedNoActive",
    ]),

    handleAddChild(value) {
      const valueArray = [value];
      this.updateActiveComponentChildrenValue(valueArray);
      // this.updateActiveComponentChildrenValue(value);
    },

    // Handle deleting a child
    handleDeleteChild(value) {},

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
  mixins: [handleExportComponentMixin],
  watch: {
    // watches for changes in selected component, changes edit name text to newly selected component
    activeComponentObj: function () {
      if (this.activeComponentObj)
        this.newName = this.activeComponentObj.componentName;
    },
  },
};
</script>

<style lang="scss" scoped>
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

.title {
  font-size: 20px;
  font-weight: bold;
  color: white;
}

.toggleText {
  color: white;
}

.toggle {
  align-self: flex-end;
}

.editName {
  color: white;
}

#deleteButton {
  background-color: $secondary;
  color: white;
}

hr {
  border: 2px solid black;
  margin-left: -10px;
  margin-right: -10px;
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

.accordBorder {
  border: 2px solid black;
  border-radius: 4px;
}

.inner-div {
  display: flex;
  flex-direction: column;
  height: 94%;
  margin: 10px;
}
</style>
