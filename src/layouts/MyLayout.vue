<!-- ************* FROM OVERVUE4.0 ***********
Description:
  Displays OverVue application layout including undo/redo button, openProject, saveProject, and exportProject, side panels, and dashboard
  Functionality includes: Toolbar to the left that can be toggled open/closed and undo/redo functionality
  -->

<template>
  <!-- original layout: <q-layout view="hHh LpR lFf"> -->
  <q-layout view="hHh lpr fFf">
    <div v-if="!this.right" class="resizeDragTwo" @mousedown="hideRight">
      <div class="dragLineTwo"></div>
    </div>
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
        <!-- <SlackLoginWindow /> -->
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
        
        <SaveProjectComponent />
        <OpenProjectComponent />
        <ExportProjectComponent />
        
        <q-btn icon="fas fa-cog" size="sm">
          <!-- < fas => fontawesome, refers to icon style -->
          <q-menu class="dropdown">
            
          <div class="settings-dropdown column items-center">
            <q-btn
              class="menu-btn"
              color="secondary"
              label="Getting Started"
              no-caps
            />
           
            <q-btn
              class="menu-btn"
              color="secondary"
              no-caps
            >
                 <svg
                xmlns="http://www.w3.org/2000/svg"
                style="height: 20px; width: 20px; margin-right: 12px"
                viewBox="0 0 122.8 122.8"
              >
                <path
                  d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z"
                  fill="#e01e5a"
                ></path>
                <path 
                  d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z"
                  fill="#36c5f0"
                ></path>
                <path
                  d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z"
                  fill="#2eb67d"
                ></path>
                <path
                  d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z"
                  fill="#ecb22e"
                ></path>
              </svg>
              Connect to Slack
            </q-btn>
            <div>
            <label for="typescript"  class="switch">
              <input class="switch-input" type="checkbox" name="typescript" id="typescript" :value="exportAsTypescript" @change="syncTypescriptFlag" />
                <span class="switch-label" data-on="TypeScript" data-off="JavaScript"></span> 
                <span class="switch-handle"></span> 
              </label>
             </div>
          </div>
          <i id="btn"></i>
          </q-menu >
        </q-btn>

       
        <!-- </div> -->
        <!-- this button will open the right drawer -->
      </q-toolbar>
    </q-header>

    <q-drawer v-model="left" side="left" behavior="desktop" bordered>
      <q-scroll-area
        visible
        dark
        style="height: 100%; max-width: 100%;"
        bar-style="{ left: '10px' }"
      >
      <q-card>
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
      </q-card>
      </q-scroll-area>
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
      <div
        class="resizeDrag"
        v-touch-pan.horizontal.prevent.mouse.preserveCursor="handlePan"
        ref="resizeBox"
        @click="hideRight"
      >
        <div class="dragLine"></div>
      </div>
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
      dashWidth: 950,
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
    ...mapState(["exportAsTypescript", "toggleTutorial"]),
  },
  methods: {
    hideRight() {
      this.right = !this.right;
      if (this.$refs.resizeBox.style.display === "none") {
        this.$refs.resizeBox.style.display = "block";
      } else {
        this.$refs.resizeBox.style.display = "none";
      }
    },
    //adapted from <https://github.com/quasarframework/quasar/issues/7099#issuecomment-907759400>
    handlePan({ evt, ...newInfo }) {
      if (this.right) {
        if (newInfo.isFirst) {
          this.originalWidth = this.dashWidth;
          this.originalLeft = newInfo.position.left;
        } else {
          const newDelta = newInfo.position.left - this.originalLeft;
          const newWidth = Math.min(950, this.originalWidth - newDelta);
          this.dashWidth = Math.max(400, newWidth);
          this.$refs.displayClose.style.display = "none";
          if (newWidth > screen.width * 0.07 && newWidth < 400) {
            clearTimeout(this.timer);
            if (newWidth < screen.width * 0.13) {
              this.$refs.displayClose.style.display = "block";
            }
            this.dashWidth = 400 - (200 - newWidth / 2);
          } else {
            this.timer = setTimeout(() => {
              this.$refs.displayClose.style.display = "none";
            }, 750);
          }
          if (newWidth < screen.width * 0.07) {
            this.right = !this.right;
            this.dashWidth = 400;
            this.$refs.resizeBox.style.display = "none";
          }
        }
        this.timer = setTimeout(() => {
          this.$refs.displayClose.style.display = "none";
        }, 750);
      }
    },

    // undo() {
    //   this.$emit("undo");
    // },
    // redo() {
    //   this.$emit("redo");
    // },
    syncTypescriptFlag(e) {
      let checkboxValue;
      if (e.target.value === "off") {
        checkboxValue = "on";
      } else {
        checkboxValue = "off";
      }
      this.$store.commit("EXPORT_AS_TYPESCRIPT", checkboxValue);
    }
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
  color: $menutext;
}

q-btn > i {
  color: $menutext;
}

#undo-redo {
  display: flex;
  justify-content: center;
  align-content: stretch;
  color: $menutext;
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
  left: -20px;
  top: 50%;
  width: 20px;
  height: 40px;
  background-image: linear-gradient(to right, #202122 50%, rgba(255, 255, 255, 0) 50%);
  border-radius: 4px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  z-index: 10;
  cursor: col-resize;
}

.resizeDragTwo {
  position: absolute;
  left: calc(100vw - 20px);
  top: calc(50vh + 25px);
  width: 20px;
  height: 40px;
  background-image: linear-gradient(to right, #202122 50%, rgba(255, 255, 255, 0) 50%);
  border-radius: 4px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  z-index: 1;
  cursor: col-resize;
}

.dragLine,
.dragLineTwo {
  position: absolute;
  left: 4px;
  top: 5px;
  height: 30px;
  width: 3px;
  border-left: 1px solid grey;
  border-right: 1px solid grey;
}

.displayCanClose {
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
  padding:16px;
}

.q-panel {
  height: 100%;
}

.q-tab-panel {
  height: 100%;
  padding: 0;
}

.left-panels {
  height: 100%;
}

.scroll {
  // overflow: hidden;
}
.menu-btn{
  width: 85%;
  margin: 10px 0px;
  box-shadow:inset 0 -0.6em 0 -0.35em rgba(0,0,0,0.17);
}
.settings-dropdown {
background: #5c5e61;
}
.dropdown{
  width: 15%;
  height: auto;
}
.switch {
	position: relative;
	display: block;
	vertical-align: top;
	width: 100px;
	height: 30px;
	padding: 3px;
	margin: 0 10px 10px 0;
	background: linear-gradient(to bottom, #eeeeee, #FFFFFF 25px);
	background-image: -webkit-linear-gradient(top, #eeeeee, #FFFFFF 25px);
	border-radius: 18px;
	box-shadow: inset 0 -1px white, inset 0 1px 1px rgba(0, 0, 0, 0.05);
	cursor: pointer;
	box-sizing:content-box;
}
.switch-input {
	position: absolute;
	top: 0;
	left: 0;
	opacity: 0;
	box-sizing:content-box;
}
.switch-label {
	position: relative;
	display: block;
	height: inherit;
	font-size: 10px;
	text-transform: uppercase;
	background: #eceeef;
	border-radius: inherit;
	box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.12), inset 0 0 2px rgba(0, 0, 0, 0.15);
	box-sizing:content-box;
}
.switch-label:before, .switch-label:after {
	position: absolute;
	top: 50%;
	margin-top: -.5em;
	line-height: 1;
	-webkit-transition: inherit;
	-moz-transition: inherit;
	-o-transition: inherit;
	transition: inherit;
	box-sizing:content-box;
}
.switch-label:before {
	content: attr(data-off);
	right: 11px;
	color: #000000;
	text-shadow: 0 1px rgba(255, 255, 255, 0.5);
}
.switch-label:after {
	content: attr(data-on);
	left: 11px;
	color: #FFFFFF;
	text-shadow: 0 1px rgba(0, 0, 0, 0.2);
	opacity: 0;
}
.switch-input:checked ~ .switch-label {
	background: #289ead;
	box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15), inset 0 0 3px rgba(0, 0, 0, 0.2);
}
.switch-input:checked ~ .switch-label:before {
	opacity: 0;
}
.switch-input:checked ~ .switch-label:after {
	opacity: 1;
}
.switch-handle {
	position: absolute;
	top: 4px;
	left: 4px;
	width: 28px;
	height: 28px;
	background: linear-gradient(to bottom, #FFFFFF 40%, #f0f0f0);
	background-image: -webkit-linear-gradient(top, #FFFFFF 40%, #f0f0f0);
	border-radius: 100%;
	box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
}
.switch-handle:before {
	content: "";
	position: absolute;
	top: 50%;
	left: 50%;
	margin: -6px 0 0 -6px;
	width: 12px;
	height: 12px;
	background: linear-gradient(to bottom, #eeeeee, #FFFFFF);
	background-image: -webkit-linear-gradient(top, #eeeeee, #FFFFFF);
	border-radius: 6px;
	box-shadow: inset 0 1px rgba(0, 0, 0, 0.02);
}
.switch-input:checked ~ .switch-handle {
	left: 74px;
	box-shadow: -1px 1px 5px rgba(0, 0, 0, 0.2);
}
 
/* Transition
========================== */
.switch-label, .switch-handle {
	transition: All 0.3s ease;
	-webkit-transition: All 0.3s ease;
	-moz-transition: All 0.3s ease;
	-o-transition: All 0.3s ease;
}
</style>
