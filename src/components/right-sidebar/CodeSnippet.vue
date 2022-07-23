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
    <prism-editor v-model="code" :highlight="highlighter" line-numbers class="my-editor" readonly />
  </div>
</template>

<script>
import { mapState } from "vuex";

import { PrismEditor } from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css";
import { highlight, languages } from "prismjs/components/prism-core";
import styleClassMap from '../../store/state/styleClassMap'
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css"; // import syntax highlighting styles

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
    ...mapState(["componentMap", "activeComponent", "activeComponentObj", "exportAsTypescript"]),
  },
  methods: {
    snippetInvoke() {
      if (this.activeComponent !== '') {
        this.code = this.createCodeSnippet(
          this.componentMap[this.activeComponent].componentName,
          this.componentMap[this.activeComponent].children
        )
      } else {
        this.code = 'Your component boilerplate will be displayed here.'
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

      //if/else statement to determine if there are class and id attributes present in the html element
      if (this.activeComponentObj.htmlAttributes.class !== "" && this.activeComponentObj.htmlAttributes.id !== "") {
        return `<template>\n  <div id = "${this.activeComponentObj.htmlAttributes.id}" class = "${this.activeComponentObj.htmlAttributes.class}">\n${templateTagStr}  </div>\n</template>`;
      } else if (this.activeComponentObj.htmlAttributes.class !== "" && this.activeComponentObj.htmlAttributes.id === "") {
          return `<template>\n  <div class = "${this.activeComponentObj.htmlAttributes.class}">\n${templateTagStr}  </div>\n</template>`;
      } else if (this.activeComponentObj.htmlAttributes.class === "" && this.activeComponentObj.htmlAttributes.id !== "")
      return `<template>\n  <div id = "${this.activeComponentObj.htmlAttributes.id}">\n${templateTagStr}  </div>\n</template>`;
        else return `<template>\n  <div>\n${templateTagStr}  </div>\n</template>`;
    },
    // Creates <template> boilerplate
    writeTemplateTag(componentName) {
      // console.log(this.activeComponentObj)
      // create reference object
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
      };
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
              nestedString += " " + "class = " + `"${child.class}"`;
            }
            if (child.text === "img" || child.text === "input" || child.text === "link") {
              nestedString += "/>";
            } else { nestedString += ">"; }

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
          outputStr += htmlElementMap[el.text][0]
          //if conditional to check class
          if (el.class !== "") {
            outputStr += " " + "class = " + `"${el.class}"`;
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
        } else if (this.componentMap[this.activeComponent].state.length) imports += "mapState";
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
        data += "  data () {\n    return {";
        this.componentMap[this.activeComponent].props.forEach((prop) => {
          data += `\n      ${prop}: "PLACEHOLDER FOR VALUE",`;
        });
        data += "\n";
        data += "    }\n";
        data += "  },\n";
      }

      // if true add computed section and populate with state
      let computed = "";
      if (this.componentMap[this.activeComponent].state.length) {
        computed += "  computed: {";
        computed += "\n    ...mapState([";
        this.componentMap[this.activeComponent].state.forEach((state) => {
          computed += `\n      "${state}",`;
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
          methods += `\n      "${action}",`;
        });
        methods += "\n    ]),\n";
        methods += "  },\n";
      }

      let htmlArray = this.componentMap[componentName].htmlList;
      let styleString = "";

      if(this.activeComponentObj.htmlAttributes.class !== "") {
        styleString += `.${this.activeComponentObj.htmlAttributes.class} {\nbackground-color: ${this.activeComponentObj.color};
width: ${this.activeComponentObj.w}px;
height: ${this.activeComponentObj.h}px;
z-index: ${this.activeComponentObj.z};
}\n`
      }

      for (const html of htmlArray) {
        if (html.class === ' ') styleString = "";
        if (html.class) {
          styleString += `.${html.class} {\n
}\n`
        }
      }

      // concat all code within script tags
      // if exportAsTypescript is on, out should be <script lang="ts">
      let output;
      if (this.exportAsTypescript === "on") {
        output = "\n\n<script lang='ts'>\n";
        output += imports + "\nexport default defineComponent ({\n  name: '" + componentName + "';";
      } else {
        output = "\n\n<script>\n";
        output += imports + "\nexport default {\n  name: '" + componentName + "';";
      }
      output += ",\n  components: {\n";
      output += childrenComponentNames + "  },\n";
      output += data;
      output += computed;
      output += methods;

      if (this.exportAsTypescript === "on") {
        output += "});\n<\/script>\n\n<style scoped>\n</style>"

      } else {
        output += `}; \n <\/script>\n\n<style scoped>\n${styleString}</style > `
      }
      return output
    },
  },
  watch: {
    // watches activeComponentObj for changes to make it reactive upon mutation
    // // // watches componentMap for changes to make it reactive upon mutation
    activeComponent: {
      handler() {
        this.snippetInvoke();
      },
      deep: true
    },
    componentMap: {
      handler() {
        this.snippetInvoke();
      },
      deep: true
    },
    exportAsTypescript: {
      handler() {
        this.snippetInvoke();
      },
    }
  },
  mounted() {
    // https://vuejs.org/v2/api/#Vue-nextTick
    // kinda like a promise, used for the window resize
    this.snippetInvoke(); //generates the code snippet whenever this is mounted
    this.$nextTick(() => {
      window.addEventListener("resize", this.getWindowHeight);

      this.getWindowHeight();
    });
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.getWindowHeight);
  },
};
</script>

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

.refreshCode {
  position:absolute;
  background-color:black;
  color: $secondary;
  bottom:96%;
  right:5%;
}
.refreshCode:hover {
  cursor:pointer;
}

</style>

