/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
<!--
Description:
  Displays Save button
  Functionality includes: Allows users to save their project as json object
  -->

<template>
  <q-btn class="export-btn" color="secondary" label="Save" @click="saveProjectJSON" />
</template>

<script>
import localforage from 'localforage'
import fs from 'fs-extra'
const { remote } = require('electron')
const Mousetrap = require('mousetrap')

// might not be optimal to import like this, since entire slackApiStuff object is imported while only one of its properties is used

export default {
  name: 'SaveProjetComponent',
  methods: {
    // displays save dialog, success calls saveJSONLocation
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
        this.saveJSONLocation(result)
      })
    },
    // returns location of where file is stored
    parseFileName (file) {
      // 'asdf/asdff/sdf.txt -> sdf.txt
      if (file) return file.split('/').pop()
    },
    // deletes anything attached to html element
    parseAndDelete (htmlList) {
      htmlList.forEach(element => {
        if (element.children.length > 0) {
          // console.log('in recurse')
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
    // displays save dialog
    saveProjectJSON () {
      this.showSaveJSONDialog()
    },
    // saves where JSON object is stored in state
    saveJSONLocation (data) {
      // delete original key from local forage
      let deleteKey = this.$store.state.projects[this.$store.state.activeTab].filename
      localforage
        .removeItem(deleteKey)
        .then(function () {
          // console.log(deleteKey, 'Key is cleared!')
        })
        .catch(function (err) {
          console.log(err)
        })

      let fileName = this.parseFileName(data)
      // if valid fileName
      if (fileName) {
        this.$set(this.$store.state.projects, this.$store.state.activeTab, {
          filename: fileName,
          lastSavedLocation: data
        })
        let state = this.$store.state
        let routes = state.routes
        // for each route call parseAndDelete on htmlList
        // eslint-disable-next-line no-unused-vars
        for (let view in routes) {
          // console.log('views in Routes', routes[view])
          routes[view].forEach(component => {
            let htmlList = component.htmlList
            this.parseAndDelete(htmlList)
          })
        }
        let componentMap = this.$store.state.componentMap
        // eslint-disable-next-line no-unused-vars
        for (let component in componentMap) {
          if (component.htmlList) {
            let comphtml = component.htmlList
            this.parseAndDelete(comphtml)
          }
        }

        fs.writeFileSync(data, JSON.stringify(state))
        localforage
          .setItem(fileName, JSON.parse(fs.readFileSync(data, 'utf8')))
          // .then(result => {
          //   console.log('saved ', fileName, 'to local forage')
          //   console.log('result is', result)
          // })

        // console.log('PROJECT SAVED AS A JSON OBJECT!')
        localforage.getItem('slackWebhookURL', (err, value) => {
          console.log('error: ', err)
          console.log('slackWebhookURL: ', value)
          if (value) this.notifySlack(fileName, value)
        })
      }
    },
    // creates a popup dialog box, where if you click on yes, it will send a message to our test Slack workspace
    notifySlack (fileName, url) {
      // TODO: add feature to store slack user's name into local memory here if we decide to

      remote.dialog.showMessageBox({
        title: 'Notify Slack?',
        message: 'Save successful. Would you like to notify your team on Slack?',
        buttons: ['No', 'Yes'],
        defaultId: 1
      },
      response => {
        if (response === 1) {
          fetch(url, {
            method: 'POST',
            body: JSON.stringify({ 'text': `A team member has saved an OverVue project file: ${fileName}` }),
            headers: { 'Content-Type': 'application/json' }
          })
        }
      })
    }
  },
  // on components creation these key presses will trigger save project
  created () {
    Mousetrap.bind(['command+s', 'ctrl+s'], () => {
      this.saveProjectJSON()
    })
  }
}
</script>

<style scoped>
.mr-sm {
  margin-right: 2px;
}
</style>
