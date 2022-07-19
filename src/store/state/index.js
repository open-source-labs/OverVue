import icons from './icons'
import htmlElementMap from './htmlElementMap'
import styleClassmap from './styleClassMap'


const cloneDeep = require('lodash.clonedeep')

const newState = {
  icons,
  htmlElementMap,
  // state below is what is used when exporting a project
  componentMap: {
    App: {
      componentName: 'App',
      children: ['HomeView'],
      htmlList: []
    },
    HomeView: {
      componentName: 'HomeView',
      children: [],
      htmlList: [],
    }
  },
  routes: {
    HomeView: []
  },
  userActions: [],
  userProps: [],
  userState: [],
  imagePath: {
    HomeView: ''
  },
  // state below is not used when exporting a project
  componentNameInputValue: '',
  projects: [{ filename: 'Untitled-1', lastSavedLocation: '' }],

  activeRoute: 'HomeView',
  // need to change to activeComponentName
  activeComponent: '',
  activeComponentObj: null,
  activeHTML: '',
  activeLayer: {
    id: '',
    lineage: []
  },

  selectedProps: [],
  selectedState: [],
  selectedActions: [],
  selectedElementList: [],
  projectNumber: 2,
  activeTab: 0,
  componentChildrenMultiselectValue: [],
  modalOpen: false,
  noteModalOpen: false,
  //test
  noteAttributeOpen: false,
  colorModalOpen: false,
  //
  parentSelected: false,
  // for storing copied component
  copiedComponent: {},
  copyNumber: 0,
  pastedComponent: {},
  exportAsTypescript: 'off',
  showTutorial: true,
  tutorialFirstOpen: true,
  pasteTimer: 0,
}

// closured method to ensure we only ever write the default state ONCE
const writeTheDefault = () => {
  let initial = {}
  let needsToRun = true
  function onced(payload) {
    if (needsToRun) {
      initial = cloneDeep(payload)
      needsToRun = false
    }
    return initial
  }
  return onced
}

const defaultState = writeTheDefault()

export default newState
export { defaultState }
