import { openHtmlElementMap } from "src/store/state/htmlElementMap";
export function useExportComponent() {
    // OVERVUE 6.0: export active component
    /**
     * @description: makes files, directories and boilerplate when exporting a single Vue component
     *
     * @param: none -- uses this.activeComponent from state to create file
     * @return: none -- outputs file to fs
     *
     */

      const showExportComponentDialog = () => {
        ipcRenderer
        .invoke("exportComponent", {
          title: "Choose location to save folder in",
          message: "Choose location to save folder in",
          nameFieldLabel: "Component Name",
        })
        .then((result) => exportComponentFile(result.filePath))
        .catch((err) => console.log(err));
      }

      /**
       * @description: creates component code <template>, <script>, <style>
       * invokes writeTemplate, writeScript, writeStyle
       */

      const createComponentCode = (componentLocation, componentName, children) => {
        fs.writeFileSync(
          componentLocation + ".vue",
            // writeComments(componentName) +
            writeTemplate(componentName, children) +
            writeScript(componentName, children) +
            writeStyle(componentName)
        );
      }

      const writeTemplateTag = (componentName) => {
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
          'e-button':[`<el-button type="info"`,`</el-button>`],
          'e-input':["<el-input", "</el-input>"],
          'e-link': [`<el-link type="primary">primary</el-link>
          <el-link type="success">success</el-link>
          <el-link type="info">info</el-link>
          <el-link type="warning">warning</el-link>
          <el-link type="danger"`, `danger</el-link>`],
          'e-form': ["<el-form", "</el-form>"],
          'e-checkbox': ["<el-checkbox", "</el-checkbox>"],
          'e-checkbox-button': ["<el-checkbox-button", "</el-checkbox-button>"],
          'e-date-picker': ["<el-date-picker", "</el-date-picker>"],
          'e-slider':["<el-slider", "</el-slider>"],
          'e-card': ["<el-card", "</el-card>"],
          'e-alert': [`<el-alert title="success alert" type="success"></el-alert>
          <el-alert title="info alert" type="info"></el-alert>
          <el-alert title="warning alert" type="warning"></el-alert>
          <el-alert title="danger alert" type="danger"`, `</el-alert>`],
          'e-dropdown': [ `<el-dropdown split-button type="primary" @click="handleClick">
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
          </template`, `
          </el-dropdown>`],
          'e-tag': [`<el-tag>Tag 1</el-tag>
     <el-tag class="ml-2" type="success">Tag 2</el-tag>
     <el-tag class="ml-2" type="info">Tag 3</el-tag>
     <el-tag class="ml-2" type="warning">Tag 4</el-tag>
     <el-tag class="ml-2" type="danger"`, `Tag 5</el-tag>`],

     'e-badge': [`<el-badge :value="12" class="item">
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
     </el-badge>`],
        }



        // function to loop through nested elements
        const writeNested = (childrenArray, indent) => {
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
              nestedString += openHtmlElementMap[child.text][0];
              if (child.class !== "") {
                nestedString += " " + "class = " + `"${child.class}"`;
              }
              if(child.binding !== "") {
                nestedString += " " + "v-model = " + `"${child.binding}"`;
              }
              if (child.text === "img" || child.text === "input" || child.text === "link") {
                nestedString += "/>";
              } else { nestedString += ">"; }

              if (child.children.length) {
                nestedString += "\n";
                nestedString += writeNested(child.children, indented);
                nestedString += indented + openHtmlElementMap[child.text][1];
                nestedString += "\n";
              } else {
                nestedString += openHtmlElementMap[child.text][1] + "\n";
              }
            }
          });
          return nestedString;
        }
        // iterate through component's htmllist
        let htmlArr = this.componentMap[componentName].htmlList;
      let outputStr = ``;
      // eslint-disable-next-line no-unused-vars
      for (let el of htmlArr) {
        if (!el.text) {
          outputStr += `    <${el}/>\n`;
        } else {
          outputStr += `    `;
          outputStr += openHtmlElementMap[el.text][0]
          //if conditional to check class
          if (el.class !== "") {
            outputStr += " " + "class = " + `"${el.class}"`;
          }
          if (el.binding !== "") {
            outputStr += " " + "v-model = " + `"${el.binding}"`;
          }
          outputStr += ">";
          if (el.children.length) {
            outputStr += "\n";
            outputStr += writeNested(el.children, `    `);
            outputStr += `    `;
            outputStr += openHtmlElementMap[el.text][1];
            outputStr += `  \n`;
          } else {
            outputStr += openHtmlElementMap[el.text][1] + "\n";
          }
        }
      }
      return outputStr;
    }

      const writeComments = (componentName) => {
        if (this.componentMap[componentName]?.noteList?.length > 0){
          let commentStr = '<!--'
          this.componentMap[componentName].noteList.forEach((el)=>{
            commentStr += "\n"
            commentStr += el;
          })
          commentStr += '\n-->\n\n'
          return commentStr;
        }
      }

      /**
       * @description creates the <router-link> boilerplate for /views/components
       * also creates the <template></template> tag for each component
       */
      const writeTemplate = (componentName, children) => {
        // let str = "";
        // str += `<div>\n`;
        // writes the HTML tag boilerplate
        let templateTagStr = writeTemplateTag(componentName);

        //used to loop through - and apply class/id in code snippet
        if (this.componentMap[componentName].htmlAttributes.class !== "" && this.componentMap[componentName].htmlAttributes.id !== "") {
        return `<template>\n  <div id = "${this.componentMap[componentName].htmlAttributes.id}" class = "${this.componentMap[componentName].htmlAttributes.class}">\n${templateTagStr}  </div>\n</template>`;
      } else if (this.componentMap[componentName].htmlAttributes.class !== "" && this.componentMap[componentName].htmlAttributes.id === "") {
          return `<template>\n  <div class = "${this.componentMap[componentName].htmlAttributes.class}">\n${templateTagStr}  </div>\n</template>`;
      } else if (this.componentMap[componentName].htmlAttributes.class === "" && this.componentMap[componentName].htmlAttributes.id !== "")
      return `<template>\n  <div id = "${this.componentMap[componentName].htmlAttributes.id}">\n${templateTagStr}  </div>\n</template>`;
        else return `<template>\n <div>\n${templateTagStr}  </div>\n</template>`;
      }

      /**
       * @description imports child components into <script>
       */
      const writeScript = (componentName, children) => {
        // add import mapstate and mapactions if they exist
        const currentComponent = this.componentMap[componentName];
        let imports = "";
        if (currentComponent.actions.length || currentComponent.state.length) {
          imports += "import { ";
          if (currentComponent.actions.length && currentComponent.state.length) {
            imports += "mapState, mapActions";
          } else if (currentComponent.state.length) imports += "mapState";
          else imports += "mapActions";
          imports += ' } from "vuex"\n';
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

        // if true add data section and populate with props
        let childrenComponentNames = "";
        children.forEach((name) => {
          childrenComponentNames += `    ${name},\n`;
        });
        // if true add data section and populate with props
        let data = "";
        data += "  data () {\n    return {";
        if (currentComponent.props.length) {
          currentComponent.props.forEach((prop) => {
            data += `\n      ${prop}: "PLACEHOLDER FOR VALUE",`;
          });
        }
          this.routes.HomeView.forEach((element) => {
            element.htmlList.forEach((html) => {
              if(html.binding !== '') {
                data += `\n      ${html.binding}: "PLACEHOLDER FOR VALUE",`;
              }
            })
          })
          data += "\n";
          data += "    }\n";
          data += "  },\n";

        // if true add computed section and populate with state
        let computed = "";
        if (currentComponent.state.length) {
          computed += "  computed: {";
          computed += "\n    ...mapState([";
          currentComponent.state.forEach((state) => {
            computed += `\n      "${state}",`;
          });
          computed += "\n    ]),\n";
          computed += "  },\n";
        }
        // if true add methods section and populate with actions
        let methods = "";
        if (currentComponent.actions.length) {
          methods += "  methods: {";
          methods += "\n    ...mapActions([";
          currentComponent.actions.forEach((action) => {
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
          output += imports + "\nexport default defineComponent ({\n  name: '" + componentName + "'";
        } else {
          output = "\n\n<script>\n";
          output += imports + "\nexport default {\n  name: '" + componentName + "'";
        }
        output += ",\n  components: {\n";
        output += childrenComponentNames + "  },\n";
        output += data;
        output += computed;
        output += methods;
        // eslint-disable-next-line no-useless-escape
        if (this.exportAsTypescript === "on") {
          output += "});\n<\/script>";

        } else {
          output += "};\n<\/script>";
        }
        return output;
      }

      /**
       * @description writes the <style> in vue component
       * if component is 'App', writes css, else returns <style scoped>
       */
      const writeStyle = (componentName) => {
        let htmlArray = this.componentMap[componentName].htmlList;
        let styleString = "";

        this.routes.HomeView.forEach((element) => {
          if(element.htmlAttributes.class !== "") {
            styleString += `.${element.htmlAttributes.class} {\nbackground-color: ${element.color};
width: ${element.w}px;
height: ${element.h}px;
z-index: ${element.z};
}\n`
          }
        })





        for (const html of htmlArray) {
          if (html.class !== '') {
            styleString += `.${html.class} {\nheight: ${html.h}%;
width: ${html.w}%;
top: ${html.x}%;
left: ${html.y}%;
z-index: ${html.z};
}\n`
          }
    }

        return `\n\n<style scoped>\n${styleString}</style >`;
      }

      const exportComponentFile = (data) => {
        if (data === undefined) return;
        if (!fs.existsSync(data)) {
          fs.mkdirSync(data);
        }
        // main logic below for creating single component
        // eslint-disable-next-line no-unused-vars
        createComponentCode(
          path.join(data, this.activeComponent),
          this.activeComponent,
          this.componentMap[this.activeComponent].children
        );
      }
      showExportComponentDialog();
  }
