/*
Tests that creating a component adds it to the componentMap object and sets the activeComponent to that component.
*/
//npm install --save-dev @testing-library/dom



// default imports
import { describe, expect, it } from "@jest/globals";
import { useStore } from "../../../src/store/main.js";
import { setActivePinia, createPinia } from "pinia";
// import { render, fireEvent, screen } from '@testing-library/vue';

// store imports
setActivePinia(createPinia())
const store = useStore();

const testComponent = {
  componentName: "parent1",
};

// check:
// active component is 'parent1'
// componentMap has a key of 'parent1'

describe("store.registerComponent", () => {
  it("updates active component to payload", () => {
    store.registerComponent(testComponent);
    expect(store.activeComponent).toEqual("parent1");
  });
  it("adds the component name as a key in componentMap", () => {
    store.registerComponent(testComponent);
    expect(store.componentMap).toHaveProperty("parent1");
  });
});
