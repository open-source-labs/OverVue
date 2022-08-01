/* eslint-disable */
/**
 * @jest-environment jsdom
 */
import mutations from "../../../src/store/mutations";
import actions from "../../../src/store/actions";

import * as All from "quasar";
import { inRange } from "lodash";
import { iterate } from "localforage";
const { Quasar, date } = All;

/**
 * @description: Tests for adding/changing attributes
 * @summary:
 *  `addBinding mutation should alter/add binding property on hmtlList or hmtlAttribute
 *  `
 *  `
 */

let hardB = {
  componentName: "b",
  htmlList: [{
    children: [{
      children: [{
        text: 'button',
        children: [],
        id: Date.now() + 1,
        binding: '',
        class: ''
      }],
      text: 'form',
      id: Date.now() + 2
    }],
    text: "div",
    id: Date.now() + 3
  }],
  children: [],
  parent: {},
  isActive: false
}

const newState = {
  componentMap: {
    App: {
      componentName: 'App',
      children: ['HomeView'],
      htmlList: []
    },
    HomeView: {
      componentName: 'HomeView',
      children: ['b'],
      children: [],
      htmlList: []
    },
    a: hardB
  },
  routes: {
    HomeView: [hardB],
    NewView: []
  },
  componentNameInputValue: '',
  activeRoute: 'HomeView',
  activeComponent: '',
  activeHTML: '',
  activeLayer: {
    id: '',
    lineage: []
  },

  selectedElementList: [],
}

describe("testing for binding attribute", () => {
  let state;
  beforeEach(() => {
    state = newState;
    state.activeComponent = 'b';
    state.componentMap.b = hardB;
  });
  it("adding a binding attribute", () => {
    sa
  })
})