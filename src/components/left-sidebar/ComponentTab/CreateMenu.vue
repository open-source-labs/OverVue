<!--
Description:
  Handles create component menu on left-side
  Functionality includes: creating a component, preventing users from entering invalid component file names
  -->
<!-- 4.0 adjustment: conditional render to switch between new comp name input and editing active comp name, moved from UpdateMenu -->

<template>
  <div class="create-component-div drawer-menu">
    <q-expansion-item group="accordion" label="Import Component">
      <ImportComponent v-if="activeComponent === ''" @imported="createComponent" title="Import Component (coming soon)" class="sidebar-btn" :disable = "true"/>
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
          :rules="[ val => val.length != 0 || 'Please set a component name', val => !Object.keys(this.componentMap).includes(val) || 'A component/route with this name already exists' ]"
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
      <button class="componentHTML">
        <CreateMenuHTMLQueue></CreateMenuHTMLQueue>
      </button>
      <br />

      <q-btn
        id="create-component-btn"
        class="sidebar-btn"
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
import { useCreateComponent } from "../../composables/useCreateComponent.js";
import Icons from "./Icons.vue";
import ParentMultiselect from "./ParentMultiselect.vue";
import ImportComponent from "./ImportComponent.vue"
import CreateMenuHTMLQueue from "./CreateMenuHTMLQueue.vue";
import { mapState, mapActions } from "vuex";
export default {
  name: "CreateMenu",
  components: {
    Icons,
    ParentMultiselect,
    ImportComponent,
    CreateMenuHTMLQueue
},
  computed: {
    ...mapState([
      "componentMap",
      "selectedElementList",
      "activeComponent",
      "activeHTML",
      "attributeModalOpen",
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

    createComponent() {
      useCreateComponent.bind(this)({}) //invokes composable
    },
  },
    watch: {
    attributeModalOpen() {
      this.attributeModal = this.attributeModalOpen;
    },
  }
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
  }

</style>
