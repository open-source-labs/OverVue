<template>
	<div>
	</div>
</template>

<script lang='ts'>
import { mapState, mapActions } from "vuex";
// need to add import defineComponent
import { defineComponent } from "vue";

export default defineComponent({
  name: 'TestContainer',
  components: {
  },
  data () {
    return {
      testProp: "PLACEHOLDER FOR VALUE",
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