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
 * @description: Testing functionality of the openProject action and following mutations
 * `actions:` `openProject'
 * `mutations: `SET_IMAGE_PATH`, `SET_COMPONENT_PATH`, `SET_ROUTES`
 * `state:` `imagePath`, `Component_Map`, `routes`
 */

describe("Test Suite for Image Upload", () => {
    const localVue = createLocalVue();
    localVue.use(Quasar, Vuex, { components });
    const payload = {"icons":{"div":"far fa-square fa-lg","button":"fas fa-toggle-off fa-lg","form":"fab fa-wpforms fa-lg","img":"far fa-image fa-lg","link":"fas fa-link fa-lg","list":"fas fa-circle fa-lg","paragraph":"fas fa-paragraph fa-lg","list-ol":"fas fa-list-ol fa-lg","list-ul":"fas fa-list-ul fa-lg","input":"fas fa-pen fa-lg","navbar":"fas fa-window-maximize fa-lg"},
        "htmlElementMap":{"div":["<div>","</div>"],"button":["<button>","</button>"],"form":["<form>","</form>"],"img":["<img>",""],"link":["<a href=\"#\"/>",""],"list":["<li>","</li>"],"paragraph":["<p>","</p>"],"list-ol":["<ol>","</ol>"],"list-ul":["<ul>","</ul>"],"input":["<input />",""],"navbar":["<nav>","</nav>"]},
        "componentMap":{"App":{"componentName":"App","children":["HomeView","b"],"htmlList":[]},
            "HomeView":{"componentName":"HomeView","children":["a"],"htmlList":[]},
            "a":{"componentName":"a","x":0,"y":0,"z":0,"w":200,"h":200,"children":[],"parent":{},"htmlList":[],"isActive":false},
            "b":{"componentName":"b","children":[],"htmlList":[]}
        },
        "routes":{"HomeView":[{"componentName":"a","x":0,"y":20,"z":0,"w":200,"h":200,"htmlList":[],"children":[],"parent":{},"isActive":false}],"b":[]},
        "userActions":[],
        "userState":{},
        "componentNameInputValue":"",
        "projects":[{"filename":"test.json","lastSavedLocation":"/Users/joju/Desktop/test.json"}],
        "activeRoute":"b","activeComponent":"","activeHTML":"","activeLayer":{"id":"","lineage":[]},
        "selectedElementList":[],
        "projectNumber":2,"activeTab":0,
        "componentChildrenMultiselectValue":[],
        "modalOpen":false,"parentSelected":"",
        "imagePath":{"HomeView":"/Users/joju/Desktop/bootstrap1.png","b":""}
    }

    test('"[types.openProject]" action calls set_image_path, set_component_map, and set_routes', () => {
        const commit = jest.fn();
        actions[types.openProject]({ commit }, payload);
        expect(commit).toHaveBeenCalledWith("SET_IMAGE_PATH", payload.imagePath);
        expect(commit).toHaveBeenCalledWith("SET_COMPONENT_MAP", payload.componentMap);
        expect(commit).toHaveBeenCalledWith("SET_ROUTES", payload.routes);
      });
    
    test('"[types.SET_IMAGE_PATH]" mutation expect add payload to imagePath object in state', ()=>{
        const openState = {
            imagePath: {
                HomeView: '',
            }
        }
        // mutation takes our state, and our payload which is payload.imagePath
        mutations[types.SET_IMAGE_PATH](openState, payload.imagePath);
        // console.log(openState.imagePath, { ...openState.imagePath, ... payload.imagePath})
        expect(openState.imagePath).toMatchObject({ ...openState.imagePath, ... payload.imagePath});
    });
    test('"[types.SET_COMPONENT_MAP]" mutation expect state.componentMap object to match payload.componentMap', ()=>{
        const openState = {
            componentMap: {
                App: {
                  componentName: 'App',
                  children: ['HomeView'],
                  htmlList: []
                },
                HomeView: {
                  componentName: 'HomeView',
                  children: [],
                  htmlList: []
                }
              }
        }
        // mutation takes in payload of payload.componentMap
        mutations[types.SET_COMPONENT_MAP](openState, payload.componentMap);
        expect(openState.componentMap).toMatchObject(payload.componentMap);
    });
    test('"[types.SET_ROUTES]" mutation expect state.routes object to match payload.routes ', ()=>{
        const openState = {
            routes: {
                HomeView: []
              }
        }

        // mutation takes in payload of payload.routes
        mutations[types.SET_ROUTES](openState, payload.routes);
        expect(openState.routes).toMatchObject(payload.routes);
    });

  });
  