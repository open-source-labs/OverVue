// file created to store all TS types in one file for project

// TS type for State (index.ts) in state folder
export type State = {
  // options/composition API check
  composition: boolean,
  mode: string;
  clicked: boolean;
  icons: Icons;
  vtIcons: Icons;
  htmlElementMap: HtmlElementMap;
  componentMap: {
    App: RouteComponentMap;
    HomeView: RouteComponentMap;
    [key: string]: RouteComponentMap | Component;
  };
  activeTreeNode: string;
  potentialParentNode: string;
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
  activeComponentObj:
    | null
    | Component
    | { componentName: string; isActive: false };
  activeHTML: string | number;
  activeLayer: {
    id: string | number;
    lineage: string[];
  };
  componentDetailsTab: string;
  selectedProps: string[];
  selectedState: string[];
  selectedActions: string[];
  selectedElementList: HtmlElement[];
  selectedIdDrag: string | number;
  selectedIdDrop: string | number;
  projectNumber: number;
  activeTab: number;
  modalOpen: boolean;
  attributeModalOpen: boolean;
  noteModalOpen: boolean;
  noteAttributeOpen: boolean;
  colorModalOpen: boolean;
  parentSelected: string;
  copiedComponent: Component | {};
  copyNumber: number;
  pastedComponent: Component | {};
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

export type Actions = {
  // changes state of options API and composition API
  compositionToggle: () => void;

  emptyState: () => void;
  removeAllStatePropsActions: () => void;
  toggleTutorial: () => void;
  addRoute: (payload: string) => void;
  addRouteToComponentMap: (payload: {
    route: string;
    children: string[];
  }) => void;
  deleteRoute: (payload: string) => void;
  setActiveRoute: (payload: string) => void;
  setActiveRouteArray: (payload: Component[]) => void;
  setRoutes: (payload: { [key: string]: Component[] }) => void;
  addRouteToRouteMap: (payload: string) => void;
  ExportAsTypescript: (payload: "on" | "off") => void;
  ExportOauth: (payload: "on" | "off") => void;
  toggleMode: (payload: "tree" | "canvas") => void; ///
  ExportOauthGithub: (payload: "on" | "off") => void;
  exportTest: (payload: string) => void;
  createAction: (payload: string) => void;
  addActionSelected: (payload: string[]) => void;
  addActionToComponent: (payload: string[]) => void;
  createProp: (payload: string) => void;
  addPropsSelected: (payload: string[]) => void;
  addPropsToComponent: (payload: string[]) => void;
  createState: (payload: string) => void;
  addStateSelected: (payload: string[]) => void;
  addStateToComponent: (payload: string[]) => void;
  deleteActionFromComponent: (payload: string) => void;
  deletePropsFromComponent: (payload: string) => void;
  deleteStateFromComponent: (payload: string) => void;
  deleteUserState: (payload: string) => void;
  deleteUserActions: (payload: string) => void;
  copyActiveComponent: () => void;
  updatePasteTimer: () => void;
  pasteActiveComponent: () => void;
  editComponentName: (payload: string) => void;

  addNestedHTML: (payload: { elementName: string; date: number }) => void;
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
  deleteFromElementHtmlList: (payload: number) => void;
  setComponentDetailsTab: (payload: string) => void;
  setActiveHTML: (payload: string[]) => void;
  setActiveLayer: (payload: { text: string; id: string }) => void;
  setClickedElementList: (payload: HtmlElement[]) => void;
  setSelectedElementList: (payload: HtmlElement[]) => void;
  upOneLayer: (payload: string) => void;
  setIdDrag: (payload: string) => void; // idDrag error line 534 of actions.ts
  setIdDrop: (payload: string) => void; // idDrag error line 540 of actions.ts

  //Overvue v10.0: drag n drop tree
  setActiveTreeNode: (payload: string) => void;
  moveNode: (payload: string) => void;
  setPotentialParentNode: (payload: string) => void;
  setSelectedIdDrag: (payload: string) => void;
  setSelectedIdDrop: (payload: string) => void;
  dragDropSortHtmlElements: () => void;
  dragDropSortSelectedHtmlElements: () => void;
  registerComponent: (payload: Component) => void;
  addComponentToActiveRouteChildren: (payload: string) => void;
  addComponentToActiveRouteInRouteMap: (payload: Component) => void;
  addComponentToComponentChildren: (payload: {
    component: string;
    value: string;
  }) => void;
  addComponentToComponentMap: (payload: Component) => void;
  addParent: (payload: Component) => void;
  addCopiedParent: (payload: Component) => void;
  deleteActiveComponent: () => void;
  parentSelect: (payload: string) => void;
  setActiveComponent: (payload: string) => void;
  setComponentMap: (payload: {
    App: RouteComponentMap;
    HomeView: RouteComponentMap;
    [key: string]: RouteComponentMap | Component;
  }) => void;
  updateComponentChildrenMultiselectValue: (payload: string[]) => void;
  updateComponentChildrenValue: (payload: {
    componentName: string;
    value: string[];
  }) => void;
  updateComponentNameInputValue: (payload: string) => void;
  updateComponentPosition: (payload: ResizePayload) => void;
  updateComponentGridPosition: (payload: ResizePayload) => void;
  updateComponentSize: (payload: ResizePayload) => void;
  updateColor: (payload: {
    color: string;
    activeComponent: string;
    routeArray: Component[];
    activeComponentData: null | Component;
  }) => void;
  editAttribute: (payload: {
    attribute: "class" | "id";
    value: string;
    activeComponent: string;
    routeArray: Component[];
    activeComponentData: null | Component;
  }) => void;
  updateComponentLayer: (payload: {
    activeComponent: string;
    routeArray: Component[];
    activeComponentData: null | Component;
    z: number;
  }) => void;
  updateHtmlLayer: (payload: {
    activeComponent: string;
    activeHTML: string | number;
    routeArray: Component[];
    z: number;
  }) => void;
  updateActiveComponentChildrenValue: (payload: string) => void;
  updateOpenModal: (payload: boolean) => void;
  addActiveComponentNote: (payload: string) => void;
  deleteActiveComponentNote: (payload: string) => void;
  openColorModal: () => void;
  openNoteModal: () => void;
  openAttributeModal: () => void;
  addAttributes: (payload: { id: number; [key: string]: any }) => void;

  addActiveComponentClass: (payload: { id: number; class: string }) => void;
  addBindingText: (payload: { id: number; binding: string }) => void;
  deleteActiveComponentClass: (payload: string) => void;
  addActiveComponentHeight: (payload: {
    id: number | string;
    height: string;
  }) => void;
  addActiveComponentWidth: (payload: {
    id: number | string;
    width: string;
  }) => void;
  addActiveComponentTop: (payload: {
    id: number | string;
    top: string;
  }) => void;
  addActiveComponentLeft: (payload: {
    id: number | string;
    left: string;
  }) => void;
  addActiveComponentElementNote: (payload: {
    id: number | string;
    note: number | string;
  }) => void;
  addProject: (payload: {
    filename: string;
    lastSavedLocation: string;
  }) => void;
  changeActiveTab: (payload: number) => void;
  deleteProjectTab: (payload: number) => void;
  openProject: (payload: {
    userProps: string[];
    userActions: string[];
    userState: string[];
    imagePath: {
      [x: string]: string;
    };
    componentMap: {
      App: RouteComponentMap;
      HomeView: RouteComponentMap;
      [key: string]: RouteComponentMap | Component;
    };
    routes: {
      [key: string]: Component[];
    };
  }) => void;
  importImage: (payload: { route: string; img: string }) => void;
  clearImage: (payload: { route: string }) => void;
  setImagePath: (payload: { [x: string]: string }) => void;
  changeLib: (payload: { libName: string }) => void;
  changeLibComponentDisplay: (payload: {
    displaylibComponent: boolean;
  }) => void;
  addLibComponents: (payload: { [x: string]: string | string[] }) => void;
  changeGridDensity: (payload: {
    direction: string;
    densityNum: number;
  }) => void;
};

// Type for HTML Element Map that used in multiple files
export type HtmlElementMap = {
  [key: string]: [string, string];
};

export type HtmlElement = {
  [key: string]: any;
  text: string;
  id: string | number;
  children: HtmlElement[];
  class: string;
  x: number | string; //top
  y: number | string;
  z: number | string; //width
  w: number | string; //width
  h: number | string; //height
  note: number | string;
  binding: number | string;
};

// Type for saved projects obj
export type Projects = {
  filename: string;
  lastSavedLocation: string;
};

export type RouteComponentMap = {
  children: string[];
  componentName: string;
  htmlList: HtmlElement[];
  parent?: Component | RouteComponentMap;
};

//used in Canvas to resize rendered components
export interface ResizePayload {
  x: number;
  y: number;
  h?: number;
  w?: number;
  activeComponent: string;
  routeArray: Component[];
  activeComponentData: null | Component;
}

// Type for generic component used in userCreateComponent.js
export type Component = {
  componentName: string;
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  id: number;
  htmlList: HtmlElement[];
  noteList: string[];
  classList: string[];
  children: string[];
  actions: string[];
  props: string[];
  state: string[];
  parent: Component | RouteComponentMap;
  isActive: boolean;
  idDrag: string | number;
  idDrop: string | number;
  color: string;
  htmlAttributes: HtmlAttributes;
};

export type HtmlAttributes = {
  class: string;
  id: string;
  gridArea: [number, number, number, number];
};

export type Icons = {
  [type: string]: string | string[];
};
