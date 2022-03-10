import { mount, shallowMount } from "@vue/test-utils";
import { createApp } from "vue";
import * as All from "quasar";
const { Quasar, date } = All;
import actions from "../../../src/store/actions";
import mutations from "../../../src/store/mutations";
import * as types from "../../../src/store/types";
import Vuex from "vuex";

describe("Tests for copy and pasting", () => {
  const App = {}
  const app = createApp(App);
  app.use(Quasar, Vuex);
  let state;
  beforeEach(() => {
    state = {
      componentMap: {
        testComp: {
          componentName: "testComp",
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
      userProps: ['prop1', 'prop2'],
      routes: {
        HomeView: [{componentName: 'testComp', parent: []}],
      },
      activeRoute: 'HomeView',
      pasteTimer: 0,
    };
  });

  test('"[types.copyActiveComponent]" action to commit COPY_ACTIVE_COMPONENT', () => {
    const commit = jest.fn();
    actions[types.copyActiveComponent]({ commit });
    expect(commit).toHaveBeenCalledWith(types.COPY_ACTIVE_COMPONENT);
  });

  test('"[types.COPY_ACTIVE_COMPONENT]" to update state successfully', ()=>{
    mutations[types.SET_ACTIVE_COMPONENT](state, 'testComp');
    mutations[types.COPY_ACTIVE_COMPONENT](state);
    expect(state.copiedComponent.componentName).toBe('testComp');
  })

  test('"[types.PASTE_ACTIVE_COMPONENT]" to update state successfully', () => {
    mutations[types.SET_ACTIVE_COMPONENT](state, 'testComp');
    mutations[types.COPY_ACTIVE_COMPONENT](state);
    mutations[types.PASTE_ACTIVE_COMPONENT](state);
    expect(Object.keys(state.componentMap).length).toBe(2);
  });

  test('"[types.PASTE_ACTIVE_COMPONENT]" to throttle via state paste timer', () => {
    mutations[types.UPDATE_PASTE_TIMER](state);
    expect(state.pasteTimer).not.toBe(0);
  });

});