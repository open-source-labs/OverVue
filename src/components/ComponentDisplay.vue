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

      <div class="component-title">
        <p>{{ componentData.componentName }}</p>
      </div>
      <div class="component-children">
        <p>children: </p>
         <!-- <p v-for="child in childList" :key="childList.indexOf(child)"> {{ child.text }}</p> -->
      </div>
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
    activeRouteArray () {
      console.log('active route array method', this.routes[this.activeRoute])
      return this.routes[this.activeRoute]
    },
    // used to delete components
    activeComponentData () {
      return this.activeRouteArray.filter(componentData => {
        return componentData.componentName === this.activeComponent
      })[0]
    },
    childList () {
      return this.componentMap[componentData.componentName].children
    }
  },
  methods: {
    ...mapActions(['setActiveComponent']),
    onResize: function (x, y, width, height) {
      this.activeComponentData.x = x
      this.activeComponentData.y = y
      this.activeComponentData.w = width
      this.activeComponentData.h = height

      this.componentMap[this.activeComponent].x = x
      this.componentMap[this.activeComponent].y = y
      this.componentMap[this.activeComponent].w = width
      this.componentMap[this.activeComponent].h = height
    },
    onDrag: function (x, y) {
      this.activeComponentData.x = x
      this.activeComponentData.y = y

      this.componentMap[this.activeComponent].x = x
      this.componentMap[this.activeComponent].y = y
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
.component-title {
  position: relative;
  font-size: 16px;
  top: -18px;
  left: 2px;
  color: black;
  font-weight: 800;
  /* background: rgba(0, 0, 0, 0.678); */
  /* width: 1rem; */
  line-height: 1.2;
  /* margin: 10px; */
}
.component-children {
  position: absolute;
  top: 0rem;
  left: 2px;
  color: black;
}
.component-display {
  /* border: 3px dashed rgb(159, 122, 122); */
  /* height: 500px; */
  /* width: 500px; */
  /* original is 70vh */
  height: 95vh;
  width: 100%;
  position: relative;
  background: darkslategray;
  background-color: rgba(124, 126, 145, 0.44);
  /* background-color: #269; */
  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
  background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;
  background-image: -webkit-linear-gradient(white 2px, transparent 2px),
    -webkit-linear-gradient(0, white 2px, transparent 2px),
    -webkit-linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
    -webkit-linear-gradient(0, rgba(255, 255, 255, 0.3) 1px, transparent 1px);
  background-image: -moz-linear-gradient(white 2px, transparent 2px),
    -moz-linear-gradient(0, white 2px, transparent 2px),
    -moz-linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
    -moz-linear-gradient(0, rgba(255, 255, 255, 0.3) 1px, transparent 1px);
  background-image: linear-gradient(white 2px, transparent 2px),
    linear-gradient(90deg, white 2px, transparent 2px),
    linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px);
  -pie-background: linear-gradient(white 2px, transparent 2px) -2px -2px / 100px,
    linear-gradient(90deg, white 2px, transparent 2px) -2px -2px / 100px,
    linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px) -1px -1px /
      20px,
    linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px) -1px -1px /
      20px,
    #269;
  behavior: url(/pie/PIE.htc);
}
.component-box {
  color: white;
  border: 1px dashed rgb(227, 203, 71);
  background-color: rgba(186, 99, 99, 0.529);
  -webkit-transition: background-color 200ms linear;
  -ms-transition: background-color 200ms linear;
  transition: background-color 200ms linear;
}

.active {
  background-color: rgba(57, 63, 84, 0.5);
  border: 1px dashed rgb(227, 203, 71);
}
</style>
