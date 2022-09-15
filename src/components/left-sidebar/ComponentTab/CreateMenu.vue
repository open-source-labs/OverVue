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
    <q-expansion-item group="accordion" label="Create Component" >
      <ImportLibraryButton></ImportLibraryButton>
      <LibComponents></LibComponents>
<div class="searchinput">
      <q-input v-if ="this.$store.state.displaylibComponent" outlined v-model="input" placeholder="Please input" label="Search Component"

      color="white"
          dark
          dense
          item-aligned
          padding="5px"
          class="input-add"
          no-error-icon
      />
    </div>


    <q-list bordered separator>
      <q-item clickable v-ripple class="componentList"  v-for="(element,index) in filter" :key ="`${index}`"  @click="pickComponent(element.libname)">
        <q-item-section style="font-size: large;">{{element.name}}</q-item-section>

    <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
          <img alt={{element.libname}}   :src="require(`../../../assets/${element.src}`)" id = {{element.libname}}>
          <q-icon name="keyboard_arrow_right"/>

        </q-tooltip>
      </q-item>



    </q-list>

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

      <div class="subsection">Elements/Components</div>
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
import ImportLibraryButton from "./ImportLibraryButton.vue";
import LibComponents from "./LibComponents.vue";


export default {
  data(){
    return {
      input:'',
      libArray:[
        {
          name:'alert',
          libname:'e-alert',
          src:'alert.png'
        },
        {name:'button',
        libname:'e-button',
         src:'button.png'
      },
      {
        name:'inputbox',
        libname:'e-input',
        src:'inputbox.png'
      },
      {
        name:'card',
        libname:'e-card',
        src:'card.png'
      },
      {
          name:'badge',
          libname:'e-badge',
          src:'badge.png'
        },
        {
          name:'dropdown',
          libname:'e-dropdown',
          src:'dropdown.png'
        },
        {
          name:'link',
          libname:'e-link',
          src:'link.png'
        },
        {
          name:'form',
          libname:'e-form',
          src:'form.png'
        },
        {
          name:'checkbox',
          libname:'e-checkbox',
          src:'checkbox.png'
        },
        {
          name:'checkbox button',
          libname:'e-checkbox-button',
          src:'checkboxbutton.png'
        },
        {
          name:'datepicker',
          libname:'e-date-picker',
          src:'datepicker.png'
        },
        {
          name:'slider',
          libname:'e-slider',
          src:'slider.png'
        },
        {
          name:'tag',
          libname:'e-tag',
          src:'tag.png'
        }

      ]
    }
  },

  name: "CreateMenu",
  components: {
    Icons,
    ParentMultiselect,
    ImportComponent,
    CreateMenuHTMLQueue,
    ImportLibraryButton,
    ImportLibraryButton,
    LibComponents,

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
    filter(){
  if(this.input =='') return [];
  if(this.input.length >=2){
  return this.libArray.filter(e=>e.name.includes(this.input.toLowerCase()))}
  }
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
'changeLibComponentDisplay',
'addLibComponents'

]),
pickComponent(componentName){
  const payload = {

  };
  payload[componentName] = ['fa-brands fa-elementor fa-xl']



  this.addLibComponents(payload);

}

   ,

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
    margin-right: 10px;
  }
  .create-component-form {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    padding: -20px;
    margin-right: 10px;
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


  img{
    max-height: 500px;
    max-width: 600px;
  }
  .searchinput{
    margin-right: 10px;
  }


</style>
