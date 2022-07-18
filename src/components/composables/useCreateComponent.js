export function useCreateComponent(importObj) {
  const createComponent = (importObj) => {
    let imported = false;
    if (importObj.hasOwnProperty('componentName')){
      imported = true;
      //Check if state and actions on import exist in the store. If not, add them.
      for (let i = 0; i < importObj.actions.length; i++){
        if (!this.userActions.includes(importObj.actions[i])){
          this.createAction(importObj.actions[i])
        }
      }
      for (let i = 0; i < importObj.state.length; i++){
        if (!this.userState.includes(importObj.state[i])){
          this.createState(importObj.state[i])
        }
      }
      for (let i = 0; i < importObj.props.length; i++){
        if (!this.userProps.includes(importObj.props[i])){
          this.createProp(importObj.props[i])
        }
      }
    }

    if (imported === false && !this.componentNameInputValue.replace(/[^a-z0-9-_.]/gi, "")) {
      event.preventDefault();
      return false;
    }

    // boilerplate properties for each component upon creation
    const component = {
      x: 0,
      y: 20,
      z: 0,
      w: 200,
      h: 200,
      htmlList: this.selectedElementList,
      noteList: [],
      children: [],
      actions: [],
      props: [],
      state: [],
      parent: {},
      isActive: false,
      color: "#ffffff00"
    };

    if (imported === true){
      component.componentName = importObj.componentName;
      component.htmlList = importObj.htmlList;
      component.actions = importObj.actions;
      component.state = importObj.state;
      component.props = importObj.props;
    } else {
      component.componentName = this.componentNameInputValue.replace(/[^a-z0-9-_.]/gi,"");
    }
    
    if (!this.componentMap[component.componentName]) {
      this.registerComponent(component);
      this.setActiveComponent(component.componentName);
    }
  }
  createComponent(importObj)
}
