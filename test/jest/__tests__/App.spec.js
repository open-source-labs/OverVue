/* eslint-disable */
/**
 * @jest-environment jsdom
 */
import mutations from '../../../src/store/mutations';
import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex';
import QBUTTON from './demo/QBtn-demo.vue'
import * as All from 'quasar'

// import langEn from 'quasar/lang/en-us' // change to any language you wish! => this breaks wallaby :(
const { Quasar, date } = All

//const localVue = createLocalVue()

// localVue.use(Vuex)

const components = Object.keys(All).reduce((object, key) => {
  const val = All[key]
  if (val && val.component && val.component.name != null) {
    object[key] = val
  }
  return object
}, {})
/*
describe('Mount Quasar', () => {
  const localVue = createLocalVue()
  localVue.use(Quasar, { components }) // , lang: langEn

  const wrapper = mount(QBUTTON, {
    localVue
  })
  const vm = wrapper.vm

  it('passes the sanity check and creates a wrapper', () => {
    expect(wrapper.isVueInstance()).toBe(true)
  })

  it('has a created hook', () => {
    expect(typeof vm.increment).toBe('function')
  })

  it('accesses the shallowMount', () => {
    expect(vm.$el.textContent).toContain('rocket muffin')
    expect(wrapper.text()).toContain('rocket muffin') // easier
    expect(wrapper.find('p').text()).toContain('rocket muffin')
  })

  it('sets the correct default data', () => {
    expect(typeof vm.counter).toBe('number')
    const defaultData2 = QBUTTON.data()
    expect(defaultData2.counter).toBe(0)
  })

  it('correctly updates data when button is pressed', () => {
    const button = wrapper.find('button')
    button.trigger('click')
    expect(vm.counter).toBe(1)
  })

  it('formats a date without throwing exception', () => {
    // test will automatically fail if an exception is thrown
    // MMMM and MMM require that a language is 'installed' in Quasar
    let formattedString = date.formatDate(Date.now(), 'YYYY MMMM MMM DD')
    console.log('formattedString', formattedString)
  })
})
*/
describe('userActions mutation', () => {
  let actions;
  let store;
  beforeEach(() => {
  store = {
    userActions: []
    }
  })
  it ('should push user defined action to end of userActions array', () => {
    mutations.ADD_USER_ACTION(store, 'actionnnn')
    expect(store.userActions[store.userActions.length-1]).toBe('actionnnn');
  })
  it ('should only push to array if payload is of type string', () => {
    mutations.ADD_USER_ACTION(store, 66)
    expect(store.userActions).toStrictEqual([])
  })
});

describe('userStore mutation', () => {
  let actions;
  let store;
    store = {
      userStore : {}
    }
  it ('should be able to update store with a key defined by the user and a value of type object', () => {
    mutations.ADD_TO_USER_STORE(store, {'dummyKey': {}})
    // console.log('store.userStore.dummyKey', store.userStore.dummyKey);
    expect(store.userStore.dummyKey).toStrictEqual({})
  })
  it ('should update user store with a key value pair with value strictly equal to empty array', () => {
    mutations.ADD_TO_USER_STORE(store, {'dummyKey': []})
    expect(store.userStore.dummyKey).toStrictEqual([]);
  })
  it ('should be able to store booleans in the store as the key', () => {
    mutations.ADD_TO_USER_STORE(store, {boolean: true})
    expect (store.userStore.boolean).toBe(true)
  })
  it ('should add to userStore a key with a value of type number', () => {
    mutations.ADD_TO_USER_STORE(store, { number:696 })
    expect (store.userStore.number).toBe(696)
  })

  it ('should work with strings too', () => {
    mutations.ADD_TO_USER_STORE(store, { string: 'string'})
    expect(store.userStore.string).toBe('string')
  })
});