<!-- 
  LOCATION IN APP:
  central UI

  FUNCTIONALITY:
  - Renders either Tree UI or Grid UI depending on mode selected (gear icon dropdown)
-->

<template>
  <q-page id="compDisplay">
    <div v-if="mode === 'canvas'">
      <Canvas />
    </div>
    <div v-else="mode === 'tree'">
      <Tree />
    </div>
  </q-page>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "../../src/store/main";
import Tree from "../components/right-sidebar/Tree.vue";
import Canvas from "../components/Canvas.vue";

const store = useStore();
const mode = computed(() => store.mode);
</script>

<style scoped>
#compDisplay {
  overflow-x: scroll;
  overflow-y: scroll;
  margin: 0px;
  padding-top: 20px;
  height: 100vh;
}
</style>
