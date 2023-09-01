/* eslint-disable */
/**
 * @jest-environment jsdom
 */
// import mutations from "../../../src/store/options/mutations";
import { setActivePinia, createPinia } from 'pinia'
import { useStore } from "../../../src/store/main.js";


/**
 * @description: Tests for deleting state
 * @summary:
 *  `deleteUserState` action invokes removeStateFromComponent
 *  `removeStateFromComponent` mutation that deletes state from userStore
 *  `userStore` holds the user defined state objects
 */

setActivePinia(createPinia());
const store = useStore();

describe("Delete state/actions in userStore/componentMap", () => {
  beforeEach(() => {
    store.componentMap = {
      testComp: {
        componentName: "test",
        children: [],
        htmlList: [],
        componentActions: [],
        state: ["state1", "state2"],
        actions: ["action1", "action2"],
      }
    }
    store.activeComponent = "test";
    store.userState = ["state1", "state2"];
    store.userActions = ["action1", "action2"];
    store.userProps = ["prop1", "prop2"];
    // state = {
    //   componentMap: {
    //     testComp: {
    //       componentName: "test",
    //       children: [],
    //       htmlList: [],
    //       componentActions: [],
    //       state: ["state1", "state2"],
    //       actions: ["action1", "action2"],
    //     },
    //   },
    //   activeComponent: "test",
    //   userState: ["state1", "state2"],
    //   userActions: ["action1", "action2"],
    //   userProps: ["prop1", "prop2"],
    // };
  });
  // test("'[types.DELETE_USER_STATE]' should delete a single state property", () => {
  //   mutations.DELETE_USER_STATE(state, "state1");
  //   expect(state.userState).toEqual(["state2"]);
  // });
  test("function deleteUserState should delete a single state property", () => {
    store.deleteUserState("state1");
    expect(store.userState).toEqual(["state2"]);
  });
  // test("'[types.DELETE_USER_ACTIONS]' should delete a single action property", () => {
  //   mutations.DELETE_USER_ACTIONS(state, "action1");
  //   expect(state.userActions).toEqual(["action2"]);
  // });
  test("'function deleteUserActions should delete a single action property", () => {
    store.deleteUserActions("action1");
    expect(store.userActions).toEqual(["action2"]);
  });
  // test("'[types.REMOVE_ALL_STATE_PROPS_ACTIONS]' should delete all props, state and action", () => {
  //   mutations.REMOVE_ALL_STATE_PROPS_ACTIONS(state);
  //   expect(state.userState.length).toEqual(0);
  //   expect(state.userActions.length).toEqual(0);
  //   expect(state.userProps.length).toEqual(0);
  // });
  test(" function removeAllStatePropsActions should delete all props, state and action", () => {
    store.removeAllStatePropsActions();
    expect(store.userState.length).toEqual(0);
    expect(store.userActions.length).toEqual(0);
    expect(store.userProps.length).toEqual(0);
  });
});
