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
  selectedElementList: string[];
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
  addRouteToComponentMap: (payload: {
    route: string;
    children: string[];
  }) => void;
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
  parentSelect: (payload: string) => void;
  //Linden
  //Chris
  //Ji
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
  htmlList: string[];
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
  htmlList: any;
  noteList: string[];
  children: string[];
  actions: string[];
  props: string[];
  state: string[];
  parent: Record<string, Component>;
  isActive: false;
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
