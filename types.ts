// file created to store all TS types in one file for project

// TS type for State (index.ts) in state folder
export type State = {
  clicked: boolean,
  icons: any,
  htmlElementMap: HtmlElementMap,
  componentMap: {
    App: RouteComponentMap,
    HomeView: RouteComponentMap,
    [key: string]: RouteComponentMap | Component,
  },
  routes: {
    [key: string]: Component[],
  },
  userActions: string[],
  userProps: string[],
  userState: string[],
  imagePath: {
    [key: string]: string,
  },
  componentNameInputValue: string,
  projects: Projects[],
  activeRoute: string,
  activeComponent: string,
  activeComponentObj: null | Component,
  activeHTML: string,
  activeLayer: {
    id: string,
    lineage: [],
  },
  selectedProps: [],
  selectedState: [],
  selectedActions: [],
  selectedElementList: [],
  selectedIdDrag: string,
  selectedIdDrop: string,
  projectNumber: number,
  activeTab: number,
  componentChildrenMultiselectValue: [],
  modalOpen: boolean,
  noteModalOpen: boolean,
  noteAttributeOpen: boolean,
  colorModalOpen: boolean,
  parentSelected: boolean,
  copiedComponent: {},
  copyNumber: number,
  pastedComponent: {},
  exportAsTypescript: 'off' | 'on',
  showTutorial: true,
  tutorialFirstOpen: true,
  pasteTimer: number,
  gridLayout: [number, number],
  containerH: number,
  containerW: number,
  importLibraries: string[],
  displaylibComponent: boolean,
};

// Type for HTML Element Map that used in multiple files
export type HtmlElementMap = {
  [key: string]: [string, string],
};

// Type for saved projects obj
export type Projects = {
  filename: string,
  lastSavedLocation: string,
};

export type RouteComponentMap = {
  children: string[],
  componentName: string,
  htmlList: [],
};

// Type for generic component used in userCreateComponent.js
export type Component = {
  x: number,
  y: number,
  z: number,
  w: number,
  h: number,
  id: number,
  // look into html List any create type
  htmlList: any,
  noteList: [],
  children: [],
  actions: [],
  props: [],
  state: [],
  parent: {},
  isActive: false,
  idDrag: string,
  idDrop: string,
  color: string,
  htmlAttributes: {
    class: string,
    id: string,
    gridArea: [number, number, number, number],
  },
};

export type Icons = {
  [type: string]: string | string[];
};

export type StyleClassMap = {
  // insert here for style class map when implenting more

};