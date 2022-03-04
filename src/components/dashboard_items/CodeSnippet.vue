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

<script>
import { mapState } from "vuex";

import { PrismEditor } from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css"; // import syntax highlighting styles

export default {
  data() {
    return {
      // code: `Your component boilerplate will be displayed here.`,
      lineNumbers: true,
      height: null,
    };
  },
  components: {
    PrismEditor,
  },
  computed: {
    // needs access to current component aka activeComponent
    ...mapState(["componentMap", "activeComponent", "activeComponentObj", "exportAsTypescript"]),
    code: function () {
      let computedCode = "Your component boilerplate will be displayed here.";
      if (this.activeComponent) {
        computedCode = this.createCodeSnippet(
          this.componentMap[this.activeComponent].componentName,
          this.componentMap[this.activeComponent].children
        );
      }
      return computedCode;
    },
  },
  methods: {
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
      // not sure why output was set up like this, was imputted into return statement
      // using string literal
      // let output = ``
      // output += ` <div>\n`
      let templateTagStr = this.writeTemplateTag(componentName);
      return `<template>\n  <div>\n${templateTagStr}  </div>\n</template>`;
    },
    // Creates <template> boilerplate
    writeTemplateTag(componentName) {
      // create reference object
      const htmlElementMap = {
        div: ["<div>", "</div>"],
        button: ["<button>", "</button>"],
        form: ["<form>", "</form>"],
        img: ["<img>", ""],
        link: ['<a href="#"/>', ""],
        list: ["<li>", "</li>"],
        paragraph: ["<p>", "</p>"],
        "list-ol": ["<ol>", "</ol>"],
        "list-ul": ["<ul>", "</ul>"],
        input: ["<input />", ""],
        navbar: ["<nav>", "</nav>"],
      };

      // Helper function that recursively iterates through the given html element's children and their children's children.
      // also adds proper indentation to code snippet
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
            if (child.children.length) {
              nestedString += htmlElementMap[child.text][0];
              nestedString += "\n";
              nestedString += writeNested(child.children, indented);
              nestedString += indented + htmlElementMap[child.text][1];
              nestedString += "\n";
            } else {
              nestedString +=
                htmlElementMap[child.text][0] +
                htmlElementMap[child.text][1] +
                "\n";
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
          // console.log(htmlArr)
          outputStr += `    <${el}/>\n`;
        } else {
          outputStr += `    `;
          if (el.children.length) {
            outputStr += htmlElementMap[el.text][0];
            outputStr += "\n";
            outputStr += writeNested(el.children, `    `);
            outputStr += `    `;
            outputStr += htmlElementMap[el.text][1];
            outputStr += `  \n`;
          } else {
            outputStr +=
              htmlElementMap[el.text][0] + htmlElementMap[el.text][1] + "\n";
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
        this.activeComponentObj.actions.length ||
        this.activeComponentObj.state.length
      ) {
        imports += "import { ";
        if (
          this.activeComponentObj.actions.length &&
          this.activeComponentObj.state.length
        ) {
          imports += "mapState, mapActions";
        } else if (this.activeComponentObj.state.length) imports += "mapState";
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
      if (this.activeComponentObj.props.length) {
        data += "  data () {\n    return {";
        this.activeComponentObj.props.forEach((prop) => {
          data += `\n      ${prop}: "PLACEHOLDER FOR VALUE",`;
        });
        data += "\n";
        data += "    }\n";
        data += "  },\n";
      }

      // if true add computed section and populate with state
      let computed = "";
      if (this.activeComponentObj.state.length) {
        computed += "  computed: {";
        computed += "\n    ...mapState([";
        this.activeComponentObj.state.forEach((state) => {
          computed += `\n      "${state}",`;
        });
        computed += "\n    ]),\n";
        computed += "  },\n";
      }

      // if true add methods section and populate with actions
      let methods = "";
      if (this.activeComponentObj.actions.length) {
        methods += "  methods: {";
        methods += "\n    ...mapActions([";
        this.activeComponentObj.actions.forEach((action) => {
          methods += `\n      "${action}",`;
        });
        methods += "\n    ]),\n";
        methods += "  },\n";
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
        output += "};\n<\/script>\n\n<style scoped>\n</style>"
      }
      // eslint-disable-next-line no-useless-escape
      // add props/data

      // eslint-disable-next-line no-useless-escape
      // return `\n\n<script>\n${str}\nexport default {\n  name: '${componentName}',\n
      // components: {\n${childrenComponentNames}  }\n};\n<\/script>\n\n<style scoped>\n
      // </style>`
      return output;
    },
  },
  watch: {
    // // watches activeComponentObj for changes to make it reactive upon mutation
    // activeComponentObj: {
    //   handler () {
    //     // console.log(this.activeComponentObj.children)
    //     this.code = this.createCodeSnippet(
    //       this.activeComponentObj.componentName,
    //       this.activeComponentObj.children
    //     )
    //   }
    // },
    // // // // watches componentMap for changes to make it reactive upon mutation
    // componentMap: {
    //   handler () {
    //     this.code = this.createCodeSnippet(
    //       this.activeComponentObj.componentName,
    //       this.activeComponentObj.children
    //     )
    //   }
    // }
  },
  mounted() {
    // https://vuejs.org/v2/api/#Vue-nextTick
    // kinda like a promise, used for the window resize
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
  max-height: 70vh;
  /* you must provide font-family font-size line-height. Example: */
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  line-height: 1.5;
  padding: 5px;
}

.codesnippet-container {
  margin-bottom: 1rem;
}

.prism-editor__textarea:focus {
  outline: none;
}
</style>

