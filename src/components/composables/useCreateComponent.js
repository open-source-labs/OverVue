// import * as ElementPlus from '../../../node_modules/element-plus/es/components' // importing all components from Element Plus with install wrappers

export function useCreateComponent(importObj) {
  const createComponent = (importObj) => {
    let imported = false; //alter this logic once ready to import components
    if (importObj.hasOwnProperty('componentName')) {
      imported = true;
      //Check if state and actions on import exist in the store. If not, add them.
      for (let i = 0; i < importObj.actions.length; i++) {
        if (!this.userActions.includes(importObj.actions[i])) {
          this.createAction(importObj.actions[i])
        }
      }
      for (let i = 0; i < importObj.state.length; i++) {
        if (!this.userState.includes(importObj.state[i])) {
          this.createState(importObj.state[i])
        }
      }
      for (let i = 0; i < importObj.props.length; i++) {
        if (!this.userProps.includes(importObj.props[i])) {
          this.createProp(importObj.props[i])
        }
      }
    }

    if (imported === false && !this.componentNameInputValue.replace(/[^a-z0-9-_.]/gi, "")) {
      event.preventDefault();
      return false;
    }
    // boilerplate properties for each component upon creation
    console.log(importObj.parent);
    console.log({ y: importObj?.parent?.y })
    const component = {
      x: importObj?.parent?.x ?? 0,
      y: importObj?.parent?.y ?? 0,
      z: importObj?.parent?.z ?? 0,
      htmlList: this.selectedElementList,
      noteList: [],
      children: [],
      actions: [],
      props: [],
      state: [],
      parent: {},
      isActive: false,
      idDrag: '',
      idDrop: '',
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
      component.componentName = this.componentNameInputValue.replace(/[^a-z0-9-_.]/gi, "");
    }
    if (!this.componentMap[component.componentName]) {
      this.registerComponent(component);
      this.setActiveComponent(component.componentName);
    }
  }
  createComponent(importObj)

  // console logging all components from Element Plus to determine shape of data and investigate structure of components
  // console.log(ElementPlus)
    // components all within giant object
}

//