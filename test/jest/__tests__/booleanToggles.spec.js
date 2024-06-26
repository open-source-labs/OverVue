import { mount, shallowMount } from "@vue/test-utils";
import { createApp } from "vue";
import { createTestingPinia } from "@pinia/testing";
import { setActivePinia, createPinia } from "pinia";
import * as All from "quasar";
const { Quasar, date } = All;
import { useStore } from "../../../src/stores/main.js";

setActivePinia(createPinia());
const store = useStore();
//testing that export as typescript on/off, showTutorial, all update properly
describe("Test for exportAsTypescript flag to flip when mutation committed", () => {
  const App = {};
  const app = createApp(App);
  app.use(Quasar);

  //tests that the export as typescript mutation properly updates state to on/off
  test('"store.ExportAsTypescript" to update state successfully', () => {
    store.ExportAsTypescript("on");
    expect(store.exportAsTypescript).toEqual("on");
    store.ExportAsTypescript("off");
    expect(store.exportAsTypescript).toEqual("off");
  });

  test('"store.toggleTutorial" to mutate state true/false', () => {
    store.toggleTutorial();
    expect(store.showTutorial).toBe(false);
    store.toggleTutorial();
    expect(store.showTutorial).toBe(true);
  });
});




// old VueX testing
// import { mount, shallowMount } from "@vue/test-utils";
// import { createApp } from "vue";
// import * as All from "quasar";
// const { Quasar, date } = All;
// import actions from "../../../src/stores/options/actions";
// import mutations from "../../../src/stores/options/mutations";
// import * as types from "../../../src/stores/options/types";
// import Vuex from "vuex";
// import store from "../../../src/stores/state/index";

// //testing that export as typescript on/off, showTutorial, all update properly
// describe("Test for exportAsTypescript flag to flip when mutation committed", () => {
//   const App = {};
//   const app = createApp(App);
//   app.use(Quasar, Vuex);
//   const state = { ...store };

//   //tests that the export as typescript mutation properly updates state to on/off
//   test('"[types.EXPORT_AS_TYPESCRIPT]" to update state successfully', () => {
//     mutations[types.EXPORT_AS_TYPESCRIPT](state, "on");
//     expect(state.exportAsTypescript).toEqual("on");
//     mutations[types.EXPORT_AS_TYPESCRIPT](state, "off");
//     expect(state.exportAsTypescript).toEqual("off");
//   });

//   //tests that the tutorial toggle successfully updates state to true/false
//   test('"[types.toggleTutorial]" action to commit TOGGLE_TUTORIAL', () => {
//     const commit = jest.fn();
//     actions[types.toggleTutorial]({ state, commit });
//     expect(commit).toHaveBeenCalledWith(types.TOGGLE_TUTORIAL);
//   });

//   test('"[types.TOGGLE_TUTORIAL]" to mutate state true/false', () => {
//     mutations[types.TOGGLE_TUTORIAL](state);
//     expect(state.showTutorial).toBe(false);
//     mutations[types.TOGGLE_TUTORIAL](state);
//     expect(state.showTutorial).toBe(true);
//   });
// });
