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
  /* border: 3px dashed rgb(159, 122, 122); */
  /* height: 500px; */
  /* width: 500px; */
  height: 70vh;
  width: 70vw;
  position: relative;
  background-color: rgba(124, 126, 145, 0.44);
  /* background-color: #269; */
background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;
background-image: -webkit-linear-gradient(white 2px, transparent 2px),
                  -webkit-linear-gradient(0, white 2px, transparent 2px),
                  -webkit-linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),
                  -webkit-linear-gradient(0, rgba(255,255,255,.3) 1px, transparent 1px);
background-image: -moz-linear-gradient(white 2px, transparent 2px),
                  -moz-linear-gradient(0, white 2px, transparent 2px),
                  -moz-linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),
                  -moz-linear-gradient(0, rgba(255,255,255,.3) 1px, transparent 1px);
background-image: linear-gradient(white 2px, transparent 2px),
                  linear-gradient(90deg, white 2px, transparent 2px),
                  linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px);
-pie-background: linear-gradient(white 2px, transparent 2px) -2px -2px / 100px,
                 linear-gradient(90deg, white 2px, transparent 2px) -2px -2px / 100px,
                 linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px) -1px -1px / 20px,
                 linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px) -1px -1px / 20px,
                 #269;
behavior: url(/pie/PIE.htc);
}

.component-box {
  color: white;
  border: 3px dashed rgb(227, 203, 71);
  background-color: rgba(186, 99, 99, 0.529);
}

</style>
