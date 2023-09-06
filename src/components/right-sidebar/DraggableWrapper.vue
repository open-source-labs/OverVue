<!--
  LOCATION IN APP:
  [right sidebar] COMPONENT DETAILS > HTML Elements

  FUNCTIONALITY:
  - Displays he-tree component 'Draggable' (to render draggable HTML Element tree)
-->

<template>
  <div>
    <Draggable v-model="props.htmlList">
      <template #default="{ node, stat }">
        <!-- edit button (pencil icon) -->
        <span class="pencil-icon">
          <i
            class="fa-solid fa-pencil fa-2xs"
            @click="setActiveElement([node.text, node.id], stat)"
          ></i>
        </span>

        <!-- HTML element -->
        {{ node.text }}

        <!-- delete button (trash can icon) -->
        <span @click="deleteSelectedNode(node)">
          <i class="fas fa fa-trash fa-md"></i>
        </span>
      </template>
    </Draggable>
  </div>
</template>

<script setup>
/* IMPORTS */
import { ref, computed, watch } from "vue";
import { Draggable } from "@he-tree/vue";
import "@he-tree/vue/style/default.css";
import { useStore } from "src/store/main";

/* EMITS & PROPS */
const emit = defineEmits(["delete"]);
const props = defineProps(["htmlList"]);

/* DATA */
const attributeModal = ref(false);

/* COMPUTED VALUES */
const store = useStore();
const attributeModalOpen = computed(() => store.attributeModalOpen);
const activeComponent = computed(() => store.activeComponent);

/* STORE ACTIONS */
const setActiveHTML = (payload) => store.setActiveHTML(payload);
const openAttributeModal = () => store.openAttributeModal();
const clearActiveHTML = () => store.clearActiveHTML();
const deleteElement = (id) => store.deleteFromElementHtmlList(id);

/* METHODS */

const deleteSelectedNode = (node) => {
  deleteElement(node.id);
  emit("delete");
};

const closeMenu = () => {
  if (activeComponent.value !== "") {
    clearActiveHTML();
    openAttributeModal();
  }
};

const setActiveElement = (element, stat) => {
  if (activeComponent.value !== "") {
    setActiveHTML(element);
    if (attributeModal.value === false) {
      openAttributeModal();
    } else {
      closeMenu();
    }
  }
};

/* WATCHES */
watch(attributeModalOpen, () => {
  attributeModal.value = attributeModalOpen.value;
});
</script>

<style lang="scss" scoped>
.vtlist .he-tree {
  cursor: pointer;
}

.he-tree--rtl {
  direction: rtl;
}

.he-tree--drag-overing {
  // background: $subprimary;
  background: #ffffff00;
}

.he-tree-drag-placeholder {
  // background: #72d096;
  // background: #ffffff00;
  background: red;
  /* border:1px dashed #00ff80; */
  height: 40px;
}

.vtlist {
  display: flex;
}

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
