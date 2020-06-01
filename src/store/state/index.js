import icons from './icons'
import htmlElementMap from './htmlElementMap'
const cloneDeep = require('lodash.clonedeep')

const newState = {
  icons,
  htmlElementMap,
  // every single time we create a component
  // sent to export project component
  componentMap: {
    App: {
      componentName: 'App',
      children: ['HomeView'],
      htmlList: []
    },
    HomeView: {
      componentName: 'HomeView',
      children: [],
      htmlList: []
    }
    // NewView: {}
  },
  routes: {
    HomeView: []
    // NewView: []
  },
  userActions: [],
  userState: {},
  /**
   *
   */
  componentNameInputValue: '',
  projects: [{ filename: 'Untitled-1', lastSavedLocation: '' }],
  activeRoute: 'HomeView',
  activeComponent: '',
  selectedElementList: [],
  projectNumber: 2,
  activeTab: 0,
  componentChildrenMultiselectValue: [],
  modalOpen: false,
  parentSelected: false,
  imagePath: {
    HomeView: ''
  }
}

//closured method to ensure we only ever write the default state ONCE
const writeTheDefault = () => {
  let initial = {}
  let needsToRun = true;
  function onced(payload){
    if(needsToRun){
      initial = cloneDeep(payload)
      needsToRun = false;
    }
    return initial
  }
  return onced
}

const defaultState = writeTheDefault()

// const defaultState = 
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
// }

// const getDefault = ()=>{
//   return {...defaultState}
// }



export default newState
export {defaultState}