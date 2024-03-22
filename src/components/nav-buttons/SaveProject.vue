<!--
  LOCATION IN APP:
  [top-right corner] 'Save' button

  FUNCTIONALITY:
  - Allows user to save current project structure as .json file on their local machine
-->

<template>
  <q-btn
    class="nav-btn"
    color="secondary"
    label="Save"
    @click="saveProjectJSON"
  />
</template>

<script setup lang="ts">
/* IMPORTS */
import { computed } from "vue";
import { useStore } from "../../store/main";
import localforage from "localforage";
const Mousetrap = require("mousetrap");


// @ts-ignore
const { ipcRenderer } = window; //  ipcRenderer is attached in the 'electron-preload.ts' file and is allowing ipcRenderer to be used instead of calling directly from electron module

/* COMPUTED VALUES */
const store = useStore();
const projects = computed(() => store.projects);
const activeTab = computed(() => store.activeTab);
const stateComputed = computed(() => store);
const routes = computed(() => store.routes);

/* STORE ACTIONS */
const addProject: typeof store.addProject = (payload) =>
  store.addProject(payload);

/* METHODS */

const showSaveJSONDialog = () => {
  ipcRenderer
    .invoke("showSaveDialog", {
      title: "Choose location to save JSON file in",
      message: "Choose location to save JSON file in",
      nameFieldLabel: "Application State Name",
      filters: [
        {
          name: "JSON Files",
          extensions: ["json"],
        },
      ],
    })
    .then((res: { filePath: string }) => {
      saveJSONLocation(res.filePath);
    })
    .catch((err: Error) => {
      console.log(err);
    });
};

const parseFileName = (file: string) => {
  if (file) return file.split("/").pop();
};

const parseAndDelete = (htmlList: any[]) => {
  htmlList.forEach((element) => {
    if (!Array.isArray(element.children))
      if (element.children.length > 0) {
        parseAndDelete(element.children);
      }
    delete element._vm;
    delete element.parent;
    delete element.open;
    delete element.active;
    delete element.style;
    delete element.class;
    delete element.innerStyle;
    delete element.innerClass;
    delete element.innerBackStyle;
    delete element.innerBackClass;
  });
};

const saveProjectJSON = () => showSaveJSONDialog();

const saveJSONLocation = (filePath: string) => {
  console.log('File path:', filePath);

  let deleteKey = projects.value[activeTab.value].filename;
  localforage
    .removeItem(deleteKey)
    .then(function () {})
    .catch(function (err) {
      console.log(err);
    });

  let fileName: string | undefined = parseFileName(filePath);

  if (fileName) {
    addProject({
      filename: fileName,
      lastSavedLocation: filePath,
    });

    let stateRef = JSON.parse(JSON.stringify(stateComputed.value));
    console.log('Project data:', stateRef);

    ipcRenderer
      .invoke('writeJSON', { filePath, data: JSON.stringify(stateRef) })
      .then(() => {
        if (fileName) {
          localforage.setItem(fileName, stateRef);
        }
        localforage.getItem("slackWebhookURL", (err, value: any) => {
          if (value) notifySlack(fileName, value);
        });
      })
      .catch((error: Error) => {
        console.error('Failed to write file:', error);
      });
  } else {
    console.error('Failed to parse file name from file path:', filePath);
  }
};


const notifySlack = (fileName: string | undefined, url: RequestInfo | URL) => {
  // @ts-ignore
  remote.dialog.showMessageBox(
    {
      title: "Notify Slack?",
      message: "Save successful. Would you like to notify your team on Slack?",
      buttons: ["No", "Yes"],
      defaultId: 1,
    },
    (response: number) => {
      if (response === 1) {
        fetch(url, {
          method: "POST",
          body: JSON.stringify({
            text: `A team member has saved an OverVue project file: ${fileName}`,
          }),
          headers: { "Content-Type": "application/json" },
        });
      }
    }
  );
};

Mousetrap.bind(["command+s", "ctrl+s"], () => {
  saveProjectJSON();
});
</script>

<style scoped>
.mr-sm {
  margin-right: 2px;
}
</style>
