<!--
Description:
  Displays project tree in Dashboard
  Functionality includes: formating componentMap object to displaying in tree form
  -->

<template>
  <div class="container">
    <vue-tree
      style="width: 100%; height: 80vh; border: 1px solid gray;"
      :dataset="treeData"
      :config="treeConfig"
      ref="tree"
      @wheel="zoom">
      <template v-slot:node="{ node, collapsed }">
        <span v-if="this.activeComponent === node.value"
          class="tree-node-active"
          :style="{ border: collapsed ? '2px solid grey' : '' }"
          
          >
          {{ node.value }}
        </span>
          <span v-else-if="this.activeRoute === node.value"
          class="tree-node-activeRoute"
          :style="{ border: collapsed ? '2px solid grey' : '' }"
          
          >
          {{ node.value }}
        </span>
        <span v-else
          class="tree-node"
          :style="{ border: collapsed ? '2px solid grey' : '' }"
          @click="activateNode(node.value)"
          >
          {{ node.value }}
        </span>
      </template>
    </vue-tree>
  </div>
</template>

<script>
import { mapState } from "vuex";
import VueTree from "@ssthouse/vue3-tree-chart";
import "@ssthouse/vue3-tree-chart/dist/vue3-tree-chart.css";

export default {
  name: "Tree",
  components: { VueTree },
  computed: {
    ...mapState([
    'activeComponent',
    'activeRoute',
    'routes',
    'componentMap',
    ])
  },
  methods: {
    zoom(){
      if (event.deltaY < 0){
        this.$refs.tree.zoomIn();
      } else {
        this.$refs.tree.zoomOut();
      }
    },
    activateNode(nodeToActivate){
      if (nodeToActivate === "App"){
        return;
      }
      //check first, activating a route? if so, activate that route and then dispatch no active component.
      for (const key in this.routes){
        if (nodeToActivate === key){
          this.$store.dispatch('setActiveRoute', nodeToActivate)
          if (this.routes[key].length > 0){
            this.$store.dispatch('setActiveComponent', '')
          }
          return;
        }
      }

      //if we click a component, check which route, and then if needed dispatch the route THEN the component
      for (const view of this.treeData.children){
        if (view.children.length > 0){
          view.children.forEach((el)=>{
            if (view.value !== this.activeRoute){ //only check where the view.value is NOT the active route
              if (nodeToActivate === el.value){
                this.$store.dispatch('setActiveRoute', view.value)
                return;
              }
              if (el.children.length > 0){
                this.evalChildren(el.children, nodeToActivate, view);
              }
            }
          })
        }
      }
      if (this.activeComponent !== nodeToActivate) {
        this.$store.dispatch('setActiveComponent', nodeToActivate);
      }
    },
    evalChildren(children, targetString, view){
        children.forEach((el)=>{
          if (el.value === targetString){
            this.$store.dispatch('setActiveRoute', view.value)
            return;
          } else if (el.children.length >0){
            return this.evalChildren(el.children, targetString, view)
        }
      })
    },

    buildTree(componentData){
      //App is always the root of the tree.  
      const treeData = {     
        value: 'App',
        children: []
      }
      //Views come after the root, as its children. No components will be children of App.
      //ONLY Views will have components as children.
      for (const child of componentData.App.children){
        treeData.children.push({
          value: child,
          children: buildTreeChildren(componentData[child].children),
        })
      }
      
      function buildTreeChildren (array){
        if (array.length === 0){
          return [];
        } else {
          const outputArray = [];
          array.forEach((el)=>{
            const outputObj = {
            value: el,
            children: []
            }
            for (const component in componentData){
              if (component === el){
                if (componentData[component].children.length > 0){
                  outputObj.children = buildTreeChildren(componentData[component].children);
                }
              }
            }
            outputArray.push(outputObj);
          })
          return outputArray;
        }
      }
      return treeData;
    }
  },
  watch: {
    componentMap: {
      handler(){
        console.log(this.componentMap)
        this.treeData = this.buildTree(this.componentMap);
      },
      deep: true,
    },
  },
  data() { 
    return {
      treeData: this.buildTree(this.$store.state.componentMap),
      treeConfig: { nodeWidth: 120, nodeHeight: 80, levelHeight: 200},
      componentData: this.$store.state.componentMap,
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  
}

.container:hover{
  cursor: move;
}

.tree-node, .tree-node-active, .tree-node-activeRoute {
  display: inline-block;
  width: 90%;
  padding: 8px;
  margin: 6px;
  min-height: 28px;
  color: $menutext;
  background-color: $secondary;
  text-align: center;
  line-height: 28px;
  border-radius: 4px;
}

.tree-node-active {
  background-color: $accent;
  color: $darktext;
  border: 2px solid $menutext;
}

.tree-node-activeRoute {
  background-color: $darktext;
  border: 2px solid $menutext;
}


</style>


