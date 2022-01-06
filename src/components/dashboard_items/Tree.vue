<!--
Description:
  Displays project tree in Dashboard
  Functionality includes: formating componentMap object to displaying in tree form
  -->

<template>
  <div class="container">
    <myTree :nodes="computedTree" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import myTree from "vue3-tree";
import { ref } from "vue";
export default {
  name: "Tree",
  components: {
    myTree,
  },

  computed: {
    ...mapState(["componentMap", "activeComponent"]),
    // Returns project tree on re-render
    computedTree() {
      const builtTree = [this.buildTree()];
      // console.log("buildtree", builtTree);
      return builtTree;
    },
  },

  data() {
    return {
      tree: null,
      treeKey: "key",
      testTree: [
        {
          id: 1,
          label: "Animal",
          nodes: [
            {
              id: 2,
              label: "Dog",
            },
            {
              id: 3,
              label: "Cat",
              nodes: [
                {
                  id: 4,
                  label: "Egyptian Mau Cat",
                },
                {
                  id: 5,
                  label: "Japanese Bobtail Cat",
                },
              ],
            },
          ],
        },
        {
          id: 6,
          label: "People",
        },
      ],
    };
  },

  methods: {
    // Called by transformToTree, formats componentMap
    formatComponentMap(compMap) {
      let result = [];
      // Id to apply to each component, in accordance with Vue3Tree syntax
      let id = 1;
      const values = Object.values(compMap);
      values.forEach((compData) => {
        result.push({
          id: id++,
          label: compData.componentName, // previously was labeled 'name'
          nodes: compData.children, // previously was labeled 'children'
        });
      });
      return result;
    },
    // Called by buildTree, transforms componentMap
    // we need to change this to clean the data and transform it to something usable by vue3tree
    transformToTree(data) {
      let result = {};
      const temp = {};
      const formattedData = this.formatComponentMap(data);
      formattedData.forEach((component) => {
        if (!temp[component.label]) {
          temp[component.label] = { label: component.label, nodes: [] };
          result = temp;
        }
        component.nodes.forEach((child) => {
          if (!temp[child]) temp[child] = { label: child, nodes: [] };
          temp[component.label].nodes.push(temp[child]);
        });
      });
      return result;
    },
    // Called by computedTree, calls transformToTree
    buildTree() {
      let build = this.transformToTree(this.componentMap);
      return build["App"];
    },
  },
  watch: {
    componentMap: {
      deep: true,
      handler() {
        this.buildTree();
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
}

.treeclass .nodetree text {
  font-size: 19px !important;
  cursor: pointer;
  text-shadow: none !important;
  font-weight: bold;
  fill: #fff;
  transform: rotate(-90deg);
}

/* changes the circle node color */
.treeclass .nodetree circle {
  fill: #a2d9ff;
}

/* changes the stroke color */
.treeclass .linktree {
  stroke: $secondary !important;
  stroke-opacity: 0.4;
  stroke-width: 8px;
}
</style>
