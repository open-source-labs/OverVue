/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import * as All from 'quasar'
const { Quasar, date } = All

import mutations from '../../../src/store/mutations';

describe('Test mutations to remove action from component and userActions', () => {
  const state = {
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

  it('deleting user action from state.userActions', () => {
    mutations.DELETE_USER_ACTIONS(state, 'action')
    expect(state.userActions.length).toBe(0);
  })

  it('deleting "action" from componentMap', () => {
    mutations.REMOVE_ACTION_FROM_COMPONENT(state, 'action');
    expect(state.componentMap.component.mapActions.length).toBe(0)
  })
})

