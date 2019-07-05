<template>
  <div class="component-display">
    <!-- <VueDraggableResizable
      class-name="component-box"
      v-for="componentData in activeRouteArray"
      :key="componentData.componentName"
      :x="componentData.x"
      :y="componentData.y"
      :w="componentData.w"
      :h="componentData.h"
      :parent="true"
      class-name-resizable="my-resizable-class"
      @activated="onActivated(componentData)"
      @deactivated="onDeactivated(componentData)"
      @dragging="onDrag"
      @resizing="onResize"
      @dblclick.native="onDoubleClick(componentData)"
    >
      <h3>{{ componentData.componentName }}</h3>
    </VueDraggableResizable> -->
    <VueDragResize
      :isActive="true"
      v-for="componentData in activeRouteArray"
      :key="componentData.componentName"
      :x="componentData.x"
      :y="componentData.y"
      :w="componentData.w"
      :h="componentData.h"
      @resizing="onResize"
      @dragging="onDrag"
      @activated="onActivated(componentData)"
      @deactivated="onDeactivated(componentData)"
      @dblclick.native="onDoubleClick(componentData)"
    >
      <h3>{{ componentData.componentName }}</h3>
    </VueDragResize>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
// import VueDraggableResizable from 'vue-draggable-resizable'
import VueDragResize from 'vue-drag-resize'

export default {
  name: 'ComponentDisplay',
  components: {
    // VueDraggableResizable
    VueDragResize
  },
  data () {
    return {
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
    // onResize: function (x, y, width, height) {
    //   this.activeComponentData.x = x
    //   this.activeComponentData.y = y
    //   this.activeComponentData.w = width
    //   this.activeComponentData.h = height
    // },
    onResize (rectangle) {
      this.activeComponentData.y = rectangle.top
      this.activeComponentData.x = rectangle.left
      this.activeComponentData.w = rectangle.width
      this.activeComponentData.h = rectangle.height
    },
    // onDrag: function (x, y) {
    //   this.activeComponentData.x = x
    //   this.activeComponentData.y = y
    // },
    onDrag (rectangle) {
      this.activeComponentData.y = rectangle.top
      this.activeComponentData.x = rectangle.left
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

h3 {
  text-align: center;
}
</style>
