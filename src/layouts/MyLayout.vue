<!-- ************* FROM OVERVUE4.0 ***********
Description:
  Displays OverVue application layout including undo/redo button, openProject, saveProject, and exportProject, side panels, and dashboard
  Functionality includes: Toolbar to the left that can be toggled open/closed and undo/redo functionality
  -->

<template>

  <!-- original layout: <q-layout view="hHh LpR lFf"> -->
  <q-layout view="hHh lpr fFf">
    <div v-if="!this.right" class="resizeDragTwo" @mousedown="hideRight"><div class="dragLineTwo"></div></div>
    <!-- the top header of OverVue -->
    <q-header elevated class="gradient text-white">
      <q-toolbar>
        <!-- <q-btn dense flat color="subaccent" round @click="left = !left">
          <i
            :class="[left ? 'fas fa-chevron-left' : 'fas fa-list-ul']"
            id="btn"
          ></i>
        </q-btn> -->
        <q-toolbar-title><img alt="OverVue" src="../assets/OverVue_navLogo.png" id="nav-logo"><div id="undo-redo">
        <q-btn>
        <i
          v-if="doneAction.length"
          class="fa fa-undo"
          aria-hidden="true"
          @click="undo"
        ></i>
        <i
          v-else
          class="fa fa-undo"
          id="unavailable"
          aria-hidden="true"
        ></i>
        </q-btn>
        <q-btn>
        <i
          v-if="undoneAction.length"
          class="fa fa-redo"
          aria-hidden="true"
          @click="redo"
        ></i>
        <i v-else class="fa fa-redo" id="unavailable" aria-hidden="true"></i>
        </q-btn>
      </div></q-toolbar-title>
        <label for="typescript" style="margin-right: 10px;"> 
          <input type="checkbox" name="typescript" id="typescript" :value="exportAsTypescript" @change="syncTypescriptFlag" />
          Use Typescript
        </label>
        <SlackLoginWindow />
        <div></div>
        <!-- <i
          v-if="doneAction.length"
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
        <i v-else class="fa fa-forward" id="unavailable" aria-hidden="true"></i> -->

        <OpenProjectComponent />
        <SaveProjectComponent />
        <ExportProjectComponent />
        <!-- </div> -->
        <!-- this button will open the right drawer -->
        <q-btn dense flat color="subaccent" round @click="hideRight">
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
        <q-tab name="component" label="Component"></q-tab>
        <q-tab name="store" label="Store"></q-tab>
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
      :width="this.dashWidth"
      bordered
    >
    <div class="resizeDrag" v-touch-pan.horizontal.prevent.mouse.preserveCursor="handlePan" ref="resizeBox" @click="hideRight"><div class="dragLine"></div></div>
    <div class="displayCanClose" ref="displayClose"></div>
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
import SlackLoginWindow from "../components/slack_login/SlackLoginWindow.vue";
import ComponentTab from "../components/home_sidebar_items/ComponentTab/ComponentTab.vue";
import StoreTab from "../components/home_sidebar_items/StoreTab/StoreTab.vue";
import { mapState } from "vuex";

export default {
  // Passed down from App.vue
  props: ["doneAction", "undoneAction"],
  data() {
    return {
      tab: "component",
      left: true,
      right: true,
      dashWidth: 400,
      originalWidth: 400,
      originalLeft: 400,
      timer: null,
    };
  },
  components: {
    Dashboard,
    ExportProjectComponent,
    SaveProjectComponent,
    OpenProjectComponent,
    SlackLoginWindow,
    ComponentTab,
    StoreTab,
  },
  computed: {
    ...mapState([
      "exportAsTypescript"
    ]),
  },
  methods: {
    hideRight(){
      this.right = !this.right;
      if (this.$refs.resizeBox.style.display === 'none'){
        this.$refs.resizeBox.style.display = 'block';
      } else {
        this.$refs.resizeBox.style.display = 'none';
      }
    },
    //adapted from <https://github.com/quasarframework/quasar/issues/7099#issuecomment-907759400>
    handlePan ({ evt, ...newInfo }) {
      if (this.right){
        if (newInfo.isFirst) {
          this.originalWidth = this.dashWidth;
          this.originalLeft = newInfo.position.left
        } else {
          const newDelta = newInfo.position.left - this.originalLeft;
          const newWidth = Math.min(950, this.originalWidth - newDelta);
            this.dashWidth = Math.max(400, newWidth);
            this.$refs.displayClose.style.display = 'none';
          if (newWidth > screen.width*0.07 && newWidth < 400){
            clearTimeout(this.timer)
            if (newWidth < screen.width*0.13){
              this.$refs.displayClose.style.display = 'block'
            }
            this.dashWidth = 400 - (200-newWidth/2)
          } else { 
            this.timer = setTimeout(()=>{this.$refs.displayClose.style.display = 'none'}, 750)
          }
          if (newWidth < screen.width*0.07){
            this.right = !this.right;
            this.dashWidth = 400;
            this.$refs.resizeBox.style.display = 'none';
          }
        }
          this.timer = setTimeout(()=>{this.$refs.displayClose.style.display = 'none'}, 750)
      }
    },
    
    undo() {
      this.$emit("undo");
    },
    redo() {
      this.$emit("redo");
    },
    syncTypescriptFlag(e) {
      let checkboxValue;
      if (e.target.value === "off") {
        checkboxValue = "on"
      } else {
        checkboxValue = "off"
      }
      this.$store.commit('EXPORT_AS_TYPESCRIPT', checkboxValue);
    },
  },
};
</script>

<style lang="scss">

.q-toolbar {
  height: 50px;
}

.q-toolbar__title {
  display: flex;
  align-items: center;
}

#nav-logo {
  margin-right: 95px;
}

.text-white {
  color: white;
}

q-btn > i {
  color: white;
}

#undo-redo {
  display: flex;
  justify-content: center;
  align-content: stretch;
  color: white;
}

#undo-redo > .q-btn {
  flex-grow: 1;
  align-items: center;
  margin-right: 5px;
}

// Must change style lang='scss'
.fa-undo,
.fa-redo {
  padding: 0 5px;
}

.resizeDrag {
  position: absolute;
  left: -5px;
  top: 50vh;
  width: 20px;
  height: 40px;
  background-color: #202122;
  border-radius: 4px;
  z-index: 10;
  cursor: col-resize;
}

.resizeDragTwo{
  position: absolute;
  left: calc(100vw - 10px);
  top: calc(50vh + 33.59px);
  width: 10px;
  height: 40px;
  background-color: #202122;
  border-radius: 4px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  z-index: 10;
  cursor: col-resize;
}

.dragLine, .dragLineTwo {
  position: absolute;
  left: 4px;
  top: 5px;
  height: 30px;
  width: 3px;
  border-left: 1px solid grey;
  border-right: 1px solid grey;
}

.displayCanClose{
  position: absolute;
  left: 60%;
  display: none;
  top: 0px;
  height: 100%;
  width: 40%;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.301);

}

.fa-backward:hover,
.fa-forward:hover {
  cursor: pointer;
  color: $secondary;
}

#unavailable {
  color: grey;
  cursor: default;
}

.fa-undo:active,
.fa-redo:active {
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
  background: $subprimary;
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
  background-color: $subprimary;
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
