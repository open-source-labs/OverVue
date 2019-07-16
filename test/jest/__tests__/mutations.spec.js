/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from "@vue/test-utils";
import QBUTTON from "./demo/QBtn-demo.vue";
import * as All from "quasar";
// import langEn from 'quasar/lang/en-us' // change to any language you wish! => this breaks wallaby :(
const { Quasar, date } = All;

const components = Object.keys(All).reduce((object, key) => {
  const val = All[key];
  if (val && val.component && val.component.name != null) {
    object[key] = val;
  }
  return object;
}, {});

import actions from "../../../src/store/actions";
import mutations from "../../../src/store/mutations";
import * as types from "../../../src/store/types";

/**
 * @description: Tests for deleting state
 * @summary:
 *  `deleteUserState` action invokes removeStateFromComponent
 *  `removeStateFromComponent` mutation that deletes state from userStore
 *  `userStore` holds the user defined state objects
 *
 */

describe("Test Suite in mutations.spec.js - Delete from userState(?) and/or componentMap", () => {
  const localVue = createLocalVue();
  localVue.use(Quasar, { components });
  const dumVal = false;

  // dummy test to test mutation
  test('"[types.SET_ACTIVE_COMPONENT]" sets new "activeComponent" in newState', () => {
    const newState = {
      activeComponent: ""
    };
    const payload = "hello-world";
    mutations[types.SET_ACTIVE_COMPONENT](newState, payload);
    expect(newState.activeComponent).toBe("hello-world");
  });
  // testing REMOVE_STATE_FROM_COMPONENT tests
  /*
  test('"[types.REMOVE_STATE_FROM_COMPONENT]" removes state from userState', () => {
    const newState = {
      userState: {
        obj1: "string",
        obj2: "array"
      }
    };
    const payload = "obj1";
    mutations[types.REMOVE_STATE_FROM_COMPONENT](newState, payload);
    expect(newState.userState).toBe({
      obj2: "array"
    });
  });

  test('"[types.REMOVE_STATE_FROM_COMPONENT]" removes selected state obj from userState', () => {
    const newState = {
      userState: {
        obj1: "string",
        obj2: "array",
        obj3: "boolean"
      }
    };
    const payload = "obj2";
    mutations[types.REMOVE_STATE_FROM_COMPONENT](newState, payload);
    expect(newState.userState).toBe({
      obj1: "string",
      obj3: "boolean"
    });
  });
  // testing deleteUserState action
  test('"[types.deleteUserState]" removes selected state obj from userState', () => {
    const newState = {
      userState: {
        obj1: "string",
        obj2: "array",
        obj3: "boolean"
      }
    };
    const payload = "obj2";
    actions[types.deleteUserState](newState, payload);
    expect(newState.userState).toBe({
      obj1: "string",
      obj3: "boolean"
    });
  
  });
  */
});
