<!--
Description:
  Handles create component menu on left-side
  Functionality includes: creating a component, preventing users from entering invalid component file names
  -->
<!-- 4.0 adjustment: conditional render to switch between new comp name input and editing active comp name, moved from EditDeleteComponents -->

<template>
  <div class="create-component-div drawer-menu">
    <q-expansion-item group="accordion" label="Import Component">
      <ImportComponent v-if="activeComponent === ''" @imported="createComponent" />
    </q-expansion-item>
    <q-expansion-item group="accordion" label="Create Component">
      <form class="create-component-form" v-on:submit.prevent="createComponent">
        <!-- will render if creating new component -->
        <q-input
          v-if="activeComponent === ''"
          v-on:keyup.delete.stop
          v-model="componentNameInputValue"
          label="Set component name *"
          color="white"
          dark
          dense
          outlined
          item-aligned
          padding="5px"
          class="input-add"
          no-error-icon
          reactive-rules
          :rules="[ val => val.length != 0 || 'Please set a component name', val => !Object.keys(this.componentMap).includes(val) || 'A component with this name already exists' ]"
        ></q-input>
      </form>

      <ParentMultiselect v-if="activeComponent === ''"></ParentMultiselect>
      <div class="subsection">HTML Elements</div>
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
        <CreateComponentHTMLQueue></CreateComponentHTMLQueue>
      </div>
      <br />

      <q-btn
        id="create-component-btn"
        v-if="activeComponent === ''"
        color="secondary"
        label="Create Component"
        @click="createComponent"
        :disabled="!componentNameInputValue.trim() || Object.keys(this.componentMap).includes(componentNameInputValue.trim())"
      />
    </q-expansion-item>
  </div>
</template>

<script>
import Icons from "./Icons.vue";
import ParentMultiselect from "./ParentMultiselect.vue";
import ImportComponent from "./ImportComponent.vue"
import CreateComponentHTMLQueue from "./CreateComponentHTMLQueue.vue";
import { mapState, mapActions } from "vuex";
export default {
  name: "HomeSidebar",
  components: {
    Icons,
    ParentMultiselect,
    ImportComponent,
    CreateComponentHTMLQueue
},
  computed: {
    ...mapState([
      "componentMap",
      "selectedElementList",
      "activeComponent",
      "activeHTML",
      "userActions",
      "userState",
      "userProps",
    ]),
    componentNameInputValue: {
      get() {
        return this.$store.state.componentNameInputValue;
      },
      set(value) {
        this.updateComponentNameInputValue(value);
      },
    },
  },
  methods: {
    ...mapActions([
      "registerComponent",
      "addToSelectedElementList",
      "updateComponentNameInputValue",
      "setActiveComponent",
      "addToComponentElementList",
      "addNestedHTML",
      "addNestedNoActive",
      "editComponentName",
      "openProject",
      "createAction",
      "createState",
      "createProp",
    ]),

    createComponent(importObj) {
      let imported = false;
      if (importObj.hasOwnProperty('componentName')){
        imported = true;
        //Check if state and actions on import exist in the store. If not, add them.
        for (let i = 0; i < importObj.actions.length; i++){
          if (!this.userActions.includes(importObj.actions[i])){
            this.createAction(importObj.actions[i])
          }
        }
        for (let i = 0; i < importObj.state.length; i++){
          if (!this.userState.includes(importObj.state[i])){
            this.createState(importObj.state[i])
          }
        }
        for (let i = 0; i < importObj.props.length; i++){
          if (!this.userProps.includes(importObj.props[i])){
            this.createProp(importObj.props[i])
          }
        }
      }

      if (!this.componentNameInputValue.replace(/[^a-z0-9-_.]/gi, "") && imported === false) {
        event.preventDefault();
        return false;
      }

      // boilerplate properties for each component upon creation
      const component = {
        componentName: this.componentNameInputValue.replace(
          /[^a-z0-9-_.]/gi,
          ""
        ),
        x: 0,
        y: 20,
        z: 0,
        w: 200,
        h: 200,
        htmlList: this.selectedElementList,
        noteList: [],
        children: [],
        actions: [],
        props: [],
        state: [],
        parent: {},
        isActive: false,
      };

      if (imported === true){
        component.componentName = importObj.componentName;
        component.htmlList = importObj.htmlList;
        component.actions = importObj.actions;
        component.state = importObj.state;
        component.props = importObj.props;
      }
      
      if (!this.componentMap[component.componentName]) {
        this.registerComponent(component);
        this.setActiveComponent(component.componentName);
      }

    },
  },
};
</script>

<style lang="scss" scoped>
  .create-component-div {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    margin: 4px;
  }
  .create-component-form {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    padding: -20px;
  }
  .subsection {
    border-top: 1px solid rgba(245, 245, 245, 0.3);
    padding: 10px 0 0;
    margin: 20px 0 0;
  }
  .componentHTML {
    height: 100px;
    margin-top: 20px;
    background-color: rgba($subsecondary, .5);
    overflow-y: scroll;
    border: 1px solid rgba(245, 245, 245, 0.3);
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    resize: vertical;
  }

  #create-component-btn {
    width: 100%;
  }
  .q-expansion-item {
    margin-bottom: 10px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 3px 6px 0 rgba(0, 0, 0, 0.13);
  }

// .is-primary {
//   height: 45px;
// }
// #add-component-btn {
//   height: 15px;
//   margin: 0.75rem;
//   width: 90%;
// }
// #import-component-btn {
//   height: 15px;
//   margin: 0 0.75rem;
//   width: 90%;
// }
// .inner-div {
//   display: flex;
//   flex-direction: column;
//   justify-content: flex-start;
//   padding-left: 15px;
//   padding-right: 15px;
//   height: 100%;
// }
</style>
