/* eslint-disable no-unused-vars */
/* eslint-disable guard-for-in */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
import localforage from "localforage";
import * as types from "./types";

import {
  breadthFirstSearch,
  breadthFirstSearchParent,
} from "../utils/search.util";
import _ from "lodash";


const cloneDeep = require("lodash.clonedeep");

const mutations = {
  // invoked on undo, resetsstate to a cdeep clone of the initial state
  [types.EMPTY_STATE]: (state, payload) => {
    payload.store.replaceState(cloneDeep(payload.initialState));
  },

  [types.REMOVE_ALL_STATE_PROPS_ACTIONS]: (state) => {
    const emptyObj = {
      userProps: [],
      userState: [],
      userActions: [],
    }
    Object.assign(state, emptyObj)
  },

  [types.TOGGLE_TUTORIAL]: (state) => {
    if (state.tutorialFirstOpen === true) {
      state.tutorialFirstOpen = false;
    }
    state.showTutorial = !state.showTutorial;
  },

  // *** ROUTES *** //////////////////////////////////////////////
  [types.ADD_ROUTE]: (state, payload) => {
    state.routes = {
      ...state.routes,
      [payload]: [],
    };
    state.imagePath[payload] = "";
  },

  [types.ADD_ROUTE_TO_COMPONENT_MAP]: (state, payload) => {
    const { route, children } = payload;
    state.componentMap = {
      ...state.componentMap,
      [route]: {
        componentName: route,
        children,
        htmlList: [],
      },
    };
  },

  [types.DELETE_ROUTE]: (state, payload) => {
    const newRoutes = { ...state.routes };
    const newMap = { ...state.componentMap };
    const newImagePath = { ...state.imagePath };
    // deletes all components in route
    const deleteChildren = (child) => {
      if (newMap[child.componentName].children.length) {
        child.children.forEach((grandchild) => {
          deleteChildren(grandchild);
        });
      }
      delete newMap[child.componentName];
    };
    newRoutes[payload].forEach((child) => {
      deleteChildren(child);
    });

    delete newRoutes[payload];
    delete newMap[payload];
    delete newImagePath[payload];

    newMap.App.children = newMap.App.children.filter(
      (route) => route !== payload
    );
    if (!newRoutes[state.activeRoute]) state.activeRoute = "HomeView";
    state.routes = newRoutes;
    state.componentMap = newMap;
    state.imagePath = newImagePath;
  },

  [types.SET_ACTIVE_ROUTE]: (state, payload) => {
    state.activeRoute = payload;
  },
  // invoked when a component is deleted, removes from routes
  [types.SET_ACTIVE_ROUTE_ARRAY]: (state, payload) => {
    state.routes[state.activeRoute] = payload;
  },
  // sets initial routes object, invoked when project is created
  [types.SET_ROUTES]: (state, payload) => {
    state.routes = { ...payload };
  },

  // *** END ROUTES *** //////////////////////////////////////////////

  // *** VUEX *** //////////////////////////////////////////////


  [types.EXPORT_AS_TYPESCRIPT]: (state, payload) => {
    state.exportAsTypescript = payload;
  },

  [types.CREATE_ACTION]: (state, payload) => {
    state.userActions.push(payload);
    state.userActions.sort();
  },

  [types.ADD_ACTION_SELECTED]: (state, payload) => {
    state.selectedActions = payload;
  },

  [types.ADD_ACTION_TO_COMPONENT]: (state, payload) => {
    const active = state.componentMap[state.activeComponent];

    if (!active.actions) {
      active.actions = payload;
    } else {
      for (const action of payload) {
        if (!active.actions.includes(action)) {
          active.actions.push(action);
        }
      }
    }
    state.selectedActions = [];
    // super weird code, minor changes to objects are not reactive
    // setting to null and then resetting to object makes it reactive
    // state.activeComponentObj = null;
    // state.activeComponentObj = active;
    state.activeComponentObj = { ...active };

    state.componentMap = {
      ...state.componentMap,
      [state.activeComponent]: state.activeComponentObj,
    };
  },

  [types.CREATE_PROP]: (state, payload) => {
    state.userProps.push(payload);
    state.userProps.sort();
  },

  [types.ADD_PROPS_SELECTED]: (state, payload) => {
    state.selectedProps = payload;
  },

  [types.ADD_PROPS_TO_COMPONENT]: (state, payload) => {
    const active = state.componentMap[state.activeComponent];

    if (!active.props) {
      active.props = payload;
    } else {
      for (const prop of payload) {
        if (!active.props.includes(prop)) {
          active.props.push(prop);
        }
      }
    }
    state.selectedProps = [];
    state.activeComponentObj = { ...active };

    state.componentMap = {
      ...state.componentMap,
      [state.activeComponent]: state.activeComponentObj,
    };
  },

  [types.CREATE_STATE]: (state, payload) => {
    state.userState.push(payload);
    state.userState.sort();
  },

  [types.ADD_STATE_SELECTED]: (state, payload) => {
    state.selectedState = payload;
    // state.selectedActions.push(payload);
  },

  [types.ADD_STATE_TO_COMPONENT]: (state, payload) => {
    // const active = state.activeComponentObj;
    const active = state.componentMap[state.activeComponent];

    if (!state.activeComponentObj.state) {
      state.activeComponentObj.state = payload;
    } else {
      for (const s of payload) {
        if (!state.activeComponentObj.state.includes(s)) {
          state.activeComponentObj.state.push(s);
        }
      }
    }
    state.selectedState = [];
    state.activeComponentObj = { ...active };

    state.componentMap = {
      ...state.componentMap,
      [state.activeComponent]: state.activeComponentObj,
    };
  },

  [types.DELETE_ACTION_FROM_COMPONENT]: (state, payload) => {
    state.componentMap[state.activeComponent].actions = state.componentMap[state.activeComponent].actions.filter(
      (action) => action !== payload);
  },

  [types.DELETE_PROPS_FROM_COMPONENT]: (state, payload) => {
    state.componentMap[state.activeComponent].props = state.componentMap[state.activeComponent].props.filter(
      (prop) => prop !== payload);
  },

  [types.DELETE_STATE_FROM_COMPONENT]: (state, payload) => {
    state.componentMap[state.activeComponent].state = state.componentMap[state.activeComponent].state.filter(
      (state) => state !== payload);
  },

  [types.DELETE_USER_STATE]: (state, payload) => {
    // need to loop through components and take out matching state
    for (const component in state.componentMap) {
      // first don't go through if component is App or Homeview
      if (component === "App" || component === "HomeView") continue;
      // splice out if there is a match
      state.componentMap[component].state = state.componentMap[component].state.filter(
        (action) => action !== payload);
    }
    // remove from userState
    let index = state.userState.indexOf(payload);
    state.userState.splice(index, 1);
  },

  [types.DELETE_USER_ACTIONS]: (state, payload) => {
    for (const component in state.componentMap) {
      // first don't go through if component is App or Homeview
      if (component === "App" || component === "HomeView") continue;
      // splice out if there is a match
      state.componentMap[component].actions = state.componentMap[component].actions.filter(
        (action) => action !== payload);
    }
    let index = state.userActions.indexOf(payload);
    state.userActions.splice(index, 1);
  },
  // copy and paste functionality
  [types.COPY_ACTIVE_COMPONENT]: (state) => {
    // copy activeComponentObj and place in the state but without children
    const copy = { ...state.activeComponentObj };
    // copy.componentName;
    copy.children = [];
    copy.isActive = false;
    state.copiedComponent = copy;
    // reset the number of copies created
    state.copyNumber = 0;
  },
  [types.UPDATE_PASTE_TIMER]: (state) => {
    state.pasteTimer = Date.now() + 1000;
  },

  [types.PASTE_ACTIVE_COMPONENT]: (state) => {
    // check if copied exists
    if (state.copiedComponent) {
      const { copiedComponent } = state;
      // offset duplicate's coordinates
      const pastedComponent = { ...copiedComponent };
      pastedComponent.x = 20;
      pastedComponent.y = 20;
      pastedComponent.componentName += ` (${state.copyNumber})`
      while (state.componentMap.hasOwnProperty(pastedComponent.componentName)) {
        pastedComponent.componentName += ` copy`
      }
      state.componentMap[pastedComponent.componentName] = pastedComponent;

      // increment copyNumber
      state.copyNumber += 1;
      // track for pastedComponent
      state.pastedComponent = pastedComponent;
    }
  },

  // *** EDIT FUNCTIONALITY *** //////////////////////////////////////////////

  [types.EDIT_COMPONENT_NAME]: (state, payload) => {
    // extract active to ensure change is made in routes
    const active = state.routes[state.activeRoute].filter(
      (comp) => comp.componentName === state.activeComponent
    )[0];
    const temp = active.componentName;

    // edit component name in routes
    active.componentName = payload;

    // edit active component object's name
    state.activeComponentObj = {
      ...state.activeComponentObj,
      componentName: payload,
    };

    // update activeComponent
    state.activeComponent = payload;

    // updating component map component, create new key value based on new name, delete old value
    state.componentMap[state.activeComponent] = {
      ...state.componentMap[temp],
      componentName: payload,
    };
    delete state.componentMap[temp];

    // updating component map, finding old value within children array, updating to new value
    // change enitre child array to make reactive
    for (const item of Object.values(state.componentMap)) {
      if (item.children.includes(temp)) {
        const newArray = [...item.children];
        newArray[newArray.indexOf(temp)] = payload;
        item.children = newArray;
      }
    }

    for (const item of Object.values(state.componentMap)) {
      if (item.parent) {
        const objectCheck = Object.keys(item.parent);
        if (objectCheck[0] === temp) {
          item.parent[payload] = state.componentMap[state.activeComponent];
          delete item.parent[temp];
        }
      }
    }
  },

  // *** HTML ELEMENTS *** //////////////////////////////////////////////

  [types.ADD_NESTED_HTML]: (state, payload) => {
    const componentName = state.activeComponent;
    const { activeHTML } = state;
    state.componentMap[componentName] = {
      ...state.componentMap[componentName],
    };
    const nestedElement = breadthFirstSearch(
      state.componentMap[componentName].htmlList,
      activeHTML
    );
    nestedElement.children.push({
      text: payload.elementName,
      id: payload.date,
      children: [],
      class: ''
    });
  },

  [types.ADD_NESTED_NO_ACTIVE]: (state, payload) => {
    const componentName = state.activeComponent;
    const { activeLayer } = state;
    state.componentMap[componentName] = {
      ...state.componentMap[componentName],
    };
    const nestedElement = breadthFirstSearch(
      state.componentMap[componentName].htmlList,
      activeLayer.id
    );
    nestedElement.children.push({
      text: payload.elementName,
      id: payload.date,
      children: [],
      class: ''
    });
  },

  [types.ADD_TO_COMPONENT_HTML_LIST]: (state, payload) => {
    const componentName = state.activeComponent;
    state.componentMap[componentName] = {
      ...state.componentMap[componentName],
    };
    state.componentMap[componentName].htmlList.push({
      text: payload.elementName,
      id: payload.date,
      children: [],
      class: ''
    });
  },

  [types.ADD_TO_SELECTED_ELEMENT_LIST]: (state, payload) => {
    state.selectedElementList.push({
      text: payload.elementName,
      id: payload.date,
      children: [],
      class: ''
    });
  },

  [types.DELETE_FROM_COMPONENT_HTML_LIST]: (state, id) => {
    const componentName = state.activeComponent;
    const htmlList = state.componentMap[componentName].htmlList.slice(0);
    // splice out selected element and return resulting array
    if (state.activeLayer.id === "") {
      for (let i = 0; i < htmlList.length; i++) {
        if (htmlList[i].id === id) {
          htmlList.splice(i, 1);
          break;
        }
      }
    } else {
      const element = breadthFirstSearchParent(htmlList, id);
      element.evaluated.children.splice(element.index, 1);
    }
    if (id === state.activeHTML) {
      state.activeHTML = "";
    }
    let newCompMap = state.componentMap;
    newCompMap[componentName].htmlList = htmlList;
    state.componentMap = Object.assign({}, newCompMap);
  },

  // deletes a element html tag from HTMLQueue
  [types.DELETE_SELECTED_ELEMENT]: (state, payload) => {
    state.selectedElementList.splice(payload, 1);
  },

  [types.SET_ACTIVE_HTML_ELEMENT]: (state, payload) => {
    if (payload[0] === "") {
      state.activeHTML = "";
    } else {
      state.activeHTML = payload[2];
    }
  },

  [types.SET_ACTIVE_LAYER]: (state, payload) => {
    const newLayer = cloneDeep(state.activeLayer);
    newLayer.lineage.push(payload.text);
    newLayer.id = payload.id;
    state.activeLayer = newLayer;
    state.activeHTML = "";
  },

  [types.SET_CLICKED_ELEMENT_LIST]: (state, payload) => {
    const componentName = state.activeComponent;
    state.componentMap[componentName].htmlList = payload;
  },

  [types.SET_SELECTED_ELEMENT_LIST]: (state, payload) => {
    state.selectedElementList = payload;
  },

  [types.UP_ONE_LAYER]: (state, payload) => {
    if (state.activeLayer.lineage.length === 1) {
      state.activeLayer = {
        id: "",
        lineage: [],
      };
    } else {
      const newID = breadthFirstSearchParent(
        state.componentMap[state.activeComponent].htmlList,
        payload
      );
      const newLayer = { ...state.activeLayer };
      newLayer.id = newID.evaluated.id;
      newLayer.lineage.pop();
      state.activeLayer = newLayer;
    }
    state.activeHTML = "";
  },

  // *** COMPONENTS *** //////////////////////////////////////////////
  // adds the component to the selected route (ex: HomeView)
  [types.ADD_COMPONENT_TO_ACTIVE_ROUTE_CHILDREN]: (state, payload) => {
    state.componentMap[state.activeRoute].children.push(payload);
  },

  // places the component inside the same route map (ie. homeview)
  [types.ADD_COMPONENT_TO_ACTIVE_ROUTE_IN_ROUTE_MAP]: (state, payload) => {
    state.routes[state.activeRoute].push(payload);
  },
  // invoked when a new route is created
  [types.ADD_COMPONENT_TO_COMPONENT_CHILDREN]: (state, payload) => {
    const { component, value } = payload;
    state.componentMap[component].children.push(value);
  },
  // pushs new component to componentMap
  [types.ADD_COMPONENT_TO_COMPONENT_MAP]: (state, payload) => {
    const {
      componentName,
      htmlList,
      children,
      parent,
      isActive,
      actions,
      props,
      htmlAttributes,
    } = payload;
    const s = payload.state;
    state.componentMap = {
      ...state.componentMap,
      [componentName]: {
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
        state: s,
        htmlAttributes,
      },
    };
  },

  [types.ADD_PARENT]: (state, payload) => {
    state.componentMap[payload.componentName].parent[state.parentSelected] =
      state.componentMap[state.parentSelected];
    state.componentMap[state.parentSelected].children.push(
      payload.componentName
    );
  },

  [types.ADD_COPIED_PARENT]: (state, payload) => {
    const parentSelected = Object.values(payload.parent)[0].componentName;
    // push into parent's children array
    state.componentMap[parentSelected].children.push(payload.componentName);
  },

  [types.DELETE_ACTIVE_COMPONENT]: (state) => {
    const { componentMap, activeComponent, activeRoute } = state;

    const newObj = { ...componentMap };
    // save the children of the active component
    // and make sure they are placed as children of the active route or they will be lost to the graph.

    const activeObjChildrenArray = newObj[activeComponent].children;

    activeObjChildrenArray.forEach((child) => {
      delete newObj[child].parent[activeComponent];
    });

    delete newObj[activeComponent];

    // goes in to make sure no children are the selected component any longer
    for (const compKey in newObj) {
      const { children } = newObj[compKey];
      children.forEach((child, index) => {
        if (activeComponent === child) {
          children.splice(index, 1);
          // removes component from activeComponent's htmlList
          newObj[compKey].htmlList = newObj[compKey].htmlList.filter(
            (el) => el !== activeComponent
          );
        }
      });
    }

    newObj[activeRoute].children.push(...activeObjChildrenArray);
    state.componentMap = newObj;
  },

  [types.PARENT_SELECTED]: (state, payload) => {
    state.parentSelected = payload;
  },

  [types.SET_ACTIVE_COMPONENT]: (state, payload) => {
    if (!payload) {
      payload = '';
    }
    if (payload === '') {
      state.activeComponent = '';
      state.activeComponentObj = { componentName: '', isActive: false };
      state.activeHTML = "";
      state.activeLayer = {
        id: "",
        lineage: [],
      };
    } else {
      state.activeComponent = payload;
      state.activeComponentObj = state.routes[state.activeRoute].filter(
        (comp) => comp.componentName === state.activeComponent
      )[0];
    }
    state.activeHTML = "";
    state.activeLayer = {
      id: "",
      lineage: [],
    };
  },

  [types.SET_COMPONENT_MAP]: (state, payload) => {
    state.componentMap = payload;
  },
  // executed when a new component is made
  // also invoked when a child is added to the parent from the sidebar (EditSidebar or HomeSidebar?)
  // also invoked when clicked on invoking the modal-view
  // event: @ VueMultiselect
  [types.UPDATE_COMPONENT_CHILDREN_MULTISELECT_VALUE]: (state, payload) => {
    state.componentChildrenMultiselectValue = payload;
  },
  // executed when a new component is made
  // additionally adds children to the component
  [types.UPDATE_COMPONENT_CHILDREN_VALUE]: (state, payload) => {
    const { componentName, value } = payload;
    state.componentMap[componentName].children = value;
  },

  [types.UPDATE_COMPONENT_NAME_INPUT_VALUE]: (state, payload) => {
    state.componentNameInputValue = payload;
  },

  [types.UPDATE_COMPONENT_POSITION]: (state, payload) => {
    const updatedComponent = state.routes[state.activeRoute].filter(
      (element) => element.componentName === payload.activeComponent
    )[0];
    updatedComponent.x = payload.x;
    updatedComponent.y = payload.y;
  },

  [types.UPDATE_COMPONENT_SIZE]: (state, payload) => {
    const updatedComponent = state.routes[state.activeRoute].filter(
      (element) => element.componentName === payload.activeComponent
    )[0];

    updatedComponent.h = payload.h;
    updatedComponent.w = payload.w;
    updatedComponent.x = payload.x;
    updatedComponent.y = payload.y;
  },
  //color updater
  [types.UPDATE_COLOR]: (state, payload) => {
    const updatedComponent = state.routes[state.activeRoute].filter(
      (element) => element.componentName === payload.activeComponent
    )[0];
    
    updatedComponent.color = payload.color
  },
//Attribute updater for parent
  [types.EDIT_ATTRIBUTE]: (state, payload) => {
    const updatedComponent = state.routes[state.activeRoute].filter(
      (element) => element.componentName === payload.activeComponent
    )[0];
    updatedComponent.htmlAttributes[payload.attribute] = payload.value
  },

  [types.UPDATE_COMPONENT_LAYER]: (state, payload) => {
    const updatedComponent = state.routes[state.activeRoute].filter(
      (element) => element.componentName === payload.activeComponent
    )[0];
    updatedComponent.z = payload.z;
    state.componentMap[payload.activeComponent].z = payload.z;
  },

  [types.UPDATE_ACTIVE_COMPONENT_CHILDREN_VALUE]: (state, payload) => {
    //temp is the activeComponent's children array
    if (state.activeComponent === payload) { return }
    const temp = state.componentMap[state.activeComponent].children;
    // delete block
    if ((temp.filter((el) => payload === el)).length > 0) {
      //commented stuff below does not seem necessary for the functionality of this if block.
      //children will be current children EXCLUDING payload
      // const child = temp.filter((el) => payload.includes(el));
      let childCount = 0;
      const components = Object.values(state.componentMap);
      for (const comp of components) {
        if (comp.children.includes(payload)) childCount++; //if the component has 2 parents, do not assign the component to the route
      }
      state.componentMap[state.activeComponent].children = (temp.filter((el) => payload !== el));
      if (childCount <= 1) {
        state.componentMap[state.activeRoute].children.push(...temp.filter((el) => payload === el));
      }
      // const newHTMLList = state.componentMap[
      //   state.activeComponent
      // ].htmlList.filter((el) => el !== child[0]);
      // state.componentMap[state.activeComponent].htmlList = newHTMLList;
      // const newMap = { ...state.componentMap };
      // state.componentMap = { ...newMap };
      delete state.componentMap[payload].parent[state.activeComponent];
      // add block
    } else {
      const child = temp;
      child.push(payload)
      state.componentMap[state.activeComponent].children = child;
      state.componentMap[state.activeRoute].children = state.componentMap[
        state.activeRoute
      ].children.filter((el) => payload !== el);
      state.componentMap[child[child.length - 1]].parent[state.activeComponent] =
        state.componentMap[state.activeComponent];
    }
  },
  // invoked when element is double clicked, changing the boolean value
  [types.UPDATE_OPEN_MODAL]: (state, payload) => {
    state.modalOpen = payload;
  },

  [types.ADD_ACTIVE_COMPONENT_NOTE]: (state, payload) => {
    if (!state.componentMap[state.activeComponent].hasOwnProperty('noteList')) {
      state.componentMap[state.activeComponent].noteList = [];
    }
    while (state.componentMap[state.activeComponent].noteList.includes(payload)) {
      payload = 'DUPLICATE: ' + payload
    }
    state.componentMap[state.activeComponent].noteList.push(payload)
  },

  [types.DELETE_ACTIVE_COMPONENT_NOTE]: (state, payload) => {
    state.componentMap[state.activeComponent].noteList.forEach((el, ind) => {
      if (payload === el) {
        state.componentMap[state.activeComponent].noteList.splice(ind, 1)
        return;
      }
    })
  },

  [types.OPEN_NOTE_MODAL]: (state) => {
    state.noteModalOpen = !state.noteModalOpen;
  }, 
  
  [types.OPEN_COLOR_MODAL]: (state) => {
    state.colorModalOpen = !state.colorModalOpen;
  },
  //Jace practice for future, not place classList directly in activeComponent
  [types.OPEN_ATTRIBUTE_MODAL]: (state) => {
    state.attributeModalOpen = !state.attributeModalOpen;
  },

  [types.ADD_ACTIVE_COMPONENT_CLASS]: (state, payload) => {
    state.componentMap[state.activeComponent].htmlList.forEach((el) => {
      if (payload.id === el.id) {
        el.class = payload.class
      }
    })
  },
  [types.DELETE_ACTIVE_COMPONENT_CLASS]: (state, payload) => {
    state.componentMap[state.activeComponent].classList.forEach((el, ind) => {
      if (payload === el) {
        state.componentMap[state.activeComponent].classList.splice(ind, 1)
        return;
      }
    })
  },
  // *** PROJECTS *** //////////////////////////////////////////////

  [types.ADD_PROJECT]: (state, payload) => {
    state.projects = [];
    state.projects.push(payload);
    state.projectNumber++;
  },
  [types.CHANGE_ACTIVE_TAB]: (state, payload) => {
    state.activeTab = payload;
  },

  [types.DELETE_PROJECT_TAB]: (state, payload) => {
    state.projects.splice(payload, 1);
    localforage.getItem(state.projects[payload - 1].filename).then((data) => {
      state = data;
    });
    state.activeTab -= 1;
  },
  // *** IMAGES *** //////////////////////////////////////////////

  [types.IMPORT_IMAGE]: (state, payload) => {
    state.imagePath = {
      ...state.imagePath,
      [payload.route]: payload.img.replace(/\\/g, "/"),
    };
  },
  [types.CLEAR_IMAGE]: (state, payload) => {
    if (state.imagePath[payload.route]) state.imagePath[payload.route] = "";
  },
  [types.SET_IMAGE_PATH]: (state, payload) => {
    state.imagePath = { ...state.imagePath, ...payload };
  },

  // *** INACTIVE MUTATIONS - kept for reference *** //////////////////////////////////////////////

  // [types.SET_STATE]: (state, payload) => {
  //   Object.assign(state, payload)
  // },
  // [types.DELETE_USER_ACTIONS]: (state, payload) => {
  //   // payload should be a string of the name of the action to remove
  //   let index = state.userActions.indexOf(payload)
  //   state.userActions.splice(index, 1)
  // },
  // [types.ADD_USER_ACTION]: (state, payload) => {
  //   if (typeof payload === 'string') state.userActions.push(payload)
  // },
  // [types.ADD_TO_USER_STORE]: (state, payload) => {
  //   const key = Object.keys(payload)
  //   state.userStore[key] = payload[key]
  // },
  // [types.DELETE_USER_STATE]: (state, payload) => {
  //   delete state.userStore[payload]
  // },
  // [types.REMOVE_ACTION_FROM_COMPONENT]: (state, payload) => {
  //   let index = state.componentMap[state.activeComponent].mapActions.indexOf(
  //     payload
  //   )
  //   state.componentMap[state.activeComponent].mapActions.splice(index, 1)
  // },
  // [types.ADD_TO_COMPONENT_ACTIONS]: (state, payload) => {
  //   state.componentMap[state.activeComponent].componentActions.push(payload)
  // },
  // [types.ADD_TO_COMPONENT_STATE]: (state, payload) => {
  //   state.componentMap[state.activeComponent].componentState.push(payload)
  // },
  // [types.REMOVE_STATE_FROM_COMPONENT]: (state, payload) => {
  //   let prop = state.componentMap[state.activeComponent].componentState
  //   prop.splice(prop.indexOf(payload), 1)
  // },
  // [types.DELETE_COMPONENT]: (state, payload) => {
  //   const stateCopy = state
  //   let compArr = stateCopy.routes[stateCopy.activeRoute]
  //   for (let i = 0; i < compArr.length; i++) {
  //     if (compArr[i].componentName == payload.componentName) {
  //       compArr.splice(i, 1)
  //     }
  //   }
  //   delete state.componentMap[payload.componentName]
  //   state.routes[state.activeRoute] = compArr
  //   // console.log('new state', state)
  // }
};

export default mutations;
