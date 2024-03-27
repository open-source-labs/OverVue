<!--
  LOCATION IN APP:
  [left sidebar] COMPONENT > Update Component > Props

  FUNCTIONALITY:
  - Enables user to create props, save them, and add them to current active component
-->

<template>
  <div>
    <!-- create new prop -->
    <q-input
      @keyup.enter="createNewProp(textProps)"
      color="white"
      dark
      outlined
      bottom-slots
      v-model="textProps"
      label="Create new prop"
      dense
      class="input-add"
      v-on:keyup.delete.stop
    >
      <template v-slot:append>
        <q-btn flat icon="add" @click="createNewProp(textProps)" />
      </template>
    </q-input>

    <!-- select an existing prop -->
    <div id="props-select">
      <VueMultiselect
        v-model="selectProps"
        class="multiselect"
        placeholder="Select an existing prop"
        :multiple="true"
        :close-on-select="false"
        :max-height="180"
        :option-height="20"
        open-direction="top"
        :options="propsOptions"
        :searchable="false"
        @search-change="stopDelete($event)"
      >
        <template v-slot:noResult>No props found</template>
      </VueMultiselect>
    </div>
    <br />

    <!-- select & add existing props -->
    <div>
      <q-btn
        v-if="selectProps.length"
        id="add-props-btn"
        class="add-btn"
        color="secondary"
        label="Add Prop(s)"
        @click="addPropsToComp"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/* IMPORTS */
import { ref, computed } from "vue";
import VueMultiselect from "vue-multiselect";
import { useStore } from "../../../stores/main";

/* DATA */
const textProps = ref("");

/* COMPUTED VALUES */
const store = useStore();
const selectedProps = computed(() => store.selectedProps);
const userProps = computed(() => store.userProps);
const propsOptions = userProps.value;
const selectProps = computed({
  get() {
    return [...selectedProps.value];
  },
  set(value) {
    addPropsSelected(value);
  },
});

/* STORE ACTIONS */
const createProp: typeof store.createProp = (payload) =>
  store.createProp(payload);
const addPropsSelected: typeof store.addPropsSelected = (payload) =>
  store.addPropsSelected(payload);
const addPropsToComponent: typeof store.addPropsToComponent = (payload) =>
  store.addPropsToComponent(payload);

/* METHODS */
const stopDelete = (e: KeyboardEvent) => {
  if (e.code === "Backspace") e.stopPropagation();
};

const createNewProp = (text: string) => {
  if (![...userProps.value].includes(text) && text) {
    createProp(text);
    textProps.value = "";
  }
};

const addPropsToComp = () => addPropsToComponent([...selectedProps.value]);
</script>

<style lang="scss" scoped>
.q-field {
  margin: 30px 0 10px;
}
</style>
../../../stores/main
