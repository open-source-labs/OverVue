<!--
Description:
  Handles display grid functionality
  Functionality includes: resizing/dragging component boxes, display grid image, active component
  -->

<template>
  <div
    class="component-display grid-bg"
    :style="mockBg"
    v-on:click="handleClick"
  >
    <VueDraggableResizable
      class-name="component-box"
      v-for="componentData in activeRouteArray"
      ref="boxes"
      :key="componentData.componentName"
      :id="componentData.componentName"
      :x="componentData.x"
      :y="componentData.y"
      :z="componentData.z"
      :w="componentData.w"
      :h="componentData.h"
      :parent="true"
      :preventDeactivation="true"
      @activated="onActivated(componentData)"
      @deactivated="onDeactivated(componentData)"
      @dragstop="finishedDrag"
      @resizestop="finishedResize"
      :onDragStart="recordInitialPosition"
      :onResizeStart="recordInitialSize"
    >
      <div class="component-title">
        <p>{{ componentData.componentName }}</p>
      </div>
      <div class="component-html-info">
        <!-- <p>Elements in Component:</p> -->
        <p
          class="list-of-elements"
          v-for="htmlElement in componentMap[componentData.componentName]
            .htmlList"
          :key="htmlElement"
        >
           {{  htmlElement.text  }}
        </p>
      </div>
      <q-menu context-menu>
        <q-list color="black" class="menu">
          <q-item clickable v-ripple v-close-popup @click="handleAddChild">
            <q-item-section style="color: white"
              >Update Children</q-item-section
            >
            <q-item-section avatar>
              <q-icon color="primary" name="add" />
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple v-close-popup>
            <q-item-section class="layer" style="color: white"
              >Layer</q-item-section
            >
            <q-btn
              class="btn"
              color="transparent"
              text-color="primary"
              label="-"
              @click="e => handleLayer(e)"
            />
            <p id="counter" style="color: white">{{ componentData.z }}</p>
            <q-btn
              class="btn"
              color="transparent"
              text-color="primary"
              label="+"
              @click="e => handleLayer(e)"
            />
          </q-item>
        </q-list>
      </q-menu>
    </VueDraggableResizable>
    <div>
      <q-dialog v-model="modalOpen">
        <q-select
          @input="handleSelect"
          id="dropdown"
          filled
          v-model="testModel"
          multiple
          :options="options"
          use-chips
          stack-label
          label="Select children"
          style="width: 250px; background-color: #fd5f00"
        />
      </q-dialog>
    </div>
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
    // console.log("Current Component Map is: ", this.componentMap);
    return {
      modalOpen: false,
      abilityToDelete: false,
      testModel: [],
      mockImg: false,
      initialPosition: { x: 0, y: 0 },
      initialSize: { w: 0, h: 0 }
    }
  },
  mounted () {
    // when component is mounted, add ability to delete
    window.addEventListener('keyup', event => {
      if (event.key === 'Backspace') {
        if (this.activeComponent) {
          this.$store.dispatch('deleteActiveComponent')
        }
      }
    })
  },
  computed: {
    ...mapState([
      'routes',
      'activeRoute',
      'activeComponent',
      'componentMap',
      'componentChildrenMultiselectValue',
      'imagePath'
    ]),

    // used in VueDraggableResizeable component
    activeRouteArray () {
      return this.routes[this.activeRoute]
    },

    // used to delete active component
    activeComponentData () {
      return this.activeRouteArray.filter(componentData => {
        return componentData.componentName === this.activeComponent
      })[0]
    },

    childList () {
      return this.componentMap[componentData.componentName].children
    },

    options () {
      // checks if component has any parents and pushes them into lineage
      const checkParents = (component, lineage = [component.componentName]) => {
        if (!Object.keys(component.parent).length) return lineage
        for (var parents in component.parent) {
          lineage.push(parents)
          checkParents(component.parent[parents], lineage)
        }
        return lineage
      }
      let lineage = [this.activeComponent]
      // checks to see if there are any existing children
      if (this.componentMap[this.activeComponent]) {
        // console.log('testmodel', this.testModel)
        // console.log(this.componentMap[this.activeComponent].children)
        this.testModel = this.componentMap[this.activeComponent].children
        lineage = checkParents(this.componentMap[this.activeComponent])
        // console.log('Lineage', lineage);
      }
      const routes = Object.keys(this.routes)
      const exceptions = new Set([
        'App',
        ...lineage,
        ...routes,
        ...this.testModel
      ])
      return Object.keys(this.componentMap).filter(component => {
        if (!exceptions.has(component)) return component
      })
    },

    userImage () {
      const imgSrc = `file://` + this.imagePath[this.activeRoute]
      // console.log('imgSrc is: ', imgSrc)
      return imgSrc
    },

    // updates display with mockup image
    mockBg () {
      return this.imagePath[this.activeRoute]
        ? {
          background: `url("${
            this.userImage
          }") center/contain no-repeat rgba(223, 218, 218, 0.886)`
        }
        : {}
    }
  },
  updated () {
    // if there are no active component, all boxes are unhighlighted
    if (this.activeComponent === '') {
      if (this.$refs.boxes) {
        this.$refs.boxes.forEach(element => {
          element.enabled = false
          element.$emit('deactivated')
          element.$emit('update:active', false)
        })
      }
    } else {
      // if a component is set to active, highlight it
      this.$refs.boxes.forEach(element => {
        if (
          this.activeComponent === element.$attrs.id &&
          element.enabled === false
        ) {
          element.enabled = true
          element.$emit('activated')
          element.$emit('update:active', true)
        }
      })
    }
  },

  methods: {
    ...mapActions([
      'setActiveComponent',
      'updateComponentChildrenMultiselectValue',
      'updateActiveComponentChildrenValue',
      'updateComponentPosition',
      'updateStartingPosition',
      'updateComponentLayer',
      'updateStartingSize',
      'updateComponentSize'
    ]),

    // records component's initial position in case of drag
    recordInitialPosition: function (e) {
      // console.log('recording initial position: ', this.initialPosition)
      if (this.activeComponent !== e.target.id) {
        this.setActiveComponent(e.target.id)
      }
      this.initialPosition.x = this.activeComponentData.x
      this.initialPosition.y = this.activeComponentData.y
    },

    // records component's initial size/position in case of resize
    recordInitialSize: function (e) {
      // console.log('recording initial size')
      this.initialSize.h = this.activeComponentData.h
      this.initialSize.w = this.activeComponentData.w
      this.initialPosition.x = this.activeComponentData.x
      this.initialPosition.y = this.activeComponentData.y
    },

    // sets component's ending size/position
    finishedResize: function (x, y, w, h) {
      // console.log('FINISHED RESIZING')
      let payload = {
        x: x,
        y: y,
        w: w,
        h: h,
        activeComponent: this.activeComponent,
        routeArray: this.routes[this.activeRoute],
        activeComponentData: this.activeComponentData
      }
      if (
        payload.x !== this.initialPosition.x ||
        payload.y !== this.initialPosition.y ||
        payload.w !== this.initialSize.w ||
        payload.h !== this.initialSize.h
      ) {
        this.updateComponentSize(payload)
      }
    },

    finishedDrag: function (x, y) {
      // console.log('FINISHED DRAGGING')
      let payload = {
        x: x,
        y: y,
        activeComponent: this.activeComponent,
        routeArray: this.routes[this.activeRoute],
        activeComponentData: this.activeComponentData
      }
      // console.log("Payload.x = ", payload.x, "this.initialPosition.x", this.initialPosition.x)
      // console.log("Payload.y = ", payload.y, "this.initialPosition.y", this.initialPosition.y)
      if (
        payload.x !== this.initialPosition.x ||
        payload.y !== this.initialPosition.y
      ) {
        this.updateComponentPosition(payload)
      }
    },

    /* Records size/position
      Add @resizing="onResize" to VueDraggableResizable #component-box to use

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
    */

    /* Records component's position
      Add @dragging="onDrag" to VueDraggableResizable #component-box to use

    onDrag: function (x, y) {
      console.log('ondrag')
      this.activeComponentData.x = x
      this.activeComponentData.y = y

      this.componentMap[this.activeComponent].x = x
      this.componentMap[this.activeComponent].y = y
    },
    */

    // unhighlights all inactive components
    onActivated (componentData) {
      this.$refs.boxes.forEach(element => {
        if (element.$attrs.id !== componentData.componentName) {
          element.enabled = false
          element.$emit('deactivated')
          element.$emit('update:active', false)
        }
      })
      if (!(componentData.componentName === this.activeComponent)) {
        this.setActiveComponent(componentData.componentName)
      }
      this.activeComponentData.isActive = true
    },

    // deactivated is emitted before activated
    onDeactivated (componentData) {
      if (this.activeComponent !== '') {
        this.activeComponentData.isActive = false
      }
    },

    // renders modal with Update Children and Layer in it
    handleAddChild () {
      this.modalOpen = true
    },

    // used when user selects to add child from dropdown
    handleSelect (value) {
      // console.log('selected child component: ', value)
      this.updateActiveComponentChildrenValue(value)
    },

    // user can change component's layer order
    handleLayer (e) {
      e.preventDefault()
      const payload = {
        activeComponent: this.activeComponent,
        routeArray: this.routes[this.activeRoute],
        activeComponentData: this.activeComponentData,
        z: this.activeComponentData.z
      }
      if (e.target.innerText === '+') payload.z++
      if (e.target.innerText === '-' && payload.z > 0) payload.z--
      this.updateComponentLayer(payload)
    },

    // if user clicks on display grid, resets active component to ''
    handleClick (event) {
      if (event.target.className === 'component-display grid-bg') {
        if (!(this.activeComponent === '')) this.setActiveComponent('')
      }
    }
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
  -webkit-text-stroke: 0.4px white;
  font-weight: 800;
  line-height: 1.2;
  z-index: -1;
}
/* .component-html-info {
  position: relative;
  font-size: 16px;
  top: -18px;
  left: 2px;
  color: black;
  -webkit-text-stroke: 0.4px white;
  font-weight: 800;
  line-height: 1.2;
  z-index: -1;
} */
.component-html-info {
    display: flex;
    /* flex-basis: auto; */
    flex-direction: column;
    /* flex-wrap: wrap; */
    /* justify-content: center; */
    /* flex-flow: column wrap; */
    /* align-content: stretch; */
    /* align-items: flex-start; */
    font-weight: 800;
  }
.component-children {
  position: relative;
  top: 0rem;
  left: 2px;
  color: black;
  list-style: none;
}
.component-display {
  height: 90vh;
  width: 100%;
  position: relative;
}
.grid-bg {
  background-color: rgba(223, 218, 218, 0.886);
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

.menu {
  margin-bottom: 0px !important;
}
.component-box {
  color: white;
  border: 1.2px dashed rgb(231, 203, 75);
  background-color: rgba(172, 83, 83, 0.42);
  -webkit-transition: background-color 200ms linear;
  -ms-transition: background-color 200ms linear;
  transition: background-color 200ms linear;
}
.active {
  background-color: rgba(105, 179, 190, 0.514);
  border: 1px dashed rgb(227, 203, 71);
}
.btn {
  font-size: 25px;
  padding: 0 20px;
  width: 10px;
  height: 10px;
  transition: none;
}
.btn:hover,
.btn:focus,
.btn:active {
  color: white;
  background-color: transparent;
}
#counter {
  margin-top: 20px;
}
</style>
