/* eslint-disable */
/**
 * @jest-environment jsdom
 */

// import { mount, createLocalVue, shallowMount } from "@vue/test-utils";
import { createApp } from "vue";
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
import Vuex from "vuex";
import store from "../../../src/store/state/index";

/**
 * @description: Testing functionality of the uploadImage mutations and actions
 * `actions:` `importImage`, `clearImage`
 * `mutations: ` `IMPORT_IMAGE`, `CLEAR_IMAGE`
 * `state:` `imagePath`
 */

describe("Test Suite for Image Upload", () => {
  // createLocalVue was deprecated in newer versions of vue testing utils
  // const localVue = createLocalVue();
  // localVue.use(Quasar, Vuex, { components });

  // New version using createApp
  const App = {}
  const app = createApp(App);
  app.use(Quasar, Vuex, { components });

  const dumVal = false;

  test('"[types.IMPORT_IMAGE]" mutation sets file path for electron "imagePath" in newState', () => {
    const newState = {
      imagePath: "",
      activeRoute: 'HomeView'
    };
    const payload = { img: "/Users/dev/Documents/test_img.jpg", route: newState.activeRoute };
    mutations[types.IMPORT_IMAGE](newState, payload);
    expect(newState.imagePath).toBeInstanceOf(Object);
    expect(newState.imagePath).toHaveProperty(payload.route);
    expect(newState.imagePath[payload.route]).toEqual(payload.img);
  });

  test('"[types.CLEAR_IMAGE]" mutation removes string from "imagePath" in newState', () => {
    const newState = {
      imagePath: { HomeView: "/Users/dev/Documents/delete_test_img.jpg" },
      activeRoute: "HomeView"
    };
    const payload = { route: newState.activeRoute };
    mutations[types.CLEAR_IMAGE](newState, payload);
    expect(newState.imagePath[payload.route]).toBe("");
  });

  test('"[types.importImage]" action calls "IMPORT_IMAGE"', () => {
    const newState = {
      imagePath: ""
    };
    const commit = jest.fn();
    const payload = "/Users/dev/Documents/test_img.jpg";
    actions[types.importImage]({ commit }, { payload });
    expect(commit).toHaveBeenCalledWith("IMPORT_IMAGE", { payload });
    // expect(store.imagePath).toBe("/Users/dev/Documents/test_img.jpg");
  });

  test('"[types.clearImage]" action calls the "CLEAR_IMAGE" mutation in newState', () => {
    store.imagePath = "/Users/dev/Documents/delete_test_img.jpg";
    const commit = jest.fn();
    // console.log(commit);
    // console.log(actions[types.clearImage])
    actions[types.clearImage]({ commit }, { route: "HomeView" });
    expect(commit).toHaveBeenCalledWith("CLEAR_IMAGE", { route: "HomeView" });
    // expect(store.imagePath).toBe("");
  });
});
