<template>
  <!-- Get passed down to MyLayout.vue 
  & listen for custom events emitted from MyLayout.vue -->
  <router-view
    v-on:undo="undoTrigger"
    v-on:redo="redoTrigger"
    v-bind:done-action="doneAction"
    v-bind:undone-action="undoneAction"
  />
</template>

<script setup>
// import { defineComponent } from "vue";
// import ElementPlus from 'element-plus'; // importing element plus component library
import "element-plus/dist/index.css"; // importing element plus styling
// import { defaultState } from "./store/state/index.ts";
import { onMounted, ref } from "vue";
import { useStore } from "./store/main.js";
const deepEqual = require("lodash.isequal");
const cloneDeep = require("lodash.clonedeep");
const throttle = require("lodash.throttle");

// use this to make sure these actions don't count as things you "undo"
const ignoredActions = new Set([
  "setActiveComponent",
  "setActiveLayer",
  "upOneLayer",
  "setActiveHTML",
  "updateComponentNameInputValue",
]);

const doneAction = ref([]);
const undoneAction = ref([]);
const isTimetraveling = ref(false);

const store = useStore();

const subscribeAction = store.$subscribe((action, state) => {
  if (typeof action.payload === "object") {
    action.payload = cloneDeep(action.payload);
  }
  doneAction.value.push(action);
  if (!isTimetraveling.value) {
    if (undoneAction.value[undoneAction.value.length - 1]) {
      if (
        action.type ===
          undoneAction.value[undoneAction.value.length - 1].type &&
        deepEqual(
          action.payload,
          undoneAction.value[undoneAction.value.length - 1].payload
        )
      ) {
        undoneAction.value.pop();
      } else {
        undoneAction.value = [];
      }
    }
  }
});

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

const undo = () => {
  if (doneAction.value.length === 0) {
    return;
  }

  isTimetraveling.value = true;
  let undone = doneAction.value.pop();

  /* assuming we have have something to undo, we check if we are undoing an action that has no feedback
            e.g.: changing active elements or active components or going up and down a layer since these can be obscured from immediate feedback.
            these will feel bad to undo (imagine someone clicking around out of boredom and then deciding to undo
            this will force them to have to undo the 30 highlights they just did instead of the last "Real" action)
            if this happens we keep popping the doneAction.value queue and building up the redo queue. */
  if (undone !== undefined) {
    undoneAction.value.push(undone);
    if (ignoredActions.has(undone.type)) {
      while (
        doneAction.value[doneAction.value.length - 1] &&
        ignoredActions.has(doneAction.value[doneAction.value.length - 1].type)
      ) {
        undoneAction.value.push(doneAction.value.pop());
      }
      /* if we get here, that means we have undone all "useless" actions
              so we have to do one more final pop and push, have to make sure it isn't null though */
      let finalPop = doneAction.value.pop();
      if (finalPop !== undefined) {
        undoneAction.value.push(finalPop);
      }
    }
  }

  store.emptyState();

  doneAction.value.forEach((action) => {
    const actionType = action.type;
    store.action.type(cloneDeep(action.payload));
    doneAction.pop();
  });
  isTimetraveling.value = false;
};

const redo = () => {
  let action = undoneAction.pop();

  // we have to set timeTraveling to true to preserve the undoneAction array while we make changes
  isTimetraveling.value = true;
  if (action) {
    const actionType = action.type;
    store[actionType](cloneDeep(action.payload));
  }
  isTimetraveling.value = false;
  if (action && ignoredActions.has(action.type)) {
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

<!-- old options api script -->
<!-- <script>
  import { defineComponent } from "vue";
  import ElementPlus from 'element-plus'; // importing element plus component library
  import 'element-plus/dist/index.css'; // importing element plus styling
  const deepEqual = require("lodash.isequal");
  const cloneDeep = require("lodash.clonedeep");
  const throttle = require("lodash.throttle");
  import { defaultState } from "./store/state/index.ts";
  
  // use this to make sure these actions don't count as things you "undo"
  const ignoredActions = new Set([
    "setActiveComponent",
    "setActiveLayer",
    "upOneLayer",
    "setActiveHTML",
    "updateComponentNameInputValue",
  ]);
  
  let redoMixin = {
    data() {
      return {
        doneAction: [],
        undoneAction: [],
        isTimetraveling: false,
        initialState: {},
      };
    },
    created() {
      this.$store.subscribeAction((action, state) => {
        if (typeof action.payload === "object") {
          action.payload = cloneDeep(action.payload);
        }
        this.doneAction.push(action);
        if (!this.isTimetraveling) {
          if (this.undoneAction[this.undoneAction.length - 1]) {
            if (
              action.type ===
              this.undoneAction[this.undoneAction.length - 1].type &&
              deepEqual(
                action.payload,
                this.undoneAction[this.undoneAction.length - 1].payload
              )
            ) {
              this.undoneAction.pop();
            } else {
              this.undoneAction = [];
            }
          }
        }
      });
    },
    // undo + redo function calling
    // metaKey accounts for Command Key on Mac
    mounted() {
      const throttledUndo = throttle(this.undo, 300);
      const throttledRedo = throttle(this.redo, 300);
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
  
      this.initialState = defaultState(this.$store.state);
    },
  
    methods: {
      undo: function () {
        if (this.doneAction.length === 0) {
          return;
        }
  
        this.isTimetraveling = true;
        let undone = this.doneAction.pop();
  
        /* assuming we have have something to undo, we check if we are undoing an action that has no feedback
          e.g.: changing active elements or active components or going up and down a layer since these can be obscured from immediate feedback.
          these will feel bad to undo (imagine someone clicking around out of boredom and then deciding to undo
          this will force them to have to undo the 30 highlights they just did instead of the last "Real" action)
          if this happens we keep popping the doneAction queue and building up the redo queue. */
        if (undone !== undefined) {
          this.undoneAction.push(undone);
          if (ignoredActions.has(undone.type)) {
            while (
              this.doneAction[this.doneAction.length - 1] &&
              ignoredActions.has(this.doneAction[this.doneAction.length - 1].type)
            ) {
              this.undoneAction.push(this.doneAction.pop());
            }
            /* if we get here, that means we have undone all "useless" actions
            so we have to do one more final pop and push, have to make sure it isn't null though */
            let finalPop = this.doneAction.pop();
            if (finalPop !== undefined) {
              this.undoneAction.push(finalPop);
            }
          }
        }
  
        let payload = {
          initialState: this.initialState,
          store: this.$store,
        };
        this.$store.commit("EMPTY_STATE", payload);
        this.doneAction.forEach((action) => {
          this.$store.dispatch(action.type, cloneDeep(action.payload));
          this.doneAction.pop();
        });
        this.isTimetraveling = false;
      },
  
      redo: function () {
        let action = this.undoneAction.pop();
  
        // we have to set timeTraveling to true to preserve the undoneAction array while we make changes
        this.isTimetraveling = true;
        if (action) {
          this.$store.dispatch(action.type, cloneDeep(action.payload));
        }
        this.isTimetraveling = false;
        if (action && ignoredActions.has(action.type)) {
          this.redo();
        }
      },
  
      // Undo triggered from MyLayout.vue
      undoTrigger: function () {
        const throttledUndo = throttle(this.undo, 300);
        throttledUndo();
      },
  
      // Redo triggered from MyLayout.vue
      redoTrigger: function () {
        const throttledRedo = throttle(this.redo, 300);
        throttledRedo();
      },
    },
  };
  
  export default defineComponent({
    name: "App",
    mixins: [redoMixin],
  });
  </script> -->
