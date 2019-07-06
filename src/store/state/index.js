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
      children: [],
      htmlList: []
    }
    // NewView: {}
  },
  routes: {
    HomeView: []
    // NewView: []
  },
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
  parentSelected: false
}

export default newState
