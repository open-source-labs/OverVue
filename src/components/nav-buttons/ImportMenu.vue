<!--
  LOCATION IN APP:
  [top-right corner] 'Import' button

  FUNCTIONALITY:
  - Allows user to import saved project from .json file

  NOTE:
  - Errors do not affect functionality
-->

<template>
  <q-btn
    class="nav-btn"
    color="secondary"
    label="Import"
    @click="openProjectJSON"
  >
    <!-- moved this functionality (click event) to <q-btn> above -->
    <!-- <q-menu class="dropdown">
      <div class="column items-center">
        <q-btn
          class="menu-btn"
          no-caps
          color="secondary"
          label="Project JSON"
          @click="openProjectJSON"
        />
      </div>
    </q-menu> -->
  </q-btn>
</template>

<script setup lang="ts">
/* IMPORTS */
const Mousetrap = require("mousetrap");
import { useStore } from "../../store/main";
import fs from 'fs'
// import { ipcRenderer } from 'electron';
// const fs = window.require('fs');

// @ts-ignore
const { ipcRenderer } = window;

Mousetrap.bind(["command+o", "ctrl+o"], () => {
  openProjectJSON();
});

const store = useStore();

/* STORE ACTIONS */
const openProject: typeof store.openProject = (payload) =>
  store.openProject(payload);

/* METHODS */

const showOpenJSONDialog = () => {
  ipcRenderer
    .invoke("openProject", {
      properties: ["openFile"],
      filters: [
        {
          name: "JSON Files",
          extensions: ["json"],
        },
      ],
    })
    .then((res: { jsonFile: any }) =>{
      openProject(res.jsonFile)
      })
    .catch((e: Error) => console.log(e));
};

const openProjectJSON = () => {
  showOpenJSONDialog();
};
</script>

<style scoped>
.mr-sm {
  margin-right: 0.2rem;
}
.menu-btn {
  width: 70%;
  margin: 10px 0px;
  max-height: 50px !important;
}

.import-comp {
  width: 80% !important;
  margin: 10px 0 20px 0 !important;
}
</style>
