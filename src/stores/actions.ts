import {
  breadthFirstSearch,
  breadthFirstSearchParent,
} from "src/utils/search.util";

import { toRaw } from "vue";
import { State, Actions, Component, HtmlElement } from "../../types";
import { Store } from "pinia";
import localforage from "localforage";
// *** GLOBAL *** //////////////////////////////////////////////
// @ts-ignore
const actions: Store<"main", State, {}, Actions> = {
  emptyState() {
    this.$reset();
  },

// action for changing state of options API and composition API
  compositionToggle() {
    this.composition = !this.composition;
  },

  removeAllStatePropsActions() {
    this.$patch({
      userProps: [],
      userState: [],
      userActions: [],
    });
  },

  toggleTutorial() {
    if (this.tutorialFirstOpen === true) {
      this.tutorialFirstOpen = false;
    }
    this.showTutorial = !this.showTutorial;
  },

  // *** END GlOBAL *** //////////////////////////////////////////////

  // *** ROUTES *** //////////////////////////////////////////////

  addRoute(payload) {
    this.routes[payload] = [];
    this.imagePath[payload] = "";
  },

  addRouteToComponentMap(payload) {
    const { route, children } = payload;
    this.componentMap[route] = {
      componentName: route,
      children,
      htmlList: [],
    };
  },

  deleteRoute(payload) {
    const deleteChildren = (child: Component | String): void => {
      if (
        this.componentMap[(child as Component).componentName].children.length
      ) {
        (child as Component).children.forEach((grandchild) => {
          deleteChildren(grandchild);
        });
      }
      delete this.componentMap[(child as Component).componentName];
    };

    delete this.routes[payload];
    delete this.componentMap[payload];
    delete this.imagePath[payload];

    this.componentMap.App.children = this.componentMap.App.children.filter(
      (route: string) => route !== payload
    );

    if (!this.routes[this.activeRoute]) this.activeRoute = "";
  },

  setActiveRoute(payload) {
    this.activeRoute = payload;
  },

  setActiveRouteArray(payload) {
    this.routes[this.activeRoute] = payload;
  },

  setRoutes(payload) {
    this.routes = { ...payload };
  },

  addRouteToRouteMap(payload) {
    this.addRoute(payload);
    this.setActiveRoute(payload);
    const route = this.activeRoute;
    const children: string[] = [];

    this.addRouteToComponentMap({ route, children });

    const component = "App";
    const value = this.componentMap[this.activeRoute].componentName;

    this.addComponentToComponentChildren({ component, value });
  },

  // *** END ROUTES *** //////////////////////////////////////////////

  // *** VUEX EXPORT *** //////////////////////////////////////////////

  //function is capitalized as to not cause conflicts with state
  ExportAsTypescript(payload) {
    this.exportAsTypescript = payload;
  },

  ExportOauth(payload) {
    this.exportOauth = payload;
  },

  ExportOauthGithub(payload) {
    this.exportOauthGithub = payload;
  },

  toggleMode(payload) {
    this.mode = payload;
  },
  exportTest(payload) {
    this.importTest = payload;
  },

  createAction(payload) {
    this.userActions.push(payload);
    this.userActions.sort();
  },

  addActionSelected(payload) {
    this.selectedActions = payload;
  },

  addActionToComponent(payload) {
    const active = this.componentMap[this.activeComponent] as Component;

    if (!active.actions) active.actions = payload;
    else {
      for (const action of payload) {
        if (!active.actions.includes(action)) active.actions.push(action);
      }
    }

    this.selectedActions = [];
    this.activeComponentObj = { ...active };
    this.componentMap[this.activeComponent] = this.activeComponentObj;
  },

  createProp(payload) {
    this.userProps.push(payload);
    this.userProps.sort();
  },

  addPropsSelected(payload) {
    this.selectedProps = payload;
  },

  addPropsToComponent(payload) {
    const active = this.componentMap[this.activeComponent] as Component;

    if (!active.props) active.props = payload;
    else {
      for (const prop of payload) {
        if (!active.props.includes(prop)) active.props.push(prop);
      }
    }

    this.selectedProps = [];
    this.activeComponentObj = { ...active };
    this.componentMap[this.activeComponent] = this.activeComponentObj;
  },

  createState(payload) {
    this.userState.push(payload);
    this.userState.sort();
  },

  addStateSelected(payload) {
    this.selectedState = payload;
  },

  addStateToComponent(payload) {
    const active = this.componentMap[this.activeComponent] as Component;

    if (!active.state) active.state = payload;
    else {
      for (const s of payload) {
        if (!active.state.includes(s)) active.state.push(s);
      }
    }

    this.selectedState = [];
    this.activeComponentObj = { ...active };
    this.componentMap[this.activeComponent] = this.activeComponentObj;
  },

  deleteActionFromComponent(payload) {
    const active = this.componentMap[this.activeComponent] as Component;
    active.actions = active.actions.filter(
      (action: string) => action !== payload
    );
  },

  deletePropsFromComponent(payload) {
    const active = this.componentMap[this.activeComponent] as Component;
    active.props = active.props.filter((prop: string) => prop !== payload);
  },

  deleteStateFromComponent(payload) {
    const active = this.componentMap[this.activeComponent] as Component;
    active.state = active.state.filter((state: string) => state !== payload);
  },

  deleteUserState(payload) {
    // need to loop through components and take out matching state
    for (const component in this.componentMap) {
      // first don't go through if component is App or Homeview
      if (component === "App" || component === "HomeView") continue;
      // filter out if there is a match
      const active = this.componentMap[component] as Component;
      active.state = active.state.filter((state: string) => state !== payload);
    }
    // remove from userState
    let index = this.userState.indexOf(payload);
    this.userState.splice(index, 1);
  },

  deleteUserActions(payload) {
    for (const component in this.componentMap) {
      // first don't go through if component is App or Homeview
      if (component === "App" || component === "HomeView") continue;
      // splice out if there is a match
      const active = this.componentMap[component] as Component;
      active.actions = active.actions.filter(
        (action: string) => action !== payload
      );
    }
    let index = this.userActions.indexOf(payload);
    this.userActions.splice(index, 1);
  },

  copyActiveComponent() {
    const copy = { ...this.activeComponentObj } as Component;
    copy.children = [];
    copy.isActive = false;
    this.copiedComponent = copy;
    // reset the number of copies created
    this.copyNumber = 0;
  },

  updatePasteTimer() {
    this.pasteTimer = Date.now() + 1000;
  },

  pasteActiveComponent() {
    //if nothing is copied, don't commit anything
    if (!(this.copiedComponent as Component).componentName) {
      return;
    }
    if (Date.now() < this.pasteTimer) {
      return;
    } else {
      this.updatePasteTimer(); //throttles pasting
    }

    if (this.copiedComponent) {
      const copiedComponent = this.copiedComponent;
      const pastedComponent = { ...copiedComponent } as Component;

      pastedComponent.x = 20;
      pastedComponent.y = 20;
      pastedComponent.componentName += ` (${this.copyNumber})`;
      while (this.componentMap.hasOwnProperty(pastedComponent.componentName)) {
        pastedComponent.componentName += ` copy`;
      }
      this.componentMap[pastedComponent.componentName] = pastedComponent;

      // increment copyNumber
      this.copyNumber += 1;
      // track for pastedComponent
      this.pastedComponent = pastedComponent;
    }

    // if no other parents, update as parent of active route in componentMap
    if (!Object.keys((this.pastedComponent as Component).parent).length) {
      this.addComponentToActiveRouteChildren(
        (this.pastedComponent as Component).componentName
      );
      // if parents, update parent of pastedComponent to include as a child
    } else {
      this.addCopiedParent(this.pastedComponent as Component);
    }
    // add pastedComponent as a child of route in activeRoutes
    this.addComponentToActiveRouteInRouteMap(this.pastedComponent as Component);
  },

  // *** END VUEX EXPORT *** //////////////////////////////////////////////

  // EDIT FUNCTIONALITY

  editComponentName(payload) {
    // extract active to ensure change is made in routes
    const active = this.routes[this.activeRoute].filter(
      (comp) => comp.componentName === this.activeComponent
    )[0];
    const temp = active.componentName;

    // edit component name in routes
    active.componentName = payload;

    // edit active component object's name
    if (this.activeComponentObj)
      this.activeComponentObj.componentName = payload;

    // update activeComponent
    this.activeComponent = payload;

    // updating component map component, create new key value based on new name, delete old value
    this.componentMap[this.activeComponent] = {
      ...this.componentMap[temp],
      componentName: payload,
    };
    delete this.componentMap[temp];

    // updating component map, finding old value within children array, updating to new value
    // change enitre child array to make reactive
    for (const item of Object.values(this.componentMap)) {
      if (item.children.includes(temp)) {
        const newArray = [...item.children];
        newArray[newArray.indexOf(temp)] = payload;
        item.children = newArray;
      }
    }

    for (const item of Object.values(this.componentMap) as Component[]) {
      if (item.parent) {
        const objectCheck = Object.keys(item.parent);
        if (objectCheck[0] === temp) {
          item.parent = this.componentMap[this.activeComponent] as Component;
          // delete item.parent[temp];
        }
      }
    }

    //update the the htmlList, find child components within the htmlLists with the old value, update it to the new value
    for (const item of Object.values(this.componentMap)) {
      if (item.htmlList) {
        const newArray = [...item.htmlList];

        const changeAllChildComponents = (
          array: HtmlElement[],
          name: string
        ) => {
          const queue = [...array.filter((el) => typeof el === "object")];
          while (queue.length) {
            const evaluate = queue.shift() as HtmlElement;
            if (evaluate.text === name) {
              evaluate.text = payload;
            }
            for (let i = 0; i < evaluate.children.length; i++) {
              if (evaluate.children[i].text === name) {
                evaluate.children[i].text = payload;
              }
              if (evaluate.children.length) {
                queue.push(...evaluate.children);
              }
            }
          }
        };

        changeAllChildComponents(newArray, temp);
        item.htmlList = newArray;
      }
    }
  },

  // HTML ELEMENTS

  // assigned as to a function
  addNestedHTML(payload) {
    const componentName = this.activeComponent;
    const { activeHTML } = this;
    this.componentMap[componentName] = {
      ...this.componentMap[componentName],
    };
    const nestedElement = breadthFirstSearch(
      this.componentMap[componentName].htmlList,
      activeHTML
    );
    nestedElement.children.push({
      text: payload.elementName,
      id: payload.date,
      children: [],
      class: "",
      x: 0,
      y: 0,
      z: 0,
      w: 0,
      h: 0,
      note: "",
    });
  },

  clearActiveHTML() {
    this.activeHTML = "";
  },

  addNestedNoActive(payload) {
    const componentName = this.activeComponent;
    const { activeLayer } = this;
    this.componentMap[componentName] = {
      ...this.componentMap[componentName],
    };
    const nestedElement = breadthFirstSearch(
      this.componentMap[componentName].htmlList,
      activeLayer.id
    );
    nestedElement.children.push({
      text: payload.elementName,
      id: payload.date,
      children: [],
      class: "",
      x: 0,
      y: 0,
      z: 0,
      w: 0,
      h: 0,
      note: "",
      binding: "",
    });
  },

  addToComponentElementList(payload) {
    const componentName = this.activeComponent;
    this.componentMap[componentName] = {
      ...this.componentMap[componentName],
    };
    this.componentMap[componentName].htmlList.push({
      text: payload.elementName,
      id: payload.date,
      children: [],
      class: "",
      x: 0,
      y: 0,
      z: 0,
      w: 0,
      h: 0,
      note: "",
      binding: "",
    });
  },

  addToSelectedElementList(payload) {
    this.selectedElementList.push({
      text: payload.elementName,
      id: payload.date,
      children: [],
      class: "",
      x: 0,
      y: 0,
      z: 0,
      w: 0,
      h: 0,
      note: "",
      binding: "",
    });
  },

  deleteFromElementHtmlList(payload): void {
    // find ID of html element in htmlList (of activeComponent)
    const componentName = this.activeComponent;
    const htmlList = toRaw(this.componentMap[componentName].htmlList);

    const deleteNested = (array: HtmlElement[]): void => {
      for (let i = 0; i < array.length; i++) {
        if (array[i].id === payload) {
          array.splice(i, 1);
        } else {
          if (array[i].children.length) deleteNested(array[i].children);
        }
      }
    };

    deleteNested(htmlList);
  },
  setComponentDetailsTab(payload) {
    this.componentDetailsTab = payload;
  },

  setActiveHTML(payload) {
    if (payload[0] === "") {
      this.activeHTML = "";
    } else {
      // changed from payload[2] after deprecating HTMLQueue
      this.activeHTML = payload[1];
    }
  },

  setActiveLayer(payload) {
    const newLayer = { ...this.activeLayer };
    newLayer.lineage.push(payload.text);
    newLayer.id = payload.id;
    this.activeLayer = newLayer;
    this.activeHTML = "";
  },

  setClickedElementList(payload) {
    const componentName = this.activeComponent;
    this.componentMap[componentName].htmlList = payload;
  },

  setSelectedElementList(payload) {
    this.selectedElementList = payload;
  },

  upOneLayer(payload) {
    if (this.activeLayer.lineage.length === 1) {
      this.activeLayer = {
        id: "",
        lineage: [],
      };
    } else {
      const newID = breadthFirstSearchParent(
        this.componentMap[this.activeComponent].htmlList,
        payload
      ) as {
        evaluated: HtmlElement;
        index: number;
      };
      const newLayer = { ...this.activeLayer };

      newLayer.id = newID.evaluated.id;
      newLayer.lineage.pop();
      this.activeLayer = newLayer;
    }
    this.activeHTML = "";
  },
  // OverVue v.10.0 –– Drag and Drop for Tree Nodes
  setActiveTreeNode(payload) {
    this.activeTreeNode = payload;
  },

  setPotentialParentNode(payload) {
    this.potentialParentNode = payload;
  },

  moveNode(payload) {
    if (payload === this.potentialParentNode) return; //edge case: current component cannot drag onto itself

    // current node being dragged is payload
    // potential parent this.potentialParentNode

    const componentMapAtPayload = JSON.parse(
      JSON.stringify(this.componentMap[payload])
    );

    // store parent in variable
    const oldParent = componentMapAtPayload.parent.componentName;

    // Do nothing if dragging to current parent
    if (oldParent === this.potentialParentNode) return;

    // remove payload inside oldParent children array
    const index = this.componentMap[oldParent].children.indexOf(payload);
    if (index !== -1) this.componentMap[oldParent].children.splice(index, 1);

    this.componentMap[this.potentialParentNode].children.push(payload);

    // Change parent of payload
    this.componentMap[payload].parent =
      this.componentMap[this.potentialParentNode];

    // remember to clear potential parent
    this.potentialParentNode = "";
  },

  // !Drag-andDrop
  //store id of dragged html element in activeComponent
  setIdDrag(payload) {
    const componentName = this.activeComponent;
    const active = this.componentMap[componentName] as Component;
    active.idDrag = payload;
  },

  //store id of html element whose place the dragged html element is dropped on in activeComponent
  setIdDrop(payload) {
    const componentName = this.activeComponent;
    const active = this.componentMap[componentName] as Component;
    active.idDrop = payload;
  },

  //store id of dragged selected html element when creating a component
  setSelectedIdDrag(payload) {
    this.selectedIdDrag = payload;
  },

  //store id of html element whose place the dragged selected html element will be dropped when creating a component
  setSelectedIdDrop(payload) {
    this.selectedIdDrop = payload;
  },

  // use idDrag and idDrop to rearrange the htmlList of the activeComponent to perform drag-and-drop functionality
  dragDropSortHtmlElements() {
    const componentName = this.activeComponent;
    const active = this.componentMap[componentName] as Component;
    const idDrag = active.idDrag;
    const idDrop = active.idDrop;

    if (idDrag !== idDrop && idDrag !== "" && idDrop !== "") {
      let indexDrag: number = 0;
      let indexDrop: number = 0;
      const htmlList = this.componentMap[componentName].htmlList.slice(0);

      if (this.activeLayer.id === "") {
        //find the indexes belonging to the html elements with idDrag and idDrop
        htmlList.forEach((el: HtmlElement, i: number) => {
          if (el.id === idDrag) {
            indexDrag = i;
          } else if (el.id === idDrop) {
            indexDrop = i;
          }
        });
        //use the indexes to rearrange htmlList
        const draggedEl = htmlList.splice(indexDrag, 1)[0];
        htmlList.splice(indexDrop, 0, draggedEl);
      } else {
        //Use breadFirstSearchParent to find the parent and indexes of nested html elements with idDrag and idDrop
        const nestedDrag = breadthFirstSearchParent(htmlList, idDrag) as {
          evaluated: HtmlElement;
          index: number;
        };
        const nestedDrop = breadthFirstSearchParent(htmlList, idDrop) as {
          evaluated: HtmlElement;
          index: number;
        };
        //use the indexes and parents to rearrange htmlList
        let nestedEl = nestedDrag.evaluated.children.splice(
          nestedDrag.index,
          1
        )[0];
        nestedDrop.evaluated.children.splice(nestedDrop.index, 0, nestedEl);
      }
      this.componentMap[componentName].htmlList = htmlList;
    }
    //reset the ids
    active.idDrag = "";
    active.idDrop = "";
  },

  // use selectedIdDrag and selectedIdDrop to rearrange the selectedElementList to perform drag-and-drop functionality
  dragDropSortSelectedHtmlElements() {
    const selectedIdDrag = this.selectedIdDrag;
    const selectedIdDrop = this.selectedIdDrop;

    if (
      selectedIdDrag !== selectedIdDrop &&
      selectedIdDrag !== "" &&
      selectedIdDrop !== ""
    ) {
      const htmlList = this.selectedElementList.slice(0);

      let indexDrag: number = 0;
      let indexDrop: number = 0;
      //find the indexes belonging to the html elements with the selectedIdDrag and selectedIdDrop
      htmlList.forEach((el: { id: string | number }, i: number) => {
        if (el.id === selectedIdDrag) {
          indexDrag = i;
        } else if (el.id === selectedIdDrop) {
          indexDrop = i;
        }
      });
      //use the indexes to delete the dragged element and place them into the new location
      const draggedEl = htmlList.splice(indexDrag, 1)[0];
      htmlList.splice(indexDrop, 0, draggedEl);
      this.selectedElementList = htmlList;
    }
    //reset the ids
    this.selectedIdDrag = "";
    this.selectedIdDrop = "";
  },

  // END OF EDIT FUNCTIONALITY SECTION

  // *** COMPONENTS *** //////////////////////////////////////////////
  registerComponent(payload) {
    /* this action has a lot of mutations deployed
    Because we have to initialize a whole bunch of propertiess
    which are determined by the choices made on the left hand panel
     */
    const { componentName } = payload;
    // if the component name doesn't already exist,
    // then add the component to the display
    if (!this.componentMap[componentName]) {
      this.addComponentToComponentMap(payload);
      // if the component isn't already a child,
      // add it as child to the homeview display
      if (!this.parentSelected.length) {
        this.addComponentToActiveRouteChildren(payload.componentName);
      }

      this.addComponentToActiveRouteInRouteMap(payload);

      if (this.parentSelected.length) {
        this.addParent(payload);
      }
      this.updateComponentNameInputValue("");
      this.setSelectedElementList([]);
      this.setActiveComponent(componentName);
      this.parentSelect("");
    }
  },

  addComponentToActiveRouteChildren(payload) {
    this.componentMap[this.activeRoute].children.push(payload);
  },

  addComponentToActiveRouteInRouteMap(payload) {
    this.routes[this.activeRoute].push(payload);
  },

  addComponentToComponentChildren(payload) {
    const { component, value } = payload;
    this.componentMap[component].children.push(value);
  },

  addComponentToComponentMap(payload) {
    const {
      componentName,
      htmlList,
      children,
      parent,
      isActive,
      actions,
      props,
      idDrag,
      idDrop,
      htmlAttributes,
      color,
      state,
    } = payload;

    this.componentMap[componentName] = {
      componentName,
      x: 0,
      y: 0,
      z: 0,
      w: 200,
      h: 200,
      children,
      parent,
      htmlList,
      isActive,
      actions,
      props,
      state,
      idDrag,
      idDrop,
      htmlAttributes,
      color,
    };
  },

  addParent(payload) {
    this.componentMap[payload.componentName].parent =
      this.componentMap[this.parentSelected];
    this.componentMap[this.parentSelected].children.push(payload.componentName);
  },

  // Used in Canvas.vue (untested)
  addCopiedParent(payload) {
    const parentSelected: string = payload.parent.componentName;
    // push into parent's children array
    this.componentMap[parentSelected].children.push(payload.componentName);
  },

  deleteActiveComponent() {
    if (this.noteModalOpen === true) {
      return;
    }
    const { componentMap, activeComponent, activeRoute } = this;

    const newObj = { ...componentMap };

    const activeObjChildrenArray = newObj[activeComponent].children;

    activeObjChildrenArray.forEach((child) => {
      // delete (newObj[child] as Component).parent[activeComponent];
      newObj[child].parent = this.componentMap[activeRoute];
    });

    delete newObj[activeComponent];

    for (const compKey in newObj) {
      const { children } = newObj[compKey];
      children.forEach((child, index) => {
        if (activeComponent === child) {
          children.splice(index, 1);
          // removes component from activeComponent's htmlList
          newObj[compKey].htmlList = newObj[compKey].htmlList.filter(
            //this used to be el !== activeComponent. However this was comparing an object to a string
            (el) => el.text !== activeComponent
          );
        }
      });
    }

    newObj[activeRoute].children.push(...activeObjChildrenArray);
    this.componentMap = newObj;

    const activeRouteArray = [...this.routes[this.activeRoute]];
    const newActiveRouteArray = activeRouteArray.filter(
      (componentData) => this.activeComponent !== componentData.componentName
    );
    this.setActiveRouteArray(newActiveRouteArray);
    this.setActiveComponent("");
  },

  parentSelect(payload) {
    this.parentSelected = payload;
  },

  setActiveComponent(payload) {
    if (!payload) {
      payload = "";
    }
    if (payload === "") {
      this.activeComponent = "";
      this.activeComponentObj = { componentName: "", isActive: false };
      this.activeHTML = "";
      this.activeLayer = {
        id: "",
        lineage: [],
      };
    } else {
      this.activeComponent = payload;
      this.activeComponentObj = this.componentMap[
        this.activeComponent
      ] as Component;
    }
    this.activeHTML = "";
    this.activeLayer = {
      id: "",
      lineage: [],
    };
  },

  setComponentMap(payload) {
    this.componentMap = payload;
  },

  updateComponentNameInputValue(payload) {
    this.componentNameInputValue = payload;
  },

  // updates state to code snippet component position
  updateComponentPosition(payload) {
    // filter to find component in the state routes array
    const updatedComponent = this.routes[this.activeRoute].filter(
      (element) => element.componentName === payload.activeComponent
    )[0];
    // update component x and y to reflect vue draggable resizeable position on canvas
    updatedComponent.x = payload.x;
    updatedComponent.y = payload.y;
  },

  // updates state to code snippet component grid area
  updateComponentGridPosition(payload) {
    // filter to find component in the state routes array
    const updatedComponent = this.routes[this.activeRoute].filter(
      (element) => element.componentName === payload.activeComponent
    )[0];
    // update CSS grid grid area fr [Y beginning, Y end + 1, x beginning, x end + 1]
    if (updatedComponent.w === undefined) {
      updatedComponent.w = (2 * this.containerW) / this.gridLayout[0];
    }
    if (updatedComponent.h === undefined) {
      updatedComponent.h = (2 * this.containerH) / this.gridLayout[1];
    }
    // add one - CSS grid-area is one-indexed
    const rowStart =
      1 +
      Math.round((this.gridLayout[1] * updatedComponent.y) / this.containerH);
    const colStart =
      1 +
      Math.round((this.gridLayout[0] * updatedComponent.x) / this.containerW);
    const rowEnd =
      1 +
      Math.round(
        (this.gridLayout[1] * (updatedComponent.y + updatedComponent.h)) /
          this.containerH
      );
    const colEnd =
      1 +
      Math.round(
        (this.gridLayout[0] * (updatedComponent.x + updatedComponent.w)) /
          this.containerW
      );
    updatedComponent.htmlAttributes.gridArea = [
      rowStart,
      colStart,
      rowEnd,
      colEnd,
    ];
  },

  updateComponentSize(payload) {
    const updatedComponent = this.routes[this.activeRoute].filter(
      (element) => element.componentName === payload.activeComponent
    )[0];
    (updatedComponent.h as number | undefined) = payload.h;
    (updatedComponent.w as number | undefined) = payload.w;
    updatedComponent.x = payload.x;
    updatedComponent.y = payload.y;
  },

  updateColor(payload) {
    const updatedComponent = this.routes[this.activeRoute].filter(
      (element) => element.componentName === payload.activeComponent
    )[0];

    updatedComponent.color = payload.color;
  },

  editAttribute(payload) {
    const updatedComponent = this.routes[this.activeRoute].filter(
      (element) => element.componentName === payload.activeComponent
    )[0];
    updatedComponent.htmlAttributes[payload.attribute] = payload.value;
  },

  updateComponentLayer(payload) {
    const updatedComponent = this.routes[this.activeRoute].filter(
      (element) => element.componentName === payload.activeComponent
    )[0];
    updatedComponent.z = payload.z;
    (this.componentMap[payload.activeComponent] as Component).z = payload.z;
  },

  updateHtmlLayer(payload) {
    const updatedComponent = this.routes[this.activeRoute].filter(
      (element) => element.componentName === payload.activeComponent
    )[0];

    const updatedHTML = updatedComponent.htmlList.filter(
      (element) => element.id === payload.activeHTML
    )[0];

    updatedHTML.z = payload.z;
  },

  updateActiveComponentChildrenValue(payload) {
    //temp is the activeComponent's children array
    if (this.activeComponent === payload) {
      return;
    }
    const temp = this.componentMap[this.activeComponent].children;
    // delete block
    if (temp.filter((el) => payload === el).length > 0) {
      //commented stuff below does not seem necessary for the functionality of this if block.
      let childCount = 0;
      const components = Object.values(this.componentMap);
      for (const comp of components) {
        if (comp.children.includes(payload)) childCount++; //if the component has 2 parents, do not assign the component to the route
      }
      this.componentMap[this.activeComponent].children = temp.filter(
        (el) => payload !== el
      );
      if (childCount <= 1) {
        this.componentMap[this.activeRoute].children.push(
          ...temp.filter((el) => payload === el)
        );
      }

      //delete the instances of the Child Component in the activeComponent's htmlList
      const componentName = this.activeComponent;
      const htmlList = this.componentMap[componentName].htmlList.slice(0);

      // splice out child componenets even if nested
      function deleteChildFromHtmlList(array: HtmlElement[], payload: string) {
        for (let i = array.length; i--; ) {
          if (array[i].children.length) {
            deleteChildFromHtmlList(array[i].children, payload);
          }
          if (array[i].text === payload) {
            array.splice(i, 1);
          }
        }
      }

      deleteChildFromHtmlList(htmlList, payload);
      const active = this.componentMap[payload] as Component;
      //updates the htmlList with the child components deleted
      this.componentMap[componentName].htmlList = htmlList;
    } else {
      const child = temp;
      child.push(payload);
      this.componentMap[this.activeComponent].children = child;
      this.componentMap[this.activeRoute].children = this.componentMap[
        this.activeRoute
      ].children.filter((el) => payload !== el);
      (this.componentMap[child[child.length - 1]] as Component).parent = this
        .componentMap[this.activeComponent] as Component;
    }
  },

  updateOpenModal(payload) {
    this.modalOpen = payload;
  },

  addActiveComponentNote(payload) {
    const active = this.componentMap[this.activeComponent] as Component;
    if (!this.componentMap[this.activeComponent].hasOwnProperty("noteList")) {
      active.noteList = [];
    }
    while (active.noteList.includes(payload)) {
      payload = "DUPLICATE: " + payload;
    }
    active.noteList.push(payload);
  },

  deleteActiveComponentNote(payload) {
    const active = this.componentMap[this.activeComponent] as Component;
    active.noteList.forEach((el, ind) => {
      if (payload === el) {
        active.noteList.splice(ind, 1);
        return;
      }
    });
  },

  openColorModal() {
    this.colorModalOpen = !this.colorModalOpen;
  },

  openNoteModal() {
    this.noteModalOpen = !this.noteModalOpen;
  },

  openAttributeModal() {
    this.attributeModalOpen = !this.attributeModalOpen;
  },

  addAttributes(payload) {
    //get the active component
    let added = false;
    const addRecursively = (htmlElement: HtmlElement) => {
      const attributeString: string = Object.keys(payload)[0];
      if (htmlElement.id === payload.id) {
        added = true;
        // callback(payload, htmlElement);
        htmlElement[attributeString] = payload[attributeString];
        return;
      }

      //base case: if the html list doesn't have children, return;
      if (!htmlElement.children) {
        return;
      } else {
        //iterate through the htmlList of activeComponent children
        for (let i = 0; i < htmlElement.children.length; i++) {
          if (added === false) {
            addRecursively(htmlElement.children[i]);
          } else return;
        }
      }
    };

    if ((this.activeComponentObj as Component).htmlList) {
      this.componentMap[this.activeComponent].htmlList.forEach(
        (htmlElement) => {
          if (added === false) {
            addRecursively(htmlElement);
          } else return;
        }
      );
    }
  },

  addActiveComponentClass(payload) {
    const active = this.activeComponentObj as Component;
    if (active.htmlList)
      this.componentMap[this.activeComponent].htmlList.forEach((el) => {
        //adding class into it's child 1st layer
        //if our element has children,
        if (el.children.length !== 0) {
          el.children.forEach(
            (element: { id: string | number; class: string }) => {
              if (payload.id === element.id) {
                element.class = payload.class;
              }
            }
          );
        }
        if (payload.id === el.id) {
          el.class = payload.class;
        }
      });
  },

  //payload: addBinding(bindingText, activeHTML as number)
  addBindingText(payload) {
    const active = this.activeComponentObj as Component;
    //access the htmlList, add payload to the empty bind obj
    if (payload.binding === "") return;
    else {
      //if the active component has an html list, iterate through the htmlList
      //check if each element in the html list has a
      if (active.htmlList)
        this.componentMap[this.activeComponent].htmlList.forEach((el) => {
          if (el.children.length !== 0) {
            el.children.forEach(
              (element: { id: string | number; binding: string | number }) => {
                if (payload.id === element.id) {
                  element.binding = payload.binding;
                }
              }
            );
          }
          if (payload.id === el.id) {
            el.binding = payload.binding;
          }
        });
    }
  },

  deleteActiveComponentClass(payload) {
    const active = this.componentMap[this.activeComponent] as Component;
    active.classList.forEach((el, ind) => {
      if (payload === el) {
        active.classList.splice(ind, 1);
        return;
      }
    });
  },

  addActiveComponentHeight(payload) {
    this.componentMap[this.activeComponent].htmlList.forEach((el) => {
      if (payload.id === el.id) {
        el.h = payload.height; //height = h on HtmlElement type
      }
    });
  },

  addActiveComponentWidth(payload) {
    this.componentMap[this.activeComponent].htmlList.forEach((el) => {
      if (payload.id === el.id) {
        el.w = payload.width;
      }
    });
  },

  addActiveComponentTop(payload) {
    this.componentMap[this.activeComponent].htmlList.forEach((el) => {
      if (payload.id === el.id) {
        el.x = payload.top;
      }
    });
  },

  addActiveComponentLeft(payload) {
    this.componentMap[this.activeComponent].htmlList.forEach((el) => {
      if (payload.id === el.id) {
        el.y = payload.left;
      }
    });
  },

  addActiveComponentElementNote(payload) {
    this.componentMap[this.activeComponent].htmlList.forEach((el) => {
      if (payload.id === el.id) {
        el.note = payload.note;
      }
    });
  },

  // *** END COMPONENTS *** //////////////////////////////////////////////

  // PROJECTS

  addProject(payload) {
    this.projects = [];
    this.projects.push(payload);
    this.projectNumber++;
  },

  changeActiveTab(payload) {
    this.activeTab = payload;
  },

  deleteProjectTab(payload) {
    this.projects.splice(payload, 1);
    //imported localforage from module, like our mutations.js did
    localforage.getItem(this.projects[payload - 1].filename).then((data) => {
      let store = data;
    });
    this.activeTab -= 1;
  },

  openProject(payload) {
    this.removeAllStatePropsActions();
    this.setActiveRoute("HomeView");
    payload.userProps.forEach((prop) => {
      this.createProp(prop);
    });
    payload.userActions.forEach((action) => {
      this.createAction(action);
    });
    payload.userState.forEach((state) => {
      this.createState(state);
    });
    this.setImagePath(payload.imagePath);
    this.setComponentMap(payload.componentMap);
    this.setRoutes(payload.routes);
    this.setActiveComponent("");
  },

  // *** END PROJECTS *** //////////////////////////////////////////////

  // IMAGES

  importImage(payload) {
    this.imagePath[payload.route] = payload.img.replace(/\\/g, "/");
  },

  clearImage(payload) {
    if (this.imagePath[payload.route]) this.imagePath[payload.route] = "";
  },

  setImagePath(payload) {
    this.imagePath = { ...this.imagePath, ...payload };
  },

  changeLib(payload) {
    this.importLibraries.push(payload.libName);
  },

  changeLibComponentDisplay(payload) {
    this.displaylibComponent = payload.displaylibComponent;
  },

  addLibComponents(payload) {
    for (let key in payload) {
      this.icons[key] = payload[key];
    }
  },

  changeGridDensity(payload) {
    if (payload.direction === "height") {
      this.gridLayout[1] = payload.densityNum;
    } else {
      this.gridLayout[0] = payload.densityNum;
    }
    this.routes[this.activeRoute].forEach((updatedComponent) => {
      if (updatedComponent.w === undefined) {
        updatedComponent.w = (2 * this.containerW) / this.gridLayout[0];
      }
      if (updatedComponent.h === undefined) {
        updatedComponent.h = (2 * this.containerH) / this.gridLayout[1];
      }
      // add one - CSS grid-area is one-indexed
      const rowStart =
        1 +
        Math.round((this.gridLayout[1] * updatedComponent.y) / this.containerH);
      const colStart =
        1 +
        Math.round((this.gridLayout[0] * updatedComponent.x) / this.containerW);
      const rowEnd =
        1 +
        Math.round(
          (this.gridLayout[1] * (updatedComponent.y + updatedComponent.h)) /
            this.containerH
        );
      const colEnd =
        1 +
        Math.round(
          (this.gridLayout[0] * (updatedComponent.x + updatedComponent.w)) /
            this.containerW
        );
      updatedComponent.htmlAttributes.gridArea = [
        rowStart,
        colStart,
        rowEnd,
        colEnd,
      ];
      updatedComponent.x =
        ((colStart - 1) * this.containerH) / this.gridLayout[1];
      updatedComponent.y =
        ((rowStart - 1) * this.containerW) / this.gridLayout[0];
      updatedComponent.w =
        ((colEnd - 1) * this.containerH) / this.gridLayout[1] -
        updatedComponent.y;
      updatedComponent.h =
        ((rowEnd - 1) * this.containerW) / this.gridLayout[0] -
        updatedComponent.x;
    });
  },
};

export default actions;
