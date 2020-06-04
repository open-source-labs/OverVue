<template>
  <!-- <q-btn class=" export-btn" color="secondary" label="Save"/> -->
  <q-btn class="export-btn" color="secondary" label="Save" @click="saveProjectJSON" />
</template>

<script>
import localforage from 'localforage'
import fs from 'fs-extra'
const { remote } = require('electron')
const Mousetrap = require('mousetrap')

export default {
  name: 'SaveProjetComponent',
  methods: {
    showSaveJSONDialog () {
      remote.dialog.showSaveDialog({
        title: 'Choose location to save JSON object in',
        // defaultPath: remote.app.getPath('desktop'),
        message: 'Choose location to save JSON object in',
        nameFieldLabel: 'Application State Name',
        filters: [{
          name: 'JSON Files',
          extensions: ['json']
        }]
      },
      result => {
        // event.sender.send('save-json-location', result);
        this.saveJSONLocation(result)
      })
    },
    parseFileName (file) {
      // 'asdf/asdff/sdf.txt -> sdf.txt
      return file.split('/').pop()
    },
    parseAndDelete (htmlList) {
      htmlList.forEach(element => {
        if (element.children.length > 0) {
          console.log('in recurse')
          this.parseAndDelete(element.children)
        }
        delete element._vm
        delete element.parent
        delete element.open
        delete element.active
        delete element.style
        delete element.class
        delete element.innerStyle
        delete element.innerClass
        delete element.innerBackStyle
        delete element.innerBackClass
      })
    },
    saveProjectJSON () {
      this.showSaveJSONDialog()
    },
    saveJSONLocation (data) {
      // delete original key from local forage
      let deleteKey = this.$store.state.projects[this.$store.state.activeTab].filename
      localforage
        .removeItem(deleteKey)
        .then(function () {
          console.log(deleteKey, 'Key is cleared!')
        })
        .catch(function (err) {
          console.log(err)
        })

      let fileName = this.parseFileName(data)

      this.$set(this.$store.state.projects, this.$store.state.activeTab, {
        filename: fileName,
        lastSavedLocation: data
      })
      let state = this.$store.state
      let routes = state.routes
      for (let view in routes) {
        console.log('views in Routes', routes[view])
        routes[view].forEach(component => {
          let htmlList = component.htmlList
          this.parseAndDelete(htmlList)
        })
      }
      let componentMap = this.$store.state.componentMap
      for (let component in componentMap) {
        if (component.htmlList) {
          let comphtml = component.htmlList
          this.parseAndDelete(comphtml)
        }
      }

      fs.writeFileSync(data, JSON.stringify(state))
      localforage
        .setItem(fileName, JSON.parse(fs.readFileSync(data, 'utf8')))
        .then(result => {
          console.log('saved ', fileName, 'to local forage')
          console.log('result is', result)
        })
      console.log('PROJECT SAVED AS A JSON OBJECT!')
    }
  },
  created () {
    Mousetrap.bind(['command+s', 'ctrl+s'], () => {
      this.saveProjectJSON()
    })
  }
}
</script>

<!-- } -->
<style scoped>
.mr-sm {
  margin-right: 2px;
}
</style>
