<template>
  <button @click="outputTreeData"></button>
  <Draggable v-model="treeData" />
</template>

<script setup>
// [OverVue v.10.0] he-tree library: https://hetree.phphe.com/v2/
import { Draggable } from "@he-tree/vue";
import "@he-tree/vue/style/default.css";
import { useStore } from "src/store/main";
import { ref, computed, watch } from "vue";

const store = useStore();

const componentMap = computed(() => store.componentMap);
const activeComponent = computed(() => store.activeComponent);

const htmlList = JSON.parse(JSON.stringify(componentMap.value))[
  activeComponent.value
].htmlList;

// Parsing - unneeded for HeTree
// const convertToTreeData = (htmlList) => {
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
// convertToTreeData(htmlList);
// // console.log("converted", JSON.parse(JSON.stringify(convertedTreeData.value)));

const treeData = ref(
  JSON.parse(JSON.stringify(componentMap.value))[activeComponent.value].htmlList
);

const outputTreeData = () => {
  console.log(treeData.value);
};

watch(
  treeData,
  () => {
    componentMap.value[activeComponent.value].htmlList = treeData.value;
    console.log(
      "updated htmlList: ",
      componentMap.value[activeComponent.value].htmlList
    );
  },
  { deep: true }
);

/*

types:

type HTMLTreeElement = {
  text: string,
  children: HTMLTreeElement[]
}

htmlTreeData: HTMLTreeElement[]

===

2 divs, 1 img, 3 forms
(then drag second div as child of first div)

activeComponent.htmlList -->
[
  {
    text: div,
    children: [
        {
          text: div,
          children: []
        },
    ]
  },
  {
    text: img,
    children: []
  },
  {
    text: form,
    children: []
  },
  {
    text: form,
    children: []
  },
  {
    text: form,
    children: []
  },
]

*/

// [{text: 'Frontend', children: [{text: 'Vue', children: [{text: Nuxt}]}, {text: 'React', chldren: [{text: 'Next'}]}, {text:Angular}]}, {text" 'Backend'}]
</script>

<style scoped></style>
