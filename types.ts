// file created to store all TS types in one file for project

import { NoParamCallback } from "original-fs";
import { deletePropsFromComponent } from "src/store/options/types";

// TS type for State (index.ts) in state folder
export type State = {
  clicked: boolean;
  icons: Icons;
  htmlElementMap: HtmlElementMap;
  componentMap: {
    App: RouteComponentMap;
    HomeView: RouteComponentMap;
    [key: string]: RouteComponentMap | Component;
  };
  routes: {
    [key: string]: Component[];
  };
  userActions: string[];
  userProps: string[];
  userState: string[];
  imagePath: {
    [key: string]: string;
  };
  componentNameInputValue: string;
  projects: Projects[];
  activeRoute: string;
  activeComponent: string;
  activeComponentObj: null | Component;
  activeHTML: string;
  activeLayer: {
    id: string;
    lineage: string[];
  };
  selectedProps: string[];
  selectedState: string[];
  selectedActions: string[];
  selectedElementList: any[]; // ?? actions function addToSelectedElementList
  selectedIdDrag: string;
  selectedIdDrop: string;
  projectNumber: number;
  activeTab: number;
  componentChildrenMultiselectValue: string[];
  modalOpen: boolean;
  attributeModalOpen: boolean;
  noteModalOpen: boolean;
  noteAttributeOpen: boolean;
  colorModalOpen: boolean;
  parentSelected: any; // need to look deeper into parentSelected - it seems to take many data types
  copiedComponent: Component | {};
  copyNumber: number;
  pastedComponent: {};
  exportAsTypescript: "off" | "on";
  exportOauth: "off" | "on";
  exportOauthGithub: "off" | "on";
  showTutorial: boolean;
  tutorialFirstOpen: boolean;
  pasteTimer: number;
  gridLayout: [number, number];
  containerH: number;
  containerW: number;
  importLibraries: string[];
  displaylibComponent: boolean;
  importTest: string;
};

export interface Actions {
  emptyState: () => void;
  removeAllStatePropsActions: () => void;
  toggleTutorial: () => void;
  addRoute: (payload: string) => void;
  addRouteToComponentMap: (payload: { route: string; children: [] }) => void;
  // deleteRoute: (payload: string) => void;
  setActiveRoute: (payload: string) => void;
  // setActiveRouteArray: (payload: {}) => void;
  // setRoutes: (payload: []) => void;
  // addRouteToRouteMap: (payload: string) => void;
  ExportAsTypescript: (payload: "on" | "off") => void;
  ExportOauth: (payload: "on" | "off") => void;
  ExportOauthGithub: (payload: "on" | "off") => void;
  exportTest: (payload: string) => void;
  createAction: (payload: string) => void;
  addActionSelected: (payload: string[]) => void;
  // addActionToComponent:
  createProp: (payload: string) => void;
  addPropsSelected: (payload: string[]) => void;
  // addPropsToComponent:
  createState: (payload: string) => void;
  addStateSelected: (payload: string[]) => void;
  // addStateToComponent:
  // deleteActionFromComponent:
  // deletePropsFromComponent:
  // deleteStateFromComponent:
  // deleteUserState:
  // deleteUserActions:
  copyActiveComponent: () => void;
  updatePasteTimer: () => void;
  // pasteActiveComponent: () => void;
  // editComponentName:
  //Linden
  addNestedHTML: (payload: { elementName: string; date: string }) => void;
  clearActiveHTML: () => void;
  addNestedNoActive: (payload: { elementName: string; date: string }) => void;
  addToComponentElementList: (payload: {
    elementName: string;
    date: string;
  }) => void;
  addToSelectedElementList: (payload: {
    elementName: string;
    date: string;
  }) => void;
  deleteFromComponentHtmlList: (id: string) => void;
  deleteSelectedElement: (payload: number) => void;
  setActiveHTML: (payload: string[]) => void;
  setActiveLayer: (payload: { text: string; id: string }) => void;
  setClickedElementList: (payload: string) => void;
  setSelectedElementList: (payload: any[]) => void;
  upOneLayer: (payload: number) => void;
  setIdDrag: (payload: string) => void; // idDrag error line 534 of actions.ts
  setIdDrop: (payload: string) => void; // idDrag error line 540 of actions.ts
  setSelectedIdDrag: (payload: string) => void;
  setSelectedIdDrop: (payload: string) => void;
  dragDropSortHtmlElements: () => void;
  //Chris
  dragDropSortSelectedHtmlElements: () => void;
  registerComponent: (payload: object) => void;
  addComponentToActiveRouteChildren: (payload: string) => void;
  addComponentToActiveRouteInRouteMap: (payload: object) => void;
  addComponentToComponentChildren: (payload: object) => void;
  addComponentToComponentMap: (payload: {
    componentName: string;
    htmlList: Component[];
    children: string[];
    parent: Record<string, Component>;
    isActive: boolean,
    actions:string[];
    props: string[],
    idDrag: string,
    idDrop: string,
    htmlAttributes: {
      class: string;
      id: string;
      gridArea: [number, number, number, number];
    };
    color: string;
    state: string[],
  }) => void;
  addParent: (payload: object) => void;
  addCopiedParent: (payload: object) => void;
  deleteActiveComponent: () => void;
  parentSelect: (payload: string) => void;
  setActiveComponent: (payload: string) => void;
  setComponentMap: (payload: object) => void;
  updateComponentChildrenMultiselectValue: (payload: string[]) => void;
  updateComponentChildrenValue: (payload: object) => void;
  updateComponentNameInputValue: (payload: string) => void;
  updateComponentPosition: (payload: object) => void;
  updateComponentGridPosition: (payload: object) => void;
  updateComponentSize: (payload: object) => void;
  updateColor: (payload: object) => void;
  editAttribute: (payload: object) => void;
  updateComponentLayer: (payload: object) => void;
  updateHtmlLayer: (payload: object) => void;
  updateActiveComponentChildrenValue: (payload: string) => void;


  //Ji
  updateActiveComponentChildrenValue: (payload: string) => void;
  updateOpenModal: (payload: boolean) => void;
  addActiveComponentNote: (payload: string) => void;
  deleteActiveComponentNote: (payload: string) => void;
  addActiveComponentClass: (payload: {
    id: number,
    class: string
  }) => void;
  addBindingText: (payload: {
    id: number,
    binding: string
  }) => void;
  deleteActiveComponentClass: (payload: string) => void;
  addActiveComponentHeight: (payload: {
    id: number,
    height: number
  }) => void;
  addActiveComponentWidth: (payload: {
    id: number,
    width: number
  }) => void;
  addActiveComponentTop: (payload: {
    id: number,
    top: number
  }) => void;
  addActiveComponentLeft: (payload: {
    id: number,
    left: number
  }) => void;
  //unsure of below
  addActiveComponentElementNote: (payload: {
    id: number,
    note: string
  }) => void;
  addProject: (payload: {
    filename: string, lastSavedLocation: string
  }) => void;
  changeActiveTab: (payload: number) => void;
  deleteProjectTab: (payload: number) => void;
  //unsure of below
  openProject: (payload: {
    userProps: string[],
    userActions: string[],
    userState: string[],
    imagePath: {
      [x: string]: string
    },
    componentMap: string,
    routes: string
  }) => void;
  importImage: (payload: {
    route: string,
    img: string
  }) => void;
  clearImage: (payload: {
    route: string
  }) => void;
  //unsure of below
  setImagePath: (payload: {
    [x: string]: string
  }) => void;
  changeLib: (payload: {
    libName: string
  }) => void;
  changeLibComponentDisplay: (payload: {
    displaylibComponent: boolean
  }) => void;
  //unsure of below
  addLibComponents: (payload: {
    [x: string] : string | string[];
  }) => void;
  changeGridDensity: (payload: {
    direction: string,
    densityNum: number,
  }) => void;
}

// Type for HTML Element Map that used in multiple files
export type HtmlElementMap = {
  [key: string]: [string, string];
};

// Type for saved projects obj
export type Projects = {
  filename: string;
  lastSavedLocation: string;
};

export type RouteComponentMap = {
  children: string[];
  componentName: string;
  htmlList: [];
};

// Type for generic component used in userCreateComponent.js
export type Component = {
  componentName: string;
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  id: number;
  // look into html List any create type
  htmlList: [];
  noteList: string[];
  children: string[];
  actions: string[];
  props: string[];
  state: string[];
  parent: Record<string, Component>;
  isActive: boolean;
  idDrag: string;
  idDrop: string;
  color: string;
  htmlAttributes: {
    class: string;
    id: string;
    gridArea: [number, number, number, number];
  };
};

export type Icons = {
  [type: string]: string | string[];
};

export type StyleClassMap = {
  // insert here for style class map when implenting more
};
