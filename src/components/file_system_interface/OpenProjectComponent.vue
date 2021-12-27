<!--
Description:
  Displays Open Project Button
  Functionality includes: opening saved json file and storing data in state
  -->

<template>
  <q-btn
    class="export-btn"
    color="secondary"
    label="Open Project"
    @click="openProjectJSON"
  />
</template>

<script>
// import fs from "fs-extra";
// const { remote } = require("electron");
import { mapActions } from "vuex";
// const Mousetrap = require("mousetrap");
const { fs, ipcRenderer } = window;

export default {
  name: "OpenProjectComponent",
  methods: {
    ...mapActions(["openProject"]),
    // opens project
    openJSONFile(data) {
      if (data === undefined) return;
      const jsonFile = JSON.parse(fs.readFileSync(data[0], "utf8"));
      // console.log('json file', jsonFile)
      this.openProject(jsonFile);
    },
    showOpenJSONDialog() {
      remote.dialog.showOpenDialog(
        {
          properties: ["openFile"],
          filters: [
            {
              name: "JSON Files",
              extensions: ["json"],
            },
          ],
        },
        (result) => {
          // 'result' is the filepath of the .json file being opened
          this.openJSONFile(result);
        }
      );
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
</script>

<style scoped>
.mr-sm {
  margin-right: 0.2rem;
}
</style>
