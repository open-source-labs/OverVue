<!--
  ************* FROM OVERVUE4.0 ***********
  Description:
    Displays OverVue application layout including undo/redo button, openProject, saveProject, and exportProject, side panels, and dashboard
  Functionality:
    Toolbar to the left that can be toggled open/closed and undo/redo functionality
-->

<template>
  <q-layout view="hHh lpr fFf">
    <!-- right-side drawer functionality -->
    <div v-if="!right" class="resizeDragTwo" @mousedown="hideRight">
      <div class="dragLineTwo"></div>
    </div>

    <!-- HEADER -->
    <q-header elevated class="gradient">
      <q-toolbar>
        <q-toolbar-title>
          <!-- top-left corner: LOGO -->
          <img
            alt="OverVue"
            src="../assets/app_logo106x23.svg"
            id="nav-logo"
          />
          <div id="undo-redo">
            <div v-if="mode === 'canvas'">
              <!-- shows Width + Height buttons if Grid Mode enabled -->
              <GridDensity />
            </div>
          </div>
        </q-toolbar-title>

        <!-- save, import, and export buttons -->
        <SaveProject />
        <ImportMenu />
        <ExportMenu />

        <q-btn class="nav-btn" icon="fas fa-cog" unelevated size="sm">
          <q-menu :offset="[0, 10]" class="dropdown">
            <!-- toggle button -->
            <div class="column items-center">
              <q-btn
                class="tut-btn"
                color="secondary"
                :label="startingOrBuilding"
                no-caps
                @click="toggleTutorial"
              />

              <!-- Tree or Grid mode -->
              <div class="typescript">
                <p class="typescript-text"><b>Mode</b></p>
                <label for="mode" class="switch">
                  <input
                    v-if="mode === 'tree'"
                    class="switch-input"
                    type="checkbox"
                    name="mode"
                    id="mode"
                    :value="mode"
                    @change="changeMode"
                    checked
                  />
                  <input
                    v-else-if="mode === 'canvas'"
                    class="switch-input"
                    type="checkbox"
                    name="mode"
                    id="mode"
                    :value="mode"
                    @change="changeMode"
                  />
                  <span
                    class="switch-label"
                    :value="mode"
                    data-on="tree"
                    data-off="Grid"
                  ></span>
                  <span class="switch-handle" :value="mode"></span>
                </label>
              </div>

              <!-- enable TypeScript -->
              <div class="typescript">
                <p class="typescript-text"><b>TypeScript</b></p>
                <label for="typescript" class="switch">
                  <input
                    v-if="exportAsTypescript === 'on'"
                    class="switch-input"
                    type="checkbox"
                    name="typescript"
                    id="typescript"
                    :value="exportAsTypescript"
                    @change="syncTypescriptFlag"
                    checked
                  />
                  <input
                    v-else
                    class="switch-input"
                    type="checkbox"
                    name="typescript"
                    id="typescript"
                    :value="exportAsTypescript"
                    @change="syncTypescriptFlag"
                  />
                  <span
                    class="switch-label"
                    :value="exportAsTypescript"
                    data-on="on"
                    data-off="off"
                  ></span>
                  <span
                    class="switch-handle"
                    :value="exportAsTypescript"
                  ></span>
                </label>
              </div>

              <!-- the below has been deprecated by OverVue v.10.0 due to lack of functionality. feel free to comment this back in if/when you wish to flesh it out -->

              <!-- Vue Test -->
              <div class="Test">
                <p class="Test-text"><b> Vue Test</b></p>
                <label for="Test" class="switch">
                  <input
                    v-if="importTest === 'on'"
                    class="switch-input"
                    type="checkbox"
                    name="Test"
                    id="Test"
                    :value="importTest"
                    @change="syncTestFlag"
                    checked
                  />
                  <input
                    v-else
                    class="switch-input"
                    type="checkbox"
                    name="Test"
                    id="Test"
                    :value="importTest"
                    @change="syncTestFlag"
                  />
                  <span
                    class="switch-label"
                    :value="importTest"
                    data-on="on"
                    data-off="off"
                  ></span>
                  <span class="switch-handle" :value="importTest"></span>
                </label>
              </div>

              <!-- <SlackLoginWindow /> -->

              <!-- OAuth -->
              <!-- <div class="drawer">
                <q-expansion-item group="accordion" label="OAuth">
                  <div class="Oauth">
                    <p class="Oauth-text">
                      <b>
                        <img src="../assets/google.svg" alt="" id="google" />
                      </b>
                    </p>
                    <label for="Oauth" class="switch">
                      <input
                        v-if="exportOauth === 'on'"
                        class="switch-input"
                        type="checkbox"
                        name="Oauth"
                        id="Oauth"
                        :value="exportOauth"
                        @change="syncOauthFlag"
                        checked
                      />
                      <input
                        v-else
                        class="switch-input"
                        type="checkbox"
                        name="Oauth"
                        id="Oauth"
                        :value="exportOauth"
                        @change="syncOauthFlag"
                      />
                      <span
                        class="switch-label"
                        :value="exportOauth"
                        data-on="on"
                        data-off="off"
                      ></span>
                      <span class="switch-handle" :value="exportOauth"></span>
                    </label>
                  </div>

                  <div class="Oauth">
                    <p class="Oauth-text">
                      <b>
                        <img src="../assets/github.png" alt="" id="github" />
                      </b>
                    </p>
                    <label for="OauthGit" class="switch">
                      <input
                        v-if="exportOauthGithub === 'on'"
                        class="switch-input"
                        type="checkbox"
                        name="OauthGit"
                        id="OauthGit"
                        :value="exportOauthGithub"
                        @change="syncOauthGitFlag"
                        checked
                      />
                      <input
                        v-else
                        class="switch-input"
                        type="checkbox"
                        name="OauthGit"
                        id="OauthGit"
                        :value="exportOauthGithub"
                        @change="syncOauthGitFlag"
                      />
                      <span
                        class="switch-label"
                        :value="exportOauthGithub"
                        data-on="on"
                        data-off="off"
                      ></span>
                      <span
                        class="switch-handle"
                        :value="exportOauthGithub"
                      ></span>
                    </label>
                  </div>
                </q-expansion-item>
              </div> -->
            </div>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- left sidebar -->
    <q-drawer v-model="left" side="left" behavior="desktop" bordered>
      <q-scroll-area
        visible
        dark
        style="height: 100%; max-width: 100%"
        bar-style="{ left: '10px' }"
      >
        <q-card class="no-shadow">
          <!-- COMPONENT & STORE tabs -->
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

          <!-- tab panels (where components are rendered) -->
          <q-tab-panels v-model="tab" animated class="html-bg text-white fit">
            <!-- COMPONENT -->
            <q-tab-panel name="component" class="left-panel fit">
              <ComponentTab />
            </q-tab-panel>

            <!-- STORE -->
            <q-tab-panel name="store" class="left-panel fit">
              <StoreTab />
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </q-scroll-area>
    </q-drawer>

    <!-- right sidebar -->
    <q-drawer
      right-side
      show-if-above
      v-model="right"
      side="right"
      behavior="desktop"
      :width="dashWidth"
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

      <!-- rendered component -->
      <q-list class="q-list-drawer">
        <RightSidebar />
      </q-list>
    </q-drawer>

    <!-- THIS ENABLES THE CENTRAL UI -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
/* IMPORTS */
import { ref, computed } from "vue";
import { useStore } from "../store/main";
import ComponentTab from "../components/left-sidebar/ComponentTab/ComponentTab.vue";
import StoreTab from "../components/left-sidebar/StoreTab/StoreTab.vue";
import RightSidebar from "../components/right-sidebar/RightSidebar.vue";
import ExportMenu from "../components/nav-buttons/ExportMenu.vue";
import SaveProject from "../components/nav-buttons/SaveProject.vue";
import ImportMenu from "../components/nav-buttons/ImportMenu.vue";
import GridDensity from "../components/nav-buttons/GridDensity.vue";

/* EMITS & PROPS */
const emit = defineEmits(["undo", "redo"]);
defineProps(["doneAction", "undoneAction", "undoTrigger", "redoTrigger"]);

/* DATA */
const tab = ref("component");
const left = ref(true);
const right = ref(true);
const dashWidth = ref(500); // affects default width of right sidebar
const originalWidth = ref(400);
const originalLeft = ref(400);
const timer = ref<ReturnType<typeof setTimeout> | null>(null);
const resizeBox = ref<HTMLElement | null>(null);
const displayClose = ref<HTMLElement | null>(null);

defineExpose({
  resizeBox,
  displayClose,
});

/* COMPUTED VALUES */
const store = useStore();
const exportAsTypescript = computed(() => store.exportAsTypescript);
const exportOauth = computed(() => store.exportOauth);
const exportOauthGithub = computed(() => store.exportOauthGithub);
const importTest = computed(() => store.importTest);
const toggleTutorial = () => store.toggleTutorial();
const mode = computed(() => store.mode); //grid or tree mode
const startingOrBuilding = computed(() => {
  return store.showTutorial ? "Start Building Now" : "Welcome Page";
});

/* METHODS */

const hideRight = () => {
  right.value = !right.value;
  if ((resizeBox.value as HTMLElement).style.display === "none") {
    (resizeBox.value as HTMLElement).style.display = "block";
  } else {
    (resizeBox.value as HTMLElement).style.display = "none";
  }
};
// @ts-ignore

const changeMode = (e: Event) => {
  let currMode: "tree" | "canvas";
  if ((e.target as HTMLInputElement).value === "tree") {
    currMode = "canvas";
  } else {
    currMode = "tree";
  }
  store.toggleMode(currMode);
};

const handlePan = ({ ...newInfo }) => {
  if (right.value) {
    if (newInfo.isFirst) {
      originalWidth.value = dashWidth.value;
      originalLeft.value = newInfo.position.left;
    } else {
      const newDelta = newInfo.position.left - originalLeft.value;
      const newWidth = Math.min(950, originalWidth.value - newDelta);
      dashWidth.value = Math.max(400, newWidth);
      (displayClose.value as HTMLElement).style.display = "none";
      if (newWidth > screen.width * 0.07 && newWidth < 400) {
        clearTimeout(timer.value as ReturnType<typeof setTimeout>);
        if (newWidth < screen.width * 0.13) {
          (displayClose.value as HTMLElement).style.display = "block";
        }
        dashWidth.value = 400 - (200 - newWidth / 2);
      } else {
        timer.value = setTimeout(() => {
          (displayClose.value as HTMLElement).style.display = "none";
        }, 750);
      }
      if (newWidth < screen.width * 0.07) {
        right.value = !right.value;
        dashWidth.value = 400;
        (displayClose.value as HTMLElement).style.display = "none";
      }
    }
    timer.value = setTimeout(() => {
      (displayClose.value as HTMLElement).style.display = "none";
    }, 750);
  }
};

const syncTypescriptFlag = (e: Event) => {
  let checkboxValue: "off" | "on";
  if ((e.target as HTMLInputElement).value === "off") {
    checkboxValue = "on";
  } else {
    checkboxValue = "off";
  }
  store.ExportAsTypescript(checkboxValue);
};

const syncTestFlag = (e: Event) => {
  let checkboxValue: "off" | "on";
  if ((e.target as HTMLInputElement).value === "off") {
    checkboxValue = "on";
  } else {
    checkboxValue = "off";
  }
  store.exportTest(checkboxValue);
};

const syncOauthFlag = (e: Event) => {
  let checkboxValue: "off" | "on";
  if ((e.target as HTMLInputElement).value === "off") {
    checkboxValue = "on";
  } else {
    checkboxValue = "off";
  }
  store.ExportOauth(checkboxValue);
};

const syncOauthGitFlag = (e: Event) => {
  let checkboxValue: "off" | "on";
  if ((e.target as HTMLInputElement).value === "off") {
    checkboxValue = "on";
  } else {
    checkboxValue = "off";
  }
  store.ExportOauthGithub(checkboxValue);
};
</script>

<style lang="scss">
.q-page-container {
  // Overriding original q-page-container padding
  padding-top: 0px !important;
  margin: 0px;
}

.q-toolbar {
  height: 50px;
}

.q-toolbar__title {
  display: flex;
  align-items: center;
}

#nav-logo {
  height: 40px;
  margin-left: 8px;
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
  width: 40px;
  border: 1px solid rgba($primary, 0.5);
}

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
  background-image: linear-gradient(
    to right,
    #202122 50%,
    rgba(255, 255, 255, 0) 50%
  );
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
  background-image: linear-gradient(
    to right,
    #202122 50%,
    rgba(255, 255, 255, 0) 50%
  );
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

.unavailable {
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

.nav-btn {
  margin-left: 0.5rem;
  box-shadow: none !important;
}

.q-toolbar {
  min-height: 30px;
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
  padding: 16px;
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

.menu-btn {
  width: 80%;
  margin: 10px 0px;
}

.tut-btn {
  width: 80%;
  margin: 20px 0px 10px;
}

.menu-btn:disabled {
  background: #437962 !important;
  opacity: 100% !important;
  color: #959a98 !important;
}

.dropdown {
  width: 200px;
  height: auto;
  overflow: visible;
  background: rgba(#000000, 0.8);
}

/* Typescript toggle
========================== */

.switch {
  position: relative;
  display: block;
  // vertical-align: top;
  width: 65px;
  height: 30px;
  padding: 3px;
  margin: 0 10px 10px 0;
  background: linear-gradient(to bottom, #eeeeee, #ffffff 25px);
  background-image: -webkit-linear-gradient(top, #eeeeee, #ffffff 25px);
  border-radius: 18px;
  box-shadow: inset 0 -1px white, inset 0 1px 1px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  box-sizing: content-box;
}

.switch-input {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  box-sizing: content-box;
}

.switch-label {
  position: relative;
  display: block;
  height: inherit;
  font-size: 10px;
  text-transform: uppercase;
  background: #eceeef;
  border-radius: inherit;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.12),
    inset 0 0 2px rgba(0, 0, 0, 0.15);
  box-sizing: content-box;
}

.switch-label:before,
.switch-label:after {
  position: absolute;
  top: 20px;
  margin-top: -0.8em;
  line-height: 1;
  -webkit-transition: inherit;
  -moz-transition: inherit;
  -o-transition: inherit;
  transition: inherit;
  box-sizing: content-box;
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
  color: #ffffff;
  text-shadow: 0 1px rgba(0, 0, 0, 0.2);
  opacity: 0;
}

.switch-input:checked ~ .switch-label {
  background: $secondary;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15),
    inset 0 0 3px rgba(0, 0, 0, 0.2);
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
  background: linear-gradient(to bottom, #ffffff 40%, #f0f0f0);
  background-image: -webkit-linear-gradient(top, #ffffff 40%, #f0f0f0);
  border-radius: 100%;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
}

.switch-handle:before {
  content: "";
  position: absolute;
  top: 20px;
  left: 20px;
  margin: -12px -12px;
  width: 12px;
  height: 12px;
  background: linear-gradient(to bottom, #eeeeee, #ffffff);
  background-image: -webkit-linear-gradient(top, #eeeeee, #ffffff);
  border-radius: 6px;
  box-shadow: inset 0 1px rgba(0, 0, 0, 0.02);
}

.switch-input:checked ~ .switch-handle {
  left: 40px;
  box-shadow: -1px 1px 5px rgba(0, 0, 0, 0.2);
}

/* Transition
========================== */
.switch-label,
.switch-handle {
  transition: All 0.3s ease;
  -webkit-transition: All 0.3s ease;
  -moz-transition: All 0.3s ease;
  -o-transition: All 0.3s ease;
}

.typescript {
  display: flex;
  align-items: flex-end;
  margin: 10px;
  flex-direction: row;
}

.typescript-text {
  margin-right: 10px;
}

.Oauth {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px;
  flex-direction: row;
}

.Oauth-text {
  margin-right: 10px;
}

.drawer {
  font-size: 15px;
  font-weight: bold;
}

#google {
  width: 100px;
  margin-top: 10px;
}

#github {
  width: 50px;
  margin-top: 10px;

  margin-left: 25px;
}

.Test {
  display: flex;
  align-items: flex-end;
  margin: 10px;
  flex-direction: row;
}

.Test-text {
  margin-right: 10px;
}
</style>
