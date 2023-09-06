<!-- 
  LOCATION IN APP:
  [left sidebar] COMPONENT > Update Component (conditional: current active component selected)

  FUNCTIONALITY:
  - Enables user to:
    - Update component name
    - Add underlying HTML elements or Vuetensils components [OverVue v.10.0 feature]
    - Add class & id to parent div of component
    - Map state & actions to component
    - Add props to component
-->

<template>
  <div class="edit-component-div">
    <div>
      <button class="menu-link" @click="resetActiveComponent">
        <i class="fa fa-arrow-left" aria-hidden="true"></i>&nbsp; &nbsp; go back
        & create a new component
      </button>
      <q-card class="no-shadow" dark flat>
        <q-expansion-item default-opened label="UPDATE COMPONENT">
          <!-- rename component -->
          <q-input
            @keyup.enter="editCompName(newName)"
            v-on:keyup.delete.stop
            v-model="newName"
            :placeholder="activeComponent"
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
            :rules="[
              (val) => {
                return (
                  !Object.keys(componentMap).includes(val) ||
                  val === activeComponent ||
                  'A component with this name already exists'
                );
              },
            ]"
          ></q-input>
          <p class="update-component-name">
            press 'enter' to rename your component
          </p>

          <q-list
            class="accordBorder no-shadow"
            active-color="secondary"
            indicator-color="secondary"
          >
            <!-- HTML elements + Vuetensils components -->
            <q-expansion-item group="accordion" label="HTML Elements">
              <div class="subsection">
                <!-- [OverVue v.10.0] NEW TAB SECTION
                separates standard HTML elements from Vuetensils components -->

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
                  <q-tab
                    name="vuetensils"
                    label="Vuetensils"
                    class="label-text"
                  ></q-tab>
                </q-tabs>

                <!-- tab panels -->
                <q-tab-panels v-model="tab" animated>
                  <!-- standard HTML elements -->
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
            </q-expansion-item>

            <!-- update attributes modal -->
            <InputHTMLMenu
              v-model="attributeModal"
              v-if="attributeModal === true && activeLayer.lineage.length === 0"
              class="htmlElement-selected"
            />

            <!-- component attributes -->
            <q-expansion-item group="accordion" label="Component Attributes">
              <AttributesSubMenu />
            </q-expansion-item>

            <!-- state -->
            <q-expansion-item group="accordion" label="State">
              <StateSubMenu />
            </q-expansion-item>

            <!-- actions -->
            <q-expansion-item group="accordion" label="Actions">
              <ActionsSubMenu />
            </q-expansion-item>

            <!-- props -->
            <q-expansion-item group="accordion" label="Props">
              <PropsSubMenu />
              <div>
                <a
                  v-for="prop in (componentMap[activeComponent] as Component).props"
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
          </q-list>

          <!-- update, export, and delete buttons -->
          <!-- <q-btn
            id="create-component-btn"
            class="sidebar-btn"
            color="secondary"
            label="Update Component"
            @click="resetActiveComponent"
          /> -->
          <q-btn
            id="exportButton"
            class="sidebar-btn"
            @click="useExportComponent"
            label="Export Current Component"
          />
          <q-btn
            id="deleteButton"
            class="sidebar-btn deleteAction"
            @click="deleteSelectedComp(activeComponentData)"
            label="Delete Current Component"
          />
        </q-expansion-item>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
/* IMPORTS */
import { ref, computed, watch } from "vue";
import { useStore } from "../../../store/main";
import { Component } from "../../../../types";
import { useExportComponent } from "../../composables/useExportComponent.js";
import Icons from "./Icons.vue";
import Vuetensils from "./Vuetensils.vue";
import AttributesSubMenu from "./AttributesSubMenu.vue";
import StateSubMenu from "./StateSubMenu.vue";
import ActionsSubMenu from "./ActionsSubMenu.vue";
import PropsSubMenu from "./PropsSubMenu.vue";
import InputHTMLMenu from "./InputHTMLMenu.vue";
const cloneDeep = require("lodash.clonedeep");

/* DATA */
const value = ref("");
const newName = ref("");
const childrenSelected = ref([""]);
const attributeModal = ref(false);
const tab = ref("standard-elements");

/* COMPUTED VALUES */
const store = useStore();
const routes = computed(() => store.routes);
const activeRoute = computed(() => store.activeRoute);
const activeComponent = computed(() => store.activeComponent);
const activeLayer = computed(() => store.activeLayer);
const activeComponentObj = computed(() => store.activeComponentObj);
const componentMap = computed(() => store.componentMap);
const attributeModalOpen = computed(() => store.attributeModalOpen);
const activeRouteDisplay = computed(() => routes.value[activeRoute.value]);
const activeComponentData = cloneDeep(activeComponentObj.value);

/* STORE ACTIONS */
const setActiveComponent: typeof store.setActiveComponent = (payload) =>
  store.setActiveComponent(payload);
const deleteActiveComponent: typeof store.deleteActiveComponent = () =>
  store.deleteActiveComponent();
const editComponentName: typeof store.editComponentName = (payload) =>
  store.editComponentName(payload);
const addToSelectedElementList: typeof store.addToSelectedElementList = (
  payload
) => store.addToSelectedElementList(payload);
const addToComponentElementList: typeof store.addToComponentElementList = (
  payload
) => store.addToComponentElementList(payload);
const addNestedHTML: typeof store.addNestedHTML = (payload) =>
  store.addNestedHTML(payload);
const addNestedNoActive: typeof store.addNestedNoActive = (payload) =>
  store.addNestedNoActive(payload);
const deleteProp: typeof store.deletePropsFromComponent = (payload) =>
  store.deletePropsFromComponent(payload);
const onActivated = (componentData: string) => {
  setActiveComponent(componentData);
  activeComponentData.isActive = true;
};
const deleteSelectedComp = (componentData: Component) => {
  if (componentData) deleteActiveComponent();
};

/* METHODS */
const resetActiveComponent = () => {
  if (activeComponent.value !== "") setActiveComponent("");
};

const editCompName = (name: string) => {
  if (
    name &&
    name !== activeComponent.value &&
    activeComponent.value &&
    !componentMap.value[name]
  ) {
    editComponentName(name);
    newName.value = "";
    setActiveComponent(activeComponent.value);
  }
};

/* WATCHES */
watch(attributeModalOpen, () => {
  attributeModal.value = attributeModalOpen.value;
});
</script>

<style lang="scss" scoped>
.update-component-name {
  margin-top: -25px;
  text-align: center;
}
.subsection {
  border-top: 1px solid rgba(245, 245, 245, 0.3);
  padding: 10px 0 0;
  margin: 20px 0 0;
}

.q-tab-panels {
  padding: 0px !important;
  background: $subprimary;
}

.edit-component-div {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  margin: 4px;
}

.menu-link {
  background-color: $subprimary;
  color: $menutext;
  border: 1px solid $subprimary;
  margin-bottom: 20px;
  padding: 0;
}

.menu-link:hover {
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
  background-color: rgba($subsecondary, 0.5);
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

#exportButton,
#create-component-btn {
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

.htmlElement-selected {
  height: 100%;
}
</style>
