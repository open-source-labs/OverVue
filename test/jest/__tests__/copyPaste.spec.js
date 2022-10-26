// import { mount, shallowMount } from "@vue/test-utils";
import { createApp } from "vue";
import * as All from "quasar";
import { setActivePinia, createPinia } from 'pinia'
import * as types from "../../../types";
import { useStore } from "src/store/main.js";
// import Vuex from "vuex";
const { Quasar, date } = All;
// import actions from "../../../src/store/options/actions";
// import mutations from "../../../src/store/options/mutations";
// import * as types from "../../../src/store/options/types";

describe("Tests for copy and pasting", () => {
  const App = {};
  const app = createApp(App);
  const pinia = setActivePinia(createPinia());
  app.use(Quasar, pinia);
  //  app.use(Quasar, Vuex);
const store = useStore();
  // let state;
  beforeEach(() => {
    store.componentMap = {
          testComp: {
            componentName: "testComp",
            children: [],
            htmlList: [],
            componentActions: [],
            state: ["state1", "state2"],
            actions: ["action1", "action2"],
          }
        };
    store.activeComponent = "test";
    store.userState = ["state1", "state2"];
    store.userActions = ["action1", "action2"];
    store.userProps = ["prop1", "prop2"];
    store.routes = {
        HomeView: [{ componentName: "testComp", parent: [] }]
      };
    store.activeRoute = "HomeView";
    store.pasteTimer = 0;
    });
    // state = {
    //   componentMap: {
    //     testComp: {
    //       componentName: "testComp",
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
    //   routes: {
    //     HomeView: [{ componentName: "testComp", parent: [] }],
    //   },
    //   activeRoute: "HomeView",
    //   pasteTimer: 0,
    // };


  // test('"[types.copyActiveComponent]" action to commit COPY_ACTIVE_COMPONENT', () => {
  //   const commit = jest.fn();
  //   actions[types.copyActiveComponent]({ commit });
  //   expect(commit).toHaveBeenCalledWith(types.COPY_ACTIVE_COMPONENT);
  // });

  test('"function copyActiveComponent to update state successfully', () => {
    store.setActiveComponent("testComp");
    store.copyActiveComponent;
    expect(store.copiedComponent.componentName).toBe("testComp");
  });

  // test('"[types.COPY_ACTIVE_COMPONENT]" to update state successfully', () => {
  //   mutations[types.SET_ACTIVE_COMPONENT](state, "testComp");
  //   mutations[types.COPY_ACTIVE_COMPONENT](state);
  //   expect(state.copiedComponent.componentName).toBe("testComp");
  // });


  test('"function pasteActiveComponent to update state successfully', () => {
    store.setActiveComponent("testComp");
    store.copyActiveComponent();
    store.pasteActiveComponent();
    expect(Object.keys(store.componentMap).length).toBe(2);
  });

  // test('"[types.PASTE_ACTIVE_COMPONENT]" to update state successfully', () => {
  //   mutations[types.SET_ACTIVE_COMPONENT](state, "testComp");
  //   mutations[types.COPY_ACTIVE_COMPONENT](state);
  //   mutations[types.PASTE_ACTIVE_COMPONENT](state);
  //   expect(Object.keys(state.componentMap).length).toBe(2);
  // });

  test('function pasteActiveComponent to throttle via state paste timer', () => {
    store.updatePasteTimer();
    expect(store.pasteTimer).not.toBe(0);
  });

  // test('"[types.PASTE_ACTIVE_COMPONENT]" to throttle via state paste timer', () => {
  //   mutations[types.UPDATE_PASTE_TIMER](state);
  //   expect(state.pasteTimer).not.toBe(0);
  // });
});
