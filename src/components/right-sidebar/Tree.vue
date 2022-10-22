<!--
Description:
  Displays project tree in Dashboard
  Functionality includes: formatting componentMap object to displaying in tree form
  -->

<template>
  <div class="container">
    <vue-tree
      style="width: 100%; height: 80vh; border: 1px solid gray"
      :dataset="treeData"
      :config="treeConfig"
      ref="tree"
      @wheel="zoom"
    >
      <template v-slot:node="{ node }">
        <span v-if="activeComponent === node.value" class="tree-node-active">
          {{ node.value }}
        </span>
        <span
          v-else-if="activeRoute === node.value"
          class="tree-node-activeRoute"
        >
          {{ node.value }}
        </span>
        <span v-else class="tree-node" @click="activateNode(node.value)">
          {{ node.value }}
        </span>
      </template>
    </vue-tree>
  </div>
</template>

<script>
export default {
  name: "Tree",
};
</script>

<script setup lang="ts">
import VueTree from "@ssthouse/vue3-tree-chart";
import "@ssthouse/vue3-tree-chart/dist/vue3-tree-chart.css";
import { useStore } from "../../store/main.js";
import { ref, computed, watch } from "vue";

const store = useStore();

const treeConfig = ref({ nodeWidth: 175, nodeHeight: 100, levelHeight: 200 });
const treeData = ref<typeof VueTree.treeData>(null);

//ref to htmlelement
const tree = ref<typeof VueTree>(null);

defineExpose({ tree });

//computed
const activeComponent = computed(() => store.activeComponent);
const activeRoute = computed(() => store.activeRoute);
const routes = computed(() => store.routes);
const componentMap = computed(() => store.componentMap);

const componentData = componentMap;

const zoom = (event: WheelEvent) => {
  if (event.deltaY < 0) {
    tree.value.zoomIn();
  } else {
    tree.value.zoomOut();
  }
};

const evalChildren = (children: typeof VueTree.treeData.children, targetString: string, view: {value: string}) => {
  children.forEach((el: typeof VueTree.treeData.value) => {
    if (el.value === targetString) {
      /// do we need to remove view.value???
      store.setActiveRoute(view.value);
      return;
    } else if (el.children.length > 0) {
      return evalChildren(el.children, targetString, view);
    }
  });
};

const activateNode = (nodeToActivate: string) => {
  if (nodeToActivate === "App") {
    return;
  }
  //check first, activating a route? if so, activate that route and then dispatch no active component.
  for (const key in routes.value) {
    if (nodeToActivate === key) {
      store.setActiveRoute(nodeToActivate);
      if (routes.value[key].length > 0) {
        store.setActiveComponent("");
      }
      return;
    }
  }

  //if we click a component, check which route, and then if needed dispatch the route THEN the component
  for (const view of treeData.value.children) {
    if (view.children.length > 0) {
      view.children.forEach((el: typeof VueTree.treeData.value) => {
        if (view.value !== activeRoute.value) {
          //only check where the view.value is NOT the active route
          if (nodeToActivate === el.value) {
            store.setActiveRoute(view.value);
            return;
          }
          if (el.children.length > 0) {
            evalChildren(el.children, nodeToActivate, view);
          }
        }
      });
    }
  }
  if (activeComponent.value !== nodeToActivate) {
    store.setActiveComponent(nodeToActivate);
  }
};

const buildTree = (componentData: typeof VueTree.treeData) => {
  //App is always the root of the tree.
  const treeData = {
    value: "App",
    children: [],
  };
  //Views come after the root, as its children. No components will be children of App.
  //ONLY Views will have components as children.
  for (const child of componentData.App.children) {
    treeData.children.push({
      value: child,
      children: buildTreeChildren(componentData[child].children),
    });
  }
  return treeData;
};

function buildTreeChildren(array: string[]) {
  if (array.length === 0) {
    return [];
  } else {
    const outputArray: [] = [];
    array.forEach((el) => {
      const outputObj = {
        value: el,
        children: [],
      };
      for (const component in componentData.value) {
        if (component === el) {
          if (componentData.value[component].children.length > 0) {
            outputObj.children = buildTreeChildren(
              componentData.value[component].children
            );
          }
        }
      }
      outputArray.push(outputObj);
    });
    return outputArray;
  }
}

//data
treeData.value = buildTree(componentMap.value);

//watch
watch(
  componentMap,
  () => {
    treeData.value = buildTree(componentMap.value);
  },

  { deep: true }
);
</script>

<!-- Old Options API Script -->

<!-- <script>
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
          console.log(this.$refs.tree, "this is tree")
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
        console.log(treeData, "hello i am treeData inside buildtree")
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
          this.treeData = this.buildTree(this.componentMap);
        },
        deep: true,
      },
    },
    data() { 
      return {
        treeData: this.buildTree(this.$store.state.componentMap),
        treeConfig: { nodeWidth: 175, nodeHeight: 100, levelHeight: 200},
        componentData: this.$store.state.componentMap,
      }
    }
  }
</script> -->

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
}

.container:hover {
  cursor: move;
}

.tree-node,
.tree-node-active,
.tree-node-activeRoute {
  display: inline-block;
  padding: 8px;
  min-width: 80%;
  margin: 6px;
  min-height: 28px;
  color: $menutext;
  background-color: $secondary;
  text-align: center;
  line-height: 28px;
  border-radius: 4px;
  word-wrap: break-word;
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
