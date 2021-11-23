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
      <multiselect
        v-model="testModel"
        placeholder="Add/Remove Children"
        :multiple="true"
        :close-on-select="false"
        :options="childOptions"
        @input="handleAddChild"
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
      
 <br/>
       <q-list
        class="accordBorder"
        active-color="secondary"
        indicator-color="secondary"
      >
      <q-expansion-item group="accordion" label="Select another Component">
        <multiselect
        class="multiselect"
        v-model="value"
        :options="options"
        :searchable="true"
        :close-on-select="true"
        :max-height="90"
        :option-height="20"
        @input="handleSelect(value)"
        placeholder="Select/Search component"
      >
      <span slot="noResult">No components found.</span>
      </multiselect>
      </q-expansion-item>
 </q-list>
    </div>

        <!-- <q-list>
      <q-expansion-item popup default-opened icon="mail" label="Inbox" caption="5 unread emails">
        <q-separator />
        <q-card>
          <q-card-section>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti
            commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto suscipit iste
            eveniet doloribus ullam aliquid.
          </q-card-section>
        </q-card>
      </q-expansion-item>
      </q-list> -->
    <!-- dropdown to select a component to edit -->
  </div>
  <!-- moved this to createComponent -->
  <!-- <br/> -->
  <!-- removed text that displays what componenet is selected -->
  <!-- <p class="editName" v-if="this.activeComponentObj"> 
      Currently selected component: {{ this.activeComponentObj.componentName }}
    </p> -->
  <!-- removed delete button for now -->
  <!-- <p class="editName" v-else>Select a component</p> -->

  <!-- <br/>
    <div v-if="this.activeComponentData">
    <br/> -->
  <!-- @input="selectParent"
      @open="resetActiveComponent" -->

  <!-- <br/> -->

  <!-- <section id="counter" style="color: white">  Layer:
      <q-btn
              class="btn"
              color="transparent"
              text-color="white"
              label="-"
              @click="e => handleLayer(e)"
            />
     {{ this.activeComponentObj.z }}
            <q-btn
              class="btn"
              color="transparent"
              text-color="white"
              label="+"
              @click="e => handleLayer(e)"
            />
          </section>
    <br/>
    <p> Toggle to edit: </p>
    <div class="toggleRow">
      <section class="toggleText"> HTML elements</section>
      <toggle-button v-model="showHTML" class="toggle"/>
    </div>
    <HTMLQueue v-if="showHTML"/>
    <br/>
    <div class="toggleRow">
      <section class="toggleText"> State</section>
      <toggle-button v-model="showState" class="toggle"/>
    </div>
    <hr v-if="showState">
    <p v-if='showState && !this.activeComponentObj.state.length'>No state in component</p>
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
    <br/>
    <div class="toggleRow">
      <section class="toggleText"> Actions</section>
      <toggle-button v-model="showActions" class="toggle"/>
    </div>
    <hr v-if="showActions">
    <p v-if='showActions && !this.activeComponentObj.actions.length'>No actions in component</p>
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
    <div class="toggleRow">
      <section class="toggleText">Props </section>
      <toggle-button v-model="showProps" class="toggle" justify='end'/>
    </div>
    <hr v-if="showProps">
    <p v-if='showProps && !this.activeComponentObj.props.length'>No props in component</p>
    <a
      v-for="prop in this.activeComponentData.props"
      :key="prop"
    > -->
  <!-- v-on:click="onActivated(prop)" -->

  <!-- <q-list v-if="showProps" class="list-item" dense bordered separator>
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
    <p v-else> <br/> Select Component to Enable Edit </p> -->
</template>

<script>
import { mapState, mapActions } from "vuex";
import Multiselect from "vue-multiselect";
import { ToggleButton } from "vue-js-toggle-button";
import HTMLQueue from "../../dashboard_items/HTMLQueue.vue";
import Icons from "../Icons.vue";
import AddProps from "./AddProps.vue";
import ComponentState from "./ComponentState.vue";
import ComponentActions from "./ComponentActions.vue";

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
    Multiselect,
    ToggleButton,
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
    ]),

    activeRouteDisplay() {
      let component = this.routes[this.activeRoute];
      // console.log('component', component)
      return component;
    },

    activeComponentData() {
      return this.activeComponentObj;
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
        // console.log('testmodel', this.testModel)
        // console.log(this.componentMap[this.activeComponent].children)
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.testModel = this.componentMap[this.activeComponent].children;
        lineage = checkParents(this.componentMap[this.activeComponent]);
        // console.log('Lineage', lineage);
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
      // 'deleteActionFromComponent',
      // 'deletePropsFromComponent',
      // 'deleteStateFromComponent',
      "updateComponentLayer",
      "updateActiveComponentChildrenValue",
      "addToSelectedElementList",
      "addToComponentElementList",
      "addNestedHTML",
      "addNestedNoActive",
    ]),

    handleAddChild(value) {
      // console.log('selected child component: ', value)
      this.updateActiveComponentChildrenValue(value);
    },

    // delete selected state from active component
    // deleteState (state) {
    //   this.deleteStateFromComponent(state)
    //   console.log(this.activeComponentObj)
    // },

    // delete selected action from active component
    // deleteAction (action) {
    //   this.deleteActionFromComponent(action)
    //   console.log(this.activeComponentObj)
    // },

    // delete selected props from active component
    // deleteProp (prop) {
    //   this.deletePropsFromComponent(prop)
    //   console.log(this.activeComponentObj)
    // },
    // Set component as active component from left side dropdown
    onActivated(componentData) {
      this.setActiveComponent(componentData.componentName);
      this.activeComponentData.isActive = true;
    },
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
      console.log(this.componentMap);
    },
  },
  watch: {
    // watches for changes in selected component, changes edit name text to newly selected component
    activeComponentObj: function () {
      if (this.activeComponentObj)
        this.newName = this.activeComponentObj.componentName;
    },
  },
};
</script>

<style lang="stylus" scoped>
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
/* modifies top label */
/* .component {
  text-transform: uppercase;
} */
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
  background-color: #289ead;
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

.accordBorder{
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
