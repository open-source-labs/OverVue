import { mount, shallowMount } from "@vue/test-utils";
import { createApp } from "vue";
import * as All from "quasar";
const { Quasar, date } = All;
import actions from "../../../src/store/actions";
import mutations from "../../../src/store/mutations";
import * as types from "../../../src/store/types";
import Vuex from "vuex";
import store from "../../../src/store/state/index";

describe("Tests for copy and pasting", () => {
  const App = {}
  const app = createApp(App);
  app.use(Quasar, Vuex);
  const state = { ...store }

  test('"[types.copyActiveComponent]" action to commit COPY_ACTIVE_COMPONENT', () => {
    const commit = jest.fn();
    actions[types.copyActiveComponent]({ commit }, {});
    expect(commit).toHaveBeenCalledWith(types.COPY_ACTIVE_COMPONENT, {});
  });
  test('"[types.pasteActiveComponent]" action to commit PASTE_ACTIVE_COMPONENT', () => {
    const commit = jest.fn();
    actions[types.pasteActiveComponent]({ commit }, {});
    expect(commit).toHaveBeenCalledWith(types.PASTE_ACTIVE_COMPONENT, {});
  });


});