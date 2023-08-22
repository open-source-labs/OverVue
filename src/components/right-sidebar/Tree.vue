<!--
Description:
  Displays project tree in Dashboard
  Functionality includes: formatting componentMap object to displaying in tree form
  -->

<script setup lang="ts">
// import VueTree from "@ssthouse/vue3-tree-chart";
// import "@ssthouse/vue3-tree-chart/dist/vue3-tree-chart.css";

// [OverVue v.10.0] refactored @sst-house library files to de-activate background drag functionality
// we 'forked', published, and installed our own npm packages
import VueTree from "@overvue/vue3-tree-chart";
import "@overvue/vue3-tree-chart/dist/vue3-tree-chart.css";

import HTMLQueue from "./HTMLQueue.vue";
import NewHTMLQueue10 from "./NewHTMLQueue10.vue";

import { useStore } from "../../store/main.js";
import { ref, computed, watch } from "vue";

const store = useStore();

/* DATA */
const treeConfig = ref({ nodeWidth: 175, nodeHeight: 100, levelHeight: 200 });
const treeData = ref<typeof VueTree.treeData>(null);
const tree = ref<typeof VueTree>(null); // ref to htmlelement
defineExpose({ tree }); // makes tree available through template refs
const inspectComponentModal = ref(false);

/* COMPUTED */
const componentMap = computed(() => store.componentMap);
const activeComponent = computed(() => store.activeComponent); // handles collapsing child nodes
const activeTreeNode = computed(() => store.activeTreeNode); // handles drag & drop functionality within main Tree UI

// routes
const routes = computed(() => store.routes);
const activeRoute = computed(() => store.activeRoute);

/* FUNCTIONS */

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
      if (routes.value[key].length > 0) {
        store.setActiveComponent("");
      }
      return;
    }
  }

  //if we click a component, check which route, and then if needed dispatch the route THEN the component
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
  // console.log("componentData in buildTree", componentData);

  const treeData: {
    value: string;
    children: { value: string; children: string[] }[];
  } = {
    value: "App",
    children: [],
  };
  // console.log("tree data", treeData);

  // Views come after the root, as its children. No components will be children of App.
  // ONLY Views will have components as children.
  for (const child of componentData.App.children) {
    treeData.children.push({
      value: child,
      children: buildTreeChildren(componentData[child].children),
    });
  }

  return treeData;
};

const buildTreeChildren = (array: string[]) => {
  // console.log("array in buildTreeChildren", array);

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

// invoke + watch buildTree
treeData.value = buildTree(componentMap.value);
watch(componentMap, () => (treeData.value = buildTree(componentMap.value)), {
  deep: true,
});

/* [OverVue v.10.0] STORE METHODS (STATE UPDATERS) */

const setActiveTreeNode: typeof store.setActiveTreeNode = (payload) =>
  store.setActiveTreeNode(payload);

const setPotentialParentNode: typeof store.setPotentialParentNode = (payload) =>
  store.setPotentialParentNode(payload);

const moveNode: typeof store.moveNode = (payload) => store.moveNode(payload);

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
  // event.preventDefault(); --> handled in <template>
};

const endDrag = (event: Event, activeTreeNode: string) => {
  // set currently dragged component as child of current potential parent
  // remove component from children list of previous parent
  moveNode(activeTreeNode);
};

/* [OverVue v.10.0] INSPECT COMPONENT MODAL FEATURE */

const inspectComponent = (event: Event) => {
  console.log("double clicked");
  inspectComponentModal.value = !inspectComponentModal.value;
  console.log("inspect component modal value", inspectComponentModal.value);
};
</script>

<template>
  <div class="container">
    <vue-tree
      style="width: 100%; height: 100vh; border: 1px solid gray"
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
  <q-dialog v-model="inspectComponentModal">
    <div class="modal-box">
      <!-- <HTMLQueue /> -->
      <NewHTMLQueue10 />
      <!-- <Tree /> -->
    </div>
  </q-dialog>
</template>

<style lang="scss" scoped>
.modal-box {
  background: hotpink;
  width: 400px;
}

.container {
  height: 100%;
  width: 100%;
  background-color: black;
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
