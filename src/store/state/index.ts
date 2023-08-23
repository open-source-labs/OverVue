import { icons, vtIcons } from "./icons";
import htmlElementMap from "./htmlElementMap";
import styleClassmap from "./styleClassMap";
import * as types from "../../../types";

const cloneDeep = require("lodash.clonedeep");

const newState: types.State = {
  clicked: false,
  icons,
  vtIcons,
  htmlElementMap,
  componentMap: {
    App: {
      componentName: "App",
      children: ["HomeView"],
      htmlList: [],
    },
    HomeView: {
      componentName: "HomeView",
      children: [],
      htmlList: [],
    },
  },
  routes: {
    HomeView: [],
  },
  userActions: [],
  userProps: [],
  userState: [],
  imagePath: {
    HomeView: "",
  },
  componentNameInputValue: "",
  projects: [{ filename: "Untitled-1", lastSavedLocation: "" }],

  activeTreeNode: "", // OverVue v.10.0 –– Node that is being dragged in tree UI
  potentialParentNode: "",
  // inspectComponentModal: false,

  activeRoute: "HomeView",
  // need to change to activeComponentName
  activeComponent: "",
  activeComponentObj: null,
  activeHTML: "",
  activeLayer: {
    id: "",
    lineage: [],
  },

  selectedProps: [],
  selectedState: [],
  selectedActions: [],
  selectedElementList: [],
  selectedIdDrag: "",
  selectedIdDrop: "",
  projectNumber: 2,
  activeTab: 0,
  // componentChildrenMultiselectValue: [],
  modalOpen: false,
  attributeModalOpen: false,
  noteModalOpen: false,
  //test
  noteAttributeOpen: false,
  colorModalOpen: false,
  parentSelected: "",
  // for storing copied component
  copiedComponent: {},
  copyNumber: 0,
  pastedComponent: {},
  exportAsTypescript: "off",
  exportOauth: "off",
  exportOauthGithub: "off",
  showTutorial: true,
  tutorialFirstOpen: true,
  pasteTimer: 0,
  gridLayout: [15, 15], // [Width Ratio, Height Ratio] this will be used to have containerH / gridLayout[0] and have fr
  containerH: 720, // in px
  containerW: 1280, // in px
  importLibraries: [],
  displaylibComponent: false,
  importTest: "off",
  //push libraries string to the array
};

// closured method to ensure we only ever write the default state ONCE
const writeTheDefault = (): any => {
  let initial: object = {};
  let needsToRun: boolean = true;
  function onced(payload: any) {
    if (needsToRun) {
      initial = cloneDeep(payload);
      needsToRun = false;
    }
    return initial;
  }
  return onced;
};

const defaultState = writeTheDefault();

export default newState;
export { defaultState };
