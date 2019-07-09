<template>
  <section class="icon-grid">
    <button
      @click.prevent="changeState(elementName)"
      v-for="([elementName, iconString], idx) in Object.entries(icons)"
      :key="idx + Date.now()"
    >
      <i :class="iconString"></i>
      <br />
      <span class="white--text">{{ elementName }}</span>
    </button>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Icons',
  computed: {
    ...mapState(['icons', 'activeComponent'])
  },
  methods: {
    changeState (elementName) {
      if (this.activeComponent === '') this.$emit('getClickedIcon', elementName)
      else this.$emit('activeElement', elementName)
    }
  }
}
</script>

<style scoped>
.icon-grid {
  display: grid;
  grid-template-columns: 33% 33% 33%;
  grid-row-gap: 1em;
  padding-top: 10px;
}

@media (max-width: 680px) {
  .icon-grid {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-row-gap: 1em;
    width: 100%;
  }
}

button {
  background: none;
  border: none;
}
button:hover {
  cursor: pointer;
  color: #00d1b2;
}
button:focus {
  outline: none;
}
</style>
