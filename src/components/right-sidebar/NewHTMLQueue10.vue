<!-- [OverVue v.10.0] new & improved HTML Queue (now includes nesting) -->

<template>
  <!-- <button @click="outputTreeData">Output Tree Data</button> -->
  <div class="top-p" v-if="activeComponent === ''">
    Select a component to see your HTML elements.
  </div>
  <div v-else>
    <Draggable v-model="treeData" />
  </div>
</template>

<script setup>
// [OverVue v.10.0] he-tree library: https://hetree.phphe.com/v2/
import { Draggable } from "@he-tree/vue";
// import "@he-tree/vue/style/default.css";
import { useStore } from "src/store/main";
import { ref, computed, watch } from "vue";

const store = useStore();

const treeData = ref([]);

const componentMap = computed(() => store.componentMap);
const activeComponent = computed(() => store.activeComponent);
// const htmlList = computed(() => store.activeComponent.htmlList);

// const htmlList = computed(() => {
//   if (activeComponent.value !== "") {
//     treeData.value = JSON.parse(JSON.stringify(componentMap.value))[
//       activeComponent.value
//     ].htmlList;
//     return treeData.value;
//   }
// });

if (activeComponent.value !== "") {
  treeData.value = JSON.parse(JSON.stringify(componentMap.value))[
    activeComponent.value
  ].htmlList;
}

// const outputTreeData = () => {
//   console.log(treeData.value);
// };

// Watching tree data so that state updates when user interacts with tree
watch(
  treeData,
  () => {
    // Filters out empty objects that are placed in indices where elements were moved from
    componentMap.value[activeComponent.value].htmlList = JSON.parse(
      JSON.stringify(treeData.value)
    ).filter((obj) => Object.keys(obj).length > 0);
  },
  { deep: true }
);

// Parsing –– needed for HeTree
// const convertFromTreeData = (htmlList) => {
//   // const newTreeData = [];
//   //iterate through HTMLList of activeComponent in componentMap
//   for (let i = 0; i < htmlList.length; i++) {
//     //iterate through each HTMLelement object
//     const elementObject = {}; //declare an element object {};
//     for (const [text, children] in htmlList) {
//       elementObject.text = text;
//       elementObject.children = children;
//     }
//     convertedTreeData.value.push(elementObject); //push element object into the treeData
//   }
//   //do this recursively???
// };
// convertFromTreeData(htmlList);
// // console.log("converted", JSON.parse(JSON.stringify(convertedTreeData.value)));
</script>

<style>
.he-tree--rtl {
  direction: rtl;
}

.he-tree--drag-overing {
  background: #333334;
}

.he-tree-drag-placeholder {
  background: #72d096;
  /* border:1px dashed #00ff80; */
  height: 40px;
}

/* .he-tree {

} */

.vtlist {
  display: flex;
}

/* .vtlist-inner {
  display: flex;
}

.tree-node {
  display: flex;
} */

.tree-node-inner {
  box-sizing: border-box;
  font-size: 20px;
  background-color: #72d096;
  border: 1px solid rgb(150, 150, 150);
  border-radius: 5px;
  padding: 5px;
  text-align: center;
  width: 200px;
  height: 40px;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
