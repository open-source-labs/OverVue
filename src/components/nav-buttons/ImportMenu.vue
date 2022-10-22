<!--
Description:
  Displays Open Project Button
  Functionality includes: opening saved json file and storing data in state
  -->

<template>
  <q-btn class="nav-btn" color="secondary" label="Import">
    <q-menu :offset="[0, 15]" class="dropdown">
      <div class="column items-center">
        <p class="center">Import:</p>
        <q-btn
          class="menu-btn"
          no-caps
          color="secondary"
          label="Project JSON"
          @click="openProjectJSON"
        />
        <ImportComponent
          class="import-comp menu-btn"
          no-caps
          title="Vue Component (coming soon)"
          :disable="true"
        />
      </div>
    </q-menu>
  </q-btn>
</template>

<script>
export default { name: "ImportMenu" };
</script>

<script setup lang="ts">
import { useStore } from "../../store/main";
import ImportComponent from "../left-sidebar/ComponentTab/ImportComponent.vue";
import { Component } from "../../../types";
import * as fs from "fs";
const Mousetrap = require("mousetrap");
const { ipcRenderer } = window.require("electron");

const store = useStore();

// ON CREATED
Mousetrap.bind(["command+o", "ctrl+o"], () => {
  openProjectJSON();
});

const openProject: typeof store.openProject = (payload) =>
  store.openProject(payload);

const openJSONFile = (data: fs.PathOrFileDescriptor[]) => {
  if (!data) return;
  const jsonFile = JSON.parse(fs.readFileSync(data[0], "utf8"));
  openProject(jsonFile);
};

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
    .then((res: { filePaths: fs.PathOrFileDescriptor[] }) =>
      openJSONFile(res.filePaths)
    )
    .catch((e: Error) => console.log(e));
};

const openProjectJSON = () => {
  showOpenJSONDialog();
};
</script>

<!-- <script>
import { mapActions } from "vuex";
import ImportComponent from "../left-sidebar/ComponentTab/ImportComponent.vue";
const Mousetrap = require("mousetrap");
const { fs, ipcRenderer } = window;

export default {
  name: "ImportMenu",
  components: {
    ImportComponent,
  },
  methods: {
    ...mapActions(["openProject"]),
    // opens project
    openJSONFile(data) {
      if (data === undefined) return;
      const jsonFile = JSON.parse(fs.readFileSync(data[0], "utf8"));
      this.openProject(jsonFile);
    },
    showOpenJSONDialog() {
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
        .then((res) => this.openJSONFile(res.filePaths))
        .catch((err) => console.log(err));
    },

    openProjectJSON() {
      this.showOpenJSONDialog();
    },
  },
  // on components creation these key presses will trigger open project
  created() {
    Mousetrap.bind(["command+o", "ctrl+o"], () => {
      this.openProjectJSON();
    });
  },
};
</script> -->

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
