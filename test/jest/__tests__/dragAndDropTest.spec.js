// /* eslint-disable */
// /**
//  * @jest-environment jsdom
//  */
//  import { mount, createLocalVue, shallowMount } from "@vue/test-utils";

import { useStore } from "../../../src/stores/main.js";
import { describe, test } from "node:test";
import { setActivePinia, createPinia } from "pinia";

 setActivePinia(createPinia());
 const store = useStore();

 describe("Tests drag-and-drop functionality for tree component", () => {
  describe("sets state for Tree drag-and-drop", () => {
    it("setActiveTreeNode sets the active tree node", () => {
      const payload = "testNode";
      expect(store.activeTreeNode).not.toBe(payload);
      store.setActiveTreeNode(payload);
      expect(store.activeTreeNode).toBe(payload);
    });

    it("setPotentialParentNode sets the potential parent node", () => {
      const payload = "testParentNode";
      expect(store.potentialParentNode).not.toBe(payload);
      store.setPotentialParentNode(payload);
      expect(store.potentialParentNode).toBe(payload);
    });
  });

  describe("moveNode updates the componentMap accurately", () => {
    let newComponentMap;
        newComponentMap = {
        App: {
          componentName: "App",
          children: ["HomeView"],
          htmlList: [],
        },
        HomeView: {
          componentName: "HomeView",
          children: ["testParent1", "testParent2"],
          htmlList: [],
        },
        testParent1: {
          componentName: "testParent1",
          parent: {
          componentName: "HomeView",
          children: ["testParent1", "testParent2"],
          htmlList: [],
          },
          children: ["testChild"],
          htmlList: [],
        },
        testParent2: {
          componentName: "testParent2",
          parent: {
          componentName: "HomeView",
          children: ["testParent1", "testParent2"],
          htmlList: [],
          },
          children: [],
          htmlList: [],
        },
        testChild: {
          componentName: "testChild",
          parent: {
            componentName: "testParent1",
            parent: "HomeView",
            children: ["testChild"],
            htmlList: [],
          },
          children: [],
          htmlList: [],
        }
      }
      store.componentMap = newComponentMap;

    const potentialParent = 'testParent2';
    // store.potentialParentNode = potentialParent;
    store.setPotentialParentNode(potentialParent)
    // call moveNode
    store.moveNode('testChild');

    // see if the componentMap got updated correctly
    it("The moved node's new parent becomes potentialParentNode", () => {
      expect(store.componentMap['testChild'].parent.componentName).toBe(potentialParent);
    })
    it("The new parent has the moved node in childrens array", () => {
      expect(store.componentMap['testParent2'].children).toContain('testChild');
    })
    it("The old parent does not have the moved node in childrens array", () => {
      expect(store.componentMap['testParent1'].children).not.toContain('testChild');
    })
  });

})
