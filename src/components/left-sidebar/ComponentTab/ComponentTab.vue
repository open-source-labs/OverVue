<!--
  LOCATION IN APP:
  [left sidebar] COMPONENT

  FUNCTIONALITY:
  - Displays either 'create component' options or 'update component' options based on whether there is a current active component
-->

<template>
  <q-card id="store-cards" class="no-shadow">
    <CreateMenu v-if="activeComponent === ''" />
    <UpdateMenu v-if="activeComponent !== ''" />
  </q-card>
</template>

<script setup lang="ts">
/* IMPORTS */
import { computed } from "vue";
import { useStore } from "../../../stores/main.js";
import CreateMenu from "./CreateMenu.vue";
import UpdateMenu from "./UpdateMenu.vue";

/* COMPUTED VALUES */
const store = useStore();
const activeComponent = computed(() => store.activeComponent);
</script>

<style lang="scss">
.html-bg {
  background-color: $subprimary;
}

#store-cards {
  height: 100%;
  border-radius: 0px !important;
  background-color: $subprimary;
}

.q-tab-panel {
  height: calc(100% - 30px);
  background: $subprimary;
  padding: 0px;
  border-radius: 0px !important;
}

.q-tab-panels {
  height: 100%;
  border-radius: 0px !important;
}

.q-tabs {
  background: $subprimary;
}

.q-tab__content {
  padding: 10px 0;
}
</style>

