<template>
  <div class="top-p" v-if="activeComponent === ''">
    Select a component to see your HTML elements.
  </div>
  <div v-else>
    <DraggableWrapper v-if="renderComponent" :htmlList="htmlList"/>
  </div>
</template>

<script setup>
import { useStore } from "src/store/main";
import { ref, computed, nextTick } from "vue";

import DraggableWrapper from "./DraggableWrapper.vue";

const store = useStore();

/* DATA */
const renderComponent = ref(true);

const forceRender = async () => {
  renderComponent.value = false;
  await nextTick();
  renderComponent.value = true;
}

const htmlList = computed({
  get: () => {
    if (store.componentMap[store.activeComponent]) {
      forceRender();
      return store.componentMap[store.activeComponent].htmlList;
    }
  }
})

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
