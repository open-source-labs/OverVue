<!-- Component Tab Container that holds components for creating components, editing and deleting, and adding props.
Functionality includes: if active component is selected, will switch view to editing mode. If not, it will be in create mode -->
<template>
  <q-card id="store-cards">
    <CreateComponent v-if="activeComponent === ''"/>
    <EditDeleteComponents v-if="activeComponent !== ''"/>
  </q-card>
</template>

<script>
import CreateComponent from './CreateComponent.vue'
import EditDeleteComponents from './EditDeleteComponents.vue'
import { mapState } from 'vuex'
import UploadImage from './UploadImage.vue'
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
    CreateComponent,
    EditDeleteComponents,
    UploadImage,
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
  border-radius: 0px;
  background-color: $subprimary;
  
}
.q-tab-panel {
  height: 100%;
  // matches the code editor bg
  background: $subprimary;
  // changes the length of the tab panels
}
.q-tab-panels {
  height: 100%;
}
.q-tabs {
  background: $subprimary;
}

.q-tab__content{
  padding: 10px 0;
}
</style>