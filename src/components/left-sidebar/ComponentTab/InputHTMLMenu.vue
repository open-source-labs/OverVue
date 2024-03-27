<!--
  LOCATION IN APP:
  [left sidebar] COMPONENT > Update Component
  (in between HTML Elements & Component Attributes)
  (activated by clicking on pencil icon on current active component's HTML elements in right sidebar)

  FUNCTIONALITY:
  - Enables user to add attributes & inner text to a component's HTML elements

  EXTRA INFO:
  - Errors are only TypeScript related; does not affect functionality
-->

<template>
  <div class="AttributeBox">
    <div
      class="AttributeContainer"
      v-for="element in componentMap[activeComponent].htmlList"
      :key="element.id as number + Date.now()"
    ></div>

    <!-- add class -->
    <q-form autofocus v-on:submit.prevent="submitClass">
      <q-input
        label="Add class to element"
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

    <!-- add v-model -->
    <q-form autofocus v-on:submit.prevent="addBinding">
      <q-input
        label="Add v-model to element"
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

    <!-- add inner text -->
    <q-form autofocus v-on:submit.prevent="submitNote">
      <q-input
        label="Add inner text to element"
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
      ></div>
    </div>

    <q-btn label="Close HTML Element" class="closeBtn" @click="closeMenu()" />
  </div>
</template>

<script setup lang="ts">
/* IMPORTS */
import { computed, ref, watch, onMounted } from "vue";
import { useStore } from "../../../stores/main.js";

/* LIFECYCLE HOOKS */
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

/* DATA */
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
const noteText = ref("");
const bindingText = ref("");

/* COMPUTED VALUES */
const store = useStore();
const componentMap = computed(() => store.componentMap);
const activeComponent = computed(() => store.activeComponent);
const activeHTML = computed(() => store.activeHTML);
const attributeModalOpen = computed(() => store.attributeModalOpen);
const activeRoute = computed(() => store.activeRoute);
const routes = computed(() => store.routes);

/* STORE ACTIONS */
const openAttributeModal: typeof store.openAttributeModal = () =>
  store.openAttributeModal();
const clearActiveHTML: typeof store.clearActiveHTML = () =>
  store.clearActiveHTML();
const updateHTMLLayer: typeof store.updateHtmlLayer = (payload) =>
  store.updateHtmlLayer(payload);
const addAttributes: typeof store.addAttributes = (payload) => {
  store.addAttributes(payload);
};

/* METHODS */
const submitClass = (element: string, idNum: number) => {
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
  noteText.value = "";
};

const closeMenu = () => {
  if (activeComponent.value !== "") {
    clearActiveHTML();
    openAttributeModal();
  }
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

/* WATCHES */
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
../../../stores/main.js
