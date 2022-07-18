// Mutations
export const ADD_ACTION_SELECTED = 'ADD_ACTION_SELECTED'
export const ADD_ACTION_TO_COMPONENT = 'ADD_ACTION_TO_COMPONENT'
export const ADD_COMPONENT_TO_ACTIVE_ROUTE_CHILDREN = 'ADD_COMPONENT_TO_ACTIVE_ROUTE_CHILDREN'
export const ADD_COMPONENT_TO_ACTIVE_ROUTE_IN_ROUTE_MAP = 'ADD_COMPONENT_TO_ACTIVE_ROUTE_IN_ROUTE_MAP'
export const ADD_COMPONENT_TO_COMPONENT_CHILDREN = 'ADD_COMPONENT_TO_COMPONENT_CHILDREN'
export const ADD_COMPONENT_TO_COMPONENT_MAP = 'ADD_COMPONENT_TO_COMPONENT_MAP'
export const ADD_COPIED_PARENT = 'ADD_COPIED_PARENT'
export const ADD_NESTED_HTML = 'ADD_NESTED_HTML'
export const ADD_NESTED_NO_ACTIVE = 'ADD_NESTED_NO_ACTIVE'
export const ADD_PARENT = 'ADD_PARENT'
export const ADD_PROJECT = 'ADD_PROJECT'
export const ADD_PROPS_SELECTED = 'ADD_PROPS_SELECTED'
export const ADD_PROPS_TO_COMPONENT = 'ADD_PROPS_TO_COMPONENT'
export const ADD_ROUTE = 'ADD_ROUTE'
export const ADD_ROUTE_TO_COMPONENT_MAP = 'ADD_ROUTE_TO_COMPONENT_MAP'
export const ADD_STATE_SELECTED = 'ADD_STATE_SELECTED'
export const ADD_STATE_TO_COMPONENT = 'ADD_STATE_TO_COMPONENT'
export const ADD_TO_COMPONENT_HTML_LIST = 'ADD_TO_COMPONENT_HTML_LIST'
export const ADD_TO_SELECTED_ELEMENT_LIST = 'ADD_TO_SELECTED_ELEMENT_LIST'
export const CHANGE_ACTIVE_TAB = 'CHANGE_ACTIVE_TAB'
export const CLEAR_IMAGE = 'CLEAR_IMAGE'
export const COPY_ACTIVE_COMPONENT = 'COPY_ACTIVE_COMPONENT'
export const CREATE_ACTION = 'CREATE_ACTION'
export const CREATE_PROP = 'CREATE_PROP'
export const CREATE_STATE = 'CREATE_STATE'
export const DELETE_ACTION_FROM_COMPONENT = 'DELETE_ACTION_FROM_COMPONENT'
export const DELETE_ACTIVE_COMPONENT = 'DELETE_ACTIVE_COMPONENT'
export const DELETE_FROM_COMPONENT_HTML_LIST = 'DELETE_FROM_COMPONENT_HTML_LIST'
export const DELETE_FROM_QUEUE = 'DELETE_FROM_QUEUE'
export const DELETE_PROJECT_TAB = 'DELETE_PROJECT_TAB'
export const DELETE_PROPS_FROM_COMPONENT = 'DELETE_PROPS_FROM_COMPONENT'
export const DELETE_ROUTE = 'DELETE_ROUTE'
export const DELETE_SELECTED_ELEMENT = 'DELETE_SELECTED_ELEMENT'
export const DELETE_STATE_FROM_COMPONENT = 'DELETE_STATE_FROM_COMPONENT'
export const EDIT_COMPONENT_NAME = 'EDIT_COMPONENT_NAME'
export const EMPTY_STATE = 'EMPTY_STATE'
export const IMPORT_IMAGE = 'IMPORT_IMAGE'
export const INCREMENT_PROJECT_ID = 'INCREMENT_PROJECT_ID'
export const PARENT_SELECTED = 'PARENT_SELECTED'
export const PASTE_ACTIVE_COMPONENT = 'PASTE_ACTIVE_COMPONENT'
export const SET_ACTIVE_COMPONENT = 'SET_ACTIVE_COMPONENT'
export const SET_ACTIVE_HTML_ELEMENT = 'SET_ACTIVE_HTML_ELEMENT'
export const SET_ACTIVE_LAYER = 'SET_ACTIVE_LAYER'
export const SET_ACTIVE_PROJECT = 'SET_ACTIVE_PROJECT'
export const SET_ACTIVE_ROUTE = 'SET_ACTIVE_ROUTE'
export const SET_ACTIVE_ROUTE_ARRAY = 'SET_ACTIVE_ROUTE_ARRAY'
export const SET_CLICKED_ELEMENT_LIST = 'SET_CLICKED_ELEMENT_LIST'
export const SET_COMPONENT_HTML_LIST = 'SET_COMPONENT_HTML_LIST'
export const SET_COMPONENT_MAP = 'SET_COMPONENT_MAP'
export const SET_IMAGE_PATH = 'SET_IMAGE_PATH'
export const SET_ROUTES = 'SET_ROUTES'
export const SET_SELECTED_ELEMENT_LIST = 'SET_SELECTED_ELEMENT_LIST'
export const UP_ONE_LAYER = 'UP_ONE_LAYER'
export const UPDATE_ACTIVE_COMPONENT_CHILDREN_VALUE = 'UPDATE_ACTIVE_COMPONENT_CHILDREN_VALUE'
export const UPDATE_COMPONENT_CHILDREN_MULTISELECT_VALUE = 'UPDATE_COMPONENT_CHILDREN_MULTISELECT_VALUE'
export const UPDATE_COMPONENT_NAME_INPUT_VALUE = 'UPDATE_COMPONENT_NAME_INPUT_VALUE'
export const UPDATE_COMPONENT_CHILDREN_VALUE = 'UPDATE_COMPONENT_CHILDREN_VALUE'
export const UPDATE_COMPONENT_POSITION = 'UPDATE_COMPONENT_POSITION'
export const UPDATE_COMPONENT_LAYER = 'UPDATE_COMPONENT_LAYER'
export const UPDATE_COMPONENT_SIZE = 'UPDATE_COMPONENT_SIZE'
export const UPDATE_OPEN_MODAL = 'UPDATE_OPEN_MODAL'
export const DELETE_USER_ACTIONS = 'DELETE_USER_ACTIONS'
export const DELETE_USER_STATE = 'DELETE_USER_STATE'
export const EXPORT_AS_TYPESCRIPT = 'EXPORT_AS_TYPESCRIPT'
export const TOGGLE_TUTORIAL = 'TOGGLE_TUTORIAL'
export const ADD_ACTIVE_COMPONENT_NOTE = 'ADD_ACTIVE_COMPONENT_NOTE'
export const DELETE_ACTIVE_COMPONENT_NOTE = 'DELETE_ACTIVE_COMPONENT_NOTE'
export const OPEN_NOTE_MODAL = 'OPEN_NOTE_MODAL'
//Jace practest
export const OPEN_ATTRIBUTE_MODAL = 'OPEN_ATTRIBUTE_MODAL'
export const ADD_ACTIVE_COMPONENT_CLASS = 'ADD_ACTIVE_COMPONENT_CLASS'
export const DELETE_ACTIVE_COMPONENT_CLASS = 'DELETE_ACTIVE_COMPONENT_CLASS'
//
export const REMOVE_ALL_STATE_PROPS_ACTIONS = 'REMOVE_ALL_STATE_PROPS_ACTIONS'
export const UPDATE_PASTE_TIMER = 'UPDATE_PASTE_TIMER'

// Actions
export const openNoteModal = 'openNoteModal'
//Jace practest
export const openAttributeModal = 'openAttributeModal'
export const addActiveComponentClass = 'addActiveComponentClass'
export const deleteActiveComponentClass = 'deleteActiveComponentClass'

//
export const deleteActiveComponentNote = 'deleteActiveComponentNote'
export const addActiveComponentNote = 'addActiveComponentNote'
export const addActionSelected = 'addActionSelected'
export const addActionToComponent = 'addActionToComponent'
export const addNestedHTML = 'addNestedHTML'
export const addNestedNoActive = 'addNestedNoActive'
export const addProject = 'addProject'
export const addRouteToRouteMap = 'addRouteToRouteMap'
export const addPropsSelected = 'addPropsSelected'
export const addPropsToComponent = 'addPropsToComponent'
export const addStateSelected = 'addStateSelected'
export const addStateToComponent = 'addStateToComponent'
export const addToComponentElementList = 'addToComponentElementList'
export const addToSelectedElementList = 'addToSelectedElementList'
export const changeActiveTab = 'changeActiveTab'
export const clearImage = 'clearImage'
export const copyActiveComponent = 'copyActiveComponent'
export const createAction = 'createAction'
export const createProp = 'createProp'
export const createState = 'createState'
export const deleteActiveComponent = 'deleteActiveComponent'
export const deleteActionFromComponent = 'deleteActionFromComponent'
export const deleteComponent = 'deleteComponent'
export const deleteRoute = 'deleteRoute'
export const deleteFromComponentHtmlList = 'deleteFromComponentHtmlList'
export const deleteFromQueue = 'deleteFromQueue'
export const deleteProjectTab = 'deleteProjectTab'
export const deletePropsFromComponent = 'deletePropsFromComponent'
export const deleteSelectedElement = 'deleteSelectedElement'
export const deleteStateFromComponent = 'deleteStateFromComponent'
export const editComponentName = 'editComponentName'
export const importComponent = 'importComponent'
export const importImage = 'importImage'
export const incrementProjectId = 'incrementProjectId'
export const openProject = 'openProject'
export const parentSelected = 'parentSelected'
export const pasteActiveComponent = 'pasteActiveComponent'
export const registerComponent = 'registerComponent'
export const setActiveComponent = 'setActiveComponent'
export const setActiveHTML = 'setActiveHTML'
export const setActiveRoute = 'setActiveRoute'
export const setActiveLayer = 'setActiveLayer'
export const setClickedElementList = 'setClickedElementList'
export const setComponentHtmlList = 'setComponentHtmlList'
export const setComponentMap = 'setComponentMap'
export const setImagePath = 'setImagePath'
export const setRoutes = 'setRoutes'
export const setSelectedElementList = 'setSelectedElementList'
export const upOneLayer = 'upOneLayer'
export const updateActiveComponentChildrenValue = 'updateActiveComponentChildrenValue'
export const updateComponentChildrenMultiselectValue = 'updateComponentChildrenMultiselectValue'
export const updateComponentChildrenValue = 'updateComponentChildrenValue'
export const updateComponentLayer = 'updateComponentLayer'
export const updateComponentNameInputValue = 'updateComponentNameInputValue'
export const updateComponentPosition = 'updateComponentPosition'
export const updateComponentSize = 'updateComponentSize'
export const updateOpenModal = 'updateOpenModal'
export const updateStartingPosition = 'updateStartingPosition'
export const updateStartingSize = 'updateStartingSize'
export const deleteUserActions = 'deleteUserActions'
export const deleteUserState = 'deleteUserState'
export const toggleTutorial = 'toggleTutorial'


// inactive mutations
// export const SET_STATE = 'SET_STATE'
// export const DELETE_COMPONENT = 'DELETE_COMPONENT'
// export const REMOVE_ACTION_FROM_COMPONENT = 'REMOVE_ACTION_FROM_COMPONENT'
// export const ADD_TO_COMPONENT_ACTIONS = 'ADD_TO_COMPONENT_ACTIONS'
// export const ADD_TO_COMPONENT_STATE = 'ADD_TO_COMPONENT_STATE'
// export const ADD_USER_ACTION = 'ADD_USER_ACTION'
// export const ADD_TO_USER_STORE = 'ADD_TO_USER_STORE'
// export const REMOVE_STATE_FROM_COMPONENT = 'REMOVE_STATE_FROM_COMPONENT'
// export const DELETE_USER_STATE = 'DELETE_USER_STATE'

// // inactive actions
// export const setState = 'setState'
// export const removeActionFromComponent = 'removeActionFromComponent'
// export const addUserAction = 'addUserAction'
// export const addToUserStore = 'addToUserStore'
// export const removeStateFromComponent = 'removeStateFromComponent'

