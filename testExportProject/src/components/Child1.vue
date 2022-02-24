<template>
	<div>
    <img>
	</div>
</template>

<script>
import { mapState, mapActions } from "vuex"

export default {
  name: 'Child1',
  components: {
  },
  data () {
    return {
      testProp: "PLACEHOLDER FOR VALUE",
    }
  },
  computed: {
    ...mapState([
      "state",
    ]),
  },
  methods: {
    ...mapActions([
      "action",
    ]),
  },
};
</script>

<style scoped>
</style>