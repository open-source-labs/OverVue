<template>
	<div>
	</div>
</template>

<script lang='ts'>
import { mapState, mapActions } from "vuex";
import { defineComponent } from "vue";

export default defineComponent ({
  name: 'routeComponent (1)',
  components: {
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
});
</script>

<style scoped>
</style>