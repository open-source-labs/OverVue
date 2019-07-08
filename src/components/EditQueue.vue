<template>
  <div>
    <p class="panel-heading">Selected Elements</p>
    <Tree :data="renderList" draggable="draggable">
      <div slot-scope="{ data }" class="drag">
        <template v-if="!data.isDragPlaceHolder">
          <span class="drag-text">{{ data.text }}</span>
          <i class="fas fa-trash fa-md" @click="deleteElement(data._id)"></i>
        </template>
      </div>
    </Tree>
  </div>
</template>

<script>
// import draggable from 'vuedraggable'
import { DraggableTree } from 'vue-draggable-nested-tree'
import { mapState, mapActions } from 'vuex'
import {
  setClickedElementList,
  deleteFromComponentHtmlList
  // setComponentHtmlList,
  // addToComponentElementList
} from '../store/types'
// import { setInterval } from 'timers'

export default {
  name: 'EditQueue',
  props: {
    name: {
      type: String
    }
  },
  data: function () {
    return {
      listToRender: null
    }
  },
  computed: {
    ...mapState(['componentMap', 'activeComponent', 'routes', 'activeRoute']),
    renderList: {
      get () {
        return this.componentMap[this.activeComponent].htmlList
      },
      set (newArr) {
        this.setClickedElementList(newArr)
      }
    }
  },
  methods: {
    ...mapActions([setClickedElementList]),
    deleteElement (id) {
      this.$store.dispatch(deleteFromComponentHtmlList, id)
    }
  },
  components: {
    // draggable,
    Tree: DraggableTree
  }
}
</script>

<style scoped>
.delete-icon:hover {
  cursor: pointer;
}
.drag {
  background-color: white;
  margin: 0.5em;
  border-radius: 5px;
}
.drag-text {
  padding-left: 5px;
}
</style>
