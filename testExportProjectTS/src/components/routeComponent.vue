<template>
	<div>
	</div>
</template>

<script lang='ts'>
import { mapState, mapActions } from "vuex"
import { defineComponent } from "vue";
import routeChild from '@/components/routeChild.vue';

export default defineComponent ({
  name: 'routeComponent',
  components: {
    routeChild,
  },
  data () {
    return {
      routeProp: "PLACEHOLDER FOR VALUE",
    }
  },
  computed: {
    ...mapState([
      "testState",
    ]),
  },
  methods: {
    ...mapActions([
      "testAction",
    ]),
  },
};
</script>

<style scoped>
</style>