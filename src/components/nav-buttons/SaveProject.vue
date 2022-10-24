/* eslint-disable no-unused-vars */ /* eslint-disable no-unused-vars */
<!--
Description:
  Displays Save button
  Functionality includes: Allows users to save their project as json object
  -->

<template>
  <q-btn
    class="nav-btn"
    color="secondary"
    label="Save"
    @click="saveProjectJSON"
  />
</template>

<!-- COMPOSITION API SYNTAX -->

<script setup lang="ts">
import localforage from "localforage";
import { useStore } from "../../store/main";
import { computed } from "vue";
import { HtmlElement } from "app/types";
import * as fs from "fs";
const Mousetrap = require("mousetrap");
// @ts-ignore
const { ipcRenderer } = window;

const store = useStore();

const projects = computed(() => store.projects);
const activeTab = computed(() => store.activeTab);
const stateComputed = computed(() => store);
const routes = computed(() => store.routes);

const addProject: typeof store.addProject = (payload) =>
  store.addProject(payload);

const showSaveJSONDialog = () => {
  ipcRenderer
    .invoke("saveProject", {
      title: "Choose location to save JSON object in",
      message: "Choose location to save JSON object in",
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

const saveJSONLocation = (data: string) => {
  let deleteKey = projects.value[activeTab.value].filename; // store.state.projects
  localforage
    .removeItem(deleteKey)
    .then(function () {})
    .catch(function (err) {
      console.log(err);
    });

  let fileName: string | undefined = parseFileName(data);

  if (fileName) {
    addProject({
      filename: fileName,
      lastSavedLocation: data,
    });

    let stateRef = stateComputed.value;
    let routesRef = routes.value;

    fs.writeFileSync(data, JSON.stringify(stateRef));
    localforage.setItem(fileName, JSON.parse(fs.readFileSync(data, "utf8")));
    localforage.getItem("slackWebhookURL", (err, value: any) => {
      if (value) notifySlack(fileName, value);
    });
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

<!-- OLD OPTIONS API SYNTAX -->
<!-- <script>
import localforage from "localforage";
import { mapActions } from "vuex";
const Mousetrap = require("mousetrap");
const { fs, ipcRenderer } = window;

// might not be optimal to import like this, since entire slackApiStuff object is imported while only one of its properties is used
export default {
  name: "SaveProject",
  methods: {
    // Action to addProject to store before save
    ...mapActions([
      "addProject", //also supports payload `this.nameOfAction(amount)`
    ]),

    // displays save dialog, success calls saveJSONLocation
    showSaveJSONDialog() {
      // ************ New, with ipcRenderer and ipcMain *****************
      ipcRenderer
        .invoke("saveProject", {
          title: "Choose location to save JSON object in",
          message: "Choose location to save JSON object in",
          nameFieldLabel: "Application State Name",
          filters: [
            {
              name: "JSON Files",
              extensions: ["json"],
            },
          ],
        })
        .then((res) => {
          this.saveJSONLocation(res.filePath);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // returns location of where file is stored
    parseFileName(file) {
      // 'asdf/asdff/sdf.txt -> sdf.txt
      if (file) return file.split("/").pop();
    },
    // deletes anything attached to html element
    parseAndDelete(htmlList) {
      htmlList.forEach((element) => {
        if (!Array.isArray(element.children))
          if (element.children.length > 0) {
            this.parseAndDelete(element.children);
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
    },
    // displays save dialog
    saveProjectJSON() {
      this.showSaveJSONDialog();
    },
    // saves where JSON object is stored in state
    saveJSONLocation(data) {
      // delete original key from local forage
      let deleteKey =
        this.$store.state.projects[this.$store.state.activeTab].filename;
      localforage
        .removeItem(deleteKey)
        .then(function () {})
        .catch(function (err) {
          console.log("error");
          console.log(err);
        });

      let fileName = this.parseFileName(data);
      // if valid fileName
      if (fileName) {
        // Modified to remove use of this.$set, no longer needed in Vue3
        this.addProject({
          filename: fileName,
          lastSavedLocation: data,
        });

        let state = this.$store.state;
        let routes = state.routes;

        fs.writeFileSync(data, JSON.stringify(state));
        localforage.setItem(
          fileName,
          JSON.parse(fs.readFileSync(data, "utf8"))
        );
        localforage.getItem("slackWebhookURL", (err, value) => {
          // TODO: handle error
          if (value) this.notifySlack(fileName, value);
        });
      }
    },
    // creates a popup dialog box, where if you click on yes, it will send a message to our test Slack workspace
    notifySlack(fileName, url) {
      // TODO: add feature to store slack user's name into local memory here if we decide to
      remote.dialog.showMessageBox(
        {
          title: "Notify Slack?",
          message:
            "Save successful. Would you like to notify your team on Slack?",
          buttons: ["No", "Yes"],
          defaultId: 1,
        },
        (response) => {
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
    },
  },
  // on components creation these key presses will trigger save project
  created() {
    Mousetrap.bind(["command+s", "ctrl+s"], () => {
      this.saveProjectJSON();
    });
  },
};
</script> -->

<style scoped>
.mr-sm {
  margin-right: 2px;
}
</style>
