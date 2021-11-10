<!--
Description:
  Displays OverVue application layout including undo/redo button, openProject, saveProject, and exportProject, side panels, and dashboard
  Functionality includes: Toolbar to the left that can be toggled open/closed and undo/redo functionality
  -->

<template>
  <q-layout view="hHh LpR lFf">
    <q-header elevated class="gradient text-white">
      <q-toolbar>
        <q-btn dense flat color="subaccent" round @click="left = !left">
          <i :class="[left ? 'fas fa-chevron-left' : 'fas fa-list-ul']" id="btn"></i>
        </q-btn>
        <q-toolbar-title>
          OverVue
        </q-toolbar-title>
        <div>
        <i v-if='this.$router.app.$children[0].doneAction.length' class="fa fa-backward" aria-hidden="true" @click="undo"></i>
        <i v-else class="fa fa-backward" id="unavailable" aria-hidden="true"></i>
        <i v-if='this.$router.app.$children[0].undoneAction.length' class="fa fa-forward" aria-hidden="true" @click="redo"></i>
        <i v-else class="fa fa-forward" id="unavailable" aria-hidden="true"></i>
        <OpenProjectComponent />
        <SaveProjectComponent />
        <ExportProjectComponent />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="left" side="left" behavior="desktop" bordered>
      <q-list class="q-list-drawer">
        <UploadImage />
        <HomeSideDropDown />
        <CreateComponent />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <Dashboard/>
  </q-layout>
</template>

<script>
import HomeSideDropDown from '../components/home_sidebar_items/HomeSideDropDown.vue'
import Dashboard from '../components/dashboard_items/Dashboard.vue'
import CreateComponent from '../components/home_sidebar_items/CreateComponent.vue'
import ExportProjectComponent from '../components/file_system_interface/ExportProject.vue'
import SaveProjectComponent from '../components/file_system_interface/SaveProjectComponent.vue'
import OpenProjectComponent from '../components/file_system_interface/OpenProjectComponent.vue'
import UploadImage from '../components/home_sidebar_items/UploadImage.vue'
import SlackLoginWindow from '../components/slack_login/SlackLoginWindow.vue'

export default {
  data () {
    return {
      left: true,
      bottom: true
    }
  },
  components: {
    HomeSideDropDown,
    Dashboard,
    CreateComponent,
    ExportProjectComponent,
    SaveProjectComponent,
    OpenProjectComponent,
    UploadImage,
    SlackLoginWindow
  },
  methods: {
    undo () {
      // console.log('UNDO FROM BUTTON')
      // console.log('look at me ', this.$router.app.$children[0].doneAction)
      this.$router.app.$children[0].undo()
    },
    redo () {
      // console.log('REDO FROM BUTTON')
      this.$router.app.$children[0].redo()
    }
  }
}
</script>

<style lang="stylus">

.fa-backward, .fa-forward {
  padding: 0 5px
}

.fa-backward:hover, .fa-forward:hover {
  cursor: pointer;
  color: #00ffff
}

#unavailable {
  color: grey;
  cursor: default
}

.fa-backward:active, .fa-forward:active {
  box-shadow: 0 1px inherit;
  transform: translateY(1px);
}

.q-layout {
  transition-timing-function: ease-in;
}

.export-btn {
  margin-left: 0.3rem;
}

.q-toolbar {
  min-height: 30px;
}

.deano-size {
  min-height: 2in;
  height: 3in;
}

// css styling for the drawer items
.drawer-menu {
  background: $subsecondary;
}

// css styling for the drawer list (not entire bg)
.q-list-drawer {
  height: 100vh;
  box-shadow: none;
}

// css styling for entire drawer
.q-drawer {
  background: $subprimary;
}
</style>
