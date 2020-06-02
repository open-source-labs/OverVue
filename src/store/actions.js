import * as types from './types'

const actions = {

  // add selected parent to component
  // [types.addParent]: ({ commit }, payload) => {
  //   commit(types.ADD_PARENT, payload)
  // },

  // creates a new component in componentMap
  [types.registerComponent]: ({ state, commit }, payload) => {
    const { componentName } = payload
    if (!state.componentMap[componentName]) {
      commit(types.ADD_COMPONENT_TO_COMPONENT_MAP, payload)
      if (!state.parentSelected.length) {
        commit(
          types.ADD_COMPONENT_TO_ACTIVE_ROUTE_CHILDREN,
          payload.componentName
        )
      }

      commit(types.ADD_COMPONENT_TO_ACTIVE_ROUTE_IN_ROUTE_MAP, payload)

      let component = state.componentNameInputValue
      let value = state.componentChildrenMultiselectValue.map(component => {
        return state.componentMap[component]
      })

      if (state.parentSelected.length) {
        // we want to replace this with an 'add parent' mutation
        commit(types.ADD_PARENT, payload)
        // commit(types.UPDATE_ACTIVE_COMPONENT_CHILDREN_VALUE, [
        //   ...state.componentMap[state.activeComponent].children,
        //   payload.componentName
        // ])
      }

      commit(types.UPDATE_COMPONENT_CHILDREN_VALUE, { component, value })
      commit(types.UPDATE_COMPONENT_CHILDREN_MULTISELECT_VALUE, [])
      commit(types.UPDATE_COMPONENT_NAME_INPUT_VALUE, '')
      commit(types.SET_SELECTED_ELEMENT_LIST, [])
      commit(types.SET_ACTIVE_COMPONENT, '')
      // commit(types.PARENT_SELECTED, false)
      commit(types.PARENT_SELECTED, '')
    }
  },
  // sets component inside componentDisplay
  [types.setSelectedElementList]: ({ commit }, payload) => {
    if (payload) {
      commit(types.SET_SELECTED_ELEMENT_LIST, payload)
    }
  },

  [types.updateComponentPosition]: ({ commit }, payload) =>{
    /*  let payload = {
        x = x,
        y = y,
        activeComponent = this.activeComponent,
        routeArray = this.routes[this.activeRoute],
        activeComponentData = this.activeComponentData
      } */
    
    commit(types.UPDATE_COMPONENT_POSITION, payload)

  },
  [types.updateComponentLayer]: ({ commit }, payload) => {
    commit(types.UPDATE_COMPONENT_LAYER, payload)
  },

  // does the same as update component position, but needed to record the initial spot of the draggable resizeable in component display
  // or else undo/redo won't work
  [types.updateStartingPosition]: ({ commit }, payload) => {
    commit(types.UPDATE_COMPONENT_POSITION, payload)
  },

  [types.updateStartingSize]: ({ commit }, payload) => {
    commit(types.UPDATE_COMPONENT_SIZE, payload)
  },

  [types.updateComponentSize]: ({ commit }, payload) => {
    commit(types.UPDATE_COMPONENT_SIZE,payload)
  },


  // adds component to the homeQueue
  [types.addToSelectedElementList]: ({ commit }, payload) => {
    commit(types.ADD_TO_SELECTED_ELEMENT_LIST, payload)
  },
  [types.addToComponentElementList]: ({ commit }, payload) => {
    commit(types.ADD_TO_COMPONENT_HTML_LIST, payload)
  },
  /**
   * @module: UNUSED?
   */
  [types.setClickedElementList]: ({ commit }, payload) => {
    commit(types.SET_CLICKED_ELEMENT_LIST, payload)
  },
  [types.deleteActiveComponent]: ({ state, commit }) => {
    commit(types.DELETE_ACTIVE_COMPONENT)
    let activeRouteArray = [...state.routes[state.activeRoute]]
    let newActiveRouteArray = activeRouteArray.filter(componentData => {
      return state.activeComponent !== componentData.componentName
    })
    commit(types.SET_ACTIVE_ROUTE_ARRAY, newActiveRouteArray)
    commit(types.SET_ACTIVE_COMPONENT, '')
  },
  [types.deleteSelectedElement]: ({ commit }, payload) => {
    commit(types.DELETE_SELECTED_ELEMENT, payload)
  },
  [types.setState]: ({ commit }, payload) => {
    commit(types.SET_STATE, payload)
  },
  [types.addProject]: ({ commit }, payload) => {
    commit(types.ADD_PROJECT, payload)
  },
  [types.deleteFromComponentHtmlList]: ({ commit }, payload) => {
    commit(types.DELETE_FROM_COMPONENT_HTML_LIST, payload)
  },
  [types.changeActiveTab]: ({ commit }, payload) => {
    commit(types.CHANGE_ACTIVE_TAB, payload)
  },
  // used by OpenProjectComponent.vue
  // [types.setComponentMap]: ({ commit }, payload) => {
  //   commit(types.SET_COMPONENT_MAP, payload)
  // },
  [types.addRouteToRouteMap]: ({ state, commit }, payload) => {
    commit(types.ADD_ROUTE, payload)
    commit(types.SET_ACTIVE_ROUTE, payload)
    let route = state.activeRoute
    let children = []
    commit(types.ADD_ROUTE_TO_COMPONENT_MAP, { route, children })
    let component = 'App'
    let value = state.componentMap[state.activeRoute].componentName
    commit(types.ADD_COMPONENT_TO_COMPONENT_CHILDREN, { component, value })
  },
  [types.setActiveRoute]: ({ commit }, payload) => {
    commit(types.SET_ACTIVE_ROUTE, payload)
  },
  // sets active component when clicked in componentDisplay
  [types.setActiveComponent]: ({ commit }, payload) => {
    commit(types.SET_ACTIVE_COMPONENT, payload)
  },
  [types.setActiveHTML]: ({ commit }, payload) => {
    commit(types.SET_ACTIVE_HTML_ELEMENT, payload)
  },
  // [types.setRoutes]: ({ commit }, payload) => {
  //   commit(types.SET_ROUTES, payload)
  // },
  [types.deleteProjectTab]: ({ commit }, payload) => {
    commit(types.DELETE_PROJECT_TAB, payload)
  },
  [types.updateComponentChildrenMultiselectValue]: ({ commit }, payload) => {
    commit(types.UPDATE_COMPONENT_CHILDREN_MULTISELECT_VALUE, payload)
  },
  [types.updateActiveComponentChildrenValue]: ({ commit }, payload) => {
    console.log('payload', payload)
    commit(types.UPDATE_ACTIVE_COMPONENT_CHILDREN_VALUE, payload)
  },
  [types.updateComponentNameInputValue]: ({ commit }, payload) => {
    commit(types.UPDATE_COMPONENT_NAME_INPUT_VALUE, payload)
  },
  [types.updateOpenModal]: ({ commit }, payload) => {
    commit(types.UPDATE_OPEN_MODAL, payload)
  },
  [types.parentSelected]: ({ commit }, payload) => {
    commit(types.PARENT_SELECTED, payload)
  },
  [types.deleteRoute]: ({ state, commit }, payload) => {
    commit(types.DELETE_ROUTE, payload)
  },
  [types.deleteComponent]: ({ state, commit }, payload) => {
    console.log('payload in actions:', payload)
    commit(types.DELETE_COMPONENT, payload)
  },
  [types.importImage]: ({ commit }, payload) => {
    commit(types.IMPORT_IMAGE, payload)
  },
  [types.clearImage]: ({ commit }, payload) => {
    commit(types.CLEAR_IMAGE, payload)
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
  // [types.setImagePath]: ({ commit }, payload) => {
  //   console.log('image payload', payload)
  //   commit(types.SET_IMAGE_PATH, payload)
  // },
  [types.openProject]: ({ commit }, payload) => {
    // open project imagePath, componentPath, routePath
    // console.log('image', payload.imagePath)
    // console.log('component', payload.componentMap)
    // console.log('route', payload.routes)
    commit(types.SET_IMAGE_PATH, payload.imagePath)
    commit(types.SET_COMPONENT_MAP, payload.componentMap)
    commit(types.SET_ROUTES, payload.routes)
  }
}

export default actions
