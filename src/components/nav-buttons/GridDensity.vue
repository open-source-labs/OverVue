<!--
Description:
  Displays Grid Density Buttons
  Functionality includes: drop down menu for both height and width to increase or decrease grid lines by a set amount
-->
<template>
  <div id="gridDensity">
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

<script>
export default { name: "GridDensity" };
</script>

<script setup>
import { useStore } from "../../../store/index";
import { computed } from "vue";

const store = useStore();

const gridLayout = computed(() => store.gridLayout);

const changeGridDensity = (payload) => store.changeGridDensity(payload);

const pickGridDensity = (direction, densityNum) => {
  let payload = { direction, densityNum };
  changeGridDensity(payload);
};
</script>

<!-- <script lang="ts">
import { mapState, mapActions } from "vuex";
import { defineComponent } from "vue";

export default defineComponent({
  name: "GridDensity" as string,
  computed: {
    ...mapState(["gridLayout"]),
  },
  methods: {
    ...mapActions(["changeGridDensity"]),
    pickGridDensity(direction: string, densityNum: number): void {
      let payload: object = {
        direction: direction,
        densityNum: densityNum,
      };
      this.changeGridDensity(payload);
    },
  },
});
</script> -->

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
