// Import the useStore function from the main.js file in the store directory.
import { useStore } from '@/store/main';

// Import the mount function from Vue Test Utils, which is a library for testing Vue components.
import { mount } from '@vue/test-utils';

// Import the createPinia function from Pinia, which is a state management library for Vue.
import { createPinia } from 'pinia';

// Import the CodeSnippet component from its location in the project directory.
import CodeSnippet from '../../../src/components/right-sidebar/CodeSnippet.vue';

// Define a test suite for the CodeSnippet component using the describe function.
describe('CodeSnippet', () => {

  // Inside the test suite, define a test case using the it function. The test case is "should switch from Options API to Composition API when the toggle is clicked".
  it('should switch from Options API to Composition API when the toggle is clicked', async () => {

    // Create a new Pinia instance using the createPinia function.
    const pinia = createPinia();

    // Mount the CodeSnippet component using the mount function, and pass the Pinia instance as a plugin to the global configuration. Store the returned wrapper in a variable.
    const wrapper = mount(CodeSnippet, {
      global: {
        plugins: [pinia]
      }
    });

    // Call the useStore function to get the store instance and store it in a variable.
    const store = useStore();

    // the initial value of store.options is false using the expect function.
    expect(store.composition).toBe(false);

    // Find the checkbox input with the class compositiontoggle in the wrapper, trigger a change event on it, and wait for any potential DOM updates using the nextTick method.
    await wrapper.find('input.compositiontoggle').trigger('change');
    await wrapper.vm.$nextTick(); //wait for any potential DOM updates

    //the final value of store.options is true using the expect function.
    expect(store.composition).toBe(true);
  });
});
