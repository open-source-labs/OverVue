<template>
  <div>
    <Draggable v-model="htmlTreeData">
      <template #default="{ node, stat }">
        <span class="pencil-icon">
          <i
            class="fa-solid fa-pencil fa-2xs"
            @click="setActiveElement([node.text, node.id])"
          ></i>
        </span>
        {{ node.text }}
        <span @click="deleteSelectedNode(node)">
          <i class="fas fa fa-trash fa-md"></i>
        </span>
      </template>
    </Draggable>
  </div>
</template>

<script setup>
import { Draggable } from "@he-tree/vue";
import { useStore } from "src/store/main";
import { ref, computed, watch, onMounted, watchEffect } from "vue";

const store = useStore();

const logThis = (thing) => {
  console.log("node", thing);
};

/* DATA */
const htmlTreeData = ref([]);
const attributeModal = ref(false);

/* COMPUTED VALUES */
const componentMap = computed(() => store.componentMap);
const activeComponent = computed(() => store.activeComponent);
const attributeModalOpen = computed(() => store.attributeModalOpen);

/* EDIT ATTRIBUTES */
const openAttributeModal = () => store.openAttributeModal();
const setActiveHTML = (payload) => store.setActiveHTML(payload);
const clearActiveHTML = () => store.clearActiveHTML();

/* DELETE METHODS */
const deleteElement = (id) => store.deleteFromElementHtmlList(id);
const deleteSelectedNode = (node) => deleteElement(node.id);

/* EDIT ATTRIBUTE METHODS */
const closeMenu = () => {
  if (activeComponent.value !== "") {
    clearActiveHTML();
    openAttributeModal();
  }
};

const setActiveElement = (element) => {
  // console.log("render list: ", renderList.value);
  console.log("element in html queue: ", element);
  if (activeComponent.value !== "") {
    setActiveHTML(element);
    if (attributeModal.value === false) {
      openAttributeModal();
    } else {
      closeMenu();
    }
  }
};

// when active component is selected, render HTML list
if (activeComponent.value !== "") {
  htmlTreeData.value = JSON.parse(JSON.stringify(componentMap.value))[
    activeComponent.value
  ].htmlList;
  // console.log("htmlTreeData", htmlTreeData.value);
}

// Watching tree data so that state updates when user interacts with tree
watch(
  // () => [activeComponent.value, htmlTreeData.value],
  htmlTreeData,
  () => {
    // Filters out empty objects that are placed in indices where elements were moved from
    componentMap.value[activeComponent.value].htmlList =
      htmlTreeData.value.filter((obj) => Object.keys(obj).length > 0);
  },
  { deep: true }
);

watch(attributeModalOpen, () => {
  attributeModal.value = attributeModalOpen.value;
});
</script>

<style lang="scss">
.vtlist .he-tree {
  cursor: pointer;
}

.he-tree--rtl {
  direction: rtl;
}

.he-tree--drag-overing {
  background: $subprimary;
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
  justify-content: space-around;
} */

.tree-node-inner {
  box-sizing: border-box;
  font-size: 20px;
  background-color: #72d096;
  border: 1px solid rgb(150, 150, 150);
  border-radius: 5px;
  padding: 5px;
  text-align: center;
  margin-top: 5px;
  width: 200px;
  height: 40px;
  text-overflow: ellipsis;
  overflow: hidden;
  display: flex;
  justify-content: space-around;
}
</style>
