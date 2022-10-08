<!-- Component Tab Container that holds components for creating components, editing and deleting, and adding props.
Functionality includes: if active component is selected, will switch view to editing mode. If not, it will be in create mode -->
<template>
  <q-card id="store-cards" class="no-shadow">
    <CreateMenu v-if="activeComponent === ''"/>
    <UpdateMenu v-if="activeComponent !== ''"/>
  </q-card>
</template>


<script setup>
import CreateMenu from './CreateMenu.vue';
import UpdateMenu from './UpdateMenu.vue';
import { computed } from "vue";
import { useStore } from "vuex";


const store = useStore();

const activeComponent = computed(() => store.state.activeComponent);

</script>

<!-- <script>
//Old Options API script
import CreateMenu from './CreateMenu.vue'
import UpdateMenu from './UpdateMenu.vue'
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
    CreateMenu,
    UpdateMenu,
  },
}
</script> -->

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