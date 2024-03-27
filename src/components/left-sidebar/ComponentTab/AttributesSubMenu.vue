<!--
  LOCATION IN APP:
  [left sidebar] COMPONENT > Update Component > Component Attributes

  FUNCTIONALITY:
  - Enables user to add class & ID attributes to enclosing div of current active component
-->

<template>
  <div>
    <!-- dropdown selection menu -->
    <q-btn-dropdown
      class="attributeDropDown"
      color="primary"
      :label="attributeSelection"
    >
      <q-list>
        <q-item
          clickable
          v-close-popup
          @keyup.enter="changeAttribute('class')"
          @click="changeAttribute('class')"
        >
          <q-item-section>
            <q-item-label>class</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          v-close-popup
          @keyup.enter="changeAttribute('id')"
          @click="changeAttribute('id')"
        >
          <q-item-section>
            <q-item-label>id</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <!-- user input -->
    <q-input
      @keyup.enter="createAttribute(attributeText as 'id' | 'class')"
      color="white"
      dark
      outlined
      bottom-slots
      v-model="attributeText"
      label="Enter class or id"
      dense
      class="input-add"
      v-on:keyup.delete.stop
    >
      <template v-slot:append>
        <q-btn
          flat
          icon="add"
          @click="createAttribute(attributeText as 'id' | 'class')"
        />
      </template>
    </q-input>

    <!-- delete buttons -->
    <button
      v-if="activeComponentObj && (activeComponentObj as Component).htmlAttributes.class !== ''"
      class="deleteButton"
      @click="deleteAttribute('class')"
      color="primary"
    >
      remove class
    </button>

    <button
      v-if="activeComponentObj && (activeComponentObj as Component).htmlAttributes.id !== ''"
      class="deleteButton"
      @click="deleteAttribute('id')"
      color="primary"
    >
      remove id
    </button>
  </div>
</template>

<script setup lang="ts">
/* IMPORTS */
import { computed, ref } from "vue";
import { useStore } from "../../../stores/main.js";
import { Component } from "../../../../types";
const cloneDeep = require("lodash.clonedeep");

/* DATA */
let attributeText = ref("");
let attributeSelection = ref("class");

/* COMPUTED VALUES */
const store = useStore();
const activeComponent = computed(() => store.activeComponent);
const activeComponentObj = computed(() => store.activeComponentObj);
const activeRouteKey = computed(() => store.routes[store.activeRoute]);

/* STORE ACTIONS */
const editAttribute: typeof store.editAttribute = (payload) =>
  store.editAttribute(payload);
const activeComponentData = (): Component => {
  return cloneDeep(activeComponentObj.value);
};

/* COMPONENT METHODS */
const changeAttribute = (attribute: "id" | "class") => {
  attributeSelection.value = attribute;
};

const createAttribute = (attribute: "id" | "class") => {
  editAttribute({
    attribute: attributeSelection.value as "id" | "class",
    value: attribute,
    activeComponent: activeComponent.value,
    routeArray: activeRouteKey.value,
    activeComponentData: activeComponentData as unknown as Component,
  });
  attributeText.value = "";
};

const deleteAttribute = (attribute: "id" | "class") => {
  editAttribute({
    attribute: attribute,
    value: "",
    activeComponent: activeComponent.value,
    routeArray: activeRouteKey.value,
    activeComponentData: activeComponentData as unknown as Component,
  });
};
</script>

<style lang="scss" scoped>
.attributeDropDown {
  margin-top: 15px;
  padding-right: 10px;
  font-size: 1em;
}

.input-add {
  margin-top: 1em;
  margin-bottom: -1em;
}

.deleteButton {
  width: 100px;
  height: 30px;
  background-color: rgba(204, 190, 190, 0.164);
  color: $menutext;
  margin-right: 2em;
}

.deleteButton:hover {
  cursor: pointer;
}
</style>
../../../stores/main.js
