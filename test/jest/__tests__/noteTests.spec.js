import { mount, shallowMount } from "@vue/test-utils";
import { createApp } from "vue";
import * as All from "quasar";
const { Quasar, date } = All;
import actions from "../../../src/stores/options/actions";
import mutations from "../../../src/stores/options/mutations";
import * as types from "../../../src/stores/options/types";
import Vuex from "vuex";
import store from "../../../src/stores/state/index";

describe("Test for component note data population", () => {
  const App = {};
  const app = createApp(App);
  app.use(Quasar, Vuex);
  const state = { ...store };

  //tests that ADD_ACTIVE_COMPONENT_NOTE mutation successfully populates activeComponent with notes
  test('"[types.ADD_ACTIVE_COMPONENT_NOTE]" to update state successfully', () => {
    mutations[types.ADD_COMPONENT_TO_COMPONENT_MAP](state, {
      componentName: "testComponent",
    });
    mutations[types.SET_ACTIVE_COMPONENT](state, "testComponent");
    mutations[types.ADD_ACTIVE_COMPONENT_NOTE](state, "test note here");
    expect(state.componentMap[state.activeComponent].noteList[0]).toEqual(
      "test note here"
    );
    mutations[types.ADD_ACTIVE_COMPONENT_NOTE](state, "another test here");
    expect(state.componentMap[state.activeComponent].noteList[1]).toEqual(
      "another test here"
    );
  });

  //tests that the action addActiveComponentNote commits the mutation
  test('"[types.addActiveComponentNote]" action to commit ADD_ACTIVE_COMPONENT_NOTE', () => {
    const commit = jest.fn();
    actions[types.addActiveComponentNote]({ commit }, "test note");
    expect(commit).toHaveBeenCalledWith(
      types.ADD_ACTIVE_COMPONENT_NOTE,
      "test note"
    );
  });

  //tests that DELETE_ACTIVE_COMPONENT_NOTE mutation successfully deletes activeComponent notes
  test('"[types.DELETE_ACTIVE_COMPONENT_NOTE]" to update state successfully', () => {
    mutations[types.DELETE_ACTIVE_COMPONENT_NOTE](state, "test note here");
    expect(state.componentMap[state.activeComponent].noteList[0]).toEqual(
      "another test here"
    );
    mutations[types.DELETE_ACTIVE_COMPONENT_NOTE](state, "another test here");
    expect(state.componentMap[state.activeComponent].noteList.length).toEqual(
      0
    );
  });

  test('"[types.deleteActiveComponentNote]" action to commit DELETE_ACTIVE_COMPONENT_NOTE', () => {
    const commit = jest.fn();
    actions[types.deleteActiveComponentNote]({ commit }, "test note");
    expect(commit).toHaveBeenCalledWith(
      types.DELETE_ACTIVE_COMPONENT_NOTE,
      "test note"
    );
  });

  test("expect mutation to check and handle for duplicate note entry", () => {
    mutations[types.ADD_ACTIVE_COMPONENT_NOTE](state, "test note here");
    mutations[types.ADD_ACTIVE_COMPONENT_NOTE](state, "test note here");
    expect(state.componentMap[state.activeComponent].noteList[1]).toEqual(
      "DUPLICATE: test note here"
    );
  });

  test('"[types.openNoteModal]" action to commit OPEN_NOTE_MODAL', () => {
    const commit = jest.fn();
    actions[types.openNoteModal]({ commit });
    expect(commit).toHaveBeenCalledWith(types.OPEN_NOTE_MODAL);
  });

  test('"[types.OPEN_NOTE_MODAL]" to update state successfully', () => {
    mutations[types.OPEN_NOTE_MODAL](state);
    expect(state.noteModalOpen).toEqual(true);
    mutations[types.OPEN_NOTE_MODAL](state);
    expect(state.noteModalOpen).toEqual(false);
  });
});
