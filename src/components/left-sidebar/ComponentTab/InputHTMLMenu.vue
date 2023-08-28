<!-- Menu for inputting information into first layer HTML Elements, giving them class, binding, size, location, and inner text-->

<template>
  <div class="AttributeBox">
    <div
      class="AttributeContainer"
      v-for="element in componentMap[activeComponent].htmlList"
      :key="element.id as number + Date.now()"
    >
      <!-- <p v-if="element.id === activeHTML" class="title">
        Your class
        {{
          element.class.length !== 0
            ? "Your class is " + element.class
            : "has not been stated yet"
        }}
      </p> -->
    </div>
    <q-form autofocus v-on:submit.prevent="submitClass">
      <q-input
        label="Add/Change your class name"
        filled
        dark
        autofocus
        true
        hide-bottom-space
        v-model="classText"
        @keydown.enter="submitClass"
      >
        <i
          id="comp-btn"
          class="fa-solid fa-right-to-bracket"
          :disable="classText.length > 0 ? false : true"
          @click.self="submitClass(classText, activeHTML as number)"
        >
        </i>
      </q-input>
    </q-form>
    <q-form autofocus v-on:submit.prevent="addBinding">
      <q-input
        label="Add/Change two-way binding"
        filled
        dark
        autofocus
        true
        hide-bottom-space
        v-model="bindingText"
        @keydown.enter="addBinding(bindingText, activeHTML as number)"
      >
        <i
          id="compt-btn"
          class="fa-solid fa-right-to-bracket"
          label="Add Binding"
          :disable="bindingText.length > 0 ? false : true"
          @click.self="addBinding(bindingText, activeHTML as number)"
        >
        </i>
      </q-input>
    </q-form>
    <q-form autofocus v-on:submit.prevent="submitNote">
      <q-input
        label="Add Inner Text"
        filled
        dark
        autofocus
        true
        hide-bottom-space
        v-model="noteText"
        @keydown.enter="submitNote"
      >
        <i
          class="fa-solid fa-right-to-bracket"
          color="secondary"
          label="Submit Note"
          :disable="noteText.length > 0 ? false : true"
          @click.self="submitNote(noteText, activeHTML as number)"
        >
        </i>
      </q-input>
    </q-form>
    <div
      class="AttributeContainer"
      v-for="element in componentMap[activeComponent].htmlList"
      :key="element.id as number + Date.now()"
    >
      <div
        v-if="exceptions.includes(element.text) && element.id === activeHTML"
      >
        <!-- <q-form autofocus v-on:submit.prevent="submitNote">
          <q-input
            label="Add Inner Text"
            filled
            dark
            autofocus
            true
            hide-bottom-space
            v-model="noteText"
            @keydown.enter="submitNote"
          >
            <i
              class="fa-solid fa-right-to-bracket"
              color="secondary"
              label="Submit Note"
              :disable="noteText.length > 0 ? false : true"
              @click.self="submitNote(noteText, activeHTML as number)"
            >
            </i>
          </q-input>
        </q-form> -->
        <!-- <p class="title">Adjust Height and Elevation:</p>
        <q-form autofocus v-on:submit.prevent="submitHeight">
          <q-slider
            v-model="heightText"
            :min="0"
            :max="100"
            vertical
            label
            label-always
            :label-value="'Height:' + heightText"
            inner-track-color="primary"
            color="secondary"
            @change="submitHeight(heightText, activeHTML as number)"
            @update:model-value="submitHeight(heightText, activeHTML as number)"
            style="float: left; margin-left: 5%"
          />
        </q-form>
        <q-form autofocus v-on:submit.prevent="submitTop">
          <q-slider
            v-model="topText"
            :min="0"
            :max="100"
            vertical
            label
            label-always
            :label-value="'Elevation:' + topText"
            inner-track-color="primary"
            color="secondary"
            @change="submitTop(topText, activeHTML as number)"
            @update:model-value="submitTop(topText, activeHTML as number)"
            style="float: left; margin-left: 35%"
          />
        </q-form>
        <q-form autofocus v-on:submit.prevent="submitWidth">
          <q-slider
            v-model="widthText"
            :min="0"
            :max="100"
            label
            label-always
            :label-value="'Width:' + widthText"
            inner-track-color="primary"
            color="secondary"
            @change="submitWidth(widthText, activeHTML as number)"
            @update:model-value="submitWidth(widthText, activeHTML as number)"
            style="margin-top: 20%"
          />
        </q-form>
        <q-form autofocus v-on:submit.prevent="submitLeft">
          <q-slider
            v-model="leftText"
            :min="0"
            :max="100"
            label
            label-always
            :label-value="'Position:' + leftText"
            inner-track-color="primary"
            color="secondary"
            @change="submitLeft(leftText, activeHTML as number)"
            @update:model-value="submitLeft(leftText, activeHTML as number)"
            style="margin-top: 20%"
          />
        </q-form>
        <q-form autofocus v-on:submit.prevent="submitHeight">
          <q-input
            label="Adjust height (0-100)"
            filled
            dark
            autofocus
            true
            hide-bottom-space
            v-model="heightText"
            @keydown="submitHeight"
          >
            <i
              class="fa-solid fa-right-to-bracket"
              color="secondary"
              label="Submit Height"
              @click.self="submitHeight(heightText, activeHTML as number)"
            >
            </i>
          </q-input>
        </q-form>
        <q-form autofocus v-on:submit.prevent="submitWidth">
          <q-input
            label="Adjust width (0-100)"
            filled
            dark
            autofocus
            true
            hide-bottom-space
            v-model="widthText"
            @keydown.enter="submitWidth"
          >
            <i
              class="fa-solid fa-right-to-bracket"
              color="secondary"
              label="Submit Width"
              @click.self="submitWidth(widthText, activeHTML as number)"
            >
            </i>
          </q-input>
        </q-form>
        <q-form autofocus v-on:submit.prevent="submitTop">
          <q-input
            label="Adjust Elevation (0-100)"
            filled
            dark
            autofocus
            true
            hide-bottom-space
            v-model="topText"
            @keydown.enter="submitTop"
          >
            <i
              class="fa-solid fa-right-to-bracket"
              color="secondary"
              label="Submit Height"
              @click.self="submitTop(topText, activeHTML as number)"
            >
            </i>
          </q-input>
        </q-form>
        <q-form autofocus v-on:submit.prevent="submitLeft">
          <q-input
            label="Adjust Distance (0-100)"
            filled
            dark
            autofocus
            true
            hide-bottom-space
            v-model="leftText"
            @keydown.enter="submitLeft"
          >
            <i
              class="fa-solid fa-right-to-bracket"
              color="secondary"
              label="Submit Position"
              @click="submitLeft(leftText, activeHTML as number)"
            >
            </i>
          </q-input>
        </q-form>
        <q-item
          id="layer-item"
          filled
          dark
          autofocus
          true
          hide-bottom-space
          color="secondary"
        >
          <q-item-section class="layer">Component Layer = </q-item-section>
          <q-btn
            class="minorAction"
            color="transparent"
            text-color="primary"
            label="-"
            @click="(e: Event) => handleLayer(e)"
          /> -->
        <!-- nested for loop to iterate to display current z-index for selected htmlElement -->
        <!-- <template v-for="element in routes[activeRoute]">
            <template v-for="element1 in element.htmlList">
              <p
                v-if="element1.id === activeHTML"
                id="counter"
                :key="element1.id"
              >
                {{ element1.z }}
              </p>
            </template>
          </template>
          <q-btn
            class="minorAction"
            color="transparent"
            text-color="primary"
            label="+"
            @click="(e: Event) => handleLayer(e)"
          />
        </q-item> -->
      </div>
    </div>
    <q-btn label="Close HTML Element" class="closeBtn" @click="closeMenu()" />
  </div>
</template>

<script setup lang="ts">
// new script for Composition API
import { computed, ref, watch, onMounted } from "vue";
import { useStore } from "../../../store/main.js";
import { HtmlElement } from "../../../../types";

const store = useStore();

const exceptions = ref([
  "div",
  "button",
  "form",
  "img",
  "list",
  "paragraph",
  "list-ol",
  "list-ul",
  "input",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "e-button",
  "e-input",
  "e-link",
  "e-form",
  "e-checkbox",
  "e-checkbox-button",
  "e-date-picker",
  "e-slider",
  "e-card",
  "e-alert",
  "e-dropdown",
]);
const attributeModal = ref(false);
const classText = ref("");
const heightText = ref();
const widthText = ref();
const topText = ref();
const leftText = ref();
// const z = ref("0");
const noteText = ref("");
const bindingText = ref("");
// const note = ref('');

onMounted(() => {
  //for loop to access nested HTML elements of components - sets height/width/top/left sliders to current value of selected HTML element
  for (let i = 0; i < routes.value[activeRoute.value].length; i++) {
    for (
      let j = 0;
      j < routes.value[activeRoute.value][i].htmlList.length;
      j++
    ) {
      if (
        activeHTML.value === routes.value[activeRoute.value][i].htmlList[j].id
      ) {
        heightText.value = routes.value[activeRoute.value][i].htmlList[j]
          .h as number;
        widthText.value = routes.value[activeRoute.value][i].htmlList[j]
          .w as number;
        topText.value = routes.value[activeRoute.value][i].htmlList[j]
          .x as number;
        leftText.value = routes.value[activeRoute.value][i].htmlList[j]
          .y as number;
      }
    }
  }
});

//computed

const selectedElementList = computed(() => store.selectedElementList);
const componentMap = computed(() => store.componentMap);
const activeComponent = computed(() => store.activeComponent);
const activeHTML = computed(() => store.activeHTML);
const activeLayer = computed(() => store.activeLayer);
const attributeModalOpen = computed(() => store.attributeModalOpen);
const activeRoute = computed(() => store.activeRoute);
const routes = computed(() => store.routes);

// const activeComponentData = computed(() => store.activeComponentData);
// const activeComponentObj = computed(() => store.activeComponentObj);
// const componentData = computed(() => store.componentData);

//actions

const setActiveHTML: typeof store.setActiveHTML = (payload) =>
  store.setActiveHTML(payload);
const setActiveLayer: typeof store.setActiveLayer = (payload) =>
  store.setActiveLayer(payload);
const openAttributeModal: typeof store.openAttributeModal = () =>
  store.openAttributeModal();
const addActiveComponentClass: typeof store.addActiveComponentClass = (
  payload
) => store.addActiveComponentClass(payload);
const addActiveComponentElementNote: typeof store.addActiveComponentElementNote =
  (payload) => store.addActiveComponentElementNote(payload);
const addActiveComponentHeight: typeof store.addActiveComponentHeight = (
  payload
) => store.addActiveComponentHeight(payload);
const addActiveComponentWidth: typeof store.addActiveComponentWidth = (
  payload
) => store.addActiveComponentWidth(payload);
const addActiveComponentTop: typeof store.addActiveComponentTop = (payload) =>
  store.addActiveComponentTop(payload);
const addActiveComponentLeft: typeof store.addActiveComponentLeft = (payload) =>
  store.addActiveComponentLeft(payload);
const clearActiveHTML: typeof store.clearActiveHTML = () =>
  store.clearActiveHTML();
const updateComponentLayer: typeof store.updateComponentLayer = (payload) =>
  store.updateComponentLayer(payload);
const updateHTMLLayer: typeof store.updateHtmlLayer = (payload) =>
  store.updateHtmlLayer(payload);
const addBindingText: typeof store.addBindingText = (payload) =>
  store.addBindingText(payload);
const addAttributes: typeof store.addAttributes = (payload) => {
  store.addAttributes(payload);
};

const submitClass = (element: string, idNum: number) => {
  console.log(
    "activeComponent Attributes",
    componentMap.value[activeComponent.value].htmlList
  );
  if (element === "") {
    return;
  }
  let payload: { class: string; id: number } = {
    class: element,
    id: idNum,
  };
  addAttributes(payload);
  classText.value = "";
};

const submitNote = (element: string, idNum: number) => {
  if (element === "") {
    return;
  }
  let payload: { note: string; id: number } = {
    note: element,
    id: idNum,
  };

  addAttributes(payload);
  // addActiveComponentElementNote(payload);
  // console.log("Looking for htmlAttributes ", activeComponentObj.value.htmlAttributes);
  noteText.value = "";
};

const submitHeight = (element: string, idNum: number) => {
  if (element === "") {
    return;
  }
  let payload: { h: string; id: number } = {
    h: element,
    id: idNum,
  };
  addAttributes(payload);
  //addActiveComponentHeight(payload);
};

const submitWidth = (element: string, idNum: number) => {
  if (element === "") {
    return;
  }
  let payload = {
    w: element,
    id: idNum,
  };
  addAttributes(payload); //add width (w)
  // addActiveComponentWidth(payload);
};

const submitTop = (element: string, idNum: number) => {
  if (element === "") {
    return;
  }
  let payload: { x: string; id: number } = {
    x: element,
    id: idNum,
  };
  addAttributes(payload);
};

const submitLeft = (element: string, idNum: number) => {
  if (element === "") {
    return;
  }
  let payload: { y: string; id: number } = {
    y: element,
    id: idNum,
  };
  // addActiveComponentLeft(payload);
  addAttributes(payload); //add left (y)
};

const closeMenu = () => {
  if (activeComponent.value !== "") {
    clearActiveHTML();
    openAttributeModal();
  }
};

//function that adds/subtracts z-index on html Elements
const handleLayer = (e: Event) => {
  e.preventDefault();
  let HTMLZ: number = 0;
  for (let i = 0; i < routes.value[activeRoute.value].length; i++) {
    for (
      let j = 0;
      j < routes.value[activeRoute.value][i].htmlList.length;
      j++
    ) {
      if (
        activeHTML.value === routes.value[activeRoute.value][i].htmlList[j].id
      ) {
        HTMLZ = routes.value[activeRoute.value][i].htmlList[j].z as number;
      }
    }
  }
  const payload = {
    z: HTMLZ,
    activeComponent: activeComponent.value,
    activeHTML: activeHTML.value,
    routeArray: routes.value[activeRoute.value],
  };
  if ((e.target as HTMLElement).innerText === "+") {
    payload.z++;
  }
  if ((e.target as HTMLElement).innerText === "-" && payload.z > 0) {
    payload.z--;
  }
  updateHTMLLayer(payload);
};

const activeRouteArray = () => {
  return routes.value[activeRoute.value];
};

const addBinding = (binding: string, idNum: number) => {
  if (binding === "") {
    return;
  }
  const payload = {
    binding: binding,
    id: idNum,
  };
  addAttributes(payload);
  bindingText.value = "";
};

watch(attributeModalOpen, () => {
  attributeModal.value = attributeModalOpen.value;
});
</script>

<style lang="scss">
.fa-solid {
  position: relative;
  top: 25%;
  font-size: 200%;
  float: left;
}

.fa-solid:hover {
  cursor: pointer;
  color: $secondary;
}

.title {
  font-size: 1.3em;
}

.closeBtn {
  background-color: $primary;
  // margin-top: 2em;
  margin-bottom: 2em;
  width: 100%;
}

.minorAction {
  margin-right: 5px;
  margin-left: 5px;
  width: 2em;
  height: 1.5em;
}

#counter {
  padding-top: 5px;
}
</style>
