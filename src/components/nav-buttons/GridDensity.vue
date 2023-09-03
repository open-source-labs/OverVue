<!-- 
  LOCATION IN APP:
  [top bar, when 'GRID' mode enabled] WIDTH // HEIGHT buttons

  FUNCTIONALITY:
  - Enables user to alter grid density of containers within grid
-->

<template>
  <div id="gridDensity">
    <!-- width -->
    <q-btn-dropdown class="q-btn" color="secondary" label="Width">
      <q-list>
        <q-item clickable v-close-popup @click="pickGridDensity('width', 5)">
          <q-item-section>
            <q-item-label>5 increments</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickGridDensity('width', 10)">
          <q-item-section>
            <q-item-label>10 increments</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickGridDensity('width', 15)">
          <q-item-section>
            <q-item-label>15 increments</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickGridDensity('width', 30)">
          <q-item-section>
            <q-item-label>30 increments</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickGridDensity('width', 40)">
          <q-item-section>
            <q-item-label>40 increments</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <!-- height -->
    <q-btn-dropdown color="secondary" label="Height">
      <q-list>
        <q-item clickable v-close-popup @click="pickGridDensity('height', 5)">
          <q-item-section>
            <q-item-label>5 increments</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickGridDensity('height', 10)">
          <q-item-section>
            <q-item-label>10 increments</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickGridDensity('height', 15)">
          <q-item-section>
            <q-item-label>15 increments</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickGridDensity('height', 30)">
          <q-item-section>
            <q-item-label>30 increments</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickGridDensity('height', 40)">
          <q-item-section>
            <q-item-label>40 increments</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script setup lang="ts">
/* IMPORTS */
import { useStore } from "../../store/main";

const store = useStore();

/* METHODS */

const changeGridDensity: typeof store.changeGridDensity = (payload) =>
  store.changeGridDensity(payload);

const pickGridDensity = (direction: string, densityNum: number) => {
  let payload = { direction, densityNum };
  changeGridDensity(payload);
};
</script>

<style scoped lang="scss">
#gridDensity {
  margin-left: 15px;
}
.q-btn {
  padding: 0px 20px;
  margin-right: 15px;
}
.q-expansion-item {
  margin-bottom: 10px;
}
</style>
