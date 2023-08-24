<!-- [OverVue v.10.0] new & improved HTML Queue (now includes nesting) -->

<template>
  <!-- <button @click="outputTreeData">Output Tree Data</button> -->
  <div class="top-p" v-if="activeComponent === ''">
    Select a component to see your HTML elements.
  </div>
  <div v-else>
    <!-- <Draggable v-model="treeData" /> -->
    <V10HTMLQueue />
  </div>
</template>

<script setup>
// [OverVue v.10.0] he-tree library: https://hetree.phphe.com/v2/
// import { Draggable } from "@he-tree/vue";

import V10HTMLQueue from "./V10HTMLQueue.vue";
</script>


