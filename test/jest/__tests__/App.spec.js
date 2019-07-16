/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from "@vue/test-utils";
import QBUTTON from "./demo/QBtn-demo.vue";
import * as All from "quasar";
// import langEn from 'quasar/lang/en-us' // change to any language you wish! => this breaks wallaby :(
const { Quasar, date } = All;

const components = Object.keys(All).reduce((object, key) => {
  const val = All[key];
  if (val && val.component && val.component.name != null) {
    object[key] = val;
  }
  return object;
}, {});

describe("Test Suite - Delete from userActions and/or componentMap", () => {
  const localVue = createLocalVue();
  localVue.use(Quasar, { components });
  const testValue = false;
  it("does this produce the correct result ahahaha", () => {
    expect(testValue).toBe(false);
  });
});

/**
 * @description: Tests for deleting state
 * @summary:
 *  `deleteUserState` invokes removeStateFromComponent
 *  `removeStateFromComponent` mutation that deletes state from userStore
 *  `userStore` holds the user defined state objects
 *
 */

// describe("Test Suite - Delete from userState(?) and/or componentMap", () => {
//   const localVue = createLocalVue();
//   localVue.use(Quasar, { components });
//   const dumVal = false;
//   it("removeStateFromComponent deletes item from userStore", () => {

//     expect(dumVal).toBe(false);
//   });
//   it("removeStateFromComponent deletes the appropriate item from userStore", () => {
//     expect(dumVal).toBe(false);
//   });
//   it("removeStateFromComponent deletes the appropriate item from component in componentMap", () => {
//     expect(dumVal).toBe(false);
//   });
//   it("deleteUserState invokes removeStateFromComponent", () => {
//     expect(dumVal).toBe(false);
//   });
//   it("deleteUserState payload deletes the appropriate item from userStore", () => {
//     expect(dumVal).toBe(false);
//   });
// });
// describe('Mount Quasar', () => {
//   const localVue = createLocalVue()
//   localVue.use(Quasar, { components }) // , lang: langEn

//   const wrapper = mount(QBUTTON, {
//     localVue
//   })
//   const vm = wrapper.vm

//   it('passes the sanity check and creates a wrapper', () => {
//     expect(wrapper.isVueInstance()).toBe(true)
//   })

//   it('has a created hook', () => {
//     expect(typeof vm.increment).toBe('function')
//   })

//   it('accesses the shallowMount', () => {
//     expect(vm.$el.textContent).toContain('rocket muffin')
//     expect(wrapper.text()).toContain('rocket muffin') // easier
//     expect(wrapper.find('p').text()).toContain('rocket muffin')
//   })

//   it('sets the correct default data', () => {
//     expect(typeof vm.counter).toBe('number')
//     const defaultData2 = QBUTTON.data()
//     expect(defaultData2.counter).toBe(0)
//   })

//   it('correctly updates data when button is pressed', () => {
//     const button = wrapper.find('button')
//     button.trigger('click')
//     expect(vm.counter).toBe(1)
//   })

//   it('formats a date without throwing exception', () => {
//     // test will automatically fail if an exception is thrown
//     // MMMM and MMM require that a language is 'installed' in Quasar
//     let formattedString = date.formatDate(Date.now(), 'YYYY MMMM MMM DD')
//     console.log('formattedString', formattedString)
//   })
// })
