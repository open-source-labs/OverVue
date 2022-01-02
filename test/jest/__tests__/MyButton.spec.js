import { describe, expect, it } from '@jest/globals';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { mount, shallowMount } from '@vue/test-utils';
import { QBtn } from 'quasar';
import MyButton from './demo/MyButton';

// Specify here Quasar config you'll need to test your component
installQuasarPlugin();

describe('MyButton', () => {
  it('has increment method', () => {
    const wrapper = mount(MyButton);
    const { vm } = wrapper;

    expect(typeof vm.increment).toBe('function');
  });

  it('can check the inner text content', () => {
    const wrapper = mount(MyButton);
    const { vm } = wrapper;

    expect(vm.$el.textContent).toContain('rocket muffin');
    expect(wrapper.find('.content').text()).toContain('rocket muffin');
  });

  it('sets the correct default data', () => {
    const wrapper = mount(MyButton);
    const { vm } = wrapper;

    expect(typeof vm.counter).toBe('number');
    expect(vm.counter).toBe(0);
  });

  it('correctly updates counter when button is pressed', async () => {
    const wrapper = shallowMount(MyButton);
    const { vm } = wrapper;

    const button = wrapper.findComponent(QBtn);
    await button.trigger('click');
    expect(vm.counter).toBe(1);
  });
});
