<template>
  <div class="component-display">
    <VueDraggableResizable
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
    >
      <h3>{{ componentData.componentName }}</h3>
    </VueDraggableResizable>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'

export default {
  name: 'ComponentDisplay',
  components: {
    VueDraggableResizable
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
    ...mapActions(['setActiveComponent']),
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
    }
    //       @dblclick.native="onDoubleClick(componentData)"
    // onDoubleClick (compData) {
    //   this.setActiveComponent(compData.componentName)
    //   this.activeComponentData.isActive = true
    // }
  }
}
</script>

<style scoped>
.component-display {
  border: 2px dotted rgb(14, 14, 14);
  background-color: rgba(242, 234, 228, 0.61);
  height: 500px;
  width: 500px;
  /* height: 70vh; */
  /* width: 70vw; */
  position: relative;
}

.component-box {
  color: white;
  border: 1px solid salmon;
}
.my-handle-class {
    position: absolute;
    background-color: pink;
    border: 1px solid black;
    border-radius: 50%;
    height: 14px;
    width: 14px;
    -webkit-transition: all 300ms linear;
    -ms-transition: all 300ms linear;
    transition: all 300ms linear;
}

.my-handle-class-tl {
  top: -14px;
  left: -14px;
  cursor: nw-resize;
}

.my-handle-class-tm {
  top: -14px;
  left: 50%;
  margin-left: -7px;
  cursor: n-resize;
}

.my-handle-class-tr {
  top: -14px;
  right: -14px;
  cursor: ne-resize;
}

.my-handle-class-ml {
  top: 50%;
  margin-top: -7px;
  left: -14px;
  cursor: w-resize;
}

.my-handle-class-mr {
  top: 50%;
  margin-top: -7px;
  right: -14px;
  cursor: e-resize;
}

.my-handle-class-bl {
  bottom: -14px;
  left: -14px;
  cursor: sw-resize;
}

.my-handle-class-bm {
  bottom: -14px;
  left: 50%;
  margin-left: -7px;
  cursor: s-resize;
}

.my-handle-class-br {
  bottom: -14px;
  right: -14px;
  cursor: se-resize;
}

.my-handle-class-tl:hover,
.my-handle-class-tr:hover,
.my-handle-class-bl:hover,
.my-handle-class-br:hover {
    background-color: red;
    transform: scale(1.4);
}
</style>
