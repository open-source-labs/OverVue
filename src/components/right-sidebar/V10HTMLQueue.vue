<template>
  <div class="top-p" v-if="activeComponent === ''">
    <div v-if="!routes[activeRoute].length">
      Add a component to this route to see its underlying HTML elements.
    </div>
    <div v-else>Select a component to see its underlying HTML elements.</div>
  </div>
  <div v-else>
    <div v-if="routes[activeRoute].length">
      <div v-if="Object.keys(htmlList).length">
        {{ activeRoute }} / {{ `${activeComponent}.vue` }}
        <DraggableWrapper v-if="renderComponent" :htmlList="htmlList" />
      </div>

      <div v-else>Add HTML elements to this component to see them here.</div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "src/store/main";
import { ref, computed, nextTick } from "vue";

import DraggableWrapper from "./DraggableWrapper.vue";

const store = useStore();

/* DATA */
const renderComponent = ref(true);

/* COMPUTED VALUES */
const htmlList = computed({
  get: () => {
    if (store.componentMap[store.activeComponent]) {
      forceRender();
      return store.componentMap[store.activeComponent].htmlList;
    }
  },
});

const activeComponent = computed(() => store.activeComponent);
const activeRoute = computed(() => store.activeRoute);
const routes = computed(() => store.routes);

/* FUNCTIONS */
const forceRender = async () => {
  renderComponent.value = false;
  await nextTick();
  renderComponent.value = true;
};
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
