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
        <p style="color: black">{{ componentData.componentName }}</p>
      </div>

      <q-menu context-menu>
        <q-list color="black" class="menu">
            <q-item clickable v-ripple v-close-popup @click="handleExportComponent">
            <q-item-section style="color: white"
              >Export Component</q-item-section
            >
            <q-item-section avatar>
                        <q-icon color="primary" name="upload" />
                      </q-item-section>
          </q-item>
          <q-item clickable v-ripple v-close-popup @click="handleAddChild">
            <q-item-section style="color: white"
              >Update Children</q-item-section
            >
            <q-item-section avatar>
              <q-icon color="primary" name="add" />
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple v-close-popup>
            <q-item-section class="layer" style="color: white"
              >Layer</q-item-section
            >
            <q-btn
              class="btn"
              color="transparent"
              text-color="primary"
              label="-"
              @click="(e) => handleLayer(e)"
            />
            <p id="counter" style="color: white">{{ componentData.z }}</p>
            <q-btn
              class="btn"
              color="transparent"
              text-color="primary"
              label="+"
              @click="(e) => handleLayer(e)"
            />
          </q-item>
        </q-list>
      </q-menu>
    </vue-draggable-resizable>
    <div>
      <q-dialog v-model="modalOpen">
        <q-select
          @select="handleSelect"
          id="dropdown"
          filled
          v-model="testModel"
          multiple
          :options="options"
          use-chips
          stack-label
          label="Select children"
          style="width: 250px; background-color: #fd5f00"
        />
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import VueDraggableResizable from "vue-draggable-resizable/src/components/vue-draggable-resizable.vue";
import "vue-draggable-resizable/src/components/vue-draggable-resizable.css";
import handleExportComponentMixin from "./ExportComponentMixin.vue";
const { fs, ipcRenderer } = window;

const cloneDeep = require("lodash.clonedeep");

export default {
  name: "ComponentDisplay",
  components: {
    VueDraggableResizable,
  },
  mixins: [handleExportComponentMixin],
  data() {
    return {
      modalOpen: false,
      abilityToDelete: false,
      testModel: [],
      mockImg: false,
      initialPosition: { x: 0, y: 0 },
      initialSize: { w: 0, h: 0 },
      htmlElements: [],
    };
  },
  mounted() {
    // when component is mounted, add ability to delete
    window.addEventListener("keyup", (event) => {
      if (event.key === "Backspace") {
        if (this.activeComponent) {
          this.$store.dispatch("deleteActiveComponent");
        }
      }
    });
    window.addEventListener("keyup", (event) => {
      if (event.key === "Delete") {
        if (this.activeComponent) {
          this.$store.dispatch("deleteActiveComponent");
        }
      }
    });
    // listener for the copy
    window.addEventListener("copy", () => {
      // if there is an activeComponent, copy info to state using dispatch
      if (this.activeComponent) {
        this.$store.dispatch("copyActiveComponent");
      }
    });
    window.addEventListener("paste", () => {
      this.$store.dispatch("pasteActiveComponent");
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
      // checks if component has any parents and pushes them into lineage
      const checkParents = (component, lineage = [component.componentName]) => {
        console.log("Lineage: " + lineage);
        if (!Object.keys(component.parent).length) return lineage;
        for (var parents in component.parent) {
          // Mutating?
          lineage.push(parents);
          checkParents(component.parent[parents], lineage);
        }
        return lineage;
      };
      let lineage = [this.activeComponent];
      // checks to see if there are any existing children
      if (this.componentMap[this.activeComponent]) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.testModel = this.componentMap[this.activeComponent].children;
        lineage = checkParents(this.componentMap[this.activeComponent]);
      }
      const routes = Object.keys(this.routes);
      const exceptions = new Set([
        "App",
        ...lineage,
        ...routes,
        ...this.testModel,
      ]);
      return Object.keys(this.componentMap).filter((component) => {
        if (!exceptions.has(component)) return component;
      });
    },
    userImage() {
      const imgSrc = `file://` + this.imagePath[this.activeRoute];
      return imgSrc;
    },
    // updates display with mockup image
    mockBg() {
      return this.imagePath[this.activeRoute]
        ? {
            background: `url("${this.userImage}") center/contain no-repeat rgba(223, 218, 218, 0.886)`,
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
    ]),
    // records component's initial position in case of drag
    recordInitialPosition: function (e) {
      if (this.activeComponent !== e.target.id) {
        this.setActiveComponent(e.target.id);
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
    },
    /* Records size/position
      Add @resizing="onResize" to VueDraggableResizable #component-box to use
    onResize: function (x, y, width, height) {
      this.activeComponentData.x = x
      this.activeComponentData.y = y
      this.activeComponentData.w = width
      this.activeComponentData.h = height
      this.componentMap[this.activeComponent].x = x
      this.componentMap[this.activeComponent].y = y
      this.componentMap[this.activeComponent].w = width
      this.componentMap[this.activeComponent].h = height
    },
    */
    /* Records component's position
      Add @dragging="onDrag" to VueDraggableResizable #component-box to use
    onDrag: function (x, y) {
      console.log('ondrag')
      this.activeComponentData.x = x
      this.activeComponentData.y = y
      this.componentMap[this.activeComponent].x = x
      this.componentMap[this.activeComponent].y = y
    },
    */
    // unhighlights all inactive components
    onActivated(componentData) {
      if (this.$refs.boxes) {
        this.$refs.boxes.forEach((element) => {
          if (element.$attrs.id !== componentData.componentName) {
            element.enabled = false;
            element.$emit("deactivated");
            element.$emit("update:active", false);
          }
        });
      }
      if (!(componentData.componentName === this.activeComponent)) {
        this.setActiveComponent(componentData.componentName);
      }
      this.activeComponentData.isActive = true;
    },
    // deactivated is emitted before activated
    onDeactivated() {
      if (this.activeComponent !== "") {
        this.activeComponentData.isActive = false;
      }
    },
    // renders modal with Update Children and Layer in it
    handleAddChild() {
      this.modalOpen = true;
    },
    // used when user selects to add child from dropdown
    handleSelect(value) {
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
      if (e.target.innerText === "-" && payload.z > 0) payload.z--;
      this.updateComponentLayer(payload);
    },
    // if user clicks on display grid, resets active component to ''
    handleClick(event) {
      if (event.target.className === "component-display grid-bg") {
        if (!(this.activeComponent === "")) this.setActiveComponent("");
      }
    },
    // showExportDialog() {
    //   ipcRenderer
    //     .invoke("exportComponent", {
    //       title: "Choose location to save folder in",
    //       message: "Choose location to save folder in",
    //       nameFieldLabel: "Component Name",
    //     })
    //     .then((result) => this.exportFile(result.filePath))
    //     .catch((err) => console.log(err));
    // },
    // /**
    //  * @description: creates component code <template>, <script>, <style>
    //  * invokes writeTemplate, writeScript, writeStyle
    //  */
    // createComponentCode(componentLocation, componentName, children) {
    //     fs.writeFileSync(
    //       componentLocation + ".vue",
    //       this.writeTemplate(componentName, children) +
    //         this.writeScript(componentName, children) +
    //         this.writeStyle(componentName)
    //     );
    // },
    // writeTemplateTag(componentName) {
    //   // create reference object
    //   const htmlElementMap = {
    //     div: ["<div>", "</div>"],
    //     button: ["<button>", "</button>"],
    //     form: ["<form>", "</form>"],
    //     img: ["<img>", ""],
    //     link: ['<a href="#"/>', ""],
    //     list: ["<li>", "</li>"],
    //     paragraph: ["<p>", "</p>"],
    //     "list-ol": ["<ol>", "</ol>"],
    //     "list-ul": ["<ul>", "</ul>"],
    //     input: ["<input />", ""],
    //     navbar: ["<nav>", "</nav>"],
    //   };
    //   // function to loop through nested elements
    //   function writeNested(childrenArray, indent) {
    //     if (!childrenArray.length) {
    //       return "";
    //     }
    //     let indented = indent + "  ";
    //     let nestedString = "";
    //     childrenArray.forEach((child) => {
    //       nestedString += indented;
    //       if (!child.text) {
    //         nestedString += `<${child}/>\n`;
    //       } else {
    //         if (child.children.length) {
    //           nestedString += htmlElementMap[child.text][0];
    //           nestedString += "\n";
    //           nestedString += writeNested(child.children, indented);
    //           nestedString += indented + htmlElementMap[child.text][1];
    //           nestedString += "\n";
    //         } else {
    //           nestedString +=
    //             htmlElementMap[child.text][0] +
    //             htmlElementMap[child.text][1] +
    //             "\n";
    //         }
    //       }
    //     });
    //     return nestedString;
    //   }
    //   // iterate through component's htmllist
    //   let htmlArr = this.componentMap[componentName].htmlList;
    //   let outputStr = ``;
    //   // eslint-disable-next-line no-unused-vars
    //   for (let el of htmlArr) {
    //     if (!el.text) {
    //       outputStr += `    <${el}/>\n`;
    //     } else {
    //       outputStr += `    `;
    //       if (el.children.length) {
    //         outputStr += htmlElementMap[el.text][0];
    //         outputStr += "\n";
    //         outputStr += writeNested(el.children, `    `);
    //         outputStr += `    `;
    //         outputStr += htmlElementMap[el.text][1];
    //         outputStr += `  \n`;
    //       } else {
    //         outputStr +=
    //           htmlElementMap[el.text][0] + htmlElementMap[el.text][1] + "\n";
    //       }
    //     }
    //   }
    //   return outputStr;
    // },
    // /**
    //  * @description creates the <router-link> boilerplate for /views/components
    //  * also creates the <template></template> tag for each component
    //  */
    // writeTemplate(componentName, children) {
    //   let str = "";
    //   str += `<div>\n`;
    //   // writes the HTML tag boilerplate
    //   let templateTagStr = this.writeTemplateTag(componentName);
    //   return `<template>\n\t${str}${templateTagStr}\t</div>\n</template>`;
    // },
    // /**
    //  * @description imports child components into <script>
    //  */
    // writeScript(componentName, children) {
    //   // add import mapstate and mapactions if they exist
    //   const currentComponent = this.componentMap[componentName];
    //   let imports = "";
    //   if (currentComponent.actions.length || currentComponent.state.length) {
    //     imports += "import { ";
    //     if (
    //       currentComponent.actions.length &&
    //       currentComponent.state.length
    //     ) {
    //       imports += "mapState, mapActions";
    //     } else if (currentComponent.state.length) imports += "mapState";
    //     else imports += "mapActions";
    //     imports += ' } from "vuex"\n';
    //   }
    //   // add imports for children
    //   children.forEach((name) => {
    //     imports += `import ${name} from '@/components/${name}.vue';\n`;
    //   });
    //   // add components section

    //   // if true add data section and populate with props
    //   let childrenComponentNames = "";
    //   children.forEach((name) => {
    //     childrenComponentNames += `    ${name},\n`;
    //   });
    //   // if true add data section and populate with props
    //   let data = "";
    //   if (currentComponent.props.length) {
    //     data += "  data () {\n    return {";
    //     currentComponent.props.forEach((prop) => {
    //       data += `\n      ${prop}: "PLACEHOLDER FOR VALUE",`;
    //     });
    //     data += "\n";
    //     data += "    }\n";
    //     data += "  },\n";
    //   }
    //   // if true add computed section and populate with state
    //   let computed = "";
    //   if (currentComponent.state.length) {
    //     computed += "  computed: {";
    //     computed += "\n    ...mapState([";
    //     currentComponent.state.forEach((state) => {
    //       computed += `\n      "${state}",`;
    //     });
    //     computed += "\n    ]),\n";
    //     computed += "  },\n";
    //   }
    //   // if true add methods section and populate with actions
    //   let methods = "";
    //   if (currentComponent.actions.length) {
    //     methods += "  methods: {";
    //     methods += "\n    ...mapActions([";
    //     currentComponent.actions.forEach((action) => {
    //       methods += `\n      "${action}",`;
    //     });
    //     methods += "\n    ]),\n";
    //     methods += "  },\n";
    //   }
    //   // concat all code within script tags
    //   let output = "\n\n<script>\n";
    //   output +=
    //     imports + "\nexport default {\n  name: '" + componentName + "'";
    //   output += ",\n  components: {\n";
    //   output += childrenComponentNames + "  },\n";
    //   output += data;
    //   output += computed;
    //   output += methods;
    //   // eslint-disable-next-line no-useless-escape
    //   output += "};\n<\/script>";
    //   return output;
    // },
    // /**
    //  * @description writes the <style> in vue component
    //  * if component is 'App', writes css, else returns <style scoped>
    //  */
    // writeStyle(componentName) {
    //   return `\n\n<style scoped>\n</style>`;
    // },
    
    // exportFile(data) {
    //   if (data === undefined) return;
    //   if (!fs.existsSync(data)) {
    //     fs.mkdirSync(data);
    //     // console.log(`data: ${data}`); // displays the directory path
    //   }
    //   // main logic below for creating single component
    //   // eslint-disable-next-line no-unused-vars
    //   this.createComponentCode(
    //     path.join(data, this.activeComponent),
    //     this.activeComponent,
    //     this.componentMap[this.activeComponent].children
    //   );
    // },
    // // OVERVUE 6.0: export active component
    // handleExportComponent(event) {
    //   this.showExportDialog();
    // },

    // event handler for copying (ctrl+C)
    copyActiveComponent() {},
  },
  watch: {
    activeComponent: function () {
      if (this.activeComponent) {
        this.onActivated(this.activeComponentObj);
      } else {
        this.onDeactivated();
      }
    },
  },
};
</script>

<style scoped>
.component-title {
  position: relative;
  font-size: 16px;
  top: -18px;
  left: 2px;
  color: black;
  -webkit-text-stroke: 0.4px white;
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
  height: 95.4vh;
  width: 100%;
  position: relative;
}
.grid-bg {
  background-color: rgba(223, 218, 218, 0.886);
  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
  background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;
  background-image: -webkit-linear-gradient(white 2px, transparent 2px),
    -webkit-linear-gradient(0, white 2px, transparent 2px),
    -webkit-linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
    -webkit-linear-gradient(0, rgba(255, 255, 255, 0.3) 1px, transparent 1px);
  background-image: -moz-linear-gradient(white 2px, transparent 2px),
    -moz-linear-gradient(0, white 2px, transparent 2px),
    -moz-linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
    -moz-linear-gradient(0, rgba(255, 255, 255, 0.3) 1px, transparent 1px);
  background-image: linear-gradient(white 2px, transparent 2px),
    linear-gradient(90deg, white 2px, transparent 2px),
    linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px);
  -pie-background: linear-gradient(white 2px, transparent 2px) -2px -2px / 100px,
    linear-gradient(90deg, white 2px, transparent 2px) -2px -2px / 100px,
    linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px) -1px -1px /
      20px,
    linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px) -1px -1px /
      20px,
    #269;
  behavior: url(/pie/PIE.htc);
}
.menu {
  margin-bottom: 0px !important;
}
.component-box {
  color: white;
  border: 1.2px dashed rgb(231, 203, 75);
  background-color: rgba(172, 83, 83, 0.42);
  -webkit-transition: background-color 200ms linear;
  -ms-transition: background-color 200ms linear;
  transition: background-color 200ms linear;
}
.active {
  background-color: rgba(105, 179, 190, 0.514);
  border: 1px dashed rgb(227, 203, 71);
}
.btn {
  font-size: 25px;
  padding: 0 20px;
  width: 10px;
  height: 10px;
  transition: none;
}
.btn:hover,
.btn:focus,
.btn:active {
  color: white;
  background-color: transparent;
}
#counter {
  margin-top: 20px;
}
</style>
