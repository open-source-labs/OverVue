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
            :checked="store.composition"
            @change="store.compositionToggle"
            type="checkbox" class="compositiontoggle"
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
  Ref
} from "vue";
import { PrismEditor } from "vue-prism-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css"; // import syntax highlighting styles
import "vue-prism-editor/dist/prismeditor.min.css";
import { useStore } from "../../stores/main.js";
import { vtIcons } from "src/stores/state/icons";
import { Component, HtmlElement, HtmlElementMap } from "../../../types";
import { createBoilerOptions, createBoilerComposition } from "./createBoilerFuncs"

/* COMPUTED VALUES */
const store = useStore(); // template
const componentMap = computed(() => store.componentMap);
const activeComponent = computed(() => store.activeComponent);
const activeComponentObj = computed(() => store.activeComponentObj);
const exportAsTypescript = computed(() => store.exportAsTypescript);
const activeRoute = computed(() => store.activeRoute);

/* This will update code.value based on the new state of options */
watch(() => store.composition, () => {
  snippetInvoke();
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


/* METHODS */
/* ------------------------ Logic to check if Options or Composition API is selected ------------------------*/
const snippetInvoke = () => {
  if (activeComponent.value !== "") {
    code.value = createCodeSnippet(
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

/*------------------- Template and Boiler code snippet invocations-------------------*/
const createCodeSnippet = (componentName: string, children: string[]) => {
  let result = '';
  if (store.composition === false) {
  result = `${createTemplate(componentName /*, children*/)}${createBoilerOptions(
    componentName,
    children
  )}`;
  return result;
  } else {
    result = `${createTemplate(componentName /*, children*/)}${createBoilerComposition(
    componentName,
    children
  )}`;
  return result
  }
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

