<!--
Description:
  Displays Tree
  Functionality includes: N/A
  -->

<template>
  <!-- <Tree /> -->
  <q-page id="compDisplay">
    <!-- <q-page class="flex flex-center" id="compDisplay"> -->
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
  /* padding: 0px; */
  padding-top: 20px;
  height: 100vh;
  /* width: 100%; */
}
</style>
