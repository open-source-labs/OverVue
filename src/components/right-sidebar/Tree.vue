<!--
  LOCATION IN APP:
  central tree UI

  FUNCTIONALITY:
  - Displays working drag-and-droppable project tree
  - Drag & drop functionality developed by OverVue v.10.0
-->

<script setup lang="ts">
/* IMPORTS */
import { ref, computed, watch, onMounted } from "vue";
import { useStore } from "../../stores/main.js";

// [OverVue v.10.0]
// we 'forked', published, and installed our own npm packages based on:
// https://github.com/ssthouse/tree-chart
import VueTree from "@overvue/vue3-tree-chart";
import "@overvue/vue3-tree-chart/dist/vue3-tree-chart.css";

import HTMLElementsList from "./HTMLElementsList.vue";

/* LIFECYCLE HOOKS */
onMounted(() => {
  // Sets tree view to origin on initial render
  tree.value.setToOrigin();
});

/* DATA */
const treeConfig = ref({ nodeWidth: 175, nodeHeight: 100, levelHeight: 200 });
const treeData = ref<typeof VueTree.treeData>(null);
const tree = ref<typeof VueTree>(null); // ref to htmlelement
defineExpose({ tree }); // makes tree available through template refs
const inspectComponentModal = ref(false);

/* COMPUTED */
const store = useStore();
const componentMap = computed(() => store.componentMap);
const activeComponent = computed(() => store.activeComponent); // handles collapsing child nodes
const htmlList = computed(
  () => store.componentMap[store.activeComponent].htmlList
);
const routes = computed(() => store.routes);
const activeRoute = computed(() => store.activeRoute);

/* STORE ACTIONS */
const setActiveTreeNode: typeof store.setActiveTreeNode = (payload) =>
  store.setActiveTreeNode(payload);
const setPotentialParentNode: typeof store.setPotentialParentNode = (payload) =>
  store.setPotentialParentNode(payload);
const moveNode: typeof store.moveNode = (payload) => store.moveNode(payload);
const setComponentDetailsTab: typeof store.setComponentDetailsTab = (payload) =>
  store.setComponentDetailsTab(payload);

/* METHODS */

const zoom = (event: WheelEvent) => {
  if (event.deltaY < 0) {
    tree.value.zoomIn();
  } else {
    tree.value.zoomOut();
  }
};

const evalChildren = (
  children: typeof VueTree.treeData.children,
  targetString: string,
  view: { value: string }
) => {
  children.forEach((el: typeof VueTree.treeData.value) => {
    if (el.value === targetString) {
      store.setActiveRoute(view.value);
      return;
    } else if (el.children.length > 0) {
      return evalChildren(el.children, targetString, view);
    }
  });
};

const activateNode = (nodeToActivate: string) => {
  if (nodeToActivate === "App") {
    return;
  }

  for (const key in routes.value) {
    if (nodeToActivate === key) {
      store.setActiveRoute(nodeToActivate);
      store.setActiveComponent("");

      return;
    }
  }

  for (const view of treeData.value.children) {
    if (view.children.length > 0) {
      view.children.forEach((el: typeof VueTree.treeData.value) => {
        // check where the view.value is NOT the active route
        if (view.value !== activeRoute.value) {
          if (nodeToActivate === el.value) {
            store.setActiveRoute(view.value);
            return;
          }
          if (el.children.length > 0) {
            evalChildren(el.children, nodeToActivate, view);
          }
        }
      });
    }
  }

  if (activeComponent.value !== nodeToActivate) {
    store.setActiveComponent(nodeToActivate);
  }
};

const buildTree = (componentData: typeof VueTree.treeData) => {
  const treeData: {
    value: string;
    children: { value: string; children: string[] }[];
  } = {
    value: "App",
    children: [],
  };

  // only routes have component as children
  for (const child of componentData.App.children) {
    treeData.children.push({
      value: child,
      children: buildTreeChildren(componentData[child].children),
    });
  }

  return treeData;
};

const buildTreeChildren = (array: string[]) => {
  if (array.length === 0) return [];
  else {
    const outputArray: [] = [];

    array.forEach((el) => {
      const outputObj = {
        value: el,
        children: [],
      };

      for (const component in componentMap.value) {
        if (component === el) {
          if (componentMap.value[component].children.length > 0) {
            outputObj.children = buildTreeChildren(
              componentMap.value[component].children
            );
          }
        }
      }

      (outputArray as { value: string; children: string[] }[]).push(outputObj);
    });

    return outputArray;
  }
};

/* [OverVue v.10.0] DRAG & DROP METHODS (TREE UI) */

const startDrag = (event: Event, activeTreeNode: string) => {
  // update class to make activeTreeNode transparent while being dragged
  (event.target as HTMLElement).classList.add("currentlyDragging");
  setActiveTreeNode(activeTreeNode); // set active tree node
};

const dragEnter = (event: Event, node: string) => {
  setPotentialParentNode(node); // set potential parent node to node being hovered over
};

const dragOver = (event: Event) => {
  // needed to invoke endDrag automatically
};

const endDrag = (event: Event, activeTreeNode: string) => {
  // set currently dragged component as child of current potential parent
  // remove component from children list of previous parent
  moveNode(activeTreeNode);
};

/* [OverVue v.10.0] INSPECT COMPONENT MODAL FEATURE */

const inspectComponent = (event: Event) => {
  // ensure that modal doesn't open if active component has no HTML elements
  // (also redirects tab to 'New HTML Section')
  if (!Object.keys(htmlList.value).length) {
    setComponentDetailsTab("newhtml");
    return;
  }

  setComponentDetailsTab("code");
  inspectComponentModal.value = !inspectComponentModal.value;
};

/* WATCHES */
treeData.value = buildTree(componentMap.value);
watch(componentMap, () => (treeData.value = buildTree(componentMap.value)), {
  deep: true,
});
</script>

<template>
  <div class="container">
    <!-- main tree UI -->
    <vue-tree
      style="width: 100%; height: 100vh; border: 1px solid rgb(96, 96, 96)"
      :dataset="treeData"
      :config="treeConfig"
      ref="tree"
      @wheel="zoom"
      @dragover.prevent="dragOver($event), false"
    >
      <template v-slot:node="{ node }">
        <span
          v-if="activeComponent === node.value"
          class="tree-node-active"
          @dblclick="inspectComponent($event)"
          @dragstart="startDrag($event, node.value)"
          draggable="true"
          :stop-propagation="true"
          @dragend.prevent="endDrag($event, node.value)"
          @dragenter.prevent="dragEnter($event, node.value)"
        >
          {{ node.value }}
        </span>
        <span
          v-else-if="activeRoute === node.value"
          class="tree-node-activeRoute"
          @dragenter.prevent="dragEnter($event, node.value)"
        >
          {{ node.value }}
        </span>
        <span
          v-else
          class="tree-node"
          @click="activateNode(node.value)"
          @dblclick="inspectComponent($event)"
          @dragstart="startDrag($event, node.value)"
          draggable="true"
          :stop-propagation="true"
          @dragend="endDrag($event, node.value)"
          @dragenter.prevent="dragEnter($event, node.value)"
        >
          {{ node.value }}
        </span>
      </template>
    </vue-tree>
  </div>

  <!-- inspect component modal feature -->
  <q-dialog v-model="inspectComponentModal">
    <div class="modal-box-container">
      <div class="modal-box-title">
        {{ activeComponent }}
      </div>
      <div class="modal-box">
        <HTMLElementsList />
      </div>
    </div>
  </q-dialog>
</template>

<style lang="scss" scoped>
.currentlyDragging {
  // opacity: 0.5;
  transform: scale(1.1);
}

.modal-box {
  background: $subprimary;
  min-width: 400px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // padding: 10em;
  border-radius: 5px;
  border: 1px solid white;
  box-shadow: inset 0 0 0.5px 1px hsla(0, 0%, 100%, 0.075),
    /* shadow ring 👇 */ 0 0 0 1px hsla(0, 0%, 0%, 0.05),
    /* multiple soft shadows 👇 */ 0 0.3px 0.4px hsla(0, 0%, 0%, 0.02),
    0 0.9px 1.5px hsla(0, 0%, 0%, 0.045), 0 3.5px 6px hsla(0, 0%, 0%, 0.09);
  // box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
  //   rgba(0, 0, 0, 0.3) 0px 30px 60px -30px,
  //   rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;

  position: relative;
}

.modal-box-title {
  font-size: 2.5em;
  margin: 0 auto;
  font-weight: bold;
  text-align: center;
}

.container {
  height: 100%;
  width: 100%;
  text-shadow: -2px 0px 10px rgba(0, 0, 0, 0.16);
  background-color: $subtertiary;
}

.container:hover {
  cursor: move;
}

.tree-node,
.tree-node-active,
.tree-node-activeRoute {
  display: inline-block;
  padding: 8px;
  min-width: 80%;
  margin: 6px;
  min-height: 28px;
  color: $menutext;
  background-color: $secondary;
  text-align: center;
  line-height: 28px;
  border-radius: 4px;
  word-wrap: break-word;
}

.tree-node-active {
  background-color: $accent;
  color: $darktext;
  border: 2px solid $menutext;
}

.tree-node-activeRoute {
  background-color: $darktext;
  border: 2px solid $menutext;
}
</style>
../../stores/main.js
