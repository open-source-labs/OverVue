import * as types from './types'

import localforage from 'localforage'

const mutations = {
  // pushs new component to componentMap
  [types.ADD_COMPONENT_TO_COMPONENT_MAP]: (state, payload) => {
    const { componentName, htmlList, children, isActive } = payload
    state.componentMap = {
      ...state.componentMap,
      [componentName]: {
        componentName,
        x: 0,
        y: 0,
        w: 200,
        h: 200,
        children,
        htmlList,
        isActive
      }
    }
  },
  // adds a html tag from the Icons.vue to the HomeQueue.vue
  // event: getClickedIcon @Icons.vue
  [types.ADD_TO_SELECTED_ELEMENT_LIST]: (state, payload) => {
    state.selectedElementList.push({ text: payload, children: [] })
  },
  // allows user to create a new component in ComponentDisplay.vue
  // invovled in creating a new component, porbably does more
  [types.SET_SELECTED_ELEMENT_LIST]: (state, payload) => {
    state.selectedElementList = payload
  },
  [types.ADD_TO_COMPONENT_HTML_LIST]: (state, elementName) => {
    const componentName = state.activeComponent
    state.componentMap[componentName].htmlList.push({
      text: elementName,
      children: []
    })
  },
  [types.DELETE_FROM_COMPONENT_HTML_LIST]: (state, id) => {
    const componentName = state.activeComponent
    const htmlList = state.componentMap[componentName].htmlList

    function parseAndDelete (htmlList) {
      htmlList.forEach((element, index) => {
        if (element.children.length > 0) {
          parseAndDelete(element.children)
        }
        if (id === element._id) {
          htmlList.splice(index, 1)
        }
      })

      let copied = htmlList.slice(0)
      state.componentMap[componentName].htmlList = copied
    }
    parseAndDelete(htmlList)
  },
  [types.SET_CLICKED_ELEMENT_LIST]: (state, payload) => {
    const componentName = state.activeComponent
    state.componentMap[componentName].htmlList = payload
  },
  // deletes selected component
  [types.DELETE_ACTIVE_COMPONENT]: state => {
    const { componentMap, activeComponent } = state

    let newObj = Object.assign({}, componentMap)

    delete newObj[activeComponent]

    for (let compKey in newObj) {
      let children = newObj[compKey].children
      children.forEach((child, index) => {
        if (activeComponent === child) children.splice(index, 1)
      })
    }
    state.componentMap = newObj
  },
  [types.SET_COMPONENT_MAP]: (state, payload) => {
    console.log(payload)
    state.componentMap = payload
  },
  // deletes a element html tag from HomeQueue
  [types.DELETE_SELECTED_ELEMENT]: (state, payload) => {
    state.selectedElementList.splice(payload, 1)
  },
  [types.SET_STATE]: (state, payload) => {
    console.log('SETTING STATE')
    console.log(payload)
    Object.assign(state, payload)
  },
  [types.ADD_PROJECT]: (state, payload) => {
    console.log('PUSHING ', payload)
    state.projects.push(payload)
    state.projectNumber++
  },
  [types.CHANGE_ACTIVE_TAB]: (state, payload) => {
    state.activeTab = payload
  },
  // adds a new route in the RouteDisplay
  [types.ADD_ROUTE]: (state, payload) => {
    state.routes = {
      ...state.routes,
      [payload]: []
    }
    console.log('payload in add_route', payload)
  },
  // Changes the component map
  [types.ADD_ROUTE_TO_COMPONENT_MAP]: (state, payload) => {
    const { route, children } = payload
    state.componentMap = {
      ...state.componentMap,
      [route]: {
        componentName: route,
        children
      }
    }
  },
  // changes the route map (ie. homeview -> homeview_2_test)
  [types.SET_ACTIVE_ROUTE]: (state, payload) => {
    state.activeRoute = payload
  },
  // probably places the component inside the same route map (ie. homeview)
  [types.ADD_COMPONENT_TO_ACTIVE_ROUTE_IN_ROUTE_MAP]: (state, payload) => {
    state.routes[state.activeRoute].push(payload)
  },
  // invoked when a component is selected
  [types.SET_ACTIVE_COMPONENT]: (state, payload) => {
    state.activeComponent = payload
  },
  [types.SET_ROUTES]: (state, payload) => {
    console.log('setroutespayload:', payload)
    state.routes = Object.assign({}, payload)
  },
  // invoked when a component is deleted
  //
  [types.SET_ACTIVE_ROUTE_ARRAY]: (state, payload) => {
    state.routes[state.activeRoute] = payload
  },
  // adds the component to the selected route (ex: HomeView)
  [types.ADD_COMPONENT_TO_ACTIVE_ROUTE_CHILDREN]: (state, payload) => {
    state.componentMap[state.activeRoute].children.push(payload)
  },
  [types.DELETE_PROJECT_TAB]: (state, payload) => {
    state.projects.splice(payload, 1)
    localforage.getItem(state.projects[payload - 1].filename).then(data => {
      state = data
    })
    state.activeTab = state.activeTab - 1
  },
  // executed when a new component is made
  // also invoked when a child is added to the parent from the sidebar (EditSidebar or HomeSidebar?)
  // also invoked when clicked on invoking the modal-view
  // event: @ VueMultiselect
  [types.UPDATE_COMPONENT_CHILDREN_MULTISELECT_VALUE]: (state, payload) => {
    state.componentChildrenMultiselectValue = payload
  },
  // executed when a new component is made
  // additionally addes children to the component
  [types.UPDATE_COMPONENT_CHILDREN_VALUE]: (state, payload) => {
    const { component, value } = payload
    state.componentMap[component].children = value
  },
  [types.UPDATE_ACTIVE_COMPONENT_CHILDREN_VALUE]: (state, payload) => {
    // original line
    state.componentMap[state.activeComponent].children = payload
    // state.componentMap[state.activeRoute].children = state.componentMap[state.activeRoute].children.filter(el => el !== payload[0])
    state.componentMap[state.activeRoute].children = state.componentMap[state.activeRoute].children.filter(el => !payload.includes(el))
  },
  // allows usr to change the name of component!!
  [types.UPDATE_COMPONENT_NAME_INPUT_VALUE]: (state, payload) => {
    state.componentNameInputValue = payload
  },
  // invoked when a new route is created
  [types.ADD_COMPONENT_TO_COMPONENT_CHILDREN]: (state, payload) => {
    const { component, value } = payload
    state.componentMap[component].children.push(value)
  },
  // invoked when element is double clicked, changing the boolean value
  [types.UPDATE_OPEN_MODAL]: (state, payload) => {
    state.modalOpen = payload
  },
  [types.PARENT_SELECTED]: (state, payload) => {
    state.parentSelected = payload
  },
  [types.DELETE_ROUTE]: (state, payload) => {
    const stateCopy = state
    delete stateCopy.routes[payload]
    delete stateCopy.componentMap[payload]
    state = stateCopy
    console.log('aftermutations state', state)
  }
}

export default mutations
