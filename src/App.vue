<template>
  <router-view
    v-on:undo="undoTrigger"
    v-on:redo="redoTrigger"
    v-bind:done-action="doneAction"
    v-bind:undone-action="undoneAction"
  />
</template>

<script setup>
/* IMPORTS */
import { onMounted, ref } from "vue";
import { useStore } from "./stores/main.js";
const deepEqual = require("lodash.isequal");
const cloneDeep = require("lodash.clonedeep");
const throttle = require("lodash.throttle");
const store = useStore();
/* LIFECYCLE HOOKS */

onMounted(() => {
  const throttledUndo = throttle(undo, 300);
  const throttledRedo = throttle(redo, 300);
  // undo function calling
  window.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "z") {
      event.preventDefault();
      throttledUndo();
    }
  });
  // redo function calling
  window.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "y") {
      event.preventDefault();
      throttledRedo();
    }
  });
});

// use this to make sure these actions don't count as things you "undo"
const ignoredActions = new Set([
  "setActiveComponent",
  "setActiveLayer",
  "upOneLayer",
  "setActiveHTML",
  "updateComponentNameInputValue",
]);

/* DATA */
const doneAction = ref([]);
const undoneAction = ref([]);
const isTimetraveling = ref(false);



store.$onAction((action) => {
  if (typeof action.args[0] === "object") {
    action.args = cloneDeep(action.args[0]);
  }
  doneAction.value.push(action);
  if (!isTimetraveling.value) {
    if (undoneAction.value[undoneAction.value.length - 1]) {
      if (
        action.name ===
          undoneAction.value[undoneAction.value.length - 1].name &&
        deepEqual(
          action.args,
          undoneAction.value[undoneAction.value.length - 1].args[0]
        )
      ) {
        undoneAction.value.pop();
      } else {
        undoneAction.value = [];
      }
    }
  }
});

const undo = () => {
  if (doneAction.value.length === 0) {
    return;
  }

  isTimetraveling.value = true;
  let undone = doneAction.value.pop();

  if (undone !== undefined) {
    undoneAction.value.push(undone);
    if (ignoredActions.has(undone.name)) {
      while (
        doneAction.value[doneAction.value.length - 1] &&
        ignoredActions.has(doneAction.value[doneAction.value.length - 1].name)
      ) {
        undoneAction.value.push(doneAction.value.pop());
      }

      let finalPop = doneAction.value.pop();
      if (finalPop !== undefined) {
        undoneAction.value.push(finalPop);
      }
    }
  }

  store.emptyState();

  doneAction.value.forEach((action) => {
    store[action.name](cloneDeep(action.args[0]));
    doneAction.value.pop();
  });
  isTimetraveling.value = false;
};

const redo = () => {
  let action = undoneAction.pop();
  isTimetraveling.value = true;

  if (action) {
    const actionName = action.name;
    store[actionName](cloneDeep(action.args[0]));
  }
  isTimetraveling.value = false;

  if (action && ignoredActions.has(action.name)) {
    redo();
  }
};

// Undo triggered from MyLayout.vue
const undoTrigger = () => {
  const throttledUndo = throttle(undo, 300);
  throttledUndo();
};

// Redo triggered from MyLayout.vue
const redoTrigger = () => {
  const throttledRedo = throttle(redo, 300);
  throttledRedo();
};
</script>
