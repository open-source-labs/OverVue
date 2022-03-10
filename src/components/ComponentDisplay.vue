  <!--
  Description:
  Handles display grid functionality
  Functionality includes: resizing/dragging component boxes, display grid image, active component
  -->

<template>
  <!-- the background canvas grid -->
  <div
    class="component-display grid-bg"
    :style="mockBg"
    v-on:click="handleClick"
    v-on:click.right="handleRight"
  >
    <!-- This is the actual component box -->
    <!-- https://www.npmjs.com/package/vue-draggable-resizable -->
    <vue-draggable-resizable
      class-name="component-box"
      v-for="componentData in activeRouteArray"
      ref="boxes"
      :key="componentData.componentName"
      :id="componentData.componentName"
      :x="componentData.x"
      :y="componentData.y"
      :z="componentData.z"
      :w="componentData.w"
      :h="componentData.h"
      :preventDeactivation="true"
      @activated="onActivated(componentData)"
      @deactivated="onDeactivated(componentData)"
      @dragstop="finishedDrag"
      @resizestop="finishedResize"
      :onDragStart="recordInitialPosition"
      :onResizeStart="recordInitialSize"
    >
      <div class="component-title">
        <p>{{ componentData.componentName }}</p>
      </div>
      <q-icon v-if="this.componentMap[componentData.componentName]?.noteList?.length > 0" 
        size="30px" 
        z-layer="0" 
        name="edit_note" 
        class="compNoteLogo" 
        @click="handleAddNotes" />
      <q-icon v-else
        size="30px" 
        z-layer="0" 
        name="edit_note" 
        class="compNoteLogoEmpty" 
        @click="handleAddNotes" />
      <q-menu context-menu>
        <q-list color="black" class="menu">
          <q-item clickable v-ripple v-close-popup id="layer-item">
            <q-item-section class="layer">Component Layer</q-item-section>
            <q-btn
              class="minorAction"
              color="transparent"
              text-color="primary"
              label="&ndash;"
              @click="(e) => handleLayer(e)"
            />
            <p id="counter">{{ componentData.z }}</p>
            <q-btn
              class="minorAction"
              color="transparent"
              text-color="primary"
              label="+"
              @click="(e) => handleLayer(e)"
            />
          </q-item>
          <q-item clickable v-ripple v-close-popup @click="handleAddChild">
            <q-item-section>Update Children</q-item-section>
            <q-item-section avatar>
              <q-icon color="primary" name="add" />
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple v-close-popup @click="handleAddNotes">
            <q-item-section>Component Notes</q-item-section>
            <q-item-section avatar>
              <q-icon color="primary" name="edit_note" />
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple v-close-popup @click="useExportComponentBound">
            <q-item-section>Export Component</q-item-section>
            <q-item-section avatar>
              <q-icon color="primary" name="upload" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>

    </vue-draggable-resizable>
    <div>
      <q-dialog v-model="modalOpen">
      <div class="addChild">
      <p>Add/Remove Children</p>
      <VueMultiselect
        v-model="childrenSelected"
        placeholder="Add/remove children"
        :multiple="true"
        :close-on-select="false"
        :options="options"
        :show-labels="false"
        @remove="handleSelect"
        @select="handleSelect"
        :height="300"
        :option-height="40"
        :searchable="false"
      />
      </div>
      </q-dialog>

      <!-- some irregularity (delete event listener firing on bkspc/del) with the modal when stored locally, so modal open stored in state, and triggers to local reflect only stateful change.-->
          <q-dialog v-model="noteModal" @update:model-value="this.handleAddNotes"> 
            <div class="noteBox">
              <div class="noteHolder">
                <p class="title">Adding notes to {{ this.activeComponent }}</p>
                <div class="noteContainer">
                  <li v-for="(note, index) in this.componentMap[this.activeComponent].noteList" :key="note">
                    <span class="noteNum">Note {{index}}: </span>
                    <div class="noteblock">{{ note }}</div><span id="noteDelete" @click="deleteNote">X</span>
                  </li>
                </div>
                <div class="formBox">
                <q-form autofocus v-on:submit.prevent="submitNote">
                    <q-input
                      v-model="noteText"
                      label="Add your note here"
                      filled
                      dark
                      autofocus true
                      hide-bottom-space
                      :hint="hint"
                      @keyup.enter="submitNote"
                    ></q-input>
                    <q-btn 
                    id="comp-btn"
                    class="sidebar-btn"
                    color="secondary"
                    label="Submit Note"
                    :disable="noteText.length > 0 ? false : true"
                    @click="submitNote"
                    />
                    <q-btn
                    id="note-btn-close"
                    class="sidebar-btn closeAction"
                    label="Close"
                    @click="this.openNoteModal"
                    />
                </q-form>
                </div>
              </div>
            </div>
        </q-dialog>
    </div>
  </div>
</template>

<script setup>
  import { useExportComponent } from "./composables/useExportComponent.js";
</script>

<script>
import { mapState, mapActions } from "vuex";
import VueDraggableResizable from "vue-draggable-resizable/src/components/vue-draggable-resizable.vue";
import VueMultiselect from "vue-multiselect";
import "vue-draggable-resizable/src/components/vue-draggable-resizable.css";

const { fs, ipcRenderer } = window;

const cloneDeep = require("lodash.clonedeep");

export default {
  name: "ComponentDisplay",
  components: {
    VueDraggableResizable,
    VueMultiselect,
  },
  data() {
    return {
      modalOpen: false,
      noteText: '',
      wasDragged: false,
      testModel: [],
      noteModal: false,
      mockImg: false,
      initialPosition: { x: 0, y: 0 },
      initialSize: { w: 0, h: 0 },
      htmlElements: [],
      childrenSelected: [],
    };
  },
  mounted() {
    // when component is mounted, add ability to delete
    window.addEventListener("keyup", (event) => {
      if (event.key === "Backspace") {
        if (this.activeComponent !== '' && this.noteModalOpen === false) {
          this.$store.dispatch("deleteActiveComponent");
        }
      }
    });
    window.addEventListener("keyup", (event) => {
      if (event.key === "Delete") {
        if (this.activeComponent !== '' && this.noteModalOpen === false) {
          this.$store.dispatch("deleteActiveComponent");
        }
      }
    });
    // listener for the copy
    window.addEventListener("copy", () => {
      // if there is an activeComponent, copy info to state using dispatch
      if (this.activeComponent !== '' && this.noteModalOpen === false) {
        this.$store.dispatch("copyActiveComponent");
      }
    });
    window.addEventListener("paste", () => {
      if (this.noteModalOpen === false){
          this.$store.dispatch("pasteActiveComponent");
      }
    });
  },
  computed: {
    ...mapState([
      "routes",
      "activeRoute",
      "activeComponent",
      "componentMap",
      "componentChildrenMultiselectValue",
      "imagePath",
      "activeComponentObj",
      "exportAsTypescript",
      "noteModalOpen",
      "activeRouteDisplay"
    ]),
    // used in VueDraggableResizeable component
    activeRouteArray() {
      return this.routes[this.activeRoute];
    },
    // used to delete active component
    activeComponentData() {
      // Must deep clone this so we are not directly mutating state
      // return this.activeComponentObj;
      return cloneDeep(this.activeComponentObj);
    },
    options() {
      if (this.activeComponent !== ''){
          this.childrenSelected = [];
          this.childrenSelected = this.componentMap[this.activeComponent].children;
      } else {
        this.childrenSelected = [];
      }
      const compMap = this.componentMap;
      const activeComp = this.activeComponent;
      const val = this.routes[this.activeRoute].map(
        (component) => component.componentName
      );
      const relatives = [...val]
        //also need to filter out any parents

      let parentalLineage = [];
      findLineage(relatives)
      function findLineage(children){
        children.forEach((el)=>{
          parentalLineage.push(el);
          if (compMap[el].children.length > 0){
            findLineage(compMap[el].children);
          }
          if (el !== activeComp){
            parentalLineage.pop();
          } else {
            return;
          }
        })
      }
      const optionOutput = val.filter(el => !parentalLineage.includes(el)).filter(el => el !== this.activeComponent); 
      return optionOutput;
    },
    userImage() {
      const imgSrc = `file://` + this.imagePath[this.activeRoute];
      return imgSrc;
    },
    // updates display with mockup image
    mockBg() {
      return this.imagePath[this.activeRoute]
        ? {
            background: `url("${this.userImage}") no-repeat rgba(223, 218, 218, 0.886) top left`,
            "background-size": "contain"
          }
        : {};
    },
  },
  updated() {
    // if there are no active components, all boxes are unhighlighted
    if (this.activeComponent === "") {
      if (this.$refs.boxes) {
        this.$refs.boxes.forEach((element) => {
          element.enabled = false;
          element.$emit("deactivated");
          element.$emit("update:active", false);
        }); 
      }
    } else {
      // if a component is set to active, highlight it
      this.$refs.boxes.forEach((element) => {
        if (
          this.activeComponent === element.$attrs.id &&
          element.enabled === false
        ) {
          element.enabled = true;
          element.$emit("activated");
          element.$emit("update:active", true);
        }
      });
    }
  },
  methods: {
    ...mapActions([
      "setActiveComponent",
      "updateComponentChildrenMultiselectValue",
      "updateActiveComponentChildrenValue",
      "updateComponentPosition",
      "updateStartingPosition",
      "updateComponentLayer",
      "updateStartingSize",
      "updateComponentSize",
      "addActiveComponentNote",
      "deleteActiveComponentNote",
      "openNoteModal",
    ]),
    useExportComponentBound(){
      useExportComponent.bind(this)();
    },
    // records component's initial position in case of drag
    recordInitialPosition: function (e) {
      if (this.activeComponent !== e.target.id) {
        if (e.target.parentElement?.classList.contains('draggable')){
          this.setActiveComponent(e.target.parentElement.id)
        } else {
          this.setActiveComponent(e.target.id);
        }
      }
      this.initialPosition.x = this.activeComponentData.x;
      this.initialPosition.y = this.activeComponentData.y;
    },
    // records component's initial size/position in case of resize
    recordInitialSize: function (e) {
      this.initialSize.h = this.activeComponentData.h;
      this.initialSize.w = this.activeComponentData.w;
      this.initialPosition.x = this.activeComponentData.x;
      this.initialPosition.y = this.activeComponentData.y;
    },
    // sets component's ending size/position
    finishedResize: function (x, y, w, h) {
      let payload = {
        x: x,
        y: y,
        w: w,
        h: h,
        activeComponent: this.activeComponent,
        routeArray: this.routes[this.activeRoute],
        activeComponentData: this.activeComponentData,
      };
      if (
        payload.x !== this.initialPosition.x ||
        payload.y !== this.initialPosition.y ||
        payload.w !== this.initialSize.w ||
        payload.h !== this.initialSize.h
      ) {
        this.updateComponentSize(payload);
      }
    },
    finishedDrag: function (x, y) {
      let payload = {
        x: x,
        y: y,
        activeComponent: this.activeComponent,
        routeArray: this.routes[this.activeRoute],
        activeComponentData: this.activeComponentData,
      };
      if (
        payload.x !== this.initialPosition.x ||
        payload.y !== this.initialPosition.y
      ) {
        this.updateComponentPosition(payload);
      }
      this.wasDragged = true;
      setTimeout(()=>this.wasDragged = false, 100)
    },
    onActivated(componentData) {
      if (!componentData){
        return;
      }
      if (this.$refs.boxes) {
        this.$refs.boxes.forEach((element) => {
          if (element.$attrs.id !== componentData.componentName) {
            element.enabled = false;
            element.$emit("deactivated");
            element.$emit("update:active", false);
          }
          if (
          this.activeComponent === element.$attrs.id &&
          element.enabled === false
          ) {
          element.enabled = true;
          element.$emit("activated");
          element.$emit("update:active", true);
          }
        });
      }
      if (!(componentData.componentName === this.activeComponent)) {
        this.setActiveComponent(componentData.componentName);
      }
      if (componentData && componentData.hasOwnProperty('componentName')){
        this.activeComponentData.isActive = true;
      }
    },
    // deactivated is emitted before activated
    onDeactivated() {
      if (this.activeComponent !== "") {
        this.activeComponentData.isActive = false;
      }
    },
    // renders modal with Update Children and Layer in it
    handleAddNotes(){
      if (this.wasDragged === false && this.activeComponent !== ''){
       this.openNoteModal();
      }
    },
    handleAddChild() {
      this.modalOpen = true;
    },
    submitNote(e){
      e.preventDefault()
      if (this.noteText === ''){
        return;
      }
      this.addActiveComponentNote(this.noteText);
      this.noteText = '';
    },
    deleteNote(e){
      this.deleteActiveComponentNote(e.target.previousElementSibling.innerText);
    },
    // used when user selects to add child from dropdown
    handleSelect(value) { //actually handles adding or deleting
      this.updateActiveComponentChildrenValue(value);
    },
    // user can change component's layer order
    handleLayer(e) {
      e.preventDefault();
      const payload = {
        activeComponent: this.activeComponent,
        routeArray: this.routes[this.activeRoute],
        activeComponentData: this.activeComponentData,
        z: this.activeComponentData.z,
      };
      if (e.target.innerText === "+") payload.z++;
      if (e.target.innerText === "–" && payload.z > 0) payload.z--;
      this.updateComponentLayer(payload);
    },
    // if user clicks on display grid, resets active component to ''
    handleClick(event) {
      if (event.target.className === "component-display grid-bg") {
        this.setActiveComponent("");
      }
    },
    handleRight(event) {
      if (event.target.className === "component-display grid-bg") {
        //right click modal to make a component?
      }
    },
  },
  watch: {
    noteModalOpen (){
      this.noteModal = this.noteModalOpen;
    },
    activeComponent: {
    handler(){
      if (this.activeComponent !== '' && 
        this.$store.state.showTutorial === true && 
        this.$store.state.tutorialFirstOpen === true){
        this.$store.commit("TOGGLE_TUTORIAL");
      }
      this.onActivated(this.activeComponentObj);
    },
    deep: true,
    },
  },
};
</script>

<style scoped lang="scss">

.addChild{
  width: 25vh;
  height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: $subsecondary;
  padding: 10px;
}

li{
  display: flex;
  font-weight: bold;
  padding: 3px;
}

li:hover{
  background-color: $subprimary;
}

.noteblock{
  white-space: pre-wrap;
  font-weight: normal;
  width: 80%;
  margin-left: 10px;
  margin-right: 10px;
}
.noteBox{
  background-color: $subsecondary;
  color: $menutext;
  width: 65%;
  padding: 15px;
  height: 65vh;
  max-height: 80vh;
}
.noteNum{
  width: 10%;
}
#noteDelete{
  background-color: $secondary;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-self: flex-end;
  border-radius: 50%;
  color: $menutext;
  user-select: none;
  align-self: center;
}
#noteDelete:hover{
  background-color: $negative;
}
.noteHolder{
  background-color: $subsecondary;
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  border-radius: 4px;
  overflow-y: hidden;
  height: 100%;
}

.noteContainer{
  height: 280px;
  max-height: 280px;
  border: 1px solid $primary;
  border-radius: 4px;
  overflow-y: auto;
  word-break: break-all;
  max-width: 100%;
  display:flex;
  flex-direction: column;
  justify-content: flex-start;
}

.formBox{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.component-title {
  position: relative;
  font-size: 16px;
  top: -18px;
  left: 2px;
  color: $subprimary;
  -webkit-text-stroke: 0.4px $menutext;
  font-weight: 800;
  line-height: 1.2;
  z-index: -1;
}
.component-html-info {
  display: flex;
  font-size: 14px;
  flex-direction: column;
  font-weight: 800;
}
.component-children {
  position: relative;
  top: 0rem;
  left: 2px;
  color: black;
  list-style: none;
}
.component-display {
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  min-width: 1600px;
  min-height: 900px;
  position: absolute;
}
.grid-bg {
  background-color: rgba(223, 218, 218, 0.886);
  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
  background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;
  background-image: -webkit-linear-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px),
    -webkit-linear-gradient(0, rgba(255, 255, 255, 0.8) 1px, transparent 1px),
    -webkit-linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
    -webkit-linear-gradient(0, rgba(255, 255, 255, 0.3) 1px, transparent 1px);
  background-image: -moz-linear-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px),
    -moz-linear-gradient(0, rgba(255, 255, 255, 0.8) 1px, transparent 1px),
    -moz-linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
    -moz-linear-gradient(0, rgba(255, 255, 255, 0.3) 1px, transparent 1px);
  background-image: linear-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.8) 1px, transparent 1px),
    linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px);
  -pie-background: linear-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px) -2px -2px / 100px,
    linear-gradient(90deg, rgba(255, 255, 255, 0.8) 1px, transparent 1px) -2px -2px / 100px,
    linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px) -1px -1px /
      20px,
    linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px) -1px -1px /
      20px,
    $secondary;
  behavior: url(/pie/PIE.htc);
}
.menu {
  margin-bottom: 0px !important;
}

.compNoteLogo{
  background: rgba($subprimary, .9);
  color: $secondary;
  border-radius: 4px;
  position: absolute;
  top: 4px;
  left: 4px;
}

.compNoteLogoEmpty{
  background: rgba($subprimary, .9);
  color: rgba($primary, 1);
  border-radius: 4px;
  position: absolute;
  top: 4px;
  left: 4px;
}
.compNoteLogo:hover{
  background: rgba($subprimary, .6);
  color: rgba($secondary, .8);
}

.compNoteLogoEmpty:hover{
  background: rgba($subprimary, .6);
  color: rgba($menutext, .4);
}

.component-box {
  color: $menutext;
  border: 1.2px dashed $darktext;
  background-color: rgba($darktext, .42);
  -webkit-transition: background-color 200ms linear;
  -ms-transition: background-color 200ms linear;
  transition: background-color 200ms linear;
  position: absolute;
}
.active {
  background-color: rgba($secondary, .42);
  border: 1px dashed $accent;
}
.minorAction {
  font-weight: bolder !important;
  width: 10px;
  height: 30px !important;
  transition: none;
}
.btn:hover,
.btn:focus,
.btn:active {
  color: $menutext;
  background-color: transparent;
}

#layer-item {
  align-items: center;
}

#counter {
  margin: 0 10px 0;
  color: $menutext;
}

#childrenDropdown {
  width: 250px;
  background: $subprimary;
  color: $menutext;
}
.title {
  font-size: 20px;
  font-weight: bold;
  color: white;
}

#comp-btn{
  width: 100%;
  box-shadow:inset 0 -0.6em 0 -0.35em rgba(0,0,0,0.17);
}

#note-btn-close {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}

</style>
