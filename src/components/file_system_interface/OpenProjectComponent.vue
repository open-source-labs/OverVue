<!--
Description:
  Displays Open Project Button
  Functionality includes: opening saved json file and storing data in state
  -->

<template>
    <q-btn class="nav-btn" color="secondary" label="Import">
    <q-menu class="dropdown">
      <div class="settings-dropdown column items-center"> 
      <p class="center">Import:</p>
      <q-btn class="menu-btn" no-caps color="secondary" label="Project" @click="openProjectJSON"/> 
      <ImportComponent class="import-comp" no-caps title="Component"/>
      <!-- <q-btn class="menu-btn" no-caps color="secondary" label="Component" @click="exportProject"/>  -->
      </div>
    </q-menu>
  
  </q-btn>
</template>

<script>
import { mapActions } from "vuex";
import ImportComponent from "../home_sidebar_items/ComponentTab/ImportComponent.vue"
const Mousetrap = require("mousetrap");
const { fs, ipcRenderer } = window;

export default {
  name: "OpenProjectComponent",
  components: {
    ImportComponent
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
</script>

<style scoped>
.mr-sm {
  margin-right: 0.2rem;
}
.menu-btn{
  width: 80%;
  margin: 10px 0px;
  box-shadow:inset 0 -0.6em 0 -0.35em rgba(0,0,0,0.17);
}

.import-comp{
  width: 80% !important;
  margin: 10px 0px;
  box-shadow:inset 0 -0.6em 0 -0.35em rgba(0,0,0,0.17);
}
</style>
