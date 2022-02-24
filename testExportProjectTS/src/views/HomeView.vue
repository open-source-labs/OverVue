<template>
	<div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
 import Test from '@/components/Test.vue';
import Child from '@/components/Child.vue';

export default defineComponent ({
  name: 'HomeView',
  components: {
    Test,
    Child,
  }
});
</script>

<style scoped>
</style>