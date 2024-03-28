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
  </q-btn>
</template>

<script setup lang="ts">
/* IMPORTS */
const Mousetrap = require("mousetrap");
import { useStore } from "../../stores/main.js";

// @ts-ignore
const { ipcRenderer } = window;
const store = useStore();

Mousetrap.bind(["command+o", "ctrl+o"], () => {
  openProjectJSON();
});

/* STORE ACTIONS */
const openProject: typeof store.openProject = (payload: any) => store.openProject(payload);

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

