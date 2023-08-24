<template>
  <div>
    <Draggable v-model="treeData" />
  </div>
</template>

<script setup>
import { Draggable } from "@he-tree/vue";
import { useStore } from "src/store/main";
import { ref, computed, watch, onMounted } from "vue";

const store = useStore();

const treeData = ref([]);

const componentMap = computed(() => store.componentMap);
const activeComponent = computed(() => store.activeComponent);

const deleteElement = (id) => store.deleteFromElementHtmlList(id);

if (activeComponent.value !== "") {
  treeData.value = JSON.parse(JSON.stringify(componentMap.value))[
    activeComponent.value
  ].htmlList;
}

// const outputTreeData = () => console.log(treeData.value);

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

onMounted(() => {
  //vtlist he-tree
  // const trees = document.getElementsByClassName("he-tree");
  // console.log('tree', trees);
  // //trees[0].children[0].children
  // for (const tree in trees) {
  //   for (const treeNode in tree.children) {

  //   }
  // }

  //compute = componentMap.value[activeComponent.value].htmlList
  //if(vt-index === htmlList[index])

  const flattenTreeData = (data) => {
    const flattened = [];

    const flattenRecurse = (data) => {
      for (let i = 0; i < data.length; i++) {
        flattened.push({
          text: data[i].text,
          id: data[i].id,
        });

        if (data[i].children.length) flattenRecurse(data[i].children);
      }
    };

    flattenRecurse(data);
    return flattened;
  };

  const flattenedTreeData = flattenTreeData(treeData.value);
  // console.log('flattenedTreeData:', flattenedTreeData);

  const tree = document.getElementsByClassName("vtlist-inner");
  console.log("tree", tree);

  for (const [index, treeNode] of Object.entries(tree[0].children)) {
    // console.log("children array ", index);
    console.log("current html list: ", treeData.value);
    console.log("flattened tree data: ", flattenedTreeData);
    // console.log('he tree structure: ', Object.entries(tree[0].children));

    const deleteButton = document.createElement("button");
    const icon = document.createElement("i");
    deleteButton.appendChild(icon);
    icon.setAttribute("class", "fas fa fa-trash fa-md");

    deleteButton.addEventListener("click", () => {
      console.log("inside click: ", flattenedTreeData[index].id);
      deleteElement(flattenedTreeData[index].id);
    });

    treeNode.children[0].appendChild(deleteButton);
  }
});

const checkChildren = (node) => {};
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
