<!--
Description:
  Displays Open Project Button
  Functionality includes: opening saved json file and storing data in state
  -->

<template>
  <q-btn
    class="export-btn"
    color="secondary"
    label="Import"
    @click="openProjectJSON"
  />
</template>

<script>
import { mapActions } from "vuex";
const Mousetrap = require("mousetrap");
const { fs, ipcRenderer } = window;

export default {
  name: "OpenProjectComponent",
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
</script>

<style scoped>
.mr-sm {
  margin-right: 0.2rem;
}
</style>
