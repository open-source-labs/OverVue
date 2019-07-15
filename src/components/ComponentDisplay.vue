<template>
  <div class="component-display grid-bg" :style="mockBg">
    <!-- <p>{{ userImage }}</p> -->
    <VueDraggableResizable
      class-name="component-box"
      v-for="componentData in activeRouteArray"
      :key="componentData.componentName"
      :x="componentData.x"
      :y="componentData.y + 20"
      :w="componentData.w"
      :h="componentData.h"
      :parent="true"
      @activated="onActivated(componentData)"
      @deactivated="onDeactivated(componentData)"
      @dragging="onDrag"
      @resizing="onResize"
      @dblclick.native="onDoubleClick(componentData)"
    >
      <div class="component-title">
        <p>{{ componentData.componentName }}</p>
      </div>
      <ul class="component-children">
        <li># of children: {{ componentMap[componentData.componentName].children.length }}</li>
        <li>children: {{ componentMap[componentData.componentName].children }}</li>
        <!-- <p v-for="child in childList" :key="childList.indexOf(child)"> {{ child.text }}</p> -->
      </ul>
      <q-menu context-menu>
        <q-list class="menu">
          <q-item clickable v-ripple v-close-popup @click="handleAddChild">
            <q-item-section>Add Children</q-item-section>
            <q-item-section avatar>
              <q-icon color="primary" name="add" />
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple v-close-popup auto-close>
            <q-item-section>Delete Children</q-item-section>
            <q-item-section avatar>
              <q-icon color="primary" name="delete" />
            </q-item-section>
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
import { mapState, mapActions } from "vuex";
import VueDraggableResizable from "vue-draggable-resizable";
// import ChildrenMultiselect from '../components/ChildrenMultiselect'
import "vue-draggable-resizable/dist/VueDraggableResizable.css";

export default {
  name: "ComponentDisplay",
  components: {
    VueDraggableResizable
  },
  data() {
    return {
      modalOpen: false,
      abilityToDelete: false,
      testOptions: ["parent", "child", "grandchild"],
      testModel: [],
      mockImg: false
    };
  },
  mounted() {
    // when component is mounted add ability to delete
    window.addEventListener("keyup", event => {
      if (event.key === "Backspace") {
        if (this.activeComponent && this.activeComponentData.isActive) {
          this.$store.dispatch("deleteActiveComponent");
        }
      }
    });
  },
  computed: {
    ...mapState([
      "routes",
      "activeRoute",
      "activeComponent",
      "componentMap",
      "componentChildrenMultiselectValue",
      "imagePath"
    ]),
    // used in VueDraggableResizeable component
    activeRouteArray() {
      console.log("active route array method", this.routes[this.activeRoute]);
      return this.routes[this.activeRoute];
    },
    // used to delete components
    activeComponentData() {
      return this.activeRouteArray.filter(componentData => {
        return componentData.componentName === this.activeComponent;
      })[0];
    },
    childList() {
      return this.componentMap[componentData.componentName].children;
    },
    options() {
      // PROBLEM: the objects on childrenmultiselectvalue are applied
      const routes = Object.keys(this.routes);
      const exceptions = new Set(["App", this.activeComponent, ...routes]);
      return Object.keys(this.componentMap).filter(component => {
        if (!exceptions.has(component)) return component;
      });
    },
    userImage() {
      const imgSrc = this.imagePath.length ? `file://` + this.imagePath[0] : "";
      // const imgSrc1 = this.imagePath;
      console.log(`imgSrc: ${imgSrc}`);
      return imgSrc;
    },
    mockBg() {
      return this.imagePath.length
        ? {
            background: `url("${this.userImage}") no-repeat center`,
            "background-size": "cover"
          }
        : {};
    }
  },
  methods: {
    ...mapActions([
      "setActiveComponent",
      "updateComponentChildrenMultiselectValue",
      "updateActiveComponentChildrenValue"
    ]),
    onResize: function(x, y, width, height) {
      this.activeComponentData.x = x;
      this.activeComponentData.y = y;
      this.activeComponentData.w = width;
      this.activeComponentData.h = height;

      this.componentMap[this.activeComponent].x = x;
      this.componentMap[this.activeComponent].y = y;
      this.componentMap[this.activeComponent].w = width;
      this.componentMap[this.activeComponent].h = height;
    },
    onDrag: function(x, y) {
      this.activeComponentData.x = x;
      this.activeComponentData.y = y;

      this.componentMap[this.activeComponent].x = x;
      this.componentMap[this.activeComponent].y = y;
      this.userImage;
    },
    onActivated(componentData) {
      this.setActiveComponent(componentData.componentName);
      this.activeComponentData.isActive = true;
    },
    onDeactivated() {
      this.activeComponentData.isActive = false;
    },
    onDoubleClick(compData) {
      this.setActiveComponent(compData.componentName);
      this.activeComponentData.isActive = true;
    },
    handleAddChild() {
      // render modal with childrenmultiselect in it
      this.modalOpen = true;
    },
    handleSelect(value) {
      // if (this.modalOpen) this.updateActiveComponentChildrenValue(value)
      console.log("Multiselect: ", value);
      this.updateActiveComponentChildrenValue(value);
      // this.updateComponentChildrenMultiselectValue(value)
    }
    //       @dblclick.native="onDoubleClick(componentData)"
    // onDoubleClick (compData) {
    //   this.setActiveComponent(compData.componentName)
    //   this.activeComponentData.isActive = true
    // }
  }
};
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
  list-style: none;
}
.component-display {
  /* border: 3px dashed rgb(159, 122, 122); */
  /* height: 500px; */
  /* width: 500px; */
  /* original is 70 */
  height: 90vh;
  width: 100%;
  position: relative;
  /* background: rgb(211, 211, 210); */
}
.grid-bg {
  background-color: rgba(223, 218, 218, 0.886);
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
</style>
