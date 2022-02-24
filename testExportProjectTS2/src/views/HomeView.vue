<template>
	<div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
 import Test from '@/components/Test.vue';
import Child from '@/components/Child.vue';
import routeComponent (1) from '@/components/routeComponent (1).vue';

export default defineComponent ({
  name: 'HomeView',
  components: {
    Test,
    Child,
    routeComponent (1),
  }
});
</script>

<style scoped>
</style>