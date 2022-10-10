/* eslint-disable no-unused-vars */
<!--
Description:
  Located under Component Details in Dashboard
  Dynamically renders Code Snippet in Dashboard
  Functionality includes: Displays children components and (nested) HTML elements in order of selection.
  -->

<template>
  <div class="codesnippet-container">
    <div class="top-p" v-if="this.activeComponent === ''">
      Select a component
    </div>
    <div v-else>{{ `${this.activeComponent}.vue` }}</div>
    <prism-editor
      v-model="code"
      :highlight="highlighter"
      line-numbers
      class="my-editor"
      readonly
    />
  </div>
</template>

<!-- COMPOSITION API SYNTAX -->
<script setup>
import { PrismEditor } from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css";
import { highlight, languages } from "prismjs/components/prism-core";
import styleClassMap from "../../store/state/styleClassMap";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css"; // import syntax highlighting styles
import { useStore } from "vuex";
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";

const store = useStore(); // template

// data
const code = ref("Your component boilerplate will be displayed here.");
const lineNumbers = ref(true);
const height = ref(null);

// computed
const componentMap = computed(() => store.state.componentMap);
const activeComponent = computed(() => store.state.activeComponent);
const activeComponentObj = computed(() => store.state.activeComponentObj);
const exportAsTypescript = computed(() => store.state.exportAsTypescript);

// methods
const snippetInvoke = () => {
  if (activeComponent.value !== "") {
    code.value = createCodeSnippet(
      componentMap.value[activeComponent.value].componentName,
      componentMap.value[activeComponent.value].children
    );
  } else {
    code.value = "Your component boilerplate will be displayed here.";
  }
};

const highlighter = (myCode) => {
  return highlight(myCode, languages.js);
};

const getWindowHeight = () => {
  let minHeight =
    window.outerHeight < 900 ? 22 : window.outerHeight < 1035 ? 24 : 27.5;
  height.value = minHeight; // height.value here?
};

// Calls createTemplate and createBoiler to generate snippet
const createCodeSnippet = (componentName, children) => {
  let result = `${createTemplate(componentName, children)}${createBoiler(
    componentName,
    children
  )}`;
  return result;
};

// Creates beginner boilerplate
const createTemplate = (componentName) => {
  let templateTagStr = writeTemplateTag(componentName, activeComponent.value); // testing 2nd arg
  if (activeComponentObj.value.htmlAttributes) {
    //if/else statement to determine if there are class and id attributes present in the html element
    if (
      activeComponentObj.value.htmlAttributes.class !== "" &&
      activeComponentObj.value.htmlAttributes.id !== ""
    ) {
      return `<template>\n  <div id = "${activeComponentObj.value.htmlAttributes.id}" class = "${activeComponentObj.value.htmlAttributes.class}">\n${templateTagStr}  </div>\n</template>`;
    } else if (
      activeComponentObj.value.htmlAttributes.class !== "" &&
      activeComponentObj.value.htmlAttributes.id === ""
    ) {
      return `<template>\n  <div class = "${activeComponentObj.value.htmlAttributes.class}">\n${templateTagStr}  </div>\n</template>`;
    } else if (
      activeComponentObj.value.htmlAttributes.class === "" &&
      activeComponentObj.value.htmlAttributes.id !== ""
    )
      return `<template>\n  <div id = "${activeComponentObj.value.htmlAttributes.id}">\n${templateTagStr}  </div>\n</template>`;
    else {
      let routeStr = "";
      const arrOfChildComp = componentMap.value[componentName].children;
      // console.log(arrOfChildComp); // testing testing
      arrOfChildComp.forEach((childName) => {
        let childNameClass = componentMap.value[childName].htmlAttributes.class;
        let childNameClassFullStr =
          childNameClass === "" ? "" : ` class = '${childNameClass}'`;
        routeStr += `    <${childName}${childNameClassFullStr}></${childName}>\n`;
      });
      return `<template>\n  <div>\n${templateTagStr}${routeStr}  </div>\n</template>`;
    }
  } else return `<template>\n  <div>\n${templateTagStr}  </div>\n</template>`;
};

// Creates <template> boilerplate
const writeTemplateTag = (componentName, activeComponent) => {
  const htmlElementMap = {
    div: ["<div", "</div>"],
    button: ["<button", "</button>"],
    form: ["<form", "</form>"],
    img: ["<img", ""], //single
    link: ['<a href="#"', ""], //single
    list: ["<li", "</li>"],
    paragraph: ["<p", "</p>"],
    "list-ol": ["<ol", "</ol>"],
    "list-ul": ["<ul", "</ul>"],
    input: ["<input", ""], //single
    navbar: ["<nav", "</nav>"],
    header: ["<header", "</header>"],
    footer: ["<footer", "</footer>"],
    meta: ["<meta", "</meta>"],
    h1: ["<h1", "</h1>"],
    h2: ["<h2", "</h2>"],
    h3: ["<h3", "</h3>"],
    h4: ["<h4", "</h4>"],
    h5: ["<h5", "</h5>"],
    h6: ["<h6", "</h6>"],
    "e-button": [`<el-button type="info"`, `</el-button>`],
    "e-input": ["<el-input", "</el-input>"],
    "e-link": [
      `<el-link type="primary">primary</el-link>
      <el-link type="success">success</el-link>
      <el-link type="info">info</el-link>
      <el-link type="warning">warning</el-link>
      <el-link type="danger"`,
      `danger</el-link>`,
    ],
    "e-form": ["<el-form", "</el-form>"],
    "e-checkbox": ["<el-checkbox", "</el-checkbox>"],
    "e-checkbox-button": ["<el-checkbox-button", "</el-checkbox-button>"],
    "e-date-picker": ["<el-date-picker", "</el-date-picker>"],
    "e-slider": ["<el-slider", "</el-slider>"],
    "e-card": ["<el-card", "</el-card>"],
    "e-alert": [
      `<el-alert title="success alert" type="success"></el-alert>
      <el-alert title="info alert" type="info"></el-alert>
      <el-alert title="warning alert" type="warning"></el-alert>
      <el-alert title="danger alert" type="danger"`,
      `</el-alert>`,
    ],
    "e-dropdown": [
      `<el-dropdown split-button type="primary" @click="handleClick">
      Dropdown List
      <template #dropdown>
        <el-dropdown-menu>
        <el-dropdown-item>
        Action 1
      </el-dropdown-item>
      <el-dropdown-item>
      Action 2
    </el-dropdown-item>
      </el-dropdown-menu>
      </template`,
      `
      </el-dropdown>`,
    ],
    "e-tag": [
      `<el-tag>Tag 1</el-tag>
  <el-tag class="ml-2" type="success">Tag 2</el-tag>
  <el-tag class="ml-2" type="info">Tag 3</el-tag>
  <el-tag class="ml-2" type="warning">Tag 4</el-tag>
  <el-tag class="ml-2" type="danger"`,
      `Tag 5</el-tag>`,
    ],

    "e-badge": [
      `<el-badge :value="12" class="item">
  <el-button>comments</el-button>
  </el-badge>
  <el-badge :value="3" class="item">
  <el-button>replies</el-button>
  </el-badge>
  <el-badge :value="1" class="item" type="primary">
  <el-button>comments</el-button>
  </el-badge>
  <el-badge :value="2" class="item" type="warning">
  <el-button>replies</el-button`,
      `
  </el-badge>`,
    ],
  };

  // Helper function that recursively iterates through the given html element's children and their children's children.
  // also adds proper indentation to code snippet
  // add childComponents of the activeCompnent to the htmlElementMap
  const childComponents = componentMap.value[activeComponent].children;
  childComponents.forEach((child) => {
    htmlElementMap[child] = [`<${child}`, ""]; //single
  });

  function writeNested(childrenArray, indent) {
    if (!childrenArray.length) {
      return "";
    }
    let indented = indent + "  ";
    let nestedString = "";

    childrenArray.forEach((child) => {
      nestedString += indented;
      if (!child.text) {
        nestedString += `<${child}/>\n`;
      } else {
        nestedString += htmlElementMap[child.text][0];
        if (child.class !== "") {
          nestedString += " " + "class=" + `"${child.class}"`;
        }
        if (child.binding !== "") {
          if (child.text !== "img" || child.text !== "link") {
            nestedString += ` v-model="${child.binding}"`;
          }
        }
        if (
          child.text === "img" ||
          child.text === "input" ||
          child.text === "link" ||
          childComponents.includes(child.text)
        ) {
          nestedString += "/>";
        } else {
          nestedString += ">";
        }

        if (child.children.length) {
          nestedString += "\n";
          nestedString += writeNested(child.children, indented);
          nestedString += indented + htmlElementMap[child.text][1];
          nestedString += "\n";
        } else {
          nestedString += htmlElementMap[child.text][1] + "\n";
        }
      }
    });
    return nestedString;
  }

  // Iterates through active component's HTML elements list and adds to code snippet
  let htmlArr = componentMap.value[componentName].htmlList;
  let outputStr = ``;
  // eslint-disable-next-line no-unused-vars
  for (let el of htmlArr) {
    if (!el.text) {
      outputStr += `    <${el}/>\n`;
    } else {
      outputStr += `    `;
      outputStr += htmlElementMap[el.text][0];
      //if conditional to check class
      if (el.class !== "") {
        outputStr += " " + "class=" + `"${el.class}"`;
      }

      if (el.binding !== "") {
        outputStr += ` v-model="${el.binding}"`;
      }
      // add an extra slash at the end for child Components and single tags
      if (
        childComponents.includes(el.text) ||
        el.text === "img" ||
        el.text === "input" ||
        el.text === "link"
      ) {
        outputStr += "/";
      }
      outputStr += ">";
      if (el.children.length) {
        outputStr += "\n";
        outputStr += writeNested(el.children, `    `);
        outputStr += `    `;
        outputStr += htmlElementMap[el.text][1];
        outputStr += `  \n`;
      } else {
        outputStr += htmlElementMap[el.text][1] + "\n";
      }
    }
  }
  return outputStr;
};

// Creates boiler text for <script> and <style>
const createBoiler = (componentName, children) => {
  // add import mapstate and mapactions if they exist
  let imports = "";
  if (
    componentMap.value[activeComponent.value].actions.length ||
    componentMap.value[activeComponent.value].state.length
  ) {
    imports += "import { ";
    if (
      componentMap.value[activeComponent.value].actions.length &&
      componentMap.value[activeComponent.value].state.length
    ) {
      imports += "mapState, mapActions";
    } else if (componentMap.value[activeComponent.value].state.length)
      imports += "mapState";
    else imports += "mapActions";
    imports += ' } from "vuex";\n';
  }

  // if Typescript toggle is on, import defineComponent
  if (exportAsTypescript === "on") {
    imports += 'import { defineComponent } from "vue";\n';
  }

  // add imports for children
  children.forEach((name) => {
    imports += `import ${name} from '@/components/${name}.vue';\n`;
  });

  // add components section
  let childrenComponentNames = "";
  children.forEach((name) => {
    childrenComponentNames += `    ${name},\n`;
  });

  // if true add data section and populate with props
  let data = "";
  if (componentMap.value[activeComponent.value].props.length) {
    data += "  props: {";
    componentMap.value[activeComponent.value].props.forEach((prop) => {
      data += `\n    ${prop}: "PLACEHOLDER FOR VALUE",`;
    });
    data += "\n";
    //data += "    }\n";
    data += "  },\n";
  }

  const htmlBinding = componentMap.value[activeComponent.value].htmlList;
  data += "  data() {\n    return {\n";
  htmlBinding.forEach((el) => {
    if (el.binding !== "") {
      data += `      ${el.binding}: "PLACEHOLDER FOR VALUE", `;
      data += "\n";
    }
    //checks if there is binding in it's html child's child and will add to code snippet
    if (el.children.length !== 0) {
      el.children.forEach((el1) => {
        if (el1.binding !== "") {
          data += `      "${el1.binding}": "PLACEHOLDER FOR VALUE", `;
          data += "\n";
        }
      });
    }
  });
  data += `    }`;
  data += ` \n  },  \n `;

  // if true add computed section and populate with state
  let computed = "";
  if (componentMap.value[activeComponent.value].state.length) {
    computed += " computed: {";
    computed += "\n    ...mapState([";
    componentMap.value[activeComponent.value].state.forEach((state) => {
      computed += `\n      "${state}", `;
    });
    computed += "\n    ]),\n";
    computed += "  },\n";
  }

  // if true add methods section and populate with actions
  let methods = "";
  if (componentMap.value[activeComponent.value].actions.length) {
    methods += "  methods: {";
    methods += "\n    ...mapActions([";
    componentMap.value[activeComponent.value].actions.forEach((action) => {
      methods += `\n      "${action}", `;
    });
    methods += "\n    ]),\n";
    methods += "  },\n";
  }

  let htmlArray = componentMap.value[componentName].htmlList;
  let styleString = "";

  if (activeComponentObj.value.htmlAttributes.class !== "") {
    styleString += `.${activeComponentObj.value.htmlAttributes.class} { \n background-color: ${activeComponentObj.value.color};
grid-area: ${activeComponentObj.value.htmlAttributes.gridArea[0]} / ${activeComponentObj.value.htmlAttributes.gridArea[1]} / ${activeComponentObj.value.htmlAttributes.gridArea[2]} / ${activeComponentObj.value.htmlAttributes.gridArea[3]};
z-index: ${activeComponentObj.value.z};
} \n`;
  }

  for (const html of htmlArray) {
    if (html.class === " ") styleString = "";
    if (html.class) {
      styleString += `.${html.class} {\n height: ${html.h}%; \n width: ${html.w}%; \n top: ${html.x}%; \n left: ${html.y}%; \n z-index: ${html.z};
}\n`;
    }
  }

  // concat all code within script tags
  // if exportAsTypescript is on, out should be <script lang="ts">
  let output;
  if (exportAsTypescript.value === "on") {
    output = "\n\n<script lang='ts'>\n";
    output +=
      imports +
      "\nexport default defineComponent ({\n  name: '" +
      componentName +
      "';";
  } else {
    output = "\n\n<script>\n";
    output += imports + "\nexport default {\n  name: '" + componentName + "'";
  }
  output += ",\n  components: {\n";
  output += childrenComponentNames + "  },\n";
  output += data;
  output += computed;
  output += methods;

  if (exportAsTypescript.value === "on") {
    output += "});\n<\/script>\n\n<style scoped>\n</style>";
  } else {
    output += `}; \n <\/script>\n\n<style scoped>\n${styleString}</style > `;
  }
  return output;
};

// watch:
// watches activeComponentObj for changes to make it reactive upon mutation
// watches componentMap for changes to make it reactive upon mutation
watch(
  () => [activeComponent.value, componentMap.value, exportAsTypescript.value],
  () => snippetInvoke(),
  { deep: true }
);

// mounted()
// https://vuejs.org/v2/api/#Vue-nextTick
// kinda like a promise, used for the window resize
onMounted(() => {
  snippetInvoke(); //generates the code snippet whenever this is mounted
  nextTick(() => {
    window.addEventListener("resize", getWindowHeight);

    getWindowHeight();
  });
});

// beforeUnmount()
onBeforeUnmount(() => window.removeEventListener("resize", getWindowHeight));
</script>

<!-- <script>
import { mapState } from "vuex";

import { PrismEditor } from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css";
import { highlight, languages } from "prismjs/components/prism-core";
import styleClassMap from "../../store/state/styleClassMap";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css"; // import syntax highlighting styles

// import writeNested from "../../mixins/writeNested";

export default {
  data() {
    return {
      code: `Your component boilerplate will be displayed here.`,
      lineNumbers: true,
      height: null,
    };
  },
  components: {
    PrismEditor,
  },
  computed: {
    //add
    // needs access to current component aka activeComponent
    ...mapState([
      "componentMap",
      "activeComponent",
      "activeComponentObj",
      "exportAsTypescript",
    ]),
  },
  methods: {
    snippetInvoke() {
      console.log(this.activeComponent);
      console.log(this.componentMap);
      if (this.activeComponent !== "") {
        this.code = this.createCodeSnippet(
          this.componentMap[this.activeComponent].componentName,
          this.componentMap[this.activeComponent].children
        );
      } else {
        this.code = "Your component boilerplate will be displayed here.";
      }
    },
    //highlighter does not work: OverVue 6.0;
    highlighter(myCode) {
      return highlight(myCode, languages.js);
    },
    getWindowHeight(e) {
      let minHeight =
        window.outerHeight < 900 ? 22 : window.outerHeight < 1035 ? 24 : 27.5;
      this.height = minHeight;
    },
    // Calls createTemplate and createBoiler to generate snippet
    createCodeSnippet(componentName, children) {
      let result = `${this.createTemplate(
        componentName,
        children
      )}${this.createBoiler(componentName, children)}`;
      return result;
    },
    // Creates beginner boilerplate
    createTemplate(componentName) {
      let templateTagStr = this.writeTemplateTag(componentName);
      if (this.activeComponentObj.htmlAttributes) {
        //if/else statement to determine if there are class and id attributes present in the html element
        if (
          this.activeComponentObj.htmlAttributes.class !== "" &&
          this.activeComponentObj.htmlAttributes.id !== ""
        ) {
          return `<template>\n  <div id = "${this.activeComponentObj.htmlAttributes.id}" class = "${this.activeComponentObj.htmlAttributes.class}">\n${templateTagStr}  </div>\n</template>`;
        } else if (
          this.activeComponentObj.htmlAttributes.class !== "" &&
          this.activeComponentObj.htmlAttributes.id === ""
        ) {
          return `<template>\n  <div class = "${this.activeComponentObj.htmlAttributes.class}">\n${templateTagStr}  </div>\n</template>`;
        } else if (
          this.activeComponentObj.htmlAttributes.class === "" &&
          this.activeComponentObj.htmlAttributes.id !== ""
        )
          return `<template>\n  <div id = "${this.activeComponentObj.htmlAttributes.id}">\n${templateTagStr}  </div>\n</template>`;
        else {
          let routeStr = "";
          const arrOfChildComp = this.componentMap[componentName].children;
          arrOfChildComp.forEach((childName) => {
            let childNameClass =
              this.componentMap[childName].htmlAttributes.class;
            let childNameClassFullStr =
              childNameClass === "" ? "" : ` class = '${childNameClass}'`;
            routeStr += `    <${childName}${childNameClassFullStr}></${childName}>\n`;
          });

          return `<template>\n  <div>\n${templateTagStr}${routeStr}  </div>\n</template>`;
        }
      } else
        return `<template>\n  <div>\n${templateTagStr}  </div>\n</template>`;
    },
    // Creates <template> boilerplate
    writeTemplateTag(componentName, activeComponent) {
      const htmlElementMap = {
        div: ["<div", "</div>"],
        button: ["<button", "</button>"],
        form: ["<form", "</form>"],
        img: ["<img", ""], //single
        link: ['<a href="#"', ""], //single
        list: ["<li", "</li>"],
        paragraph: ["<p", "</p>"],
        "list-ol": ["<ol", "</ol>"],
        "list-ul": ["<ul", "</ul>"],
        input: ["<input", ""], //single
        navbar: ["<nav", "</nav>"],
        header: ["<header", "</header>"],
        footer: ["<footer", "</footer>"],
        meta: ["<meta", "</meta>"],
        h1: ["<h1", "</h1>"],
        h2: ["<h2", "</h2>"],
        h3: ["<h3", "</h3>"],
        h4: ["<h4", "</h4>"],
        h5: ["<h5", "</h5>"],
        h6: ["<h6", "</h6>"],
        "e-button": [`<el-button type="info"`, `</el-button>`],
        "e-input": ["<el-input", "</el-input>"],
        "e-link": [
          `<el-link type="primary">primary</el-link>
          <el-link type="success">success</el-link>
          <el-link type="info">info</el-link>
          <el-link type="warning">warning</el-link>
          <el-link type="danger"`,
          `danger</el-link>`,
        ],
        "e-form": ["<el-form", "</el-form>"],
        "e-checkbox": ["<el-checkbox", "</el-checkbox>"],
        "e-checkbox-button": ["<el-checkbox-button", "</el-checkbox-button>"],
        "e-date-picker": ["<el-date-picker", "</el-date-picker>"],
        "e-slider": ["<el-slider", "</el-slider>"],
        "e-card": ["<el-card", "</el-card>"],
        "e-alert": [
          `<el-alert title="success alert" type="success"></el-alert>
          <el-alert title="info alert" type="info"></el-alert>
          <el-alert title="warning alert" type="warning"></el-alert>
          <el-alert title="danger alert" type="danger"`,
          `</el-alert>`,
        ],
        "e-dropdown": [
          `<el-dropdown split-button type="primary" @click="handleClick">
          Dropdown List
          <template #dropdown>
           <el-dropdown-menu>
            <el-dropdown-item>
            Action 1
          </el-dropdown-item>
          <el-dropdown-item>
          Action 2
        </el-dropdown-item>
          </el-dropdown-menu>
          </template`,
          `
          </el-dropdown>`,
        ],
        "e-tag": [
          `<el-tag>Tag 1</el-tag>
     <el-tag class="ml-2" type="success">Tag 2</el-tag>
     <el-tag class="ml-2" type="info">Tag 3</el-tag>
     <el-tag class="ml-2" type="warning">Tag 4</el-tag>
     <el-tag class="ml-2" type="danger"`,
          `Tag 5</el-tag>`,
        ],

        "e-badge": [
          `<el-badge :value="12" class="item">
     <el-button>comments</el-button>
   </el-badge>
   <el-badge :value="3" class="item">
     <el-button>replies</el-button>
   </el-badge>
   <el-badge :value="1" class="item" type="primary">
     <el-button>comments</el-button>
   </el-badge>
   <el-badge :value="2" class="item" type="warning">
     <el-button>replies</el-button`,
          `
     </el-badge>`,
        ],
      };

      // Helper function that recursively iterates through the given html element's children and their children's children.
      // also adds proper indentation to code snippet
      //add childComponents of the activeCompnent to the htmlElementMap
      const childComponents = this.componentMap[this.activeComponent].children;
      childComponents.forEach((child) => {
        htmlElementMap[child] = [`<${child}`, ""]; //single
      });

      function writeNested(childrenArray, indent) {
        if (!childrenArray.length) {
          return "";
        }
        let indented = indent + "  ";
        let nestedString = "";

        childrenArray.forEach((child) => {
          nestedString += indented;
          if (!child.text) {
            nestedString += `<${child}/>\n`;
          } else {
            nestedString += htmlElementMap[child.text][0];
            if (child.class !== "") {
              nestedString += " " + "class=" + `"${child.class}"`;
            }
            if (child.binding !== "") {
              if (child.text !== "img" || child.text !== "link") {
                nestedString += ` v-model="${child.binding}"`;
              }
            }
            if (
              child.text === "img" ||
              child.text === "input" ||
              child.text === "link" ||
              childComponents.includes(child.text)
            ) {
              nestedString += "/>";
            } else {
              nestedString += ">";
            }

            if (child.children.length) {
              nestedString += "\n";
              nestedString += writeNested(child.children, indented);
              nestedString += indented + htmlElementMap[child.text][1];
              nestedString += "\n";
            } else {
              nestedString += htmlElementMap[child.text][1] + "\n";
            }
          }
        });
        return nestedString;
      }
      // Iterates through active component's HTML elements list and adds to code snippet
      let htmlArr = this.componentMap[componentName].htmlList;
      let outputStr = ``;
      // eslint-disable-next-line no-unused-vars
      for (let el of htmlArr) {
        if (!el.text) {
          outputStr += `    <${el}/>\n`;
        } else {
          outputStr += `    `;
          outputStr += htmlElementMap[el.text][0];
          //if conditional to check class
          if (el.class !== "") {
            outputStr += " " + "class=" + `"${el.class}"`;
          }

          if (el.binding !== "") {
            outputStr += ` v-model="${el.binding}"`;
          }
          // add an extra slash at the end for child Components and single tags
          if (
            childComponents.includes(el.text) ||
            el.text === "img" ||
            el.text === "input" ||
            el.text === "link"
          ) {
            outputStr += "/";
          }
          outputStr += ">";
          if (el.children.length) {
            outputStr += "\n";
            outputStr += writeNested(el.children, `    `);
            outputStr += `    `;
            outputStr += htmlElementMap[el.text][1];
            outputStr += `  \n`;
          } else {
            outputStr += htmlElementMap[el.text][1] + "\n";
          }
        }
      }
      return outputStr;
    },
    // Creates boiler text for <script> and <style>
    createBoiler(componentName, children) {
      // add import mapstate and mapactions if they exist
      let imports = "";
      if (
        this.componentMap[this.activeComponent].actions.length ||
        this.componentMap[this.activeComponent].state.length
      ) {
        imports += "import { ";
        if (
          this.componentMap[this.activeComponent].actions.length &&
          this.componentMap[this.activeComponent].state.length
        ) {
          imports += "mapState, mapActions";
        } else if (this.componentMap[this.activeComponent].state.length)
          imports += "mapState";
        else imports += "mapActions";
        imports += ' } from "vuex";\n';
      }

      // if Typescript toggle is on, import defineComponent
      if (this.exportAsTypescript === "on") {
        imports += 'import { defineComponent } from "vue";\n';
      }

      // add imports for children
      children.forEach((name) => {
        imports += `import ${name} from '@/components/${name}.vue';\n`;
      });

      // add components section
      let childrenComponentNames = "";
      children.forEach((name) => {
        childrenComponentNames += `    ${name},\n`;
      });
      // if true add data section and populate with props
      let data = "";
      if (this.componentMap[this.activeComponent].props.length) {
        data += "  props: {";
        this.componentMap[this.activeComponent].props.forEach((prop) => {
          data += `\n    ${prop}: "PLACEHOLDER FOR VALUE",`;
        });
        data += "\n";
        //data += "    }\n";
        data += "  },\n";
      }
      const htmlBinding = this.componentMap[this.activeComponent].htmlList;
      data += "  data() {\n    return {\n";
      htmlBinding.forEach((el) => {
        if (el.binding !== "") {
          data += `      ${el.binding}: "PLACEHOLDER FOR VALUE", `;
          data += "\n";
        }
        //checks if there is binding in it's html child's child and will add to code snippet
        if (el.children.length !== 0) {
          el.children.forEach((el1) => {
            if (el1.binding !== "") {
              data += `      "${el1.binding}": "PLACEHOLDER FOR VALUE", `;
              data += "\n";
            }
          });
        }
      });
      data += `    }`;
      data += ` \n  },  \n `;

      // if true add computed section and populate with state
      let computed = "";
      if (this.componentMap[this.activeComponent].state.length) {
        computed += " computed: {";
        computed += "\n    ...mapState([";
        this.componentMap[this.activeComponent].state.forEach((state) => {
          computed += `\n      "${state}", `;
        });
        computed += "\n    ]),\n";
        computed += "  },\n";
      }

      // if true add methods section and populate with actions
      let methods = "";
      if (this.componentMap[this.activeComponent].actions.length) {
        methods += "  methods: {";
        methods += "\n    ...mapActions([";
        this.componentMap[this.activeComponent].actions.forEach((action) => {
          methods += `\n      "${action}", `;
        });
        methods += "\n    ]),\n";
        methods += "  },\n";
      }

      let htmlArray = this.componentMap[componentName].htmlList;
      let styleString = "";

      if (this.activeComponentObj.htmlAttributes.class !== "") {
        styleString += `.${this.activeComponentObj.htmlAttributes.class} { \n background-color: ${this.activeComponentObj.color};
 grid-area: ${this.activeComponentObj.htmlAttributes.gridArea[0]} / ${this.activeComponentObj.htmlAttributes.gridArea[1]} / ${this.activeComponentObj.htmlAttributes.gridArea[2]} / ${this.activeComponentObj.htmlAttributes.gridArea[3]};
 z-index: ${this.activeComponentObj.z};
} \n`;
      }

      for (const html of htmlArray) {
        if (html.class === " ") styleString = "";
        if (html.class) {
          styleString += `.${html.class} {\n height: ${html.h}%; \n width: ${html.w}%; \n top: ${html.x}%; \n left: ${html.y}%; \n z-index: ${html.z};
}\n`;
        }
      }

      // concat all code within script tags
      // if exportAsTypescript is on, out should be <script lang="ts">
      let output;
      if (this.exportAsTypescript === "on") {
        output = "\n\n<script lang='ts'>\n";
        output +=
          imports +
          "\nexport default defineComponent ({\n  name: '" +
          componentName +
          "';";
      } else {
        output = "\n\n<script>\n";
        output +=
          imports + "\nexport default {\n  name: '" + componentName + "'";
      }
      output += ",\n  components: {\n";
      output += childrenComponentNames + "  },\n";
      output += data;
      output += computed;
      output += methods;

      if (this.exportAsTypescript === "on") {
        output += "});\n<\/script>\n\n<style scoped>\n</style>";
      } else {
        output += `}; \n <\/script>\n\n<style scoped>\n${styleString}</style > `;
      }
      return output;
    },
  },
  /*
  watch((activeComponent) => snippetInvoke());
  how to watch multiple things at once?
  watch([first, second, third], () => snippetInvoke(), { deep: true });
  */
  watch: {
    // watches activeComponentObj for changes to make it reactive upon mutation
    // // // watches componentMap for changes to make it reactive upon mutation
    activeComponent: {
      handler() {
        this.snippetInvoke();
      },
      deep: true,
    },
    componentMap: {
      handler() {
        this.snippetInvoke();
      },
      deep: true,
    },
    exportAsTypescript: {
      handler() {
        this.snippetInvoke();
      },
    },
  },
  /*
  onMounted(() => {
    snippetInvoke();
    nextTick(() => {
      window.addEventListener("resize", getWindowHeight);
      getWindowHeight();
    });
  });
  */
  mounted() {
    // https://vuejs.org/v2/api/#Vue-nextTick
    // kinda like a promise, used for the window resize
    this.snippetInvoke(); //generates the code snippet whenever this is mounted
    this.$nextTick(() => {
      window.addEventListener("resize", this.getWindowHeight);

      this.getWindowHeight();
    });
  },
  /*
  onBeforeUnmount(() => window.removeEventListener("resize", getWindowHeight));
  */
  beforeUnmount() {
    window.removeEventListener("resize", this.getWindowHeight);
  },
};
</script> -->

<style lang="scss">
// Had scoped before, but could not get rid of outline with scoped style

// resize handled by vue lifecycle methods
.my-editor {
  font-size: 12px;
  background: #2d2d2d;
  color: #ccc;
  max-height: 100%;
  /* you must provide font-family font-size line-height. Example: */
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  line-height: 1.5;
  padding: 5px;
}

.codesnippet-container {
  padding-bottom: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  height: 95%;
}

.prism-editor__textarea:focus {
  outline: none;
}
</style>
