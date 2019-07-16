/* eslint-disable */
/**
 * @jest-environment jsdom
 */
import mutations from '../../../src/store/mutations';
import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import * as All from 'quasar'
const { Quasar, date } = All

describe('Test mutations + actions to remove action from component and userActions', () => {
  let state
  beforeEach(() => {
    state = {
      componentMap: {
        component: {
          componentName: 'App',
          children: ['HomeView'],
          htmlList: [],
          mapActions: ['action']
        }
      },
      activeComponent: 'component',
      userActions: ['action']
    }
  })

  it('deleting user action from state.userActions', () => {
    mutations.DELETE_USER_ACTIONS(state, 'action')
    expect(state.userActions.length).toBe(0)
  })

  it('deleting "action" from componentMap', () => {
    mutations.REMOVE_ACTION_FROM_COMPONENT(state, 'action')
    expect(state.componentMap.component.mapActions.length).toBe(0)
  })
})

describe('Adding actions and state to components', () => {
  let state;
  beforeEach(() => {
    state = {
      componentMap: {
        testComponent: {
          componentName: 'testComponent',
          children: [],
          htmlList: [],
          componentActions: [],
          componentState: []
        }
      },
      activeComponent: 'testComponent'
    }
  })
  describe('Adding actions to components', () => {
    it('should add a single action to active component', () => {
      mutations.ADD_TO_COMPONENT_ACTIONS(state, 'testAction')
      expect(state.componentMap[state.activeComponent].componentActions).toEqual(['testAction'])
    })
  })
  describe('Adding state to components', () => {
    it('should add a single state string to active component', () => {
      mutations.ADD_TO_COMPONENT_STATE(state, 'testState')
      expect(state.componentMap[state.activeComponent].componentState).toEqual(['testState'])
    })
  })
})

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
