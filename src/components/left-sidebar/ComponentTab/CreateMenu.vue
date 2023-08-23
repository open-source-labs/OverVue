<!--
Description:
  Handles create component menu on left-side
  Functionality includes: creating a component, preventing users from entering invalid component file names
  -->
<!-- 4.0 adjustment: conditional render to switch between new comp name input and editing active comp name, moved from UpdateMenu -->

<template>
  <div class="create-component-div drawer-menu">
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
        :rules="[
          (val) => val.length != 0 || 'Please set a component name',
          (val) =>
            !Object.keys(componentMap).includes(val) ||
            'A component/route with this name already exists',
        ]"
      ></q-input>
    </form>

    <ParentMultiselect
      @addparent="parent = $event"
      v-if="activeComponent === ''"
    ></ParentMultiselect>

    <!-- [OverVue v.10.0] set CSS display to hidden (in favor of Vuetensils library) -->
    <LibComponents />
    <div class="searchinput" id="elementplussearch">
      <q-input
        outlined
        v-model="input"
        placeholder="Please input"
        label="Search Element+ Components"
        id="searchbox"
        color="white"
        dark
        dense
        item-aligned
        padding="5px"
        class="input-add"
        no-error-icon
      />
    </div>
    <!-- [OverVue v.10.0] end hidden section -->

    <q-list bordered separator>
      <q-item
        clickable
        v-ripple
        class="componentList"
        v-for="(element, index) in filter"
        :key="`${index}`"
        @click="pickComponent(element.libname)"
      >
        <q-item-section style="font-size: large">{{
          element.name
        }}</q-item-section>

        <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
          <img
            alt="{{element.libname}}"
            :src="require(`../../../assets/${element.src}`)"
            id="{{element.libname}}"
          />
          <q-icon name="keyboard_arrow_right" />
        </q-tooltip>
      </q-item>
    </q-list>

    <div class="subsection">
      <!-- [OverVue v.10.0] NEW TAB SECTION:
        (separates standard HTML elements/components from Vuetensils components -->

      <!-- tabs -->
      <q-tabs
        v-model="tab"
        align="left"
        dense
        breakpoint="1050"
        class="bg-subaccent text-white"
        active-color="secondary"
        indicator-color="secondary"
      >
        <q-tab
          name="standard-elements"
          label="Elements"
          class="label-text"
        ></q-tab>
        <q-tab name="vuetensils" label="Vuetensils" class="label-text"></q-tab>
      </q-tabs>

      <!-- tab panels -->
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="standard-elements">
          <!-- <div class="icon-container"> -->
          <Icons
            class="icons"
            @getClickedIcon="addToSelectedElementList"
            @activeElement="addToComponentElementList"
            @activeHTML="addNestedHTML"
            @activeLayer="addNestedNoActive"
          />
          <!-- </div> -->
        </q-tab-panel>
        <q-tab-panel name="vuetensils">
          <Vuetensils
            class="icons"
            @getClickedIcon="addToSelectedElementList"
            @activeElement="addToComponentElementList"
            @activeHTML="addNestedHTML"
            @activeLayer="addNestedNoActive"
          />
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <br />

    <q-btn
      id="create-component-btn"
      class="sidebar-btn"
      v-if="activeComponent === ''"
      color="secondary"
      label="Create Component"
      @click="createComponent"
      :disabled="
        !componentNameInputValue.trim() ||
        Object.keys(componentMap).includes(componentNameInputValue.trim())
      "
    />
  </div>
</template>

<script setup lang="ts">
// new script for Composition API
import { useCreateComponent } from "../../composables/useCreateComponent.js";
import { computed, ref, watch } from "vue";
import { useStore } from "../../../store/main.js";
import Icons from "./Icons.vue";
import Vuetensils from "./Vuetensils.vue";
import ParentMultiselect from "./ParentMultiselect.vue";
import ImportComponent from "./ImportComponent.vue";
import CreateMenuHTMLQueue from "./CreateMenuHTMLQueue.vue";
import ImportLibraryButton from "./ImportLibraryButton.vue";
import LibComponents from "./LibComponents.vue";
import { Component, RouteComponentMap } from "../../../../types";

const store = useStore();

const input = ref("");
const parent = ref("");
const attributeModal = ref<boolean | null>(null);
const tab = ref("standard-elements");
const libArray = ref([
  {
    name: "alert",
    libname: "e-alert",
    src: "alert.png",
  },
  { name: "button", libname: "e-button", src: "button.png" },
  {
    name: "inputbox",
    libname: "e-input",
    src: "inputbox.png",
  },
  {
    name: "card",
    libname: "e-card",
    src: "card.png",
  },
  {
    name: "badge",
    libname: "e-badge",
    src: "badge.png",
  },
  {
    name: "dropdown",
    libname: "e-dropdown",
    src: "dropdown.png",
  },
  {
    name: "link",
    libname: "e-link",
    src: "link.png",
  },
  {
    name: "form",
    libname: "e-form",
    src: "form.png",
  },
  {
    name: "checkbox",
    libname: "e-checkbox",
    src: "checkbox.png",
  },
  {
    name: "checkbox button",
    libname: "e-checkbox-button",
    src: "checkboxbutton.png",
  },
  {
    name: "datepicker",
    libname: "e-date-picker",
    src: "datepicker.png",
  },
  {
    name: "slider",
    libname: "e-slider",
    src: "slider.png",
  },
  {
    name: "tag",
    libname: "e-tag",
    src: "tag.png",
  },
]);

const componentMap = computed(() => store.componentMap);
// returns an object
const selectedElementList = computed(() => store.selectedElementList);
// returns an array
const activeComponent = computed(() => store.activeComponent);
// returns a string
const activeHTML = computed(() => store.activeHTML);
// returns a string
const attributeModalOpen = computed(() => store.attributeModalOpen);
// I don't think I need the above variable as the watch function does nothing
const userActions = computed(() => store.userActions);
// returns an array
const userState = computed(() => store.userState);
// returns an array
const userProps = computed(() => store.userProps);
// returns an array
const routes = computed(() => store.routes);
// returns an object that contains Homeview: []
const activeRoute = computed(() => store.activeRoute);

//getter function
const componentNameInputValue = computed({
  get() {
    //this used to be store.state.componentNameInputValue
    return store.componentNameInputValue;
  },
  set(value) {
    // console.log(value)
    updateComponentNameInputValue(value);
  },
});

const filter = computed(() => {
  if (input.value == "") return [];
  if (input.value.length >= 2) {
    return libArray.value.filter((e) =>
      e.name.includes(input.value.toLowerCase())
    );
  }
});

//methods

const registerComponent: typeof store.registerComponent = (payload) =>
  store.registerComponent(payload);
const addToSelectedElementList: typeof store.addToSelectedElementList = (
  payload
) => store.addToSelectedElementList(payload);
const updateComponentNameInputValue: typeof store.updateComponentNameInputValue =
  (payload) => store.updateComponentNameInputValue(payload);
const setActiveComponent: typeof store.setActiveComponent = (payload) =>
  store.setActiveComponent(payload);
const addToComponentElementList: typeof store.addToComponentElementList = (
  payload
) => store.addToComponentElementList(payload);
const addNestedHTML: typeof store.addNestedHTML = (payload) =>
  store.addNestedHTML(payload);
const addNestedNoActive: typeof store.addNestedNoActive = (payload) =>
  store.addNestedNoActive(payload);
const editComponentName: typeof store.editComponentName = (payload) =>
  store.editComponentName(payload);
const openProject: typeof store.openProject = (payload) =>
  store.openProject(payload);
const createAction: typeof store.createAction = (payload) =>
  store.createAction(payload);
const createState: typeof store.createState = (payload) =>
  store.createState(payload);
const createProp: typeof store.createProp = (payload) =>
  store.createProp(payload);
const changeLibComponentDisplay: typeof store.changeLibComponentDisplay = (
  payload
) => store.changeLibComponentDisplay(payload);
const addLibComponents: typeof store.addLibComponents = (payload) =>
  store.addLibComponents(payload);

const parentSelect: typeof store.parentSelect = (payload) =>
  store.parentSelect(payload);
const addParent: typeof store.addParent = (payload) => store.addParent(payload);

//all actions from action.js

const pickComponent = (componentName: string) => {
  const payload: { [key: string]: string[] } = {};
  payload[componentName] = ["fa-brands fa-elementor fa-xl"];
  addLibComponents(payload);
};

const createComponent = () => {
  // need to find a dynamic solution to pull current route, here set to HomeView
  // Parses array of components off routes, then finds parent element name (id), then passes parent into useCreateComponent, where x, y and z are pulled off the parent object

  let parentComponent = JSON.parse(
    JSON.stringify(routes.value[activeRoute.value])
  ).find((ele: Component) => ele.componentName === parent.value);

  if (parentComponent === undefined) {
    parentSelect(activeRoute.value);
    parentComponent = componentMap.value[activeRoute.value];

    // change parentSelected to route (activeRoute.value) and then call addParent()

    // parentSelect(activeRoute.value);
    // addParent( ** component ** );
  }
  console.log("parent component", JSON.parse(JSON.stringify(parentComponent)));

  const importProps = {
    userActions: userActions.value,
    userState: userState.value,
    userProps: userProps.value,
    componentNameInputValue: componentNameInputValue.value,
    selectedElementList: selectedElementList.value,
    componentMap: componentMap.value,
    createAction,
    createState,
    createProp,
    registerComponent,
    setActiveComponent,
  };

  useCreateComponent({ parentComponent }, importProps); //invokes composable
};

//not sure if we need this as attributeModal is not defined in the original API
watch(attributeModalOpen, () => {
  attributeModal.value = attributeModalOpen.value;
});
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
}
.subsection {
  border-top: 1px solid rgba(245, 245, 245, 0.3);
  padding: 10px 0 0;
  margin: 20px 0 0;
}
.componentHTML {
  height: 100px;
  margin-top: 20px;
  background-color: rgba($subsecondary, 0.5);
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

img {
  max-height: 500px;
  max-width: 600px;
}
.searchinput {
  width: 260px;
}

.q-tab-panels {
  padding: 0px !important;
  background: $subprimary;
}
</style>
