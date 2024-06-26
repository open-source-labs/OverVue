<!--
  NOTE:
  [OverVue v.10.0] Functionality is disabled; past iterations had intended to implement this functionality though hasn't actually been incorporated yet

  EXTRA INFO:
  - Errors are only TypeScript related; does not affect functionality
-->

<template>
  <q-btn
    id="import-component-btn"
    size="md"
    color="secondary"
    :label="title"
    @click="importComponent"
  />
</template>

<script setup lang="ts">
/* IMPORTS */
import { computed } from "vue";
const { fs, ipcRenderer } = window as any;
import { useStore } from "../../../stores/main.js";
import { Component, HtmlElement, HtmlElementMap } from "../../../../types";
import { useCreateComponent } from "../../composables/useCreateComponent.js";

/* PROPS */
defineProps(["title"]);

/* COMPUTED VALUES */
const store = useStore();
const componentMap = computed(() => store.componentMap);
const selectedElementList = computed(() => store.selectedElementList);
const userActions = computed(() => store.userActions);
const userState = computed(() => store.userState);
const userProps = computed(() => store.userProps);
const componentNameInputValue = computed(() => store.componentNameInputValue);

/* STORE ACTIONS */
const registerComponent: typeof store.registerComponent = (payload) =>
  store.registerComponent(payload);
const setActiveComponent: typeof store.setActiveComponent = (payload) =>
  store.setActiveComponent(payload);
const createAction: typeof store.createAction = (payload) =>
  store.createAction(payload);
const createState: typeof store.createState = (payload) =>
  store.createState(payload);
const createProp: typeof store.createProp = (payload) =>
  store.createProp(payload);

/* METHODS */

// defines props object to pass into useCreateComponent
const createImport = (importObj: Component) => {
  const importProps = {
    userActions: userActions.value,
    userState: userState.value,
    userProps: userProps.value,
    componentNameInputValue: componentNameInputValue.value,
    selectedElementList: selectedElementList.value,
    componentMap: componentMap.value,
    createAction,
    createState,
    createProp,
    registerComponent,
    setActiveComponent,
  };

  useCreateComponent(importObj, importProps); // invokes composable
};

// renders file
const importComponent = () => {
  ipcRenderer
    .invoke("importComponent", {
      properties: ["openFile"],
      filters: [
        {
          name: "Vue Files",
          extensions: ["vue"],
        },
      ],
    })
    .then((res: { filePaths: any }) => {
      openVueFile(res.filePaths);
      alert("Successfully Imported");
    })
    .catch((err: Error) => console.log(err));
};

// parses script tag string for props
const parsingStringToProps = (str: string) => {
  let props: string[] = [];
  let split = str.split(" ");
  for (let i = 0; i < split.length; i++) {
    if (
      split[i].includes(":") &&
      split[i] !== "computed:" &&
      split[i] !== "methods:" &&
      split[i] !== "name:" &&
      split[i] !== "components:"
    ) {
      let cleanStr = split[i].slice(0, split[i].indexOf(":"));
      props.push(cleanStr);
    }
  }
  return props;
};

// parses script tag string for actions
const parsingStringToAction = (str: string) => {
  let action: string[] = [];
  if (str.indexOf("...mapActions") === -1) {
    return action;
  }
  let trashedSlice = str.slice(str.lastIndexOf("...mapActions") + 15);
  let slice = trashedSlice.slice(0, trashedSlice.indexOf("])"));
  let split = slice.split(" ");
  for (let i = 0; i < split.length; i++) {
    if (split[i].includes(",")) {
      let cleanStr = split[i].slice(
        split[i].indexOf('"') + 1,
        split[i].lastIndexOf('"')
      );
      action.push(cleanStr);
    }
  }
  return action;
};

// parses script tag string for state
const parsingStringToState = (str: string) => {
  let state: string[] = [];
  if (str.indexOf("...mapState") === -1) {
    return state;
  }
  let trashedSlice = str.slice(str.lastIndexOf("...mapState") + 15);
  let slice = trashedSlice.slice(0, trashedSlice.indexOf("])"));
  let split = slice.split(" ");
  for (let i = 0; i < split.length; i++) {
    if (split[i].includes(",")) {
      let cleanStr = split[i].slice(
        split[i].indexOf('"') + 1,
        split[i].lastIndexOf('"')
      );
      state.push(cleanStr);
    }
  }
  return state;
};

// the bulk of the work for this component
const openVueFile = (data: any) => {
  if (data === undefined) return;

  const importObj = {} as Component; //final output
  const htmlList: string[] = []; //array populated with substrings '<div>' '</div>' '<p>' etc.

  let compName = data[0]
    .slice(data[0].lastIndexOf("/") + 1)
    .replace(/[^a-z0-9-_.]/gi, "")
    .replace(/.vue/, "");
  const vueFile = fs.readFileSync(data[0], "utf8");

  for (const key in store.componentMap) {
    if (store.componentMap[key].componentName === compName) {
      compName += "duplicate"; //appends duplicate if the componentName already exists in state.
    }
  }
  importObj.componentName = compName;

  const htmlElementMap = {
    //OverVue state management only handles these HTML tags.
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
    header: ["<header>", "</header>"],
    footer: ["<footer>", "</footer>"],
    meta: ["<meta>", "</meta>"],
    h1: ["<h1>", "</h1>"],
    h2: ["<h2>", "</h2>"],
    h3: ["<h3>", "</h3>"],
    h4: ["<h4>", "</h4>"],
    h5: ["<h5>", "</h5>"],
    h6: ["<h6>", "</h6>"],
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

  let htmlString = vueFile.substring(
    vueFile.indexOf("<template >") + 10,
    vueFile.indexOf("</template>")
  );
  let scriptString = vueFile.substring(
    vueFile.indexOf(`<script>`) + 8,
    vueFile.indexOf(`/script>`) - 1
  );

  htmlParser(htmlString);
  importObj.props = parsingStringToProps(scriptString);
  importObj.actions = parsingStringToAction(scriptString);
  importObj.state = parsingStringToState(scriptString);

  htmlList.pop();
  htmlList.shift();
  //OverVue adds a <div></div> wrapper to all components. remove this before importing.

  let groupings = findGroupings(htmlList);
  let groupingObj: { [key: string]: HtmlElement } = objectGenerator(groupings);
  let groupingArray: HtmlElement[] = [];
  for (const key in groupingObj) {
    groupingArray.push(groupingObj[key]);
  }
  importObj.htmlList = groupingArray;
  createImport(importObj);
  //send the importObj to CreateComponent.

  // /**
  //  * @name: htmlParser
  //  * @desc: parses imported .vue file for html elements and state, props and actions
  //  * @param: a string generated by reading a .vue file from the filesystem
  //  * @return: nothing: passes the substrings into buildList to generate an array of elements
  //  */

  function htmlParser(htmlString: string): void {
    // library issue
    if (!htmlString) {
      return;
    }
    //remove new lines and tabs from HTML
    htmlString = htmlString.replace("\n", "").replace("\t", "");
    //find index for the first < and > in the string
    let openTag = htmlString.indexOf("<");
    let closeTag = htmlString.indexOf(">");

    //push the substring wrapped by < and > into the helper func
    buildList(htmlString.substring(openTag + 1, closeTag));

    //recursively call htmlParser on the remainder of the string
    return htmlParser(htmlString.substring(closeTag + 1));
  }

  // /**
  //  * @name: buildList
  //  * @desc: takes incoming substrings and pushes the appropriate
  //  *        elements fromt he htmlElementMap defined by Overvue
  //  *
  //  * @param: substrings from htmlParser function
  //  * @return: nothing -- pushes into htmlList array which is defined outside scope of buildList
  //  */

  function buildList(substring: string) {
    for (const elem in htmlElementMap) {
      for (let i = 0; i < htmlElementMap[elem].length; i++) {
        //if the htmlElementMap[elem][index] matches the substring, push it into the output array
        if (substring === "p") {
          htmlList.push(htmlElementMap.paragraph[0]);
          return;
        } else if (substring === "/p") {
          htmlList.push(htmlElementMap.paragraph[1]);
          return;
        }
        if (htmlElementMap[elem][i].indexOf(substring) !== -1) {
          htmlList.push(htmlElementMap[elem][i]);
          return;
        }
      }
    }
  }

  // /**
  //  * @name: findGroupings
  //  * @desc: creates groupings of parent/child elements
  //  * @param: array generated by buildList of html elements from imported Vue file
  //  * @return: returns an array of arrays (grouped by parent/child)
  //  */

  function findGroupings(array: string[]) {
    let count = 0; //tracks where the parent ends
    let stopIndexes: number[] = []; //an array that will be used to slice out the parent/child relationships
    for (let i = 0; i < array.length; i++) {
      if (array[i][1] !== "/") {
        if (
          array[i] === "<img>" ||
          array[i] === '<a href="#"/>' ||
          array[i] === "<input />"
        ) {
          if (count === 0) {
            stopIndexes.push(i);
            continue;
          }
        } else {
          count++;
        }
      } else {
        count--;
      }
      if (count === 0) {
        stopIndexes.push(i);
      }
    }
    let groupings: string[][] = [];
    let startIndex = 0;
    for (let i = 0; i < stopIndexes.length; i++) {
      groupings.push(array.slice(startIndex, stopIndexes[i] + 1));
      startIndex = stopIndexes[i] + 1;
    }
    return groupings;
  }

  // /**
  //  * @name: objectGenerator
  //  * @desc: generates a nested object from the result of findGroupings nesting children within parents
  //  * @param: array generated by findGroupings
  //  * @return: returns an object containing parent/children html elements nested.
  //  */

  function objectGenerator(array: string[][]) {
    let groupingObj = {};
    for (let i = 0; i < array.length; i++) {
      for (const key in htmlElementMap) {
        if (array[i][0] === htmlElementMap[key][0]) {
          let idGen = Date.now() - Math.floor(Math.random() * 1000000);
          groupingObj[i] = { text: key, id: idGen };
        }
      }
      array[i].pop();
      array[i].shift();
      if (array[i].length > 0) {
        const childGroupings = findGroupings(array[i]);
        const childrenObj = objectGenerator(childGroupings);
        const childrenArray: any[] = [];
        for (const key in childrenObj) {
          childrenArray.push(childrenObj[key]);
        }
        groupingObj[i].children = childrenArray;
      } else {
        // groupingObj[i].children = [];
      }
    }
    return groupingObj;
  }
};
</script>

<style scoped>
#import-component-btn {
  width: 1000%;
  margin: 30px 0px;
}
</style>

