import icons from './icons'
import htmlElementMap from './htmlElementMap'

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
      children: ['LoginBtn'],
      htmlList: []
    },
    LoginBtn: {
      componentName: 'HomeView',
      children: ['LoginBtn'],
      htmlList: ['<btn></btn>'],
      actions: ['action1']
    }
    // NewView: {}
  },
  routes: {
    HomeView: []
    // NewView: []
  },
  userState: {
    userActions: false,
    activeStore: false,
    storeContents: {
      obj1: 'string',
      obj2: 'boolean',
      obj3: 'array'
    }
  },
  userActions: ['action1', 'action2'],
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
  imagePath: ''
}

export default newState
