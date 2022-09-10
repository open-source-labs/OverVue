<template>
  <div id="gridDensity">
    <q-btn-dropdown class="q-btn" color="purple" label="Width">
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
    <q-btn-dropdown color="purple" label="Height">
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
  import { mapState, mapActions } from "vuex";

  export default {
    name: "GridDensity",
    computed: {
    ...mapState([
      "gridLayout",
    ]),
    },
    methods: {
    ...mapActions([
      "changeGridDensity"
    ]),
    pickGridDensity(direction, densityNum){
      let payload = {
        direction:direction,
        densityNum:densityNum,
      }
      this.changeGridDensity(payload);
    },
    },
  }
</script>

<style scoped lang="scss">
#gridDensity {
  margin-left: 15px;
}
.q-btn {
  padding: 5px 20px;
  margin-right: 15px;
}
.q-expansion-item {
    margin-bottom: 10px;
}
</style>