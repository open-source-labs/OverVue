/* eslint-disable no-unused-vars */ /* eslint-disable no-unused-vars */ /*
eslint-disable no-unused-vars */ /* eslint-disable no-unused-vars */ /*
eslint-disable no-unused-vars */ /* eslint-disable no-unused-vars */ /*
eslint-disable no-unused-vars */ /* eslint-disable no-useless-escape */ /*
eslint-disable no-useless-escape */
<!--
Description:
  Displays Export Project button and allows users to export project
  Functionality includes: export prompts, creating folders and code, exporting images
  -->

<template>
  <q-btn class="nav-btn" color="secondary" label="Export">
    <q-menu class="dropdown" :offset="[0, 15]">
      <div class="column items-center"> 
      <p class="center">Export:</p>
      <q-btn class="menu-btn" no-caps color="secondary" label="Project" @click="exportProject"/> 
      <q-btn class="menu-btn" id="export-component-nav-btn" no-caps color="secondary" label="Active Component" @click="useExportComponentBound" :disabled="!activeComponent.trim()"/> 
      </div>
    </q-menu>
  
  </q-btn>
</template>

<script setup>
  import { useExportComponent } from "../composables/useExportComponent.js";
</script>

<script>
import { mapState } from "vuex";
const { fs, ipcRenderer } = window;

export default {
  name: "ExportProjectComponent",
  methods: {
    useExportComponentBound(){
      useExportComponent.bind(this)();
    },
    showExportProjectDialog() {
      ipcRenderer
        .invoke("exportProject", {
          title: "Choose location to save folder in",
          message: "Choose location to save folder in",
          nameFieldLabel: "Application Name",
        })
        .then((result) => this.exportFile(result.filePath))
        .catch((err) => console.log(err));
    },
    exportProject: function () {
      this.showExportProjectDialog();
    },
    /**
     * @description creates the router.js file
     * argument: location = path to dir
     * invokes: createRouterImports(this.componentMap['App'].children),
     *          createExport(this.componentMap['App'].children)
     *  */
    createRouter(location) {
      if (this.exportAsTypescript === "on") {
        fs.writeFileSync(
          path.join(location, "src", "router", "index.ts"),
          this.createRouterImports(this.componentMap["App"].children) +
            this.createExport(this.componentMap["App"].children)
        );
      } else {
        fs.writeFileSync(
          path.join(location, "src", "router", "index.js"),
          this.createRouterImports(this.componentMap["App"].children) +
            this.createExport(this.componentMap["App"].children)
        );
      }
    },
    /**
     * @description import routed components from the /views/ dir
     * @argument: this.componentMap['App'].children
     */
    createRouterImports(appChildren) {
      let str = "import { createRouter, createWebHistory } from 'vue-router';\n";
      appChildren.forEach((child) => {
        str += `import ${child} from '../views/${child}.vue';\n`;
      });
      return str;
    },
    /**
     * @description creates the `export default` code in <script>
     */
    createExport(appChildren) {
      let str = "export default createRouter({\n\thistory: createWebHistory(import.meta.env.BASE_URL),\n\troutes: [\n";
      appChildren.forEach((child) => {
        if (child === "HomeView") {
          str += `\t\t{\n\t\t\tpath: '/',\n\t\t\tname:'${child}',\n\t\t\tcomponent:${child}\n\t\t},\n`;
        } else {
          str += `\t\t{\n\t\t\tpath: '/${child}',\n\t\t\tname:'${child}',\n\t\t\tcomponent: () => import('../views/${child}.vue')\n\t\t},\n`;
        }
      });
      str += `\t]\n})\n`;
      return str;
    },
    /**
     * @description: creates component code <template>, <script>, <style>
     * invokes writeTemplate, writeScript, writeStyle
     */
    createComponentCode(componentLocation, componentName, children) {
      if (componentName === "App") {
        fs.writeFileSync(
          componentLocation + ".vue",
          this.writeTemplate(componentName, children) +
            this.writeStyle(componentName)
        );
      } else {
        fs.writeFileSync(
          componentLocation + ".vue",
          this.writeComments(componentName) +
          this.writeTemplate(componentName, children) +
            this.writeScript(componentName, children) +
            this.writeStyle(componentName)
        );
      }
    },
    // creates assets folder
    createAssetFile(targetLocation, assetLocation) {
      let saved = remote.nativeImage.createFromPath(assetLocation);
      let urlData = saved.toPNG();
      fs.writeFileSync(targetLocation + ".png", urlData);
    },
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
      // function to loop through nested elements
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
      // iterate through component's htmllist
      let htmlArr = this.componentMap[componentName].htmlList;
      let outputStr = ``;
      // eslint-disable-next-line no-unused-vars
      for (let el of htmlArr) {
        if (!el.text) {
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
    writeComments(componentName){
      if (this.componentMap[componentName]?.noteList?.length > 0){
        let commentStr = '<!--'
        this.componentMap[componentName].noteList.forEach((el)=>{
          commentStr += "\n"
          commentStr += el;
        })
        commentStr += '\n-->\n\n'
        return commentStr;
      } else {
        return ''
      }
    },
    /**
     * @description creates the <router-link> boilerplate for /views/components
     * also creates the <template></template> tag for each component
     */
    writeTemplate(componentName, children) {
      let str = "";
      if (componentName === "App") {
        str += `<div id="app">\n\t\t<div id="nav">\n`;
        children.forEach((name) => {
          if (name === "HomeView") {
            str += `\t\t\t<router-link to="/">${name}</router-link>\n`;
          } else {
            str += `\t\t\t<router-link to="/${name}">${name}</router-link>\n`;
          }
        });
        str += "\t\t\t<router-view></router-view>\n\t\t</div>\n";
      } else {
        str += `<div>\n`;
      }
      // writes the HTML tag boilerplate
      let templateTagStr = this.writeTemplateTag(componentName);
      return `<template>\n\t${str}${templateTagStr}\t</div>\n</template>`;
    },
    /**
     * @description imports child components into <script>
     */
    writeScript(componentName, children) {
      // add import mapstate and mapactions if they exist
      const currentComponent = this.componentMap[componentName];
      const routes = Object.keys(this.routes);
      if (!routes.includes(componentName)) {
        let imports = "";
        if (currentComponent.actions.length || currentComponent.state.length) {
          imports += "import { ";
          if (
            currentComponent.actions.length &&
            currentComponent.state.length
          ) {
            imports += "mapState, mapActions";
          } else if (currentComponent.state.length) imports += "mapState";
          else imports += "mapActions";
          imports += ' } from "vuex";\n';
        }
        // if in Typescript mode, import defineComponent
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
        if (currentComponent.props.length) {
          data += "  data () {\n    return {";
          currentComponent.props.forEach((prop) => {
            data += `\n      ${prop}: "PLACEHOLDER FOR VALUE",`;
          });
          data += "\n";
          data += "    }\n";
          data += "  },\n";
        }
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
      } else {
        let str = "";
        children.forEach((name) => {
          str += `import ${name} from '@/components/${name}.vue';\n`;
        });
        let childrenComponentNames = "";
        children.forEach((name) => {
          childrenComponentNames += `    ${name},\n`;
        });
        // eslint-disable-next-line no-useless-escape
        if (this.exportAsTypescript === "on") {
          return `\n\n<script lang="ts">\nimport { defineComponent } from "vue";\n ${str}\nexport default defineComponent ({\n  name: '${componentName}',\n  components: {\n${childrenComponentNames}  }\n});\n<\/script>`;
        }
        return `\n\n<script>\n${str}\nexport default {\n  name: '${componentName}',\n  components: {\n${childrenComponentNames}  }\n};\n<\/script>`;
      }
    },
    /**
     * @description writes the <style> in vue component
     * if component is 'App', writes css, else returns <style scoped>
     */
    writeStyle(componentName) {
      let style =
        componentName !== "App"
          ? ""
          : `#app {\n\tfont-family: 'Avenir', Helvetica, Arial, sans-serif;\n\t-webkit-font-smoothing: antialiased;\n\t-moz-osx-font-smoothing: grayscale;\n\ttext-align: center;\n\tcolor: #2C3E50;\n\tmargin-top: 60px;\n}\n`;
      return `\n\n<style scoped>\n${style}</style>`;
    },
    // creates index html
    createIndexFile(location) {
      let str = `<!DOCTYPE html>\n<html lang="en">\n\n<head>`;
      str += `\n\t<meta charset="utf-8">`;
      str += `\n\t<meta http-equiv="X-UA-Compatible" content="IE=edge">`;
      str += `\n\t<meta name="viewport" content="width=device-width,initial-scale=1.0">`;
      str += `\n\t<link rel="icon" href="/favicon.ico">`;
      str += `\n\t<title>New OverVue Project</title>`;
      str += `\n</head>\n\n`;
      str += `<body>`;
      str += `\n\t<noscript>`;
      str += `\n\t\t<strong>We're sorry but vue-boiler-plate-routes doesn't work properly without JavaScript enabled. Please enable it
      to continue.</strong>`;
      str += `\n\t</noscript>`;
      str += `\n\t<div id="app"></div>`;
      if (this.exportAsTypescript === "on"){
      str += `\n\t<script type="module" src="/src/main.ts"><\/script>`;
      } else {
      str += `\n\t<script type="module" src="/src/main.js"><\/script>`;
      }
      str += `\n</body>\n\n`;
      str += `</html>\n`;
      fs.writeFileSync(path.join(location, "index.html"), str);
    },
    // creates main.js boilerplate
    createMainFile(location) {
      let str = `import { createApp } from 'vue';`;
      str += `\nimport store from './store'`
      str += `\nimport App from './App.vue';`;
      str += `\nimport router from './router';\n`;
      str += `\nconst app = createApp(App);`;
      str += `\napp.use(router);`;
      str += `\napp.use(store)`;
      str += `\napp.mount('#app');`;
      
      // if using typescript, export with .ts extension
      if (this.exportAsTypescript === "on") {
        fs.writeFileSync(path.join(location, "src", "main.ts"), str);
      } else {
        fs.writeFileSync(path.join(location, "src", "main.js"), str);
      }
    },
    // create babel file
    createViteConfig(location) {
      let str = `import { fileURLToPath, URL } from 'url';\n\n`;
      str += `import { defineConfig } from 'vite';\n`;
      str += `import vue from '@vitejs/plugin-vue';\n\n`;
      str += `export default defineConfig({\n`
      str += `\tplugins: [vue()],\n`
      str += `\tresolve: {\n`
      str += `\t\t alias: {\n`
      str += `\t\t\t'@': fileURLToPath(new URL('./src', import.meta.url))\n`
      str += `\t\t}\n\t}\n})`

      // if using typescript, export with .ts extension
      if (this.exportAsTypescript === "on") {
        fs.writeFileSync(path.join(location, "vite.config.ts"), str);
      } else {
        fs.writeFileSync(path.join(location, "vite.config.js"), str);
      }
    },
    createESLintRC(location) {
      let str;
      if (this.exportAsTypescript === "on"){
        str += `require("@rushstack/eslint-patch/modern-module-resolution");\n\n`;
      }
      str += `module.exports = {\n`;
      str += `\t"root": true,\n`;
      str += `\t"extends": [\n`;
      str += `\t\t"plugin:vue/vue3-essential",\n`
      str += `\t\t"eslint:recommended"`
      if (this.exportAsTypescript === "on"){
        str += `,\n\t\t"@vue/eslint-config-typescript/recommended"\n`
      }
      str += `\n\t],\n`
      str += `\t"env": {\n`
      str += `\t\t"vue/setup-compiler-macros": true\n`
      str += `\t}\n}`
      fs.writeFileSync(path.join(location, ".eslintrc.cjs"), str);
    },
    createTSConfig(location) {
      if (this.exportAsTypescript === "on") {
        let str = `{\n\t"extends": "@vue/tsconfig/tsconfig.web.json",\n\t"include": ["env.d.ts", "src/**/*", "src/**/*.vue"],\n\t"compilerOptions": {\n\t\t"baseUrl": ".",\n\t\t"paths": {\n\t\t\t"@/*": ["./src/*"]\n\t\t}\n\t},`;
        str += `\t"references": [\n`
        str += `\t\t{\n\t\t\t"path": "./tsconfig.vite-config.json"\n\t\t}\n\t]\n}`
        fs.writeFileSync(path.join(location, "tsconfig.json"), str);
      } else {
        return;
      }
    },
    createTSViteConfig(location) {
      if (this.exportAsTypescript === "on") {
        let str = `{\n\t"extends": "@vue/tsconfig/tsconfig.node.json",\n\t"include": ["vite.config.*"],\n\t"compilerOptions": {\n\t\t"composite": true,\n\t\t"types": ["node", "viteset"]\n\t}\n}`;
        fs.writeFileSync(path.join(location, "tsconfig.vite-config.json"), str);
      } else {
        return;
      }
    },
    createTSDeclaration(location) {
      if (this.exportAsTypescript === "on") {
        let str = `/// <reference types="vite/client" />`;
        fs.writeFileSync(path.join(location, "env.d.ts"), str);
      } else {
        return;
      }
    },
    createStore(location) {
      let str = `import { createStore } from 'vuex';\n`;
      str += `\nconst store = createStore({`;
      str += `\n\tstate () {`;
      str += `\n\t\treturn {`;
      if (!this.userState.length){
        str += `\n\t\t\t//placeholder for state`
      }
      for (let i = 0; i < this.userState.length; i++){
        str+= `\n\t\t\t${this.userState[i]}: "PLACEHOLDER FOR VALUE",`
        if (i === this.userState.length-1){str = str.slice(0, -1)}
      }
      str += `\n\t\t}`;
      str += `\n\t},`;
      str += `\n\tmutations: {`;
      if (!this.userActions.length){
        str += `\n\t\t\t//placeholder for mutations`
      }
      for (let i = 0; i < this.userActions.length; i++){
        str += `\n\t\t${this.userActions[i]} (state) {`;
        str += `\n\t\t\t//placeholder for your mutation`;
        str += `\n\t\t},`;
        if (i === this.userActions.length-1){str = str.slice(0, -1)}
      }
      str += `\n\t},`;
      str += `\n\tactions: {`;
      if (!this.userActions.length){
        str += `\n\t\t\t//placeholder for actions`
      }
      for (let i = 0; i < this.userActions.length; i++){
        str += `\n\t\t${this.userActions[i]} () {`;
        str += `\n\t\t\tstore.commit('${this.userActions[i]}')`;
        str += `\n\t\t},`;
        if (i === this.userActions.length-1){str = str.slice(0, -1)}
      }
      str += `\n\t}`;
      str += '\n})\n';
      str += `\nexport default store;`
      if (this.exportAsTypescript === "on") {
        fs.writeFileSync(path.join(location, "src", "store", "index.ts"), str);
      } else {
        fs.writeFileSync(path.join(location, "src", "store", "index.js"), str);
      }
    },
    // create package.json file
    createPackage(location) {
      let str = `{`;
      str += `\n\t"name": "My-OverVue-Project",`;
      str += `\n\t"version": "0.0.0",`;
      str += `\n\t"scripts": {`;
      str += `\n\t\t"dev": "vite",`;
      if (this.exportAsTypescript === "on") {
        str += `\n\t\t"build": "vue-tsc --noEmit && vite build",`;
        str += `\n\t\t"typecheck": "vue-tsc --noEmit",`;
        str += `\n\t\t"lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore",`;
      } else {
        str += `\n\t\t"build": "vite build",`;
        str += `\n\t\t"lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs --fix --ignore-path .gitignore",`;
      }
      str += `\n\t\t"preview": "vite preview --port 5050"`;
      str += `\n\t},`;
      str += `\n\t"dependencies": {`;
      str += `\n\t\t"vue": "^3.2.31",`;
      str += `\n\t\t"vue-router": "^4.0.12",`;
      str += `\n\t\t"vuex": "^4.0.2"`;
      str += `\n\t},`;
      str += `\n\t"devDependencies": {`;
      str += `\n\t\t"@vitejs/plugin-vue": "^2.2.2",`;
      str += `\n\t\t"eslint": "^8.5.0",`;
      str += `\n\t\t"eslint-plugin-vue": "^8.2.0",`;
      str += `\n\t\t"vite": "^2.8.4"`
      if (this.exportAsTypescript === "on") {
        str += `,\n\t\t"@rushstack/eslint-patch": "^1.1.0",`
        str += `\n\t\t"@vue/tsconfig": "^0.1.3",`;
        str += `\n\t\t"typescript": "~4.5.5",`;
        str += `\n\t\t"vue-tsc": "^0.31.4",`;
        str += `\n\t\t"@types/node": "^16.11.25",`;
        str += `\n\t\t"@vue/eslint-config-typescript": "^10.0.0"`;
      }
      str += `\n\t}\n}`;
      fs.writeFileSync(path.join(location, "package.json"), str);
    },
    exportFile(data) {
      if (data === undefined) return;
      if (!fs.existsSync(data)) {
        fs.mkdirSync(data);
        fs.mkdirSync(path.join(data, "public"));
        fs.mkdirSync(path.join(data, "src"));
        fs.mkdirSync(path.join(data, "src", "assets"));
        fs.mkdirSync(path.join(data, "src", "components"));
        fs.mkdirSync(path.join(data, "src", "views"));
        fs.mkdirSync(path.join(data, "src", "router"));
        fs.mkdirSync(path.join(data, "src", "store"));
      }
      // creating basic boilerplate for vue app
      this.createIndexFile(data);
      this.createMainFile(data);
      this.createViteConfig(data);
      this.createESLintRC(data);
      this.createTSConfig(data);
      this.createTSViteConfig(data);
      this.createTSDeclaration(data);
      this.createPackage(data);
      this.createStore(data);
      // exports images to the /assets folder
      // eslint-disable-next-line no-unused-vars
      for (let [routeImage, imageLocation] of Object.entries(this.imagePath)) {
        if (imageLocation !== "") {
          this.createAssetFile(
            path.join(data, "src", "assets", routeImage),
            imageLocation
          );
        }
      }
      // main logic below for creating components
      this.createRouter(data);
      // eslint-disable-next-line no-unused-vars
      for (let componentName in this.componentMap) {
        // if componentName is a route:
        if (componentName !== "App") {
          if (this.$store.state.routes[componentName]) {
            this.createComponentCode(
              path.join(data, "src", "views", componentName),
              componentName,
              this.componentMap[componentName].children
            );
            // if componentName is a just a component
          } else {
            this.createComponentCode(
              path.join(data, "src", "components", componentName),
              componentName,
              this.componentMap[componentName].children
            );
          }
          // if componentName is App
        } else {
          this.createComponentCode(
            path.join(data, "src", componentName),
            componentName,
            this.componentMap[componentName].children
          );
        }
      }
    },
  },
  computed: {
    ...mapState(["componentMap", "imagePath", "routes", "exportAsTypescript", "activeComponent", "userState", "userActions"]),
  },
};
</script>

<style scoped>
#export-component-nav-btn {
  margin-bottom: 20px;
}
</style>
