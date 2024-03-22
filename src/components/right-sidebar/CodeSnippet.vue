<!-- 
  LOCATION IN APP:
  [right sidebar] COMPONENT DETAILS > Code Preview

  FUNCTIONALITY:
  - Displays working code preview of current active component
  - Dynamically updates based on user-added HTML elements, attributes, state, actions, props, etc.
-->

<template>
  <div class="codesnippet-container">
    <div class="top-p-container">  
      <div class="top-p" v-if="activeComponent !== ''">
        {{ `${activeRoute} / ${activeComponent}.vue` }}
      </div>
      <div class="switch-container">
        <p class="api">Options API</p>
        <label class="code-switch">
          <input
            :checked="checked"
            @change="changeInput"
            type="checkbox"
          >
          <span class="slider round"/>
        </label>
        <p class="api">Composition API</p>
      </div>
    </div>
    <prism-editor
      v-model="code"
      :highlight="highlighter"
      line-numbers
      class="my-editor"
      readonly
    />
  </div>
</template>

<script setup lang="ts">
/* IMPORTS */
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
  Ref, 
  defineEmits 
} from "vue";
import { PrismEditor } from "vue-prism-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css"; // import syntax highlighting styles
import "vue-prism-editor/dist/prismeditor.min.css";
import { useStore } from "../../store/main.js";
import { vtIcons } from "src/store/state/icons";
import { Component, HtmlElement, HtmlElementMap } from "../../../types";
// import { createBoiler }  from './createBoilerFuncs/createBoilerFalse'

// Declaring emits
const emit = defineEmits(['input']);

// Data ref equivalent
const checked = ref(false);

// Method equivalent in Composition API
const changeInput = (event: Event) => {
  // Perform a type assertion here to let TypeScript know you're dealing with an input element
  const input = event.target as HTMLInputElement;
  // Now TypeScript knows that input is an HTMLInputElement, which does have a 'checked' property
  checked.value = input.checked;
  emit('input', input.checked);
};

watch(checked, () => {
  snippetInvoke(); // This will update code.value based on the new state of checked.value
});


/* LIFECYCLE HOOKS */
onMounted(() => {
  snippetInvoke(); // generates code preview on mount
  nextTick(() => {
    window.addEventListener("resize", getWindowHeight);
    getWindowHeight();
  });
});
onBeforeUnmount(() => window.removeEventListener("resize", getWindowHeight));

/* DATA */
const code = ref("Select a component to see its boilerplate code.");
const height: Ref<null | number> = ref(null);

/* COMPUTED VALUES */
const store = useStore(); // template
const componentMap = computed(() => store.componentMap);
const activeComponent = computed(() => store.activeComponent);
const activeComponentObj = computed(() => store.activeComponentObj);
const exportAsTypescript = computed(() => store.exportAsTypescript);
const activeRoute = computed(() => store.activeRoute);

/* METHODS */
/* ------------------------ write logic to switch between options & composostion api ------------------------*/
const snippetInvoke = () => {
  if (activeComponent.value !== "" && checked.value === false) {
    code.value = createCodeSnippetOptions(
      componentMap.value[activeComponent.value].componentName,
      componentMap.value[activeComponent.value].children
    );
  } else if (activeComponent.value !== "" && checked.value === true) {
       code.value = createCodeSnippetComposition(
      componentMap.value[activeComponent.value].componentName,
      componentMap.value[activeComponent.value].children
    );
  } else {
    code.value = "Select a component to see its boilerplate code.";
  }
};

const highlighter = (myCode: string) => {
  return highlight(myCode, languages.js);
};

const getWindowHeight = () => {
  let minHeight =
    window.outerHeight < 900 ? 22 : window.outerHeight < 1035 ? 24 : 27.5;
  height.value = minHeight; // height.value here?
};

/*------------------- Options & Composition switch -------------------*/
const createCodeSnippetOptions = (componentName: string, children: string[]) => {
  let result = `${createTemplate(componentName /*, children*/)}${createBoilerOptions(
    componentName,
    children
  )}`;
  return result;
};

const createCodeSnippetComposition = (componentName: string, children: string[]) => {
  let result = `${createTemplate(componentName /*, children*/)}${createBoilerComposition(
    componentName,
    children
  )}`;
  return result;
};

/* --------------- creates default boilerplate --------------- */
const createTemplate = (componentName: string) => {
  let templateTagStr = writeTemplateTag(componentName, activeComponent.value); // testing 2nd arg
  let routeStr = "";
  const arrOfChildComp = componentMap.value[componentName].children;
  arrOfChildComp.forEach((childName) => {
    const childNameComponent = componentMap.value[childName] as Component; // added this typing to remove htmlAttributes error on line below
    let childNameClass = childNameComponent.htmlAttributes.class;
    let childNameClassFullStr =
      childNameClass === "" ? "" : ` class = '${childNameClass}'`;
    routeStr += `    <${childName}${childNameClassFullStr}></${childName}>\n`;
  });
  const activeCompObj = activeComponentObj.value as Component; // typed this to fix activeComponentObj.value "is possibly null" error
  if (
    activeComponentObj.value &&
    (activeComponentObj.value as Component).htmlAttributes
  ) {
    //if/else statement to determine if there are class and id attributes present in the html element
    if (
      (activeComponentObj.value as Component).htmlAttributes.class !== "" &&
      (activeComponentObj.value as Component).htmlAttributes.id !== ""
    ) {
      return `<template>\n  <div id = "${
        (activeComponentObj.value as Component).htmlAttributes.id
      }" class = "${
        (activeComponentObj.value as Component).htmlAttributes.class
      }">\n${templateTagStr}${routeStr}  </div>\n</template>`;
    } else if (
      (activeComponentObj.value as Component).htmlAttributes.class !== "" &&
      (activeComponentObj.value as Component).htmlAttributes.id === ""
    ) {
      return `<template>\n  <div class = "${
        (activeComponentObj.value as Component).htmlAttributes.class
      }">\n${templateTagStr}${routeStr}  </div>\n</template>`;
    } else if (
      (activeComponentObj.value as Component).htmlAttributes.class === "" &&
      (activeComponentObj.value as Component).htmlAttributes.id !== ""
    )
      return `<template>\n  <div id = "${
        (activeComponentObj.value as Component).htmlAttributes.id
      }">\n${templateTagStr}${routeStr}  </div>\n</template>`;
    else {
      return `<template>\n  <div>\n${templateTagStr}${routeStr}  </div>\n</template>`;
    }
  }
};

/* --------------- creates <template> boilerplate --------------- */
const writeTemplateTag = (componentName: string, activeComponent: string) => {
  const htmlElementMap: HtmlElementMap = {
    // standard HTML elements
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

    // [OverVue v.10.0] Vuetensils elements
    VAlert: [
      `<VAlert class="info" dismissible`,
      `\n\t\t <a href="https://vuetensils.com/components/Alert.html">How to use Alert</a> \n\t\t This is an alert \n\t </VAlert>`,
    ],
    VDate: ["<VDate", ""],
    VDialog: [
      `<VDialog class="test" :classes="{ bg: 'bg-black-alpha' }"`,
      `\n\t\t <template #toggle="{ bind, on }">
        <button v-bind="bind" v-on="on">
         Show the dialog
        </button>
      </template>
      <div class="color-black bg-white">
        This is the dialog content.
      </div> \n\t  </VDialog>`,
    ],
    VDrawer: [
      `<VDrawer transition="slide-right" bg-transition="fade">      
        <template #toggle="{ bind, on }">
        <button v-bind="bind" v-on="on">
          Toggle Drawer
        </button>
      </template`,
      `\n\t\t My drawer content\n\t\t</VDrawer>`,
    ],
    VDropdown: [
      `<VDropdown text="This is the dropdown."
        <div>
          <p>Dropdown content</p>
        </div`,
      `\n    </VDropdown>`,
    ],
    VFile: ["<VFile", ""],
    VNotifications: ["<VNotifications", ""],
    VResize: [
      `<VResize>
      <template #default="{ width } ">
        <div
          class="resize-example"
          :class="{
            lg: width > 500,
            md: width > 300 && width < 500,
            sm: width < 300,
          }"
        >
          <img src="https://fillmurray.lucidinternets.com/200/200" alt="description" />
          <p>This content is {{ width }}px wide.</p>
        </div>
      </template`,
      `\n    </VResize>`,
    ],
    VSkip: [
      `<div>
      <button>click here to focus</button>

      <p>Tab to get to the skip component then press enter to skip to main content</p>

      <VSkip to="#main">
        Skip To Main Content
      </VSkip>

      <!-- perhaps a nav here -->
      <nav>
        <ul class="fake-nav">
          <li><a href="#">Example 1</a></li>
          <li><a href="#">Example 2</a></li>
          <li><a href="#">Example 3</a></li>
          <li><a href="#">Example 4</a></li>
          <li><a href="#">Example 5</a></li>
          <li><a href="#">Example 6</a></li>
        </ul>
      </nav>

      <main id="main">
        <p>This is the main content section</p>
        <p>It could even be a router-link.</p>
        <p>We're adding some extra paragraphs here.</p>
        <p>Because otherwise the header blocks this content :)</p>
      </main`,
      `\n    </div>`,
    ],
    VTabs: [
      `<VTabs class="styled">
      <template #tab-1>Tab 1</template>
      <template #panel-1>
        Here's the content for tabpanel 1.
      </template>

      <template #tab-2>Tab 2</template>
      <template #panel-2>
        Here's the content for tabpanel 2.
      </template>

      <template #tab-3>Tab 3</template>
      <template #panel-3>
        Here's the content for tabpanel 3.
      </template`,
      `\n    </VTabs>`,
    ],
    VToggle: [
      `<VToggle label="Toggle label"`,
      `\n\t\tcontent here \n    </VToggle>`,
    ],
  };

  // Helper function that recursively iterates through the given html element's children and their children's children.
  // also adds proper indentation to code snippet
  // add childComponents of the activeCompnent to the htmlElementMap
  const childComponents = componentMap.value[activeComponent].children;
  childComponents.forEach((child) => {
    htmlElementMap[child] = [`<${child}`, ""]; //single
  });

  const writeNested = (childrenArray: HtmlElement[], indent: string) => {
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
          // child.text !== "img" || child.text !== "link"
          if (child.text !== "img") {
            nestedString += ` v-model="${child.binding}"`;
          }
        }
        if (
          child.text === "img" ||
          child.text === "input" ||
          child.text === "link" ||
          child.text === "VDate" ||
          child.text === "VFile" ||
          child.text === "VNotifications" ||
          childComponents.includes(child.text)
        ) {
          nestedString += " />";
        } else {
          nestedString += ">";
        }

        if (child.note !== "") {
          nestedString += `${child.note}`;
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
  };

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
        el.text === "link" ||
        el.text === "VDate" ||
        el.text === "VFile" ||
        el.text === "VNotifications"
      ) {
        outputStr += " /";
      }

      outputStr += ">";

      if (el.note !== "") {
        outputStr += `${el.note}`;
      }
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

/* --------------- creates boiler text for <script> and <style> --------------- */
const createBoilerOptions = (componentName: string, children: string[]) => {
  // add import mapstate and mapactions if they exist
  let imports = "";
  const activeComp = componentMap.value[activeComponent.value] as Component;
  // if (checked.value === false) {
    if (activeComp.actions.length || activeComp.state.length) {
      imports += "import { ";
      if (activeComp.actions.length && activeComp.state.length) {
        imports += "mapState, mapActions";
      } else if (activeComp.state.length) imports += "mapState";
      else imports += "mapActions";
      imports += ` } from "pinia";\nimport { /* store */} from '/* ./store */'`; // changed from 'vuex' pinia
    }
  // }
  // if Typescript toggle is on, import defineComponent
  if (exportAsTypescript.value === "on") {
    imports += 'import { defineComponent } from "vue";\n';
  }

  // add imports for children
  children.forEach((name) => {
    imports += `import ${name} from './components/${name}.vue';\n`;
  });

  // add components section
  let childrenComponentNames = "";
  children.forEach((name) => {
    childrenComponentNames += `    ${name},\n`;
  });

  // if true add data section and populate with props
  let data = "";
  if (activeComp.props.length) {
    data += "  props: {";
    activeComp.props.forEach((prop) => {
      data += `\n    ${prop}: "PLACEHOLDER FOR VALUE",`;
    });
    data += "\n";
    //data += "    }\n";
    data += "  },\n";
  }

  const htmlBinding = componentMap.value[activeComponent.value].htmlList;

  // [OverVue v.10.0] add Vuetensils import statements to <script setup>

  const vuetensilsSet = new Set(Object.keys(vtIcons));

  let vuetensilsImports = "";

  const vtComponents: string[] = [];

  htmlBinding.forEach((el) => {
    if (vuetensilsSet.has(el.text)) {
      // Add import statement for Vuetensils components
      vtComponents.push(el.text);
    }
  });

  if (vtComponents.length) {
    vuetensilsImports += `import { ${vtComponents.join(
      ", "
    )} } from 'vuetensils/src/components';\n`;
  }

  data += "  data() {\n    return {\n";
  htmlBinding.forEach((el) => {
    if (el.binding !== "") {
      data += `      ${el.binding}: "PLACEHOLDER FOR VALUE", `;
      data += "\n";
    }
  });
  data += `    }`;
  data += ` \n  },  \n `;

  // if true add computed section and populate with state
  let computed = "";
  if (activeComp.state.length) {
    computed += " computed: {";
    computed += "\n    ...mapState(/* store */, [";
    activeComp.state.forEach((state) => {
      computed += `\n      "${state}", `;
    });
    computed += "\n    ]),\n";
    computed += "  },\n";
  }

  // if true add methods section and populate with actions
  let methods = "";
  if (activeComp.actions.length) {
    methods += "  methods: {";
    methods += "\n    ...mapActions(/* store */, [";
    activeComp.actions.forEach((action) => {
      methods += `\n      "${action}", `;
    });
    methods += "\n    ]),\n";
    methods += "  },\n";
  }

  let htmlArray = componentMap.value[componentName].htmlList;
  let styleString = "";
  const activeCompObj = activeComponentObj.value as Component; // typed this to fix activeComponentObj.value "is possibly null" error
  if (
    activeComponentObj.value &&
    (activeComponentObj.value as Component).htmlAttributes.class !== ""
  ) {
    styleString += `.${
      (activeComponentObj.value as Component).htmlAttributes.class
    } { \n\tbackground-color: ${(activeComponentObj.value as Component).color};
\tgrid-area: ${
      (activeComponentObj.value as Component).htmlAttributes.gridArea[0]
    } / ${
      (activeComponentObj.value as Component).htmlAttributes.gridArea[1]
    } / ${
      (activeComponentObj.value as Component).htmlAttributes.gridArea[2]
    } / ${(activeComponentObj.value as Component).htmlAttributes.gridArea[3]};
\tz-index: ${(activeComponentObj.value as Component).z};
} \n`;
  }

  for (const html of htmlArray) {
    if (html.class === " ") styleString = "";
    if (html.class) {
      styleString += `.${html.class} {\n height: ${html.h}%; \n width: ${html.w}%; \n top: ${html.x}%;
       \n left: ${html.y}%; \n z-index: ${html.z};}\n`;
    }
  }

  // concat all code within script tags
  // if exportAsTypescript is on, out should be <script lang="ts">
  let output;
  if (exportAsTypescript.value === "on") {
    output = "\n\n<script lang='ts'>\n";
    output +=
      vuetensilsImports +
      imports +
      "\nexport default defineComponent ({\n  name: '" +
      componentName +
      "';";
  } else {
    output = "\n\n<script>\n";
    output +=
      vuetensilsImports +
      imports +
      "\nexport default {\n  name: '" +
      componentName +
      "'";
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

const createBoilerComposition = (componentName: string, children: string[]) => {
  // add import mapstate and mapactions if they exist
  let imports = "";
  const activeComp = componentMap.value[activeComponent.value] as Component;
  // if (checked.value === false) {
    if (activeComp.actions.length || activeComp.state.length) {
      imports += `import { /* useStore */ } from '/* ./store */';\n`; // changed from 'vuex' pinia
    }
  // }
  // if Typescript toggle is on, import defineComponent
  if (exportAsTypescript.value === "on") {
    imports += 'import { defineComponent } from "vue";\n';
  }

  // add imports for children
  children.forEach((name) => {
    imports += `import ${name} from './components/${name}.vue';\n`;
  });

  // add components section
  let childrenComponentNames = "\n";
  children.forEach((name) => {
    childrenComponentNames += `    ${name},\n`;
  });

  // if true add data section and populate with props
  let data = "";
  if (activeComp.props.length) {
    data += "  props: {";
    activeComp.props.forEach((prop) => {
      data += `\n    ${prop}: "PLACEHOLDER FOR VALUE",`;
    });
    data += "\n";
    //data += "    }\n";
    data += "  },\n";
  }
 

  const htmlBinding = componentMap.value[activeComponent.value].htmlList;

  // [OverVue v.10.0] add Vuetensils import statements to <script setup>

  const vuetensilsSet = new Set(Object.keys(vtIcons));

  let vuetensilsImports = "";

  const vtComponents: string[] = [];

  htmlBinding.forEach((el) => {
    if (vuetensilsSet.has(el.text)) {
      // Add import statement for Vuetensils components
      vtComponents.push(el.text);
    }
  });

  if (vtComponents.length) {
    vuetensilsImports += `import { ${vtComponents.join(
      ", "
    )} } from 'vuetensils/src/components';\n`;
  }
/*------------- setup() function -------------*/
data = " setup() {"
if(activeComp.state.length || activeComp.actions.length){
  data += "   \n   const /* testStore */ = useStore();  ";
}
  htmlBinding.forEach((el) => {
    if (el.binding !== "") {
      data += `      ${el.binding}: "PLACEHOLDER FOR VALUE", `;
      data += "\n";
    }
  });

  let returnStatement = "";

  if (activeComp.state.length || activeComp.actions.length) {
    returnStatement = "\n  return { \n";
  }


  // if true add computed section and populate with state
  let computed = "";
  if (activeComp.state.length) {
    const currState = 
    activeComp.state.forEach((state) => {
      data += `\n   const ${state} = computed(() => /* testStore */.${state}); `;
      returnStatement += `   ${state}, \n`
      
    });
    // line 22
  }

  data += '\n };'

  // if true add methods section and populate with actions
  let methods = "";
  if (activeComp.actions.length) {
    activeComp.actions.forEach((action) => {
      methods += `\n   const ${action} = () => /* testStore */.${action}();`;
      returnStatement += `   ${action}, \n`
    });
  }

  let htmlArray = componentMap.value[componentName].htmlList;
  let styleString = "";
  const activeCompObj = activeComponentObj.value as Component; // typed this to fix activeComponentObj.value "is possibly null" error
  if (
    activeComponentObj.value &&
    (activeComponentObj.value as Component).htmlAttributes.class !== ""
  ) {
    styleString += `.${
      (activeComponentObj.value as Component).htmlAttributes.class
    } { \n\tbackground-color: ${(activeComponentObj.value as Component).color};
\tgrid-area: ${
      (activeComponentObj.value as Component).htmlAttributes.gridArea[0]
    } / ${
      (activeComponentObj.value as Component).htmlAttributes.gridArea[1]
    } / ${
      (activeComponentObj.value as Component).htmlAttributes.gridArea[2]
    } / ${(activeComponentObj.value as Component).htmlAttributes.gridArea[3]};
\tz-index: ${(activeComponentObj.value as Component).z};
} \n`;
  }

  for (const html of htmlArray) {
    if (html.class === " ") styleString = "";
    if (html.class) {
      styleString += `.${html.class} {\n height: ${html.h}%; \n width: ${html.w}%; \n top: ${html.x}%;
       \n left: ${html.y}%; \n z-index: ${html.z};}\n`;
    }
  }

  // concat all code within script tags
  // if exportAsTypescript is on, out should be <script lang="ts">
  let output;
  if (exportAsTypescript.value === "on") {
    output = "\n\n<script lang='ts'>\n";
    output +=
      vuetensilsImports +
      imports +
      "\nexport default defineComponent ({\n  name: '" +
      componentName +
      "';";
  } else {
    output = "\n\n<script>\n";
    output +=
      vuetensilsImports +
      imports +
      "\nexport default {\n  name: '" +
      componentName +
      "'";
  }
  output += ",\n  components: {";
  output += childrenComponentNames + "  },\n";
  output += data;
  output += computed;
  output += methods;

  if (exportAsTypescript.value === "on") {
    output += "});\n<\/script>\n\n<style scoped>\n</style>";
  } else if (activeComp.state.length || activeComp.actions.length) {
    output += `   \n}; \n  ${returnStatement}  };
    \n<\/script>\n\n<style scoped>\n${styleString}</style > `;
  } else {
    output += `   \n}; \n  
    \n<\/script>\n\n<style scoped>\n${styleString}</style > `;
  }

  return output;
};

/* WATCHES */
watch(
  () => [activeComponent.value, componentMap.value, exportAsTypescript.value],
  () => snippetInvoke(),
  { deep: true }
);
</script>

<style lang="scss">
// resize handled by vue lifecycle methods
.my-editor {
  font-size: 14px;
  background: #2d2d2d;
  color: #ccc;
  max-height: 100%;
  /* you must provide font-family font-size line-height. Example: */
  font-family: Fira Code, Fira Mono, Consolas, Menlo, Courier, monospace;
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

.top-p-container{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
// ---------------------- styling for slider ----------------------
.switch-container {
  display: flex;
  justify-content: center;
  align-content: center;
}

.code-switch {
  position: relative;
  display: inline-block;
  width: 35px; // was 35px
  height: 22px;
  margin: 8px;
}

.code-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  -webkit-transition: 0.7s;
  transition: 0.7s;
  border: 1px solid #ffffff;
  background-size: 30px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 0px;
  bottom: 0px;
  background-color: #34ab83;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border: solid 1px #fff;
}

input:checked + .slider {
  background-color: transparent;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2567A2;
}

input:checked + .slider:before {
  -webkit-transform: translateX(31px);
  -ms-transform: translateX(31px);
  transform: translateX(15px);
  background: #34ab83;
  -webkit-transition: 0.7s;
  transition: 0.7s;
  border: solid 1px #fff;
}

.slider.round {
  border-radius: 24px;
  border-color: #ffffff;
}

.slider.round:before {
  border-radius: 50px; // was 50%
  border-color: #ffffff;
}
</style>
