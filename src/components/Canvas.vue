<!--
  LOCATION IN APP:
  to enable ==> [top-right corner] gear icon > Mode: Grid
  shows in center UI

  FUNCTIONALITY:
  - Displays previous 'Canvas' grid functionality
  - Soft-deprecated by OverVue v.10.0 but left as option for users who wish to use it
-->

<template>
  <!-- the background Canvas grid -->
  <div
    class="component-display grid-bg"
    :style="{ backgroundColor: '#FFFFF' }"
    v-on:click="handleClick"
    v-on:click.right="handleRight"
  >
    <div
      class="cssContainer"
      :style="{
        'background-size': `${gridWidth}px ${gridHeight}px,
      ${gridWidth}px ${gridHeight}px`,
        height: `${containerH}px`,
        width: `${containerW}px`,
      }"
    >
      <!-- This is the actual component box -->
      <!-- https://www.npmjs.com/package/vue-draggable-resizable -->
      <!--each component box in canvas will have these properties-->
      <br />
      <p class="cssContainerText">{{ activeRoute }} Preview</p>
      <vue-draggable-resizable
        class-name="component-box"
        v-for="componentData in activeRouteArray"
        ref="boxes"
        :key="componentData.componentName"
        :id="componentData.componentName"
        :x="componentData.x"
        :y="componentData.y"
        :z="componentData.z"
        :w="componentData.w ? componentData.w : 2 * gridWidth"
        :min-width="gridWidth / 2"
        :h="componentData.h ? componentData.h : 2 * gridHeight"
        :min-height="gridHeight / 2"
        :grid="[
          Math.floor(100 * gridWidth) / 100,
          Math.floor(100 * gridHeight) / 100,
        ]"
        @activated="onActivated(componentData)"
        @deactivated="onDeactivated()"
        @dragstop="finishedDrag"
        @resizestop="finishedResize"
        :style="{
          'background-color': componentData.color,
          color: 'black',
        }"
        :parent="true"
      >
        <div class="component-title">
          <p>
            {{ componentData.componentName
            }}<span v-if="isElementPlus(componentData.htmlList)">
              (Element+)</span
            >
          </p>
        </div>
        <q-icon
          v-if="componentData.componentName === activeComponent"
          size="25px"
          z-layer="0"
          name="edit_note"
          class="compNoteLogo"
          @click="handleAddNotes"
        />
        <!-- Rendering HTML Elements for each Component -->
        <div
          v-for="element in componentMap[componentData.componentName].htmlList"
          :key="element.id as string + new Date()"
        >
          <div
            class="htmlDiv"
            :style="[
              element.x !== 0 ? { top: element.x + '%' } : { top: '10%' },
              element.y !== 0 ? { left: element.y + '%' } : { left: '10%' },
              element.w !== 0 ? { width: element.w + '%' } : { width: '80%' },
              element.h !== 0 ? { height: element.h + '%' } : { height: '75%' },
              element.z !== 0 ? { 'z-index': element.z as number } : { 'z-index': 0 },
              { 'background-color': componentData.color },
            ]"
          >
            <p class="innerHtmlText" style="font-size: 3em">
              {{ element.note !== "" ? element.note : element.text }}
            </p>
          </div>
          <div
            v-if="element.text === 'button'"
            class="htmlButton"
            :style="[
              element.x !== 0 ? { top: element.x + '%' } : { top: '70%' },
              element.y !== 0 ? { left: element.y + '%' } : { left: '60%' },
              element.w !== 0 ? { width: element.w + '%' } : { width: '25%' },
              element.h !== 0 ? { height: element.h + '%' } : { height: '10%' },
              element.z !== 0
                ? { 'z-index': element.z as number}
                : { 'z-index': 0 },
              { 'background-color': componentData.color },
            ]"
          >
            <p class="innerHtmlText">
              {{ element.note !== "" ? element.note : element.text }}
            </p>
          </div>
          <div
            v-if="element.text === 'div'"
            class="htmlDiv"
            :style="[
              element.x !== 0 ? { top: element.x + '%' } : { top: '10%' },
              element.y !== 0 ? { left: element.y + '%' } : { left: '10%' },
              element.w !== 0 ? { width: element.w + '%' } : { width: '30%' },
              element.h !== 0 ? { height: element.h + '%' } : { height: '75%' },
              element.z !== 0 ? { 'z-index': element.z as number } : { 'z-index': 0 },
              { 'background-color': componentData.color },
            ]"
          >
            <p class="innerHtmlText" style="font-size: 3em">
              {{ element.note !== "" ? element.note : element.text }}
            </p>
          </div>
          <div v-if="element.text === 'footer'" class="htmlFooter"></div>
          <div
            v-if="element.text === 'form'"
            class="htmlGeneral"
            :style="[
              element.x !== 0 ? { top: element.x + '%' } : { top: '50%' },
              element.y !== 0 ? { left: element.y + '%' } : { left: '10%' },
              element.w !== 0 ? { width: element.w + '%' } : { width: '80%' },
              element.h !== 0 ? { height: element.h + '%' } : { height: '40%' },
              element.z !== 0 ? { 'z-index': element.z as number } : { 'z-index': 0 },
              { 'background-color': componentData.color },
            ]"
          >
            <p class="innerHtmlText" style="font-size: 3em">
              {{ element.note !== "" ? element.note : element.text }}
            </p>
          </div>
          <div
            v-if="element.text === 'h1'"
            class="htmlHead"
            :style="[
              element.x !== 0 ? { top: element.x + '%' } : { top: '10%' },
              element.y !== 0 ? { left: element.y + '%' } : { left: '5%' },
              element.w !== 0 ? { width: element.w + '%' } : { width: '90%' },
              element.h !== 0 ? { height: element.h + '%' } : { height: '20%' },
              element.z !== 0 ? { 'z-index': element.z as number } : { 'z-index': 0 },
              { 'background-color': componentData.color },
            ]"
          >
            <p class="innerHtmlText" style="font-size: 4em">
              {{ element.note !== "" ? element.note : element.text }}
            </p>
          </div>
          <div
            v-if="element.text === 'h2'"
            class="htmlHead"
            :style="[
              element.x !== 0 ? { top: element.x + '%' } : { top: '15%' },
              element.y !== 0 ? { left: element.y + '%' } : { left: '10%' },
              element.w !== 0 ? { width: element.w + '%' } : { width: '80%' },
              element.h !== 0 ? { height: element.h + '%' } : { height: '15%' },
              element.z !== 0 ? { 'z-index': element.z as number } : { 'z-index': 0 },
              { 'background-color': componentData.color },
            ]"
          >
            <p class="innerHtmlText" style="font-size: 3em">
              {{ element.note !== "" ? element.note : element.text }}
            </p>
          </div>
          <div
            v-if="element.text === 'h3'"
            class="htmlHead"
            :style="[
              element.x !== 0 ? { top: element.x + '%' } : { top: '18%' },
              element.y !== 0 ? { left: element.y + '%' } : { left: '15%' },
              element.w !== 0 ? { width: element.w } + '%' : { width: '70%' },
              element.h !== 0 ? { height: element.h + '%' } : { height: '12%' },
              element.z !== 0 ? { 'z-index': element.z as number } : { 'z-index': 0 },
              { 'background-color': componentData.color },
            ]"
          >
            <p class="innerHtmlText" style="font-size: 2.5em">
              {{ element.note !== "" ? element.note : element.text }}
            </p>
          </div>
          <div
            v-if="element.text === 'h4'"
            class="htmlHead"
            :style="[
              element.x !== 0 ? { top: element.x + '%' } : { top: '20%' },
              element.y !== 0 ? { left: element.y + '%' } : { left: '20%' },
              element.w !== 0 ? { width: element.w + '%' } : { width: '60%' },
              element.h !== 0 ? { height: element.h + '%' } : { height: '10%' },
              element.z !== 0 ? { 'z-index': element.z as number } : { 'z-index': 0 },
              { 'background-color': componentData.color },
            ]"
          >
            <p class="innerHtmlText" style="font-size: 2em">
              {{ element.note !== "" ? element.note : element.text }}
            </p>
          </div>
          <div
            v-if="element.text === 'h5'"
            class="htmlHead"
            :style="[
              element.x !== 0 ? { top: element.x + '%' } : { top: '20%' },
              element.y !== 0 ? { left: element.y + '%' } : { left: '25%' },
              element.w !== 0 ? { width: element.w + '%' } : { width: '50%' },
              element.h !== 0 ? { height: element.h + '%' } : { height: '8%' },
              element.z !== 0 ? { 'z-index': element.z as number } : { 'z-index': 0 },
              { 'background-color': componentData.color },
            ]"
          >
            <p class="innerHtmlText" style="font-size: 1.5em">
              {{ element.note !== "" ? element.note : element.text }}
            </p>
          </div>
          <div
            v-if="element.text === 'h6'"
            class="htmlHead"
            :style="[
              element.x !== 0 ? { top: element.x + '%' } : { top: '20%' },
              element.y !== 0 ? { left: element.y + '%' } : { left: '30%' },
              element.w !== 0 ? { width: element.w + '%' } : { width: '40%' },
              element.h !== 0 ? { height: element.h + '%' } : { height: '5%' },
              element.z !== 0 ? { 'z-index': element.z as number } : { 'z-index': 0 },
              { 'background-color': componentData.color },
            ]"
          >
            <p class="innerHtmlText" style="font-size: 1em">
              {{ element.note !== "" ? element.note : element.text }}
            </p>
          </div>
          <div v-if="element.text === 'header'" class="htmlHeader"></div>
          <div
            v-if="element.text === 'img'"
            class="htmlGeneral"
            :style="[
              element.x !== 0 ? { top: element.x + '%' } : { top: '20%' },
              element.y !== 0 ? { left: element.y + '%' } : { left: '20%' },
              element.w !== 0 ? { width: element.w + '%' } : { width: '40%' },
              element.h !== 0 ? { height: element.h + '%' } : { height: '40%' },
              element.z !== 0 ? { 'z-index': element.z as number } : { 'z-index': 0 },
              { 'background-color': componentData.color },
            ]"
          >
            <p class="innerHtmlText" style="font-size: 3em">
              {{ element.note !== "" ? element.note : element.text }}
            </p>
          </div>
          <input v-if="element.text === 'input'" class="htmlInput" />
          <div
            v-if="element.text === 'list'"
            class="htmlList"
            :style="[
              element.x !== 0 ? { top: element.x + '%' } : { top: '30%' },
              element.y !== 0 ? { left: element.y + '%' } : { left: '30%' },
              element.w !== 0 ? { width: element.w + '%' } : { width: '60%' },
              element.h !== 0 ? { height: element.h + '%' } : { height: '10%' },
              element.z !== 0 ? { 'z-index': element.z as number } : { 'z-index': 0 },
              { 'background-color': componentData.color },
            ]"
          >
            <p class="innerHtmlText" style="font-size: 2em">
              {{ element.note !== "" ? element.note : element.text }}
            </p>
          </div>
          <div
            v-if="element.text === 'list-ol'"
            class="htmlGeneral"
            :style="[
              element.x !== 0 ? { top: element.x + '%' } : { top: '20%' },
              element.y !== 0 ? { left: element.y + '%' } : { left: '10%' },
              element.w !== 0 ? { width: element.w + '%' } : { width: '80%' },
              element.h !== 0 ? { height: element.h + '%' } : { height: '40%' },
              element.z !== 0 ? { 'z-index': element.z as number } : { 'z-index': 0 },
              { 'background-color': componentData.color },
            ]"
          >
            <p class="innerHtmlText" style="font-size: 1.2em">
              {{ element.note !== "" ? element.note : element.text }}
            </p>
            <ol>
              <li>1</li>
              <li>2</li>
              <li>3</li>
            </ol>
          </div>
          <div
            v-if="element.text === 'list-ul'"
            class="htmlGeneral"
            :style="[
              element.x !== 0 ? { top: element.x + '%' } : { top: '20%' },
              element.y !== 0 ? { left: element.y + '%' } : { left: '10%' },
              element.w !== 0 ? { width: element.w + '%' } : { width: '80%' },
              element.h !== 0 ? { height: element.h + '%' } : { height: '40%' },
              element.z !== 0 ? { 'z-index': element.z as number } : { 'z-index': 0 },
              { 'background-color': componentData.color },
            ]"
          >
            <p class="innerHtmlText" style="font-size: 1.5em">
              {{ element.note !== "" ? element.note : element.text }}
            </p>
            <ol>
              <li>-</li>
              <li>-</li>
              <li>-</li>
            </ol>
          </div>
          <div
            v-if="element.text === 'paragraph'"
            class="htmlGeneral"
            :style="[
              element.x !== 0 ? { top: element.x + '%' } : { top: '50%' },
              element.y !== 0 ? { left: element.y + '%' } : { left: '10%' },
              element.w !== 0 ? { width: element.w + '%' } : { width: '80%' },
              element.h !== 0 ? { height: element.h + '%' } : { height: '40%' },
              element.z !== 0 ? { 'z-index': element.z as number } : { 'z-index': 0 },
              { 'background-color': componentData.color },
            ]"
          >
            <p>{{ element.note !== "" ? element.note : element.text }}</p>
          </div>
          <div v-if="element.text === 'navbar'" class="htmlNavbar"></div>
        </div>
        <!--change color icon-->
        <q-icon
          v-if="componentData.componentName === activeComponent"
          size="25px"
          z-layer="0"
          name="palette"
          class="colorLogo"
          @click="handleEditColor"
        />
        <!-- start of right click on component box function-->
        <q-menu context-menu>
          <q-list color="black" class="menu">
            <q-item clickable v-ripple v-close-popup id="layer-item">
              <q-item-section class="layer">Component Layer</q-item-section>
              <q-btn
                class="minorAction"
                color="transparent"
                text-color="primary"
                label="&ndash;"
                @click="(e : Event) => handleLayer(e)"
              />
              <p id="counter">{{ componentData.z }}</p>
              <q-btn
                class="minorAction"
                color="transparent"
                text-color="primary"
                label="+"
                @click="(e : Event) => handleLayer(e)"
              />
            </q-item>
            <q-item clickable v-ripple v-close-popup @click="handleAddChild">
              <q-item-section>Update Children</q-item-section>
              <q-item-section avatar>
                <q-icon color="primary" name="add" />
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple v-close-popup @click="handleAddNotes">
              <q-item-section>Component Notes</q-item-section>
              <q-item-section avatar>
                <q-icon color="primary" name="edit_note" />
              </q-item-section>
            </q-item>
            <!-- export requires an updated function -->
            <!-- <q-item
              clickable
              v-ripple
              v-close-popup
              @click="useExportComponent"
            >
              <q-item-section>Export Component</q-item-section>
              <q-item-section avatar>
                <q-icon color="primary" name="upload" />
              </q-item-section>
            </q-item> -->
            <q-item clickable v-ripple v-close-popup @click="handleEditColor">
              <q-item-section>Edit Color</q-item-section>
              <q-item-section avatar>
                <q-icon color="primary" name="edit" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </vue-draggable-resizable>
      <div>
        <q-dialog v-model="modalOpen">
          <div class="addChild">
            <p>Add/Remove Children</p>
            <VueMultiselect
              v-model="childrenSelected"
              placeholder="Add/remove children"
              :multiple="true"
              :close-on-select="false"
              :options="options"
              :show-labels="false"
              @remove="handleSelect"
              @select="handleSelect"
              :height="300"
              :option-height="40"
              :searchable="false"
            />
          </div>
        </q-dialog>

        <!-- some irregularity (delete event listener firing on bkspc/del) with the modal when stored locally, so modal open stored in state, and triggers to local reflect only stateful change.-->
        <q-dialog v-model="noteModal" @update:model-value="handleAddNotes">
          <div class="noteBox">
            <div class="noteHolder">
              <p class="title">Adding notes to {{ activeComponent }}</p>
              <div class="noteContainer">
                <li
                  v-for="(note, index) in (componentMap[activeComponent] as Component)
                    .noteList"
                  :key="note"
                >
                  <span class="noteNum">Note {{ index }}: </span>
                  <div class="noteblock">{{ note }}</div>
                  <span id="noteDelete" @click="deleteNote">X</span>
                </li>
              </div>
              <div class="formBox">
                <q-form autofocus v-on:submit.prevent="submitNote">
                  <q-input
                    v-model="noteText"
                    label="Add your note here"
                    filled
                    dark
                    autofocus
                    true
                    hide-bottom-space
                    @keyup.enter="submitNote"
                  ></q-input>
                  <q-btn
                    id="comp-btn"
                    class="sidebar-btn"
                    color="secondary"
                    label="Submit Note"
                    :disable="noteText.length > 0 ? false : true"
                    @click="submitNote"
                  />
                  <q-btn
                    id="note-btn-close"
                    class="sidebar-btn closeAction"
                    label="Close"
                    @click="openNoteModal"
                  />
                </q-form>
              </div>
            </div>
          </div>
        </q-dialog>

        <!-- color selector logic - color changer will start at current state of the color -->
        <q-dialog v-model="colorModal" @update:model-value="handleEditColor">
          <ColorPicker
            class="colorPicker"
            default-format="hex"
            id="color-picker-1"
            :visible-formats="['hex']"
            :color="activeComponentData.color"
            @color-change="updateColors"
          >
            <template #hue-range-input-label>
              <span class="sr-only">Hue</span>
            </template>

            <template #alpha-range-input-label>
              <span class="sr-only">Alpha</span>
            </template>

            <template #copy-button>
              <span class="sr-only">Copy color</span>

              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 15 15"
              >
                <path
                  d="M5 0v2H1v13h12v-3h-1v2H2V5h10v3h1V2H9V0zm1 1h2v2h3v1H3V3h3z"
                  fill="currentColor"
                />

                <path
                  d="M10 7v2h5v2h-5v2l-3-3zM3 6h5v1H3zm0 2h3v1H3zm0 2h3v1H3zm0 2h5v1H3z"
                  fill="currentColor"
                />
              </svg>
            </template>

            <template #format-switch-button>
              <span class="sr-only">Switch format</span>

              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="15"
                viewBox="0 0 16 15"
              >
                <path
                  d="M8 15l5-5-1-1-4 2-4-2-1 1zm4-9l1-1-5-5-5 5 1 1 4-2z"
                  fill="currentColor"
                />
              </svg>
            </template>
          </ColorPicker>
        </q-dialog>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { useExportComponent } from "./composables/useExportComponent.js";
import VueDraggableResizable from "vue-draggable-resizable/src/components/vue-draggable-resizable.vue";
import VueMultiselect from "vue-multiselect";
import "vue-draggable-resizable/src/components/vue-draggable-resizable.css";
import "vue3-draggable-resizable/dist/Vue3DraggableResizable.css";
import { ColorPicker } from "vue-accessible-color-picker";
import { useStore } from "../stores/main.js";
import { ref, computed, onMounted, watch } from "vue";
import { ResizePayload, Component } from "../../types";

const cloneDeep = require("lodash.clonedeep");

const store = useStore();
const modalOpen = ref(false);
const noteText = ref("");
const wasDragged = ref(false);
const noteModal = ref(false);
const colorModal = ref(false);
const childrenSelected = ref<typeof VueMultiselect>([]);
const boxes = ref<typeof VueDraggableResizable>(null);

//emitters
defineEmits(["deactivated", "update:active", "activated"]);
defineExpose({ boxes });

//mount
onMounted(() => {
  // listener for the copy
  window.addEventListener("copy", () => {
    // if there is an activeComponent, copy info to state using dispatch
    if (activeComponent.value !== "" && noteModalOpen.value === false) {
      store.copyActiveComponent;
    }
  });
  window.addEventListener("paste", () => {
    if (noteModalOpen.value === false) {
      store.pasteActiveComponent;
    }
  });
});

//computed
const routes = computed(() => store.routes);
const activeRoute = computed(() => store.activeRoute);
const activeComponent = computed(() => store.activeComponent);
const componentMap = computed(() => store.componentMap);
const imagePath = computed(() => store.imagePath);
const activeComponentObj = computed(() => store.activeComponentObj);
const noteModalOpen = computed(() => store.noteModalOpen);
const activeRouteDisplay = computed(() => routes.value[activeRoute.value]);
const colorModalOpen = computed(() => store.colorModalOpen);
const gridLayout = computed(() => store.gridLayout);
const containerH = computed(() => store.containerH);
const containerW = computed(() => store.containerW);
const showTutorial = computed(() => store.showTutorial);
const tutorialFirstOpen = computed(() => store.tutorialFirstOpen);

// used in VueDraggableResizeable component
const activeRouteArray = computed(() => {
  return routes.value[activeRoute.value];
});
// used to delete active component
const activeComponentData = computed(() => {
  // Must deep clone this so we are not directly mutating state
  // return this.activeComponentObj;
  return cloneDeep(activeComponentObj.value);
});

const options = computed(() => {
  if (activeComponent.value !== "") {
    childrenSelected.value = [];
    childrenSelected.value = componentMap.value[activeComponent.value].children;
  } else {
    childrenSelected.value = [];
  }
  const compMap = componentMap.value;
  const activeComp = activeComponent.value;
  const val = activeRouteDisplay.value.map(
    (component) => component.componentName
  );
  const relatives = [...val];
  //also need to filter out any parents
  let parentalLineage: string[] = [];

  function findLineage(children: string[]) {
    children.forEach((el) => {
      parentalLineage.push(el);
      if (compMap[el].children.length > 0) {
        findLineage(compMap[el].children);
      }
      if (el !== activeComp) {
        parentalLineage.pop();
      } else {
        return;
      }
    });
  }

  findLineage(relatives);

  const optionOutput = val
    .filter((el) => !parentalLineage.includes(el))
    .filter((el) => el !== activeComponent.value);
  return optionOutput;
});

const userImage = computed(() => {
  const imgSrc = `file://` + imagePath.value[activeRoute.value];
  return imgSrc;
});

// find the amount of grid lines for width
const gridWidth = computed(() => {
  return containerW.value / gridLayout.value[0];
});

// find the amount of grid lines for height
const gridHeight = computed(() => {
  return containerH.value / gridLayout.value[1];
});

//methods
const setActiveComponent: typeof store.setActiveComponent = (payload) =>
  store.setActiveComponent(payload);
const updateActiveComponentChildrenValue: typeof store.updateActiveComponentChildrenValue =
  (payload) => store.updateActiveComponentChildrenValue(payload);
const updateComponentPosition: typeof store.updateComponentPosition = (
  payload
) => store.updateComponentPosition(payload);
const updateComponentLayer: typeof store.updateComponentLayer = (payload) =>
  store.updateComponentLayer(payload);
const updateComponentSize: typeof store.updateComponentSize = (payload) =>
  store.updateComponentSize(payload);
const addActiveComponentNote: typeof store.addActiveComponentNote = (payload) =>
  store.addActiveComponentNote(payload);
const deleteActiveComponentNote: typeof store.deleteActiveComponentNote = (
  payload
) => store.deleteActiveComponentNote(payload);
const openNoteModal: typeof store.openNoteModal = () => store.openNoteModal();
const openColorModal: typeof store.openColorModal = () =>
  store.openColorModal();
const updateColor: typeof store.updateColor = (payload) =>
  store.updateColor(payload);
const updateComponentGridPosition: typeof store.updateComponentGridPosition = (
  payload
) => store.updateComponentGridPosition(payload);

const isElementPlus = (htmlList: { text: string }[]) => {
  return htmlList.find(({ text }) => text[0] === "e");
};

//color change function
const updateColors = (data: { cssColor: string }) => {
  let payload = {
    color: data.cssColor,
    activeComponent: activeComponent.value,
    routeArray: routes.value[activeRoute.value],
    activeComponentData: activeComponentData.value,
  };
  updateColor(payload);
  refresh();
};

// sets component's ending size/position
const finishedResize = (x: number, y: number, w: number, h: number) => {
  let payload: ResizePayload = {
    x: x,
    y: y,
    w: w,
    h: h,
    activeComponent: activeComponent.value,
    routeArray: routes.value[activeRoute.value],
    activeComponentData: activeComponentData.value,
  };
  updateComponentSize(payload);
  updateComponentGridPosition(payload);
  refresh();
};

// refresh function
const refresh = () => {
  const payload = {
    activeComponent: activeComponent.value,
    routeArray: routes.value[activeRoute.value],
    activeComponentData: activeComponentData.value,
    z: activeComponentData.value.z,
  };
  payload.z++;
  updateComponentLayer(payload);
  payload.z--;
  updateComponentLayer(payload);
};

// drag and drop function
const finishedDrag = (x: number, y: number) => {
  let payload = {
    x: x,
    y: y,
    activeComponent: activeComponent.value,
    routeArray: routes.value[activeRoute.value],
    activeComponentData: activeComponentData.value,
  };
  updateComponentPosition(payload);
  updateComponentGridPosition(payload);
  wasDragged.value = true;
  setTimeout(() => (wasDragged.value = false), 100);
  refresh();
};

const onActivated = (componentData: { componentName: string }) => {
  if (!componentData) {
    return;
  }
  if (boxes.value) {
    boxes.value.forEach((element: typeof VueDraggableResizable) => {
      if (element.$attrs.id !== componentData.componentName) {
        element.enabled = false;
        element.emit("deactivated");
        element.emit("update:active", false);
      }
      if (
        activeComponent.value === element.$attrs.id &&
        element.enabled === false
      ) {
        element.enabled = true;
        element.emit("activated");
        element.emit("update:active", true);
      }
    });
  }
  if (!(componentData.componentName === activeComponent.value)) {
    setActiveComponent(componentData.componentName);
  }
  if (componentData && componentData.hasOwnProperty("componentName")) {
    activeComponentData.value.isActive = true;
  }
};

// deactivated is emitted before activated
const onDeactivated = () => {
  if (activeComponent.value !== "") {
    activeComponentData.value.isActive = false;
  }
};

// renders modal with Update Children and Layer in it
const handleAddNotes = () => {
  if (wasDragged.value === false && activeComponent.value !== "") {
    openNoteModal();
  }
};

//color editor - opens the pop up
const handleEditColor = () => {
  if (wasDragged.value === false && activeComponent.value !== "") {
    openColorModal();
  }
};

const handleAddChild = () => {
  modalOpen.value = true;
};

const submitNote = (e: Event) => {
  e.preventDefault();
  if (noteText.value === "") {
    return;
  }
  addActiveComponentNote(noteText.value);
  noteText.value = "";
};

const deleteNote = (e: Event) => {
  deleteActiveComponentNote(
    ((e.target as HTMLElement).previousElementSibling as HTMLElement).innerText
  );
};

// used when user selects to add child from dropdown
const handleSelect = (value: string) => {
  //actually handles adding or deleting
  updateActiveComponentChildrenValue(value);
};

// user can change component's layer order
const handleLayer = (e: Event) => {
  e.preventDefault();
  const payload = {
    activeComponent: activeComponent.value,
    routeArray: routes.value[activeRoute.value],
    activeComponentData: activeComponentData.value,
    z: activeComponentData.value.z,
  };

  if ((e.target as HTMLElement).innerText === "+") payload.z++;
  if ((e.target as HTMLElement).innerText === "–" && payload.z > 0) payload.z--;
  updateComponentLayer(payload);
};

// if user clicks on display grid, resets active component to ''
const handleClick = (event: MouseEvent) => {
  if ((event.target as HTMLElement).className === "component-display grid-bg") {
    setActiveComponent("");
  }
};

const handleRight = (event: MouseEvent) => {
  if ((event.target as HTMLElement).className === "component-display grid-bg") {
    //right click modal to make a component?
  }
};

watch(
  noteModalOpen,
  () => {
    noteModal.value = noteModalOpen.value;
  },
  { deep: true }
);

watch(
  colorModalOpen,
  () => {
    colorModal.value = colorModalOpen.value;
  },
  { deep: true }
);

watch(
  activeComponent,
  () => {
    if (
      activeComponent.value !== "" &&
      showTutorial.value === true &&
      tutorialFirstOpen.value === true
    ) {
      store.toggleTutorial();
    }
    onActivated(activeComponentData.value);
  },
  { deep: true }
);
</script>

<style scoped lang="scss">
.addChild {
  width: 25vh;
  height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: $subsecondary;
  padding: 10px;
}

li {
  display: flex;
  font-weight: bold;
  padding: 3px;
}

li:hover {
  background-color: $subprimary;
}

.noteblock {
  white-space: pre-wrap;
  font-weight: normal;
  width: 80%;
  margin-left: 10px;
  margin-right: 10px;
}

.noteBox {
  background-color: $subsecondary;
  color: $menutext;
  width: 65%;
  padding: 15px;
  height: 65vh;
  max-height: 80vh;
}

.colorBox {
  background-color: $subsecondary;
  color: $menutext;
  width: 65%;
  padding: 15px;
  height: 65vh;
  max-height: 80vh;
}

.noteNum {
  width: 10%;
}

#noteDelete {
  background-color: $secondary;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-self: flex-end;
  border-radius: 50%;
  color: $menutext;
  user-select: none;
  align-self: center;
}

#noteDelete:hover {
  background-color: $negative;
}

.noteHolder {
  background-color: $subsecondary;
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  border-radius: 4px;
  overflow-y: hidden;
  height: 100%;
}

.noteContainer {
  height: 280px;
  max-height: 280px;
  border: 1px solid $primary;
  border-radius: 4px;
  overflow-y: auto;
  word-break: break-all;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.formBox {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.component-title {
  position: relative;
  font-size: 16px;
  top: -18px;
  left: 2px;
  color: $subprimary;
  -webkit-text-stroke: 0.4px $menutext;
  font-weight: 800;
  line-height: 1.2;
  z-index: -1;
}

.component-html-info {
  display: flex;
  font-size: 14px;
  flex-direction: column;
  font-weight: 800;
}

.component-children {
  position: relative;
  top: 0rem;
  left: 2px;
  color: black;
  list-style: none;
}

.component-display {
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  min-width: 1600px;
  min-height: 900px;
  position: absolute;
}

.grid-bg {
  background-color: rgba(223, 218, 218, 0.613);
  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
  background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;
  behavior: url(/pie/PIE.htc);
}

.cssContainer {
  display: flex;
  flex-direction: column;
  margin: 6.1%;
  border: 1px solid black;
  width: 1280px;
  height: 720px;
  background-color: rgba(223, 218, 218, 0.886);
  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
  background-image: -webkit-linear-gradient(
      rgba(255, 255, 255, 0.8) 1px,
      transparent 1px
    ),
    -webkit-linear-gradient(0, rgba(255, 255, 255, 0.8) 1px, transparent 1px),
    -webkit-linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
    -webkit-linear-gradient(0, rgba(255, 255, 255, 0.3) 1px, transparent 1px);
  background-image: -moz-linear-gradient(
      rgba(255, 255, 255, 0.8) 1px,
      transparent 1px
    ),
    -moz-linear-gradient(0, rgba(255, 255, 255, 0.8) 1px, transparent 1px),
    -moz-linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
    -moz-linear-gradient(0, rgba(255, 255, 255, 0.3) 1px, transparent 1px);
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.8) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, rgba(255, 255, 255, 0.8) 1px, transparent 1px),
    linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px);
  -pie-background: linear-gradient(
        rgba(255, 255, 255, 0.8) 1px,
        transparent 1px
      ) -2px -2px / 100px,
    linear-gradient(90deg, rgba(255, 255, 255, 0.8) 1px, transparent 1px) -2px -2px /
      100px,
    linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px) -1px -1px /
      20px,
    linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px) -1px -1px /
      20px,
    $secondary;
  behavior: url(/pie/PIE.htc);
}

.cssContainerText {
  position: absolute;
  text-align: center;
  font-size: 4em;
  margin: 0px;
  margin-top: -5%;
  width: 80%;
  color: black;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-weight: 600;
}

.menu {
  margin-bottom: 0px !important;
}

.compNoteLogo {
  background: rgba($subprimary, 0.9);
  color: $secondary;
  border-radius: 4px;
  position: absolute;
  top: 4px;
  left: 4px;
}

.colorLogo {
  background: rgba($subprimary, 0.9);
  color: $secondary;
  border-radius: 4px;
  position: absolute;
  top: 4px;
  left: 32px;
}

.colorLogo:hover {
  background: rgba($subprimary, 0.6);
  color: rgba($secondary, 0.8);
}

.compNoteLogoEmpty {
  background: rgba($subprimary, 0.9);
  color: rgba($primary, 1);
  border-radius: 4px;
  position: absolute;
  top: 4px;
  left: 4px;
}

.compNoteLogo:hover {
  background: rgba($subprimary, 0.6);
  color: rgba($secondary, 0.8);
}

.compNoteLogoEmpty:hover {
  background: rgba($subprimary, 0.6);
  color: rgba($menutext, 0.4);
}

.component-box {
  color: $menutext;
  border: 1.2px dashed $darktext;
  -webkit-transition: background-color 200ms linear;
  -ms-transition: background-color 200ms linear;
  transition: background-color 200ms linear;
  position: absolute;
}

.active {
  border: 3px solid $primary;
}

.minorAction {
  font-weight: bolder !important;
  width: 10px;
  height: 30px !important;
  transition: none;
}

.btn:hover,
.btn:focus,
.btn:active {
  color: $menutext;
  background-color: transparent;
}

#layer-item {
  align-items: center;
}

#counter {
  margin: 0 10px 0;
  color: $menutext;
}

#childrenDropdown {
  width: 250px;
  background: $subprimary;
  color: $menutext;
}

.title {
  font-size: 20px;
  font-weight: bold;
  color: white;
}

#comp-btn {
  width: 100%;
  box-shadow: inset 0 -0.6em 0 -0.35em rgba(0, 0, 0, 0.17);
}

#note-btn-close {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}

.htmlButton {
  position: absolute;
  margin: 0.5em;
  border-style: solid;
  border: 2em;
  border-radius: 1.5%;
}

.htmlDiv {
  display: flex;
  position: absolute;
  margin: 0.5em;
  border-radius: 1.5%;
  border-style: solid;
}

.htmlFooter {
  position: absolute;
  width: 100%;
  height: 10%;
  top: 90%;
  z-index: -1;
  border-radius: 1.5%;
  background-color: $primary;
}

.htmlGeneral {
  position: absolute;
  color: $menutext;
  border-radius: 1.5%;
  border-style: solid;
}

.htmlHead {
  position: absolute;
  color: $menutext;
  font-weight: bolder !important;
  text-overflow: clip;
}

.innerHtmlText {
  position: absolute;
  text-align: center;
  opacity: 0.5;
  overflow: hidden;
  text-overflow: clip;
}

.htmlNavbar {
  position: absolute;
  width: 100%;
  background-color: $primary;
  height: 10%;
  top: 0%;
  z-index: -1;
}

.sr-only {
  position: absolute;
  overflow: hidden;
  clip: rect(0 0 0 0);
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  white-space: nowrap;
}

.colorPicker {
  color: black;
  background: rgba(177, 171, 171, 0.562);
}

.colorContainer {
  position: relative;
  background: black;
}
</style>
