import * as types from './types'
import icons from './state/icons.js'
import htmlElementMap from './state/htmlElementMap.js'
const cloneDeep = require('lodash.clonedeep')
// import VuexStore from './index'
// import { getDefault, defaultState } from './state/index.js'

import localforage from 'localforage'

//we have to do a search because undo/redo saves payloads as deep clones so passing a memory ref would be detrimental
// This will find you the actual object by ID
const breadthFirstSearch = (array,id) => {
  let queue = [...array.filter(el => typeof el === 'object')];
  while(queue.length){
    let evaluated = queue.shift()
    if(evaluated.id === id){
      return evaluated
    }
    else{
      if (evaluated.children.length){
      queue.push(...evaluated.children)
      }
    }
  }
  console.log("We shouldn't be ever getting here, how did you even search an id that didn't exist?")
}

//this would find you the parent of a given id
const breadthFirstSearchParent = (array,id) => {
  let queue = [...array.filter(el => typeof el === 'object')];
  while(queue.length){
    let evaluated = queue.shift()
    for(let i=0; i<evaluated.children.length;i++){
    if(evaluated.children[i] === id){
      return evaluated
     }
    }
    if (evaluated.children.length){
      queue.push(...evaluated.children)
      }
  }
  console.log("We shouldn't be ever getting here, how did you even search an id that didn't exist?")
}

const mutations = {

  [types.SET_ACTIVE_LAYER]: (state, payload) =>{
    let newLayer = cloneDeep(state.activeLayer)

    //should only be reached if we change active component
    if (payload === '') {
      state.activeLayer = {
        id:'',
        lineage:[]
      }
    }
    else{
      //htmlArray = state.componentMap[state.activeComponent].htmlList
      if(newLayer.id === ''){
        newLayer.lineage.push(state.activeComponent)
      }
      else{
        newLayer.lineage.push(newLayer.id)
      }
      newLayer.id = payload
    }
    state.activeLayer = newLayer
  },


  // pushs new component to componentMap
  [types.ADD_COMPONENT_TO_COMPONENT_MAP]: (state, payload) => {
    const { componentName, htmlList, children, parent, isActive } = payload
    state.componentMap = Object.assign({}, state.componentMap, { [componentName]: {
      componentName,
      x: 0,
      y: 0,
      z: 0,
      w: 200,
      h: 200,
      children,
      parent,
      htmlList,
      isActive
    } })

    // state.componentMap = {
    //   ...state.componentMap,
    //   [componentName]: {
    //     componentName,
    //     x: 0,
    //     y: 0,
    //     w: 200,
    //     h: 200,
    //     children,
    //     htmlList,
    //     isActive
    //   }
    // }
  },
  // empty state
  [types.EMPTY_STATE]: (state, payload) => {
    // console.log('This is our defaultstate still', defaultState)
    console.log("hopefully this stays pure", payload)
    payload.store.replaceState(cloneDeep(payload.initialState))
    // {
    //   icons,
    //   htmlElementMap,
    //   // every single time we create a component
    //   // sent to export project component
    //   componentMap: {
    //     App: {
    //       componentName: 'App',
    //       children: ['HomeView'],
    //       htmlList: []
    //     },
    //     HomeView: {
    //       componentName: 'HomeView',
    //       children: [],
    //       htmlList: []
    //     }
    //     // NewView: {}
    //   },
    //   routes: {
    //     HomeView: []
    //     // NewView: []
    //   },
    //   userActions: [],
    //   userState: {},
    //   /**
    //    *
    //    */
    //   componentNameInputValue: '',
    //   projects: [{ filename: 'Untitled-1', lastSavedLocation: '' }],
    //   activeRoute: 'HomeView',
    //   activeComponent: '',
    //   selectedElementList: [],
    //   projectNumber: 2,
    //   activeTab: 0,
    //   componentChildrenMultiselectValue: [],
    //   modalOpen: false,
    //   parentSelected: false,
    //   imagePath: ''
    // })
  },

  // add parent
  [types.ADD_PARENT]: (state, payload) => {
    state.componentMap[payload.componentName].parent[state.parentSelected] = state.componentMap[state.parentSelected]
    state.componentMap[state.parentSelected].children.push(payload.componentName)
    state.componentMap[state.parentSelected].htmlList.push(payload.componentName)
  },
  // adds a html tag from the Icons.vue to the HomeQueue.vue
  // event: getClickedIcon @Icons.vue
  [types.ADD_TO_SELECTED_ELEMENT_LIST]: (state, payload) => {
    state.selectedElementList.push({ text: payload.elementName, id: payload.date, children: [] })
  },
  // allows user to create a new component in ComponentDisplay.vue
  // invovled in creating a new component, porbably does more
  [types.SET_SELECTED_ELEMENT_LIST]: (state, payload) => {
    state.selectedElementList = payload
  },
  [types.ADD_TO_COMPONENT_HTML_LIST]: (state, payload) => {
    const componentName = state.activeComponent

    state.componentMap[componentName] = { ...state.componentMap[componentName] }
    state.componentMap[componentName].htmlList.push({
      text: payload.elementName,
      id: payload.date,
      children: []
    })
  },

  [types.ADD_NESTED_HTML]:(state, payload) => {
    const componentName = state.activeComponent
    const activeHTML = state.activeHTML
    state.componentMap[componentName] = { ...state.componentMap[componentName] }
    let nestedElement = breadthFirstSearch(state.componentMap[componentName].htmlList, activeHTML)
    nestedElement.children.push({
      text: payload.elementName,
      id: payload.date,
      children: []
    })
  },

  [types.DELETE_FROM_COMPONENT_HTML_LIST]: (state, idx) => {
    const componentName = state.activeComponent
    const htmlList = state.componentMap[componentName].htmlList.slice(0)
    // splice out selected element and return resulting array
    htmlList.splice(idx, 1)
    state.componentMap[componentName].htmlList = htmlList
  },
  [types.SET_CLICKED_ELEMENT_LIST]: (state, payload) => {
    const componentName = state.activeComponent
    state.componentMap[componentName].htmlList = payload
  },
  // deletes selected component
  [types.DELETE_ACTIVE_COMPONENT]: state => {
    const { componentMap, activeComponent, activeRoute } = state

    let newObj = Object.assign({}, componentMap)
    // gotta save the children of the active component
    // and make sure they are placed as children of the active route or they will be lost to the graph.

    const activeObjChildrenArray = newObj[activeComponent].children
    // console.log(newObj[activeComponent])
    // console.log('Saving the children of the soon to be deleted object', activeObjChildrenArray)

    activeObjChildrenArray.forEach(child => {
      delete newObj[child].parent[activeComponent]
    })

    delete newObj[activeComponent]

    // goes in to make sure no children are the selected component any longer
    for (let compKey in newObj) {
      let children = newObj[compKey].children
      children.forEach((child, index) => {
        if (activeComponent === child) {
          children.splice(index, 1)
          // removes component from activeComponent's htmlList
          newObj[compKey].htmlList = newObj[compKey].htmlList.filter(el => el !== activeComponent)
        }
      })
    }

    newObj[activeRoute].children.push(...activeObjChildrenArray)
    state.componentMap = newObj
  },
  // used by setComponentMap for OpenProjectComponent.vue
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
    state.imagePath[payload] = '';
    // console.log('payload in add_route', payload)
  },
  // Changes the component map
  [types.ADD_ROUTE_TO_COMPONENT_MAP]: (state, payload) => {
    const { route, children } = payload
    state.componentMap = {
      ...state.componentMap,
      [route]: {
        componentName: route,
        children,
        htmlList: []
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
    state.activeHTML = ''
  },
  [types.SET_ACTIVE_HTML_ELEMENT]: (state, payload) => {
    // console.log('text is ', payload[0])
    if (payload[0] === '') {
      state.activeHTML = ''
    } else {
      state.activeHTML = payload[2]
    }
  },
  [types.SET_ROUTES]: (state, payload) => {
    console.log('setroutespayload:', payload)
    state.routes = Object.assign({}, payload)
  },
  // invoked when a component is deleted
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
  [types.UPDATE_COMPONENT_POSITION]: (state, payload) => {
   const updatedComponent = state.routes[state.activeRoute].filter(element => {
      return element.componentName === payload.activeComponent
    })[0]

    updatedComponent.x = payload.x
    updatedComponent.y = payload.y //Object.assign({}, state.componentMap[payload.activeComponent], {x: payload.x, y: payload.y});

  },

  [types.UPDATE_COMPONENT_SIZE]: (state, payload) => {
    const updatedComponent = state.routes[state.activeRoute].filter(element => {
      return element.componentName === payload.activeComponent
    })[0]

    updatedComponent.h = payload.h
    updatedComponent.w = payload.w
    updatedComponent.x = payload.x
    updatedComponent.y = payload.y
  },
  [types.UPDATE_COMPONENT_LAYER]: (state, payload) => {
    const updatedComponent = state.routes[state.activeRoute].filter(element => {
      return element.componentName === payload.activeComponent
    })[0]
    updatedComponent.z = payload.z
    state.componentMap[payload.activeComponent].z = payload.z
    // payload.activeComponentData.z = payload.z
  },
  [types.UPDATE_ACTIVE_COMPONENT_CHILDREN_VALUE]: (state, payload) => {
    // original line
    let temp = state.componentMap[state.activeComponent].children // b c  and we are removing c
    if (payload.length < temp.length) { // we will get a payload of [b] and our temp is currently [b,c]
      let child = temp.filter(el => !payload.includes(el))
      console.log('delete child: ', child)
      state.componentMap[state.activeComponent].children = payload
      state.componentMap[state.activeRoute].children.push(...temp.filter(el => !payload.includes(el)))
      delete state.componentMap[child[0]].parent[state.activeComponent]
    } else {
      let child = payload.filter(el => !temp.includes(el))
      console.log('child added', child)
      state.componentMap[state.activeComponent].children = payload
      state.componentMap[state.activeRoute].children = state.componentMap[
        state.activeRoute
      ].children.filter(el => !payload.includes(el))
      state.componentMap[child[0]].parent[state.activeComponent] = state.componentMap[state.activeComponent]
    }
    const copy = [...state.componentMap[state.activeComponent].htmlList]
    for (var x in payload) {
      if (!copy.includes(payload[x])) {
        copy.push(payload[x])
      }
    }
    state.componentMap[state.activeComponent].htmlList = copy
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
  },
  [types.DELETE_COMPONENT]: (state, payload) => {
    const stateCopy = state
    let compArr = stateCopy.routes[stateCopy.activeRoute]
    for (let i = 0; i < compArr.length; i++) {
      if (compArr[i].componentName == payload.componentName) {
        compArr.splice(i, 1)
      }
    }
    delete state.componentMap[payload.componentName]
    state.routes[state.activeRoute] = compArr
    console.log('new state', state)
  },
  /**
   * Import Image Mutations
   */
  [types.IMPORT_IMAGE]: (state, payload) => {
    console.log(`import image invoked. image: ${payload.img} ${payload.route}`)
    state.imagePath = { ...state.imagePath, [payload.route]: payload.img }
    // state.imagePath[payload.route] = payload.img
  },
  [types.CLEAR_IMAGE]: (state, payload) => {
    console.log(`clear image invoked`)
    // console.log('current routes img url: ', state.imagePath[payload.route])
    if (state.imagePath[payload.route]) state.imagePath[payload.route] = ''
    // console.log('after removal', state.imagePath[payload.route])
  },
  [types.DELETE_USER_ACTIONS]: (state, payload) => {
    // payload should be a string of the name of the action to remove
    let index = state.userActions.indexOf(payload)
    state.userActions.splice(index, 1)
  },
  [types.REMOVE_ACTION_FROM_COMPONENT]: (state, payload) => {
    let index = state.componentMap[state.activeComponent].mapActions.indexOf(
      payload
    )
    state.componentMap[state.activeComponent].mapActions.splice(index, 1)
  },
  [types.ADD_TO_COMPONENT_ACTIONS]: (state, payload) => {
    state.componentMap[state.activeComponent].componentActions.push(payload)
  },
  [types.ADD_TO_COMPONENT_STATE]: (state, payload) => {
    state.componentMap[state.activeComponent].componentState.push(payload)
  },
  [types.ADD_USER_ACTION]: (state, payload) => {
    if (typeof payload === 'string') state.userActions.push(payload)
  },
  [types.ADD_TO_USER_STORE]: (state, payload) => {
    const key = Object.keys(payload)
    state.userStore[key] = payload[key]
  },
  [types.REMOVE_STATE_FROM_COMPONENT]: (state, payload) => {
    let prop = state.componentMap[state.activeComponent].componentState
    prop.splice(prop.indexOf(payload), 1)
  },
  [types.DELETE_USER_STATE]: (state, payload) => {
    delete state.userStore[payload]
  },
  [types.SET_IMAGE_PATH]: (state, payload) => {
    console.log('mutation to set image path', { ...state.imagePath, ...payload }) 
    state.imagePath = { ...state.imagePath, ...payload }
  }
}

export default mutations
