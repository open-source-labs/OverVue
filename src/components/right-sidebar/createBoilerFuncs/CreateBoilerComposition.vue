<template>
  <div>
    <div> {{ storeTest }}</div>
    <testees></testees>
    <button @click="callActionTest"></button>
  </div>
</template>

<script>

import { useTestStore } from './stores/testStore';
import testees from './components/testees.vue';

export default ({
  name: 'Test',
  components: {
    testees,
  },
  props: {
    propTest: "PLACEHOLDER FOR VALUE", // Ensure this is the correct type or use a default value if needed
  },
  setup() {
    const testStore = useTestStore();

    // Access state directly
    const storeTest = computed(() => {
      testStore.storeTest
    });

    // Call actions directly
    const callActionTest = () => {
      testStore.actionsTest();
    };

    return {
      storeTest,
      callActionTest,
    };
  },
});
</script>

<style scoped>
</style>