<!-- 
  LOCATION IN APP:
  [left sidebar] COMPONENT > default view

  FUNCTIONALITY:
  - Enables user to:
    - Create & name a component, and set a parent component if applicable
    - Add underlying HTML elements or Vuetensils components [OverVue v.10.0 feature]
-->

<template>
  <div class="create-component-div drawer-menu">
    <!-- create component input -->
    <form class="create-component-form" v-on:submit.prevent="createComponent">
      <q-input
        v-if="activeComponent === ''"
        v-on:keyup.delete.stop
        v-model="componentNameInputValue"
        label="Create a component"
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
          (val) => val.length != 0 || 'Add at least one character',
          (val) =>
            !Object.keys(componentMap).includes(val) ||
            'A component/route with this name already exists',
        ]"
      ></q-input>
    </form>

    <!-- set parent component -->
    <ParentMultiselect
      @addparent="parent = $event"
      v-if="activeComponent === ''"
    ></ParentMultiselect>
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

    <!-- [OverVue v.10.0] NEW TAB SECTION
    separates standard HTML elements from Vuetensils components -->
    <div class="subsection">
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
        <!-- HTML elements -->
        <q-tab-panel name="standard-elements">
          <Icons
            class="icons"
            @getClickedIcon="addToSelectedElementList"
            @activeElement="addToComponentElementList"
            @activeHTML="addNestedHTML"
            @activeLayer="addNestedNoActive"
          />
        </q-tab-panel>

        <!-- Vuetensils components -->
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

    <!-- create component button -->
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
/* IMPORTS */
import { computed, ref, watch } from "vue";
import { useStore } from "../../../store/main.js";
import { Component } from "../../../../types";
import { useCreateComponent } from "../../composables/useCreateComponent.js";
import ParentMultiselect from "./ParentMultiselect.vue";
import Icons from "./Icons.vue";
import Vuetensils from "./Vuetensils.vue";

/* DATA */
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

/* COMPUTED VALUES */
const store = useStore();
const componentMap = computed(() => store.componentMap);
const selectedElementList = computed(() => store.selectedElementList);
const activeComponent = computed(() => store.activeComponent);
const attributeModalOpen = computed(() => store.attributeModalOpen);
const userActions = computed(() => store.userActions);
const userState = computed(() => store.userState);
const userProps = computed(() => store.userProps);
const routes = computed(() => store.routes);
const activeRoute = computed(() => store.activeRoute);
const componentNameInputValue = computed({
  get() {
    return store.componentNameInputValue;
  },
  set(value) {
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

/* STORE ACTIONS */
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
const createAction: typeof store.createAction = (payload) =>
  store.createAction(payload);
const createState: typeof store.createState = (payload) =>
  store.createState(payload);
const createProp: typeof store.createProp = (payload) =>
  store.createProp(payload);
const addLibComponents: typeof store.addLibComponents = (payload) =>
  store.addLibComponents(payload);
const parentSelect: typeof store.parentSelect = (payload) =>
  store.parentSelect(payload);
const pickComponent = (componentName: string) => {
  const payload: { [key: string]: string[] } = {};
  payload[componentName] = ["fa-brands fa-elementor fa-xl"];
  addLibComponents(payload);
};

/* METHODS */
const createComponent = () => {
  let parentComponent = JSON.parse(
    JSON.stringify(routes.value[activeRoute.value])
  ).find((ele: Component) => ele.componentName === parent.value);

  if (parentComponent === undefined) {
    parentSelect(activeRoute.value);
    parentComponent = componentMap.value[activeRoute.value];
  }

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

  useCreateComponent({ parentComponent }, importProps); // invokes composable
};

/* WATCHES */
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
