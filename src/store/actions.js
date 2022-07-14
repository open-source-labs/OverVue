/* eslint-disable max-len */
import * as types from "./types";

const actions = {
  // Actions that primarily affect Canvas.vue //////
  [types.deleteActiveComponent]: ({ state, commit }) => {
    if (state.noteModalOpen === true){
      return;
    }
    commit(types.DELETE_ACTIVE_COMPONENT);
    const activeRouteArray = [...state.routes[state.activeRoute]];
    const newActiveRouteArray = activeRouteArray.filter(
      (componentData) => state.activeComponent !== componentData.componentName
    );
    commit(types.SET_ACTIVE_ROUTE_ARRAY, newActiveRouteArray);
    commit(types.SET_ACTIVE_COMPONENT, "");
  },

  [types.parentSelected]: ({ commit }, payload) => {
    commit(types.PARENT_SELECTED, payload);
  },
  
  [types.addActiveComponentNote]: ({ commit }, payload) => {
    commit(types.ADD_ACTIVE_COMPONENT_NOTE, payload)
  },

  [types.deleteActiveComponentNote]: ({ commit }, payload) => {
    commit(types.DELETE_ACTIVE_COMPONENT_NOTE, payload)
  },

  [types.openNoteModal]: ({ commit }) => {
    commit(types.OPEN_NOTE_MODAL)
  },
  //test
  [types.openAttributeModal]: ({ commit }, payload) => {
    commit(types.OPEN_ATTRIBUTE_MODAL, payload)
  },

  [types.addActiveComponentClass]: ({ commit }, payload) => {
    commit(types.ADD_ACTIVE_COMPONENT_CLASS, payload)
  },

  [types.deleteActiveComponentClass]: ({ commit }, payload) => {
    commit(types.DELETE_ACTIVE_COMPONENT_CLASS, payload)
  },
  //
  [types.registerComponent]: ({ state, commit }, payload) => {
    /* this action has a lot of mutations deployed
    Because we have to initialize a whole bunch of properties
    which are determined by the choices made on the left hand panel
     */
    const { componentName } = payload;
    // if the component name doesn't already exist,
    // then add the component to the display
    if (!state.componentMap[componentName]) {
      commit(types.ADD_COMPONENT_TO_COMPONENT_MAP, payload);
      // if the component isn't already a child,
      // add it as child to the homeview display
      if (!state.parentSelected.length) {
        commit(
          types.ADD_COMPONENT_TO_ACTIVE_ROUTE_CHILDREN,
          payload.componentName
        );
      }

      commit(types.ADD_COMPONENT_TO_ACTIVE_ROUTE_IN_ROUTE_MAP, payload);

      const value = state.componentChildrenMultiselectValue.map(
        (component) => state.componentMap[component]
      );

      if (state.parentSelected.length) {
        commit(types.ADD_PARENT, payload);
      }

      commit(types.UPDATE_COMPONENT_CHILDREN_VALUE, { componentName, value });
      commit(types.UPDATE_COMPONENT_CHILDREN_MULTISELECT_VALUE, []);
      commit(types.UPDATE_COMPONENT_NAME_INPUT_VALUE, "");
      commit(types.SET_SELECTED_ELEMENT_LIST, []);
      commit(types.SET_ACTIVE_COMPONENT, "");
      commit(types.PARENT_SELECTED, "");
    }
  },

  [types.toggleTutorial]: ({ commit }) => {
    commit(types.TOGGLE_TUTORIAL)
  },
  
  [types.setActiveComponent]: ({ commit }, payload) => {
    commit(types.SET_ACTIVE_COMPONENT, payload);
  },

  [types.updateActiveComponentChildrenValue]: ({ commit }, payload) => {
    commit(types.UPDATE_ACTIVE_COMPONENT_CHILDREN_VALUE, payload);
  },

  [types.updateComponentChildrenMultiselectValue]: ({ commit }, payload) => {
    commit(types.UPDATE_COMPONENT_CHILDREN_MULTISELECT_VALUE, payload);
  },

  [types.updateComponentLayer]: ({ commit }, payload) => {
    commit(types.UPDATE_COMPONENT_LAYER, payload);
  },

  [types.updateComponentPosition]: ({ commit }, payload) => {
    commit(types.UPDATE_COMPONENT_POSITION, payload);
  },

  [types.updateComponentSize]: ({ commit }, payload) => {
    commit(types.UPDATE_COMPONENT_SIZE, payload);
  },

  // copy the active component
  [types.copyActiveComponent]: ({ commit }, payload) => {
    commit(types.COPY_ACTIVE_COMPONENT);
  },
  // paste the active component copy
  [types.pasteActiveComponent]: ({ commit, state }) => {
    //if nothing is copied, don't commit anything
    if (!state.copiedComponent.componentName){
      return
    }
    if (Date.now() < state.pasteTimer){
      return;
    } else {
      commit(types.UPDATE_PASTE_TIMER) //throttles pasting
    }
    commit(types.PASTE_ACTIVE_COMPONENT);
    // if no other parents, update as parent of active route in componentMap
    if (!Object.keys(state.pastedComponent.parent).length) {
      commit(
        types.ADD_COMPONENT_TO_ACTIVE_ROUTE_CHILDREN,
        state.pastedComponent.componentName
      );
      // if parents, update parent of pastedComponent to include as a child
    } else {
      commit(types.ADD_COPIED_PARENT, state.pastedComponent);
    }
    // add pastedComponent as a child of route in activeRoutes
    commit(
      types.ADD_COMPONENT_TO_ACTIVE_ROUTE_IN_ROUTE_MAP,
      state.pastedComponent
    );
  },
  // End of Canvas Section//////////////////////////////////

  // Actions that affect Routing //////////////////////////////////////

  [types.addRouteToRouteMap]: ({ state, commit }, payload) => {
    commit(types.ADD_ROUTE, payload);
    commit(types.SET_ACTIVE_ROUTE, payload);
    const route = state.activeRoute;
    const children = [];
    commit(types.ADD_ROUTE_TO_COMPONENT_MAP, { route, children });
    const component = "App";
    const value = state.componentMap[state.activeRoute].componentName;
    commit(types.ADD_COMPONENT_TO_COMPONENT_CHILDREN, { component, value });
  },

  [types.changeActiveTab]: ({ commit }, payload) => {
    commit(types.CHANGE_ACTIVE_TAB, payload);
  },

  [types.clearImage]: ({ commit }, payload) => {
    commit(types.CLEAR_IMAGE, payload);
  },

  [types.deleteRoute]: ({ commit }, payload) => {
    commit(types.DELETE_ROUTE, payload);
  },

  [types.importImage]: ({ commit }, payload) => {
    commit(types.IMPORT_IMAGE, payload);
  },

  [types.setActiveRoute]: ({ state, commit }, payload) => {
    if (state.routes[payload].length === 0){
      commit(types.SET_ACTIVE_COMPONENT, '');
    } 
    commit(types.SET_ACTIVE_ROUTE, payload);
  },

  // End of Routing section //////////////////////////////////////////

  // Vuex ///////////////////////////////////////////////

  [types.createAction]: ({ commit }, payload) => {
    commit(types.CREATE_ACTION, payload);
  },

  [types.addActionSelected]: ({ commit }, payload) => {
    commit(types.ADD_ACTION_SELECTED, payload);
  },

  [types.addActionToComponent]: ({ commit }, payload) => {
    commit(types.ADD_ACTION_TO_COMPONENT, payload);
  },

  [types.createProp]: ({ commit }, payload) => {
    commit(types.CREATE_PROP, payload);
  },

  [types.addPropsSelected]: ({ commit }, payload) => {
    commit(types.ADD_PROPS_SELECTED, payload);
  },

  [types.addPropsToComponent]: ({ commit }, payload) => {
    commit(types.ADD_PROPS_TO_COMPONENT, payload);
  },

  [types.createState]: ({ commit }, payload) => {
    commit(types.CREATE_STATE, payload);
  },

  [types.addStateSelected]: ({ commit }, payload) => {
    commit(types.ADD_STATE_SELECTED, payload);
  },

  [types.addStateToComponent]: ({ commit }, payload) => {
    commit(types.ADD_STATE_TO_COMPONENT, payload);
  },

  [types.deleteActionFromComponent]: ({ commit }, payload) => {
    commit(types.DELETE_ACTION_FROM_COMPONENT, payload);
  },

  [types.deletePropsFromComponent]: ({ commit }, payload) => {
    commit(types.DELETE_PROPS_FROM_COMPONENT, payload);
  },

  [types.deleteStateFromComponent]: ({ commit }, payload) => {
    commit(types.DELETE_STATE_FROM_COMPONENT, payload);
  },
  // Delete user actions from vuex store
  [types.deleteUserActions]: ({ state, commit }, payload) => {
    commit(types.DELETE_USER_ACTIONS, payload);
  },

  [types.deleteUserState]: ({ state, commit }, payload) => {
    // loops through component map and deletes all props
    commit(types.DELETE_USER_STATE, payload);
  },

  // End of Vuex Actions section //////////////////////////////////////////

  // Action primarily for edit functionality////////////////////////////////////////
  [types.editComponentName]: ({ commit }, payload) => {
    commit(types.EDIT_COMPONENT_NAME, payload);
  },

  // Actions dispatched from left hand panel////////////////////////////////////////

  [types.addToComponentElementList]: ({ commit }, payload) => {
    // adds element to the HTMLQueue
    commit(types.ADD_TO_COMPONENT_HTML_LIST, payload);
  },

  [types.addToSelectedElementList]: ({ commit }, payload) => {
    commit(types.ADD_TO_SELECTED_ELEMENT_LIST, payload);
  },

  [types.updateComponentNameInputValue]: ({ commit }, payload) => {
    commit(types.UPDATE_COMPONENT_NAME_INPUT_VALUE, payload);
  },

  // end of left hand panel/////////////////////////

  // HTML Element related actions ////////////////////

  [types.addNestedHTML]: ({ commit }, payload) => {
    commit(types.ADD_NESTED_HTML, payload);
  },

  [types.addNestedNoActive]: ({ commit }, payload) => {
    commit(types.ADD_NESTED_NO_ACTIVE, payload);
  },

  [types.deleteFromComponentHtmlList]: ({ commit }, payload) => {
    commit(types.DELETE_FROM_COMPONENT_HTML_LIST, payload);
  },

  [types.deleteSelectedElement]: ({ commit }, payload) => {
    commit(types.DELETE_SELECTED_ELEMENT, payload);
  },

  [types.setActiveHTML]: ({ commit }, payload) => {
    commit(types.SET_ACTIVE_HTML_ELEMENT, payload);
  },

  [types.setActiveLayer]: ({ commit }, payload) => {
    commit(types.SET_ACTIVE_LAYER, payload);
  },

  [types.setClickedElementList]: ({ commit }, payload) => {
    commit(types.SET_CLICKED_ELEMENT_LIST, payload);
  },

  [types.setSelectedElementList]: ({ commit }, payload) => {
    if (payload) {
      commit(types.SET_SELECTED_ELEMENT_LIST, payload);
    }
  },

  [types.upOneLayer]: ({ commit }, payload) => {
    commit(types.UP_ONE_LAYER, payload);
  },

  // end of HTML segment ////////////////////////////////////////////////

  // Loading ///////////////////////////////////////////////////////

  [types.openProject]: ({ commit }, payload) => {
    commit(types.REMOVE_ALL_STATE_PROPS_ACTIONS)
    commit(types.SET_ACTIVE_ROUTE, "HomeView");
    payload.userProps.forEach((prop)=>{commit(types.CREATE_PROP, prop)})
    payload.userActions.forEach((action)=>{commit(types.CREATE_ACTION, action)})
    payload.userState.forEach((state)=>{commit(types.CREATE_STATE, state)})
    commit(types.SET_IMAGE_PATH, payload.imagePath);
    commit(types.SET_COMPONENT_MAP, payload.componentMap);
    commit(types.SET_ROUTES, payload.routes);
    commit(types.SET_ACTIVE_COMPONENT, '')
  },

  // Add project
  [types.addProject]: ({ commit }, payload) => {
    commit(types.ADD_PROJECT, payload);
  },

  // end of loading///////////////////////////////////////////////////
};

// Action Graveyard/////////////////////////////////////////
// These actions are either not called or have been removed, maybe you have use for them so we kept them here

/*
[types.updateStartingPosition]: ({ commit }, payload) => {
  // does the same as update component position
  // but needed to record the initial spot of the ."draggable-resizeable" in Canvas.vue
  // or else undo/redo won't work
    commit(types.UPDATE_COMPONENT_POSITION, payload)
  },

  [types.updateStartingSize]: ({ commit }, payload) => {
    commit(types.UPDATE_COMPONENT_SIZE, payload)
  },

   [types.deleteUserActions]: ({ state, commit }, payload) => {
    console.log('invoking deleteUserActions')
    if (state.activeComponent) {
      commit(types.REMOVE_ACTION_FROM_COMPONENT, payload)
    }
    commit(types.DELETE_USER_ACTIONS, payload)
  },

  [types.removeActionFromComponent]: ({ state, commit }, payload) => {
    console.log('invoking removeActionFromComponent')
    commit(types.REMOVE_ACTION_FROM_COMPONENT, payload)
  },

  [types.removeStateFromComponent]: ({ commit }, payload) => {
    console.log('removeStateFromComponent invoked')
    commit(types.REMOVE_STATE_FROM_COMPONENT, payload)
  },

  [types.deleteUserState]: ({ state, commit }, payload) => {
    console.log('deleteUserState invoked')
    if (state.activeComponent) {
      commit(types.REMOVE_STATE_FROM_COMPONENT, payload)
    }
    // loops through component map and deletes all props
    Object.keys(state.componentMap).forEach(prop => {
      commit(types.SET_ACTIVE_COMPONENT, prop.componentName)
      commit(types.REMOVE_ACTION_FROM_COMPONENT, payload)
    })
    commit(types.DELETE_USER_STATE, payload)
  },

    [types.updateOpenModal]: ({ commit }, payload) => {
    commit(types.UPDATE_OPEN_MODAL, payload)
  },

   [types.addProject]: ({ commit }, payload) => {
    commit(types.ADD_PROJECT, payload)
  },

  [types.setState]: ({ commit }, payload) => {
    commit(types.SET_STATE, payload)
  },

  [types.deleteProjectTab]: ({ commit }, payload) => {
    commit(types.DELETE_PROJECT_TAB, payload)
  },

  [types.deleteComponent]: ({ state, commit }, payload) => {
    console.log('payload in actions:', payload)
    commit(types.DELETE_COMPONENT, payload)
  },

*/

export default actions;
