/* eslint-disable */
/**
 * @jest-environment jsdom
 */
import mutations from "../../../src/store/options/mutations";
import actions from "../../../src/store/options/actions";
import * as types from "../../../src/store/options/types";
import { mount, createLocalVue, shallowMount } from "@vue/test-utils";
import * as All from "quasar";
const { Quasar, date } = All;

/**
 * @description: Testing functionality of HTML element mutations and actions
 * `actions:` `addNestedHtml', `AddNestedNoActive`, `setActiveHTML`, `setActiveLayer`,
 * `upOneLayer`,  `deleteFromComponentHtmlList`, `deleteSelectedElement`
 * `mutations: SET_ACTIVE_LAYER, UP_ONE_LAYER, ADD_TO_SELECTED_ELEMENT_LIST, SET_SELECTED_ELEMENT_LIST,
 * ADD_TO_COMPONENT_HTML_LIST, ADD_NESTED_HTML, ADD_NESTED_NO_ACTIVE, DELETE_FROM_COMPONENT_HTML_LIST,
 * DELETE_SELECTED_ELEMENT, SET_ACTIVE_HTML_ELEMENT
 */

let hardA = {
  componentName: "a",
  htmlList: [
    {
      children: [
        {
          children: [
            {
              text: "button",
              children: [],
              id: Date.now() + 1,
            },
          ],
          text: "form",
          id: Date.now() + 2,
        },
      ],
      text: "div",
      id: Date.now() + 3,
    },
  ],
  children: [],
  parent: {},
  isActive: false,
};

const newState = {
  componentMap: {
    App: {
      componentName: "App",
      children: ["HomeView"],
      htmlList: [],
    },
    HomeView: {
      componentName: "HomeView",
      children: ["a"],
      children: [],
      htmlList: [],
    },
    a: hardA,
  },
  routes: {
    HomeView: [hardA],
    NewView: [],
  },
  componentNameInputValue: "",
  activeRoute: "HomeView",
  activeComponent: "",
  activeHTML: "",
  activeLayer: {
    id: "",
    lineage: [],
  },

  selectedElementList: [],
};

describe("Tests for navigating layers in HTML elements", () => {
  let state;
  beforeAll(() => {
    state = newState;
    state.activeComponent = "a";
    state.componentMap.a = hardA;
  });
  it("setting active layer should update state.activeLayer, add id to lineage array, and clear state.activeHTML", () => {
    (state.activeHTML = "div"),
      (state.activeLayer = {
        id: "",
        lineage: [],
      });
    const element = { text: "form", id: state.componentMap.a.htmlList[0].id };

    mutations.SET_ACTIVE_LAYER(state, element);
    expect(state.activeHTML).toBe("");
    expect(state.activeLayer.id).toBe(element.id);
    expect(state.activeLayer.lineage[0]).toBe(element.text);
  });

  it("up one layer", () => {
    // payload is an id
    // activeLayer should be reset if lineage has only one element
    mutations.UP_ONE_LAYER(state, state.activeLayer.id);
    expect(state.activeLayer.id).toBe("");
    expect(state.activeLayer.lineage.length).toBe(0);

    // multiple elements in lineage
    const div = { text: "div", id: state.componentMap.a.htmlList[0].id };
    const button = {
      text: "button",
      id: state.componentMap.a.htmlList[0].children[0].id,
    };

    mutations.SET_ACTIVE_LAYER(state, div);

    let parentId = state.activeLayer.id;
    let parentLength = state.activeLayer.lineage.length;

    mutations.SET_ACTIVE_LAYER(state, button);
    mutations.UP_ONE_LAYER(state, state.activeLayer.id);

    expect(state.activeLayer.id).toBe(parentId);
    expect(state.activeLayer.lineage.length).toBe(parentLength);
  });

  it("set active html element", () => {
    mutations.SET_ACTIVE_HTML_ELEMENT(state, [""]);
    expect(state.activeHTML).toBe("");
    const payload = ["div", 0, state.componentMap.a.htmlList[0].id];
    mutations.SET_ACTIVE_HTML_ELEMENT(state, payload);
    expect(state.activeHTML).toBe(state.componentMap.a.htmlList[0].id);
  });

  it("add nested html", () => {
    const element = {
      date: Date.now(),
      elementName: "link",
    };
    mutations.ADD_NESTED_HTML(state, element);
    let htmlList = state.componentMap.a.htmlList[0].children;
    expect(htmlList[htmlList.length - 1]).toBeInstanceOf(Object);
    expect(htmlList[htmlList.length - 1].text).toBe(element.elementName);
    expect(htmlList[htmlList.length - 1].id).toBe(element.date);
    expect(htmlList[htmlList.length - 1].children.length).toBe(0);
  });

  it("add nested no active", () => {
    const element = {
      date: Date.now(),
      elementName: "list",
    };
    mutations.ADD_NESTED_NO_ACTIVE(state, element);
    let htmlList = state.componentMap.a.htmlList[0].children;

    expect(htmlList[htmlList.length - 1]).toBeInstanceOf(Object);
    expect(htmlList[htmlList.length - 1].text).toBe(element.elementName);
    expect(htmlList[htmlList.length - 1].id).toBe(element.date);
    expect(htmlList[htmlList.length - 1].children.length).toBe(0);
  });

  it("add to component html list", () => {
    const element = {
      elementName: "button",
      date: Date.now(),
    };
    mutations.ADD_TO_COMPONENT_HTML_LIST(state, element);
    let htmlList = state.componentMap[state.activeComponent].htmlList;
    expect(htmlList[htmlList.length - 1].text).toBe(element.elementName);
    expect(htmlList[htmlList.length - 1].id).toBe(element.date);
    expect(htmlList[htmlList.length - 1].children.length).toBe(0);
  });

  it("delete from component html list", () => {
    let htmlList = state.componentMap[state.activeComponent].htmlList;
    let id = htmlList[0].children[0].id;
    mutations.DELETE_FROM_COMPONENT_HTML_LIST(state, id);
    const filtered = htmlList.filter((el) => el.id === id);
    expect(filtered.length).toBe(0);
  });

  it("add to selected element list", () => {
    const element = {
      elementName: "form",
      date: Date.now(),
    };
    mutations.ADD_TO_SELECTED_ELEMENT_LIST(state, element);
    let newElement =
      state.selectedElementList[state.selectedElementList.length - 1];

    expect(newElement.text).toBe(element.elementName);
    expect(newElement.id).toBe(element.date);
    expect(newElement.children.length).toBe(0);
  });

  it("delete selected element", () => {
    const element = { elementName: "form", date: Date.now() };
    const element2 = { elementName: "div", date: Date.now() + 1 };
    const element3 = { elementName: "div", date: Date.now() + 2 };

    mutations.ADD_TO_SELECTED_ELEMENT_LIST(state, element2);
    mutations.ADD_TO_SELECTED_ELEMENT_LIST(state, element3);

    const length = state.selectedElementList.length;

    mutations.DELETE_SELECTED_ELEMENT(state, 1);
    expect(state.selectedElementList.length).toBe(length - 1);
    state.selectedElementList.forEach((e) => {
      expect(e).not.toEqual(element2);
      expect(e.id).not.toBe(element2.date);
    });

    mutations.DELETE_SELECTED_ELEMENT(state, 0);
    expect(state.selectedElementList.length).toBe(length - 2);
    expect(state.selectedElementList[0]).not.toEqual(element);
    expect(state.selectedElementList[0].id).not.toBe(element.id);
  });
});

describe("tests for HTML element actions", () => {
  test('"[types.addNestedHTML]" action calls the "ADD_NESTED_HTML" mutation', () => {
    const element = {
      date: Date.now(),
      elementName: "div",
    };
    const commit = jest.fn();
    actions[types.addNestedHTML]({ commit }, element);
    expect(commit).toHaveBeenCalledWith("ADD_NESTED_HTML", element);
  });

  test('"[types.addNestedNoActive]" action calls the "ADD_NESTED_NO_ACTIVE" mutation', () => {
    const element = {
      date: Date.now(),
      elementName: "div",
    };
    const commit = jest.fn();
    actions[types.addNestedNoActive]({ commit }, element);
    expect(commit).toHaveBeenCalledWith("ADD_NESTED_NO_ACTIVE", element);
  });

  test('"[types.setActiveHTML]" action calls the "SET_ACTIVE_HTML mutation', () => {
    const element = ["div", 0, Date.now()];
    const commit = jest.fn();
    actions[types.setActiveHTML]({ commit }, element);
    expect(commit).toHaveBeenCalledWith("SET_ACTIVE_HTML_ELEMENT", element);
  });

  test('"[types.setActiveLayer]" action calls the "SET_ACTIVE_LAYER" mutation', () => {
    const element = { text: "form", id: Date.now() };
    const commit = jest.fn();
    actions[types.setActiveLayer]({ commit }, element);
    expect(commit).toHaveBeenCalledWith("SET_ACTIVE_LAYER", element);
  });

  test('"[types.upOneLayer]" action calls the "UP_ONE_LAYER" mutation', () => {
    const id = Date.now();
    const commit = jest.fn();
    actions[types.upOneLayer]({ commit }, id);
    expect(commit).toHaveBeenCalledWith("UP_ONE_LAYER", id);
  });

  test('"[types.deleteFromComponentHtmlList]" action calls the "DELETE_FROM_COMPONENT_HTML_LIST" mutation', () => {
    const id = Date.now();
    const commit = jest.fn();
    actions[types.deleteFromComponentHtmlList]({ commit }, id);
    expect(commit).toHaveBeenCalledWith("DELETE_FROM_COMPONENT_HTML_LIST", id);
  });

  test('"[types.deleteSelectedElement]" action calls the "DELETE_SELECTED_ELEMENT" mutation', () => {
    const idx = 0;
    const commit = jest.fn();
    actions[types.deleteSelectedElement]({ commit }, idx);
    expect(commit).toHaveBeenCalledWith("DELETE_SELECTED_ELEMENT", idx);
  });

  test('"[types.setClickedElementList]" action calls the "SET_CLICKED_ELEMENT_LIST" mutation', () => {
    const element = { text: "form", id: Date.now() };
    const commit = jest.fn();
    actions[types.setClickedElementList]({ commit }, element);
    expect(commit).toHaveBeenCalledWith("SET_CLICKED_ELEMENT_LIST", element);
  });
});
