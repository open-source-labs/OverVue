<template>
  <section class="home-queue">
    <p class="panel-heading">Selected Elements</p>
    <draggable
      v-model="renderList"
      group="people"
      class="list-group"
      ghost-class="ghost"
      @start="drag = true"
      @end="drag = false"
    >
      <div class="list-group-item" v-for="(element, index) in renderList" :key="index + Date.now()">
        {{ element.text }}
        <i class="fas fa fa-trash fa-md" @click="deleteElement(index)"></i>
      </div>
    </draggable>
  </section>
</template>

<script>
import draggable from 'vuedraggable'
import { mapState } from 'vuex'
import { setSelectedElementList, deleteSelectedElement, deleteFromComponentHtmlList } from '../store/types'

export default {
  name: 'HomeQueue',
  props: {
    name: {
      type: String
    },
    listToRender: {
      type: Array
    }
  },

  computed: {
    ...mapState(['selectedElementList', 'componentMap', 'activeComponent']),
    renderList: {
      get () {
        if (this.activeComponent === '') return this.selectedElementList
        return this.componentMap[this.activeComponent].htmlList
      },
      set (value) {
        this.$store.dispatch(setSelectedElementList, value)
      }
    }
  },
  methods: {
    deleteElement (index) {
      if (this.activeComponent === '') this.$store.dispatch(deleteSelectedElement, index)
      else this.$store.dispatch(deleteFromComponentHtmlList, index)
    }
  },
  components: {
    draggable
  }
}
</script>

<style scoped>
.home-queue {
  border: 1px solid white;
  background-color: hsl(222, 15%, 26%);
  height: 100%;
}
li {
  list-style-type: none;
}
.list-group-item {
  margin: 2px;
  border: 1px solid black;
  border-radius: 0.5cm;
  background-color: #e7d5bc;
  height: 35px;
  padding-top: 2px;
  text-align: center;
}

.fa-trash:hover {
  cursor: pointer;
  color: red;
}
</style>
