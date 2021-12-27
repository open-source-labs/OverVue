<!-- ************* FROM OVERVUE4.0 ***********
Description:
  Displays OverVue application layout including undo/redo button, openProject, saveProject, and exportProject, side panels, and dashboard
  Functionality includes: Toolbar to the left that can be toggled open/closed and undo/redo functionality
  -->

<template>
  <!-- original layout: <q-layout view="hHh LpR lFf"> -->
  <q-layout view="hHh lpr fFf">
    <!-- the top header of OverVue -->
    <q-header elevated class="gradient text-white">
      <q-toolbar>

        <q-btn dense flat color="subaccent" round @click="left = !left">
          <i
            :class="[left ? 'fas fa-chevron-left' : 'fas fa-list-ul']"
            id="btn"
          ></i>
        </q-btn>
        <q-toolbar-title> OverVue </q-toolbar-title>
        <SlackLoginWindow />
        <div></div>
        <i v-if="doneAction.length"
          class="fa fa-backward"
          aria-hidden="true"
          @click="undo"
        ></i>
        <i
          v-else
          class="fa fa-backward"
          id="unavailable"
          aria-hidden="true"
        ></i>
        <i
          v-if="undoneAction.length"
          class="fa fa-forward"
          aria-hidden="true"
          @click="redo"
        ></i>
        <i v-else class="fa fa-forward" id="unavailable" aria-hidden="true"></i>

        <OpenProjectComponent />
        <SaveProjectComponent />
        <ExportProjectComponent />
        <!-- </div> -->
        <!-- this button will open the right drawer -->
        <q-btn dense flat color="subaccent" round @click="right = !right">
          <!-- fas => fontawesome, refers to icon style -->
          <i
            :class="[right ? 'fas fa-chevron-right' : 'fas fa-list-ul']"
            id="btn"
          ></i>
        </q-btn>
        
      </q-toolbar>
    </q-header>

    <q-drawer v-model="left" side="left" behavior="desktop" bordered>

      <!-- QTabs setup, not sure what class to set yet -->
      <q-tabs
        v-model="tab"
        dense
        class="bg-subaccent text-white"
        active-color="secondary"
        indicator-color="secondary"
      >
        <q-tab name="component" label='Component'><i class="fas fa-edit"></i></q-tab>
        <q-tab name="store" label='Store'><i class="fas fa-store-alt"></i></q-tab>
      </q-tabs>
      <!-- individual tab panel's setup -->
      <q-tab-panels v-model="tab" animated class="html-bg text-white fit">
        <!--component tab will have creator and editor components -->
        <q-tab-panel name="component" class="left-panel fit">
          <ComponentTab />
        </q-tab-panel>
        <!-- store will display store elements -->
        <q-tab-panel name="store" class="left-panel fit">
          <StoreTab />
        </q-tab-panel>
      </q-tab-panels>
    </q-drawer>

    <!-- rendering dashboard as right sidebar instead of as a footer -->
    <q-drawer
      right-side
      show-if-above
      v-model="right"
      side="right"
      behavior="desktop"
      :width="400"
      bordered
    >
      <q-list class="q-list-drawer">
        <Dashboard />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
// HomeSideDropDown contains RouteDisplay, VuexForm and Edit but we'll be separating these components across different tabs
import Dashboard from "../components/dashboard_items/Dashboard.vue";
import ExportProjectComponent from "../components/file_system_interface/ExportProject.vue";
import SaveProjectComponent from "../components/file_system_interface/SaveProjectComponent.vue";
import OpenProjectComponent from "../components/file_system_interface/OpenProjectComponent.vue";
// import UploadImage from "../components/home_sidebar_items/UploadImage.vue";
import SlackLoginWindow from "../components/slack_login/SlackLoginWindow.vue";
// import RouteDisplay from "../components/home_sidebar_items/RouteDisplay.vue";
// import VuexForm from "../components/home_sidebar_items/VuexForm.vue";
// import ComponentTab from "../components/home_sidebar_items/ComponentTab/ComponentTab.vue";
import StoreTab from "../components/home_sidebar_items/StoreTab/StoreTab.vue";

export default {
  // Passed down from App.vue
  props: ['doneAction', 'undoneAction'],
  data() {
    return {
      tab: "component",
      left: true,
      right: true,
    };
  },
  components: {
    // RouteDisplay,
    // VuexForm,
    Dashboard,
    ExportProjectComponent,
    SaveProjectComponent,
    OpenProjectComponent,
    // UploadImage,
    SlackLoginWindow,
    // ComponentTab,
    StoreTab,
  },
  methods: {
    undo() {
      // this.$router.app.$children[0].undo();
      // Emit custom event, listen in App.vue to trigger undo or redo
      this.$emit('undo');
    },
    redo() {
      this.$emit('redo');
    },
  },
};

</script>

<style lang="scss">
.text-white {
  color: white;
}

q-btn > i {
  color: white;
}
// Must change style lang='scss'
.fa-backward, .fa-forward {
  padding: 0 5px;
}

.fa-backward:hover, .fa-forward:hover {
  cursor: pointer;
  color: #00ffff;
}

#unavailable {
  color: grey;
  cursor: default;
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
  height: 100%;
  box-shadow: none;
}

// css styling for entire drawer
.q-drawer {
  background: $subprimary;
}

// give html background color of grey
.html-bg {
  background-color: #202122;
}

.left-panel {
  padding: 0 !important;
  height: 100%;
}

.q-tab-panels {
  height: 100%;
}

.q-panel {
  height: 100%;
}

.q-tab-panel {
  height: 100%;
}

.left-panels {
  height: 100%;
}

.scroll {
  overflow: hidden;
}
</style>

