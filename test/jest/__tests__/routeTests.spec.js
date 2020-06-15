/* eslint-disable */
/**
 * @jest-environment jsdom
 */
import { mount, createLocalVue, shallowMount } from "@vue/test-utils";
import * as All from "quasar";
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
 * @description: Testing functionality of route actions and mutations
 * `actions:` `addRouteToRouteMap', `setActiveRoute`, `setRoutes`, `deleteRoute`
 * `mutations: ADD_ROUTE, SET_ACTIVE_ROUTE, SET_ROUTES, SET_ACTIVE_ROUTE_ARRAY, ADD_ROUTE_TO_COMPONENT_MAP, DELETE_ROUTE
 * `state:` routes, activeRoute, componentMap, imagePath
 */

describe("Test Suite for route actions and related mutations", () => {
    const localVue = createLocalVue();
    localVue.use(Quasar, Vuex, { components });
    const state = { ...store }
    
    test('"[types.addRouteToRouteMap]" action to commit 4 mutations', () => {
        const commit = jest.fn();
        const payload = 'testRoute';
        actions[types.addRouteToRouteMap]({ state, commit }, payload);
        expect(commit).toHaveBeenCalledWith(types.ADD_ROUTE, payload);
        expect(commit).toHaveBeenCalledWith(types.SET_ACTIVE_ROUTE, payload);
        expect(commit).toHaveBeenCalledWith(types.ADD_ROUTE_TO_COMPONENT_MAP, { route: state.activeRoute , children: [] });
        expect(commit).toHaveBeenCalledWith(types.ADD_COMPONENT_TO_COMPONENT_CHILDREN, { component: 'App', value: state.componentMap[state.activeRoute].componentName});
    });
      
    test('"[types.setActiveRoute]" action to commit SET_ACTIVE_ROUTE mutation with string payload', () => {
      const commit = jest.fn();
      const payload = 'HomeView';
      actions[types.setActiveRoute]({ commit }, payload);
      expect(commit).toHaveBeenCalledWith(types.SET_ACTIVE_ROUTE, payload);
    });

    test('"[types.setRoutes]" action to ---', () => {
      // action is not called anywhere and mutation is not used
    }); 

    test('"[types.deleteRoute]" action to commit DELETE_ROUTE mutation with string payload', () => {
      const commit = jest.fn();
      const payload = 'HomeView';
      actions[types.deleteRoute]({ state, commit }, payload);
      expect(commit).toHaveBeenCalledWith(types.DELETE_ROUTE, payload);
    });

    test('"[types.ADD_ROUTE]" mutation to add new route and set route imagePath to default', () => {
      const payload = 'testRoute';
      mutations[types.ADD_ROUTE]( state, payload);
      expect(state.routes).toMatchObject({ HomeView: [], [payload]: [] });
    });

    test('"[types.SET_ACTIVE_ROUTE]" mutation to ---', () => {
      // console.log(state)
      const payload = 'testRoute';

      // expect at test start for there to be two routes and HomeView to be active Route
      expect(state.routes).toMatchObject({ HomeView: [], [payload]: [] });
      expect(state.activeRoute).toBe('HomeView');

      // start test
      mutations[types.SET_ACTIVE_ROUTE](state, payload);
      expect(state.activeRoute).toBe(payload);
    });

    
    test('"[types.ADD_ROUTE_TO_COMPONENT_MAP]" mutation to add route object containing 3 keys to state.componentMap', () => {
      expect(Object.keys(state.componentMap).length).toBe(2);
      mutations[types.ADD_ROUTE_TO_COMPONENT_MAP](state, { route: state.activeRoute , children: [] });
      // console.log('post: ', state.componentMap)
      expect(Object.keys(state.componentMap).length).toBe(3);
      // to contain componentName, children, and htmlList keys
      expect(Object.keys(state.componentMap[state.activeRoute])).toMatchObject([ 'componentName', 'children', 'htmlList' ])
    });
    
    test('"[types.ADD_COMPONENT_TO_COMPONENT_CHILDREN]" mutation to add created route as one of Apps children', () => {
      let component = 'App';
      let value = state.componentMap[state.activeRoute].componentName;
      // console.log('pre: ', state.componentMap[component].children);
      expect(state.componentMap[component].children.length).toBe(1);
      mutations[types.ADD_COMPONENT_TO_COMPONENT_CHILDREN](state, {component, value});
      // console.log('post: ', state.componentMap[component].children);
      expect(state.componentMap[component].children.length).toBe(2);
      expect(state.componentMap[component].children[state.componentMap[component].children.length-1]).toBe(value);
      
    });
    
    test('"[types.DELETE_ROUTE]" mutation to ---', () => {
      const payload = 'testRoute';
      let flag = false;
      // pre mutation tests
      expect(state.routes[payload]).not.toBe(undefined)
      expect(state.componentMap[payload]).not.toBe(undefined)
      expect(state.imagePath[payload]).not.toBe(undefined)
      if (state.activeRoute === payload) {
        // console.log(state.activeRoute)
        flag = true;
      }
      mutations[types.DELETE_ROUTE](state, payload);

      // post mutation tests
      expect(state.routes[payload]).toBe(undefined)
      expect(state.componentMap[payload]).toBe(undefined)
      expect(state.imagePath[payload]).toBe(undefined)
      if (flag) {
        expect(state.activeRoute).not.toBe(payload)
      }
      
    });
    
    test('"[types.SET_ACTIVE_ROUTE_ARRAY]" mutation to set state.routes[state.activeRoute] to newActiveRouteArray', () => {
      // invoked by delete active component action
      const newActiveRouteArray = state.routes[state.activeRoute];
      mutations[types.SET_ACTIVE_ROUTE_ARRAY](state, newActiveRouteArray);
      expect(state.routes[state.activeRoute]).toBe(newActiveRouteArray);
    });
    
    

  });
  