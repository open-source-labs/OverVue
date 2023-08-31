/* eslint-disable */
/**
 * @jest-environment jsdom
 */
 import { mount, createLocalVue, shallowMount } from "@vue/test-utils";
 import * as All from "quasar";
 import { iterate } from "localforage";
 import { useStore } from "../../../src/store/main.js";
 import { createTestingPinia } from "@pinia/testing";
 const { Quasar, date } = All;
 
 /**
  * @description: Testing mutations and actions related to the Drag and Drop functionality of html elements
  * in the HTMLQueue and the CreateMenuHTMLQueue components.
  * `actions:` `setIdDrag', `setIdDrop`, `setSelectedIdDrag`, `setSelectedIdDrop`,
  * `dragDropSortHtmlElements`,  `dragDropSortSelectedHtmlElements`
  * `mutations: SET_ID_DRAG, SET_ID_DROP, SET_SELECTED_ID_DRAG, SET_SELECTED_ID_DROP,
  * DRAG_DROP_SORT_HTML_ELEMENTS, DRAG_DROP_SORT_SELECTED_HTML_ELEMENTS
  */
 let aHtmlList = [
   {
     text: "div",
     children: [],
     id: Date.now() + 1,
   },
   {
     children: [],
     text: "img",
     id: Date.now() + 2,
   },
   {
     children: [],
     text: "paragraph",
     id: Date.now() + 3,
   },
 ];
 
 let hardA = {
   componentName: "a",
   htmlList: [...aHtmlList],
   children: [],
   parent: {},
   isActive: false,
   idDrag: "",
   idDrop: "",
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
   selectedIdDrag: "",
   selectedIdDrop: "",
   selectedElementList: [],
 };
 
 const store = useStore();

 describe("Tests for html elements drag-and-drop functionality", () => {
   describe("Test drag and drop functionality in active components", () => {
     let state;
     beforeEach(() => {
       state = newState;
       state.activeComponent = "a";
       hardA.htmlList = aHtmlList;
       state.componentMap.a = hardA;
     });
 
     afterEach(() => {
       state = newState;
       state.activeComponent = "a";
       hardA.htmlList = aHtmlList;
       state.componentMap.a = hardA;
     });

     it("identify the id of the html element being dragged", () => {
       store.setIdDrag(state, hardA.htmlList[0].id);
       expect(state.componentMap[hardA.componentName].idDrag).toBe(
         hardA.htmlList[0].id
       );
     });
 
     it("identify the id of the html element the dragged html element is dropped over", () => {
      store.setIdDrag(state, hardA.htmlList[2].id);
       expect(state.componentMap[hardA.componentName].idDrop).toBe(
         hardA.htmlList[2].id
       );
     });
 
     it("dropped html element is moved to location it was dropped", () => {
      store.setIdDrag(state, hardA.htmlList[0].id);
      store.setIdDrag(state, hardA.htmlList[2].id);
      store.setIdDrag(state);
       expect(state.componentMap[hardA.componentName].htmlList[2].text).toBe(
         "div"
       );
     });
 
     it("remainder html elements are still in order", () => {
      store.setIdDrag(state, hardA.htmlList[0].id);
      store.setIdDrag(state, hardA.htmlList[2].id);
      store.dragDropSortHtmlElements(state);
       expect(state.componentMap[hardA.componentName].htmlList[0].text).toBe(
         "img"
       );
       expect(state.componentMap[hardA.componentName].htmlList[1].text).toBe(
         "paragraph"
       );
       expect(state.componentMap[hardA.componentName].htmlList[2].text).toBe(
         "div"
       );
     });
 
     it("idDrag and idDrop is reset to '' ", () => {
      store.setIdDrag(state, hardA.htmlList[0].id);
      store.setIdDrag(state, hardA.htmlList[2].id);
      store.dragDropSortHtmlElements(state);
       expect(state.componentMap[hardA.componentName].idDrag).toBe("");
       expect(state.componentMap[hardA.componentName].idDrop).toBe("");
     });
   });
 
   describe("Test drag and drop functionality in the CreateMenu", () => {
     let state;
     beforeEach(() => {
       state = newState;
       state.selectedElementList = [
         {
           text: "div",
           children: [],
           id: Date.now() + 1,
         },
         {
           children: [],
           text: "img",
           id: Date.now() + 2,
         },
         {
           children: [],
           text: "paragraph",
           id: Date.now() + 3,
         },
       ];
     });
 
     afterEach(() => {
       state = newState;
       state.selectedElementList = [
         {
           text: "div",
           children: [],
           id: Date.now() + 1,
         },
         {
           children: [],
           text: "img",
           id: Date.now() + 2,
         },
         {
           children: [],
           text: "paragraph",
           id: Date.now() + 3,
         },
       ];
     });
     it("identify the id of the html element being dragged", () => {
       store.setSelectedIdDrag(
         state,
         state.selectedElementList[0].id
       );
       expect(state.selectedIdDrag).toBe(state.selectedElementList[0].id);
     });
 
     it("identify the id of the html element the dragged html element is dropped over", () => {
       store.setSelectedIdDrop(
         state,
         state.selectedElementList[2].id
       );
       expect(state.selectedIdDrop).toBe(state.selectedElementList[2].id);
     });
 
     it("dropped html element is moved to location it was dropped", () => {
      store.setSelectedIdDrag(
         state,
         state.selectedElementList[0].id
       );
       store.setSelectedIdDrop(
         state,
         state.selectedElementList[2].id
       );
       store.dragDropSortSelectedHtmlElements(state);
       expect(state.selectedElementList[2].text).toBe("div");
     });
 
     it("remainder html elements are still in order", () => {
       store.setSelectedIdDrag(
         state,
         state.selectedElementList[0].id
       );
       store.setSelectedIdDrop(
         state,
         state.selectedElementList[2].id
       );
       store.dragDropSortSelectedHtmlElements(state);
       expect(state.selectedElementList[0].text).toBe("img");
       expect(state.selectedElementList[1].text).toBe("paragraph");
       expect(state.selectedElementList[2].text).toBe("div");
     });
 
     it("selectedIdDDrag and selectedIdDrop is reset to '' ", () => {
       store.setSelectedIdDrag(
         state,
         state.selectedElementList[0].id
       );
       store.setSelectedIdDrop(
         state,
         state.selectedElementList[2].id
       );
       store.dragDropSortSelectedHtmlElements(state);
       expect(state.selectedIdDrag).toBe("");
       expect(state.selectedIdDrop).toBe("");
     });
   });
 });
 




//old VueX jest test
// /* eslint-disable */
// /**
//  * @jest-environment jsdom
//  */
// import mutations from "../../../src/store/options/mutations";
// import actions from "../../../src/store/options/actions";
// import * as types from "../../../src/store/options/types";
// import { mount, createLocalVue, shallowMount } from "@vue/test-utils";
// import * as All from "quasar";
// import { iterate } from "localforage";
// const { Quasar, date } = All;

// /**
//  * @description: Testing mutations and actions related to the Drag and Drop functionality of html elements
//  * in the HTMLQueue and the CreateMenuHTMLQueue components.
//  * `actions:` `setIdDrag', `setIdDrop`, `setSelectedIdDrag`, `setSelectedIdDrop`,
//  * `dragDropSortHtmlElements`,  `dragDropSortSelectedHtmlElements`
//  * `mutations: SET_ID_DRAG, SET_ID_DROP, SET_SELECTED_ID_DRAG, SET_SELECTED_ID_DROP,
//  * DRAG_DROP_SORT_HTML_ELEMENTS, DRAG_DROP_SORT_SELECTED_HTML_ELEMENTS
//  */
// let aHtmlList = [
//   {
//     text: "div",
//     children: [],
//     id: Date.now() + 1,
//   },
//   {
//     children: [],
//     text: "img",
//     id: Date.now() + 2,
//   },
//   {
//     children: [],
//     text: "paragraph",
//     id: Date.now() + 3,
//   },
// ];

// let hardA = {
//   componentName: "a",
//   htmlList: [...aHtmlList],
//   children: [],
//   parent: {},
//   isActive: false,
//   idDrag: "",
//   idDrop: "",
// };

// const newState = {
//   componentMap: {
//     App: {
//       componentName: "App",
//       children: ["HomeView"],
//       htmlList: [],
//     },
//     HomeView: {
//       componentName: "HomeView",
//       children: ["a"],
//       children: [],
//       htmlList: [],
//     },
//     a: hardA,
//   },
//   routes: {
//     HomeView: [hardA],
//     NewView: [],
//   },
//   componentNameInputValue: "",
//   activeRoute: "HomeView",
//   activeComponent: "",
//   activeHTML: "",
//   activeLayer: {
//     id: "",
//     lineage: [],
//   },
//   selectedIdDrag: "",
//   selectedIdDrop: "",
//   selectedElementList: [],
// };

// describe("Tests for html elements drag-and-drop functionality", () => {
//   describe("Test drag and drop functionality in active components", () => {
//     let state;
//     beforeEach(() => {
//       state = newState;
//       state.activeComponent = "a";
//       hardA.htmlList = aHtmlList;
//       state.componentMap.a = hardA;
//     });

//     afterEach(() => {
//       state = newState;
//       state.activeComponent = "a";
//       hardA.htmlList = aHtmlList;
//       state.componentMap.a = hardA;
//     });
//     it("identify the id of the html element being dragged", () => {
//       mutations[types.SET_ID_DRAG](state, hardA.htmlList[0].id);
//       expect(state.componentMap[hardA.componentName].idDrag).toBe(
//         hardA.htmlList[0].id
//       );
//     });

//     it("identify the id of the html element the dragged html element is dropped over", () => {
//       mutations[types.SET_ID_DROP](state, hardA.htmlList[2].id);
//       expect(state.componentMap[hardA.componentName].idDrop).toBe(
//         hardA.htmlList[2].id
//       );
//     });

//     it("dropped html element is moved to location it was dropped", () => {
//       mutations[types.SET_ID_DRAG](state, hardA.htmlList[0].id);
//       mutations[types.SET_ID_DROP](state, hardA.htmlList[2].id);
//       mutations[types.DRAG_DROP_SORT_HTML_ELEMENTS](state);
//       expect(state.componentMap[hardA.componentName].htmlList[2].text).toBe(
//         "div"
//       );
//     });

//     it("remainder html elements are still in order", () => {
//       mutations[types.SET_ID_DRAG](state, hardA.htmlList[0].id);
//       mutations[types.SET_ID_DROP](state, hardA.htmlList[2].id);
//       mutations[types.DRAG_DROP_SORT_HTML_ELEMENTS](state);
//       expect(state.componentMap[hardA.componentName].htmlList[0].text).toBe(
//         "img"
//       );
//       expect(state.componentMap[hardA.componentName].htmlList[1].text).toBe(
//         "paragraph"
//       );
//       expect(state.componentMap[hardA.componentName].htmlList[2].text).toBe(
//         "div"
//       );
//     });

//     it("idDrag and idDrop is reset to '' ", () => {
//       mutations[types.SET_ID_DRAG](state, hardA.htmlList[0].id);
//       mutations[types.SET_ID_DROP](state, hardA.htmlList[2].id);
//       mutations[types.DRAG_DROP_SORT_HTML_ELEMENTS](state);
//       expect(state.componentMap[hardA.componentName].idDrag).toBe("");
//       expect(state.componentMap[hardA.componentName].idDrop).toBe("");
//     });
//   });

//   describe("Test drag and drop functionality in the CreateMenu", () => {
//     let state;
//     beforeEach(() => {
//       state = newState;
//       state.selectedElementList = [
//         {
//           text: "div",
//           children: [],
//           id: Date.now() + 1,
//         },
//         {
//           children: [],
//           text: "img",
//           id: Date.now() + 2,
//         },
//         {
//           children: [],
//           text: "paragraph",
//           id: Date.now() + 3,
//         },
//       ];
//     });

//     afterEach(() => {
//       state = newState;
//       state.selectedElementList = [
//         {
//           text: "div",
//           children: [],
//           id: Date.now() + 1,
//         },
//         {
//           children: [],
//           text: "img",
//           id: Date.now() + 2,
//         },
//         {
//           children: [],
//           text: "paragraph",
//           id: Date.now() + 3,
//         },
//       ];
//     });
//     it("identify the id of the html element being dragged", () => {
//       mutations[types.SET_SELECTED_ID_DRAG](
//         state,
//         state.selectedElementList[0].id
//       );
//       expect(state.selectedIdDrag).toBe(state.selectedElementList[0].id);
//     });

//     it("identify the id of the html element the dragged html element is dropped over", () => {
//       mutations[types.SET_SELECTED_ID_DROP](
//         state,
//         state.selectedElementList[2].id
//       );
//       expect(state.selectedIdDrop).toBe(state.selectedElementList[2].id);
//     });

//     it("dropped html element is moved to location it was dropped", () => {
//       mutations[types.SET_SELECTED_ID_DRAG](
//         state,
//         state.selectedElementList[0].id
//       );
//       mutations[types.SET_SELECTED_ID_DROP](
//         state,
//         state.selectedElementList[2].id
//       );
//       mutations[types.DRAG_DROP_SORT_SELECTED_HTML_ELEMENTS](state);
//       expect(state.selectedElementList[2].text).toBe("div");
//     });

//     it("remainder html elements are still in order", () => {
//       mutations[types.SET_SELECTED_ID_DRAG](
//         state,
//         state.selectedElementList[0].id
//       );
//       mutations[types.SET_SELECTED_ID_DROP](
//         state,
//         state.selectedElementList[2].id
//       );
//       mutations[types.DRAG_DROP_SORT_SELECTED_HTML_ELEMENTS](state);
//       expect(state.selectedElementList[0].text).toBe("img");
//       expect(state.selectedElementList[1].text).toBe("paragraph");
//       expect(state.selectedElementList[2].text).toBe("div");
//     });

//     it("selectedIdDDrag and selectedIdDrop is reset to '' ", () => {
//       mutations[types.SET_SELECTED_ID_DRAG](
//         state,
//         state.selectedElementList[0].id
//       );
//       mutations[types.SET_SELECTED_ID_DROP](
//         state,
//         state.selectedElementList[2].id
//       );
//       mutations[types.DRAG_DROP_SORT_SELECTED_HTML_ELEMENTS](state);
//       expect(state.selectedIdDrag).toBe("");
//       expect(state.selectedIdDrop).toBe("");
//     });
//   });
// });
