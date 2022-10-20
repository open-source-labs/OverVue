// file created to store all TS types in one file for project

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
  //Linden
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
  deleteFromComponentHtmlList: (id: string) => void;
  deleteSelectedElement: (payload: number) => void;
  setActiveHTML: (payload: string[]) => void;
  setActiveLayer: (payload: { text: string; id: string }) => void;
  setClickedElementList: (payload: HtmlElement[]) => void;
  setSelectedElementList: (payload: HtmlElement[]) => void;
  upOneLayer: (payload: number) => void;
  setIdDrag: (payload: string) => void; // idDrag error line 534 of actions.ts
  setIdDrop: (payload: string) => void; // idDrag error line 540 of actions.ts
  setSelectedIdDrag: (payload: string) => void;
  setSelectedIdDrop: (payload: string) => void;
  dragDropSortHtmlElements: () => void;
  //Chris
  dragDropSortSelectedHtmlElements: () => void;
  registerComponent: (payload: Component) => void;
  addComponentToActiveRouteChildren: (payload: string) => void;
  addComponentToActiveRouteInRouteMap: (payload: Component) => void;
  addComponentToComponentChildren: (payload: { component: string; value: string }) => void;
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
  updateComponentChildrenValue: (payload: {componentName: string; value: Component}) => void;
  updateComponentNameInputValue: (payload: string) => void;
  updateComponentPosition: (payload: ResizePayload) => void;
  updateComponentGridPosition: (payload: ResizePayload) => void;
  updateComponentSize: (payload: ResizePayload) => void;
  updateColor: (payload: { 
    color: string;
    activeComponent: string;
    routeArray: [];
    activeComponentData: null | Component;
  }) => void;
  editAttribute: (payload: {
    attribute: string,
    value: string,
    activeComponent: string,
    routeArray: [],
    activeComponentData:  null | Component,
  }) => void;
  updateComponentLayer: (payload: {
    activeComponent: string;
    routeArray: [];
    activeComponentData: null | Component;
    z: number;
  }) => void;
  updateHtmlLayer: (payload: {
    activeComponent: string;
    activeHTML: string;
    routeArray: [];
    z: number;
  }) => void;
  updateActiveComponentChildrenValue: (payload: string) => void;
  //Ji line 1002
  updateOpenModal: (payload: boolean) => void;
  addActiveComponentNote: (payload: string) => void;
  deleteActiveComponentNote: (payload: string) => void;
  addActiveComponentClass: (payload: { id: string; class: string }) => void;
  addBindingText: (payload: { id: string; binding: string }) => void;
  deleteActiveComponentClass: (payload: string) => void;
  addActiveComponentHeight: (payload: { id: string; height: number }) => void;
  addActiveComponentWidth: (payload: { id: string; width: number }) => void;
  addActiveComponentTop: (payload: { id: string; top: number }) => void;
  addActiveComponentLeft: (payload: { id: string; left: number }) => void;
  //unsure of below
  addActiveComponentElementNote: (payload: {
    id: string;
    note: string;
  }) => void;
  addProject: (payload: {
    filename: string;
    lastSavedLocation: string;
  }) => void;
  changeActiveTab: (payload: number) => void;
  deleteProjectTab: (payload: number) => void;
  //unsure of below
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
  //unsure of below
  setImagePath: (payload: { [x: string]: string }) => void;
  changeLib: (payload: { libName: string }) => void;
  changeLibComponentDisplay: (payload: {
    displaylibComponent: boolean;
  }) => void;
  //unsure of below
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
  text: string;
  id: string;
  children: {
    id: string,
    class: string
    binding: string
  }[];
  class: string;
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  note: string;
  binding: string;
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
};

//used in Canvas to resize rendered components
export type ResizePayload = {
    x: number,
    y: number,
    activeComponent: string,
    routeArray: [],
    activeComponentData: null | Component
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
  // look into html List any create type
  htmlList: HtmlElement[];
  noteList: string[];
  classList: string[];
  children: string[];
  actions: string[];
  props: string[];
  state: string[];
  parent: { [key: string]: Component };
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
