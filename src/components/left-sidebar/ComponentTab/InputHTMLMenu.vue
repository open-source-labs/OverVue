<!-- Menu for inputting information into first layer HTML Elements, giving them class, binding, size, location, color -->

<template>
  <q-card id="html_element_card" class="no-shadow">
    <div>Here is a card</div>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      // tab: 'details',
    }
  },
  computed: {
    ...mapState([
      'activeComponent',
    ])
  },
  components: {
  }
}
</script>

<style lang="scss">
// give html background color of grey
.html-bg {
    background-color: $subprimary;
}
#store-cards {
  height: 100%;
  border-radius: 0px !important;
  background-color: $subprimary;
  
}
.q-tab-panel {
  height: calc(100% - 30px);
  // matches the code editor bg
  background: $subprimary;
  padding: 0px;
  border-radius: 0px !important;
  // changes the length of the tab panels
}
.q-tab-panels {
  height: 100%;
  border-radius: 0px !important;
}
.q-tabs {
  background: $subprimary;
}

.q-tab__content{
  padding: 10px 0;
}
</style>