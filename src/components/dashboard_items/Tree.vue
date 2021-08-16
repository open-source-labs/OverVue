<!--
Description:
  Displays project tree in Dashboard
  Functionality includes: formating componentMap object to displaying in tree form
  -->

<template>
  <div class="container">
    <tree
      :data="computedTree"
      node-text="name"
      layoutType="euclidean"
      type="tree"
      :zoomable="true"
      :radius="4"
    ></tree>
  </div>
</template>

<script>
import { tree } from 'vued3tree'
import { mapState } from 'vuex'
export default {
  name: 'Tree',
  components: {
    tree
  },
  computed: {
    ...mapState(['componentMap', 'activeComponent']),
    // Returns project tree on re-render
    computedTree () {
      // console.log('buildtree', this.buildTree())
      return this.buildTree()
    }
  },
  data () {
    return {
      tree: null
    }
  },
  methods: {
    // Called by transformToTree, formats componentMap
    formatComponentMap (compMap) {
      // console.log('compMap', compMap)
      let result = []
      Object.values(compMap).forEach((compData) => {
        result.push({
          name: compData.componentName,
          children: compData.children
        })
      })
      console.log(JSON.stringify(result))
      // console.log('Formatcomponent map result', result)
      return result
    },
    // Called by buildTree, transforms componentMap
    transformToTree (data) {
      let result = {}
      const nodes = {}
      const formattedData = this.formatComponentMap(data)

      formattedData.forEach((component) => {
        if (!nodes[component.name]) {
          nodes[component.name] = { name: component.name, children: [] }
          result = nodes
        }
        component.children.forEach((child) => {
          if (!nodes[child]) nodes[child] = { name: child, children: [] }
          nodes[component.name].children.push(nodes[child])
        })
      })
      console.log(nodes)
      console.log(result)
      return result
    },
    // Called by computedTree, calls transformToTree
    buildTree () {
      let build = this.transformToTree(this.componentMap)
      return build['App']
    }
  },
  watch: {
    componentMap: {
      deep: true,
      handler () {
        this.buildTree()
      }
    }
  }
}
</script>

<style lang="stylus">
.container
  height 100%
  width 100%

.treeclass .nodetree text
  font-size 19px !important
  cursor pointer
  text-shadow none !important
  font-weight bold
  fill #FFF
  /* none of these classes work
  color: white !important;
  background: white;
  margin: 1rem; */

/* changes the circle node color */
.treeclass .nodetree circle
  fill #A2D9FF

/* changes the stroke color */
.treeclass .linktree
  stroke $secondary !important
  stroke-opacity .4
  stroke-width 8px
</style>
