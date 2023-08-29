<template>
  <div>
    <Draggable v-model="props.htmlList">
      <template #default="{ node, stat }">
        <span class="pencil-icon">
          <i
            class="fa-solid fa-pencil fa-2xs"
            @click="setActiveElement([node.text, node.id], stat)"
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
import { ref, computed, watch } from "vue";
import { useStore } from "src/store/main";
import { Draggable } from "@he-tree/vue";
import "@he-tree/vue/style/default.css";

const store = useStore();

const emit = defineEmits(["delete"]);

const attributeModal = ref(false);

/* COMPUTED VALUES */
const attributeModalOpen = computed(() => store.attributeModalOpen);
const activeComponent = computed(() => store.activeComponent);

const setActiveHTML = (payload) => store.setActiveHTML(payload);
const openAttributeModal = () => store.openAttributeModal();
const clearActiveHTML = () => store.clearActiveHTML();
const deleteElement = (id) => store.deleteFromElementHtmlList(id);
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
  // console.log("event", event);
  //console.log("element in html queue: ", element);
  if (activeComponent.value !== "") {
    console.log(stat);
    setActiveHTML(element);
    if (attributeModal.value === false) {
      openAttributeModal();
    } else {
      closeMenu();
    }
  }
};

const props = defineProps(["htmlList"]);

watch(attributeModalOpen, () => {
  attributeModal.value = attributeModalOpen.value;
});
</script>
<style lang="scss" scoped>
.vtlist .he-tree {
  cursor: pointer;
}

// .tree-node {
//   background-color: #59a476
// }

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
/* .vtlist-inner {
  display: flex;
}
*/
</style>
