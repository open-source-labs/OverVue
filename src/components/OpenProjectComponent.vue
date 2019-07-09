<template>
  <q-btn class="glossy mr-sm" color="secondary" label="Open Project" @click="openProjectJSON"/>
</template>

<script>
import localforage from 'localforage';
import fs from 'fs-extra';
import { addProject } from '../store/types';
const { remote } = require("electron");
import { mapState, mapActions } from 'vuex'

export default {
  name: 'OpenProjectComponent',
  methods: {
    ...mapActions([
      'setComponentMap',
      'setRoutes',
    ]),
    parseFileName(file) { 
      //Obtains json file name from file path
      return file.split('/').pop();
    },
    openJSONFile(data){
      const jsonFile = JSON.parse(fs.readFileSync(data[0], 'utf8'))
      this.setComponentMap(jsonFile.componentMap)
      this.setRoutes(jsonFile.routes)
    },
    showOpenJSONDialog(){
      remote.dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{
          name: 'JSON Files',
          extensions: ['json']
        }]},
        result => {
          // 'result' is the filepath of the .json file being opened
          this.openJSONFile(result);
        }
      );
    },
    openProjectJSON(){
      this.showOpenJSONDialog();
    }
  },
  created(){
    Mousetrap.bind(['command+o', 'ctrl+o'], () => {
      this.openProjectJSON();
    });
  }
}
</script>

<style scoped>
  .mr-sm {
    margin-right: 0.2rem;
  }
</style>
