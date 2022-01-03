<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'MyButton',
  props: {
    incrementStep: {
      type: Number,
      default: 1,
    },
  },
  setup(props) {
    const counter = ref(0);
    const input = ref('rocket muffin');
    function increment() {
      counter.value += props.incrementStep;
    }

    return { counter, input, increment };
  },
});
</script>

<template>
  <div>
    <p class="content">{{ input }}</p>
    <span>{{ counter }}</span>
    <q-btn class="button" @click="increment()"></q-btn>
  </div>
</template>
