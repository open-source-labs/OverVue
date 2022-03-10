/* eslint-disable */
/**
 * @jest-environment jsdom
 */
import mutations from "../../../src/store/mutations";
import actions from "../../../src/store/actions";
import { mount, createLocalVue, shallowMount } from "@vue/test-utils";
import * as All from "quasar";
const { Quasar, date } = All;

/**
 * @description: Tests for deleting state
 * @summary:
 *  `deleteUserState` action invokes removeStateFromComponent
 *  `removeStateFromComponent` mutation that deletes state from userStore
 *  `userStore` holds the user defined state objects
 */

describe("Delete state/actions in userStore/componentMap", () => {
  let state;
  beforeEach(() => {
    state = {
      componentMap: {
        testComp: {
          componentName: "test",
          children: [],
          htmlList: [],
          componentActions: [],
          state: ["state1", "state2"],
          actions: ["action1", "action2"]
        }
      },
      activeComponent: "test",
      userState: ['state1', 'state2'],
      userActions: ['action1', 'action2'],
      userProps: ['prop1', 'prop2']
    };
  });
  test("'[types.DELETE_USER_STATE]' should delete a single state property", () => {
    mutations.DELETE_USER_STATE(state, "state1");
    expect(state.userState).toEqual(['state2']);
  });
  test("'[types.DELETE_USER_ACTIONS]' should delete a single action property", () => {
    mutations.DELETE_USER_ACTIONS(state, "action1");
    expect(state.userActions).toEqual(['action2']);
  });
  test("'[types.REMOVE_ALL_STATE_PROPS_ACTIONS]' should delete all props, state and action", () => {
    mutations.REMOVE_ALL_STATE_PROPS_ACTIONS(state);
    expect(state.userState.length).toEqual(0);
    expect(state.userActions.length).toEqual(0);
    expect(state.userProps.length).toEqual(0);
  });

});
  