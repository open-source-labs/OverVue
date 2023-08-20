// import * as ElementPlus from '../../../node_modules/element-plus/es/components' // importing all components from Element Plus with install wrappers

export function useCreateComponent(importObj, propObj) {
  // this function requires userActions, userState, userProps, componentNameInputValue, createAction, createState, createProp, selectedElementList, componentMap, registerComponent, setActiveComponent
  const createComponent = (importObj) => {
    let imported = false; //alter this logic once ready to import components
    if (importObj.hasOwnProperty("componentName")) {
      imported = true;

      //Check if state and actions on import exist in the store. If not, add them.
      for (let i = 0; i < importObj.actions.length; i++) {
        if (!propObj.userActions.includes(importObj.actions[i])) {
          propObj.createAction(importObj.actions[i]);
        }
      }
      for (let i = 0; i < importObj.state.length; i++) {
        if (!propObj.userState.includes(importObj.state[i])) {
          propObj.createState(importObj.state[i]);
        }
      }
      for (let i = 0; i < importObj.props.length; i++) {
        if (!propObj.userProps.includes(importObj.props[i])) {
          propObj.createProp(importObj.props[i]);
        }
      }
    }

    if (
      imported === false &&
      !propObj.componentNameInputValue.replace(/[^a-z0-9-_.]/gi, "")
    ) {
      event.preventDefault();
      return false;
    }
    
    // boilerplate properties for each component upon creation
    const component = {
      x: importObj?.parent?.x ?? 0,
      y: importObj?.parent?.y ?? 0,
      z: importObj?.parent?.z ?? 0,
      htmlList: propObj.selectedElementList,
      noteList: [],
      children: [],
      actions: [],
      props: [],
      state: [],
      parent: {},
      isActive: false,
      idDrag: "",
      idDrop: "",
      color: "#ffffff85",
      htmlAttributes: {
        class: "",
        id: "",
        gridArea: [0, 0, 2, 2],
      },
    };

    if (imported === true) {
      component.componentName = importObj.componentName;
      component.htmlList = importObj.htmlList;
      component.actions = importObj.actions;
      component.state = importObj.state;
      component.props = importObj.props;
    } else {
      component.componentName = propObj.componentNameInputValue.replace(
        /[^a-z0-9-_.]/gi,
        ""
      );
    }
    if (!propObj.componentMap[component.componentName]) {
      propObj.registerComponent(component);
      propObj.setActiveComponent(component.componentName);
    }
  };
  createComponent(importObj);
}
