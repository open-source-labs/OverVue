<template>
  <div class="component-display">
    <context-menu ref="component-options">
      <context-menu-item :action="handleAddChild">Add a Child</context-menu-item>
      <context-menu-item><button>Delete a Child</button></context-menu-item>
    </context-menu>
    <VueDraggableResizable
      class-name="component-box"
      v-for="componentData in activeRouteArray"
      :key="componentData.componentName"
      :x="componentData.x"
      :y="componentData.y"
      :w="componentData.w"
      :h="componentData.h"
      :parent="true"
      @activated="onActivated(componentData)"
      @deactivated="onDeactivated(componentData)"
      @dragging="onDrag"
      @resizing="onResize"
      @dblclick.native="onDoubleClick(componentData)"
      v-context-menu="'component-options'"
    >
      <h3>{{ componentData.componentName }}</h3>
    </VueDraggableResizable>
    <q-dialog v-model="modalOpen" style="width: 700px">
      <ChildrenMultiselect />
    </q-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import VueDraggableResizable from 'vue-draggable-resizable'
import ChildrenMultiselect from '../components/ChildrenMultiselect'

export default {
  name: 'ComponentDisplay',
  components: {
    VueDraggableResizable,
    ChildrenMultiselect
  },
  data () {
    return {
      modalOpen: false,
      abilityToDelete: false
    }
  },
  mounted () {
    // when component is mounted add ability to delete
    window.addEventListener('keyup', event => {
      if (event.key === 'Backspace') {
        if (this.activeComponent && this.activeComponentData.isActive) {
          this.$store.dispatch('deleteActiveComponent')
        }
      }
    })
  },
  computed: {
    ...mapState(['routes', 'activeRoute', 'activeComponent', 'componentMap']),
    // used in VueDraggableResizeable component
    activeRouteArray () {
      return this.routes[this.activeRoute]
    },
    // used to delete components
    activeComponentData () {
      // find out what this does
      return this.activeRouteArray.filter(componentData => {
        return componentData.componentName === this.activeComponent
      })[0]
    }
  },
  methods: {
    ...mapActions(['setActiveComponent', 'updateOpenModal']),
    onResize: function (x, y, width, height) {
      this.activeComponentData.x = x
      this.activeComponentData.y = y
      this.activeComponentData.w = width
      this.activeComponentData.h = height
    },
    onDrag: function (x, y) {
      this.activeComponentData.x = x
      this.activeComponentData.y = y
    },
    onActivated (componentData) {
      this.setActiveComponent(componentData.componentName)
      this.activeComponentData.isActive = true
    },
    onDeactivated () {
      this.activeComponentData.isActive = false
    },
    onDoubleClick (compData) {
      this.setActiveComponent(compData.componentName)
      this.activeComponentData.isActive = true
    },
    handleAddChild () {
      // render modal with childrenmultiselect in it
      this.modalOpen = true
    }
  }
}
</script>

<style scoped>
.component-display {
  border: 2px dotted rgb(14, 14, 14);
  background-color: rgba(242, 234, 228, 0.61);
  height: 70vh;
  width: 70vw;
  position: relative;
}

.component-box {
  color: white;
  border: 1px solid salmon;
}
</style>
