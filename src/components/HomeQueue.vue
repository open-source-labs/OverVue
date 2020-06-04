<template>
  <section class="home-queue" v-on:click="handleClick">
    <span class='list-title' v-if='this.activeComponent !==""'> Viewing Elements in '{{ this.activeComponent }}' </span>
    <span class='list-title' v-else> Elements in Queue </span>
    <hr>
    <draggable
      v-model="renderList"
      group="people"
      class="list-group"
      ghost-class="ghost"
      @start="drag = true"
      @end="drag = false"
    >
      <!-- <div class="list-group-item" @dblclick="setActiveElement(element)" v-for="(element) in renderList" :key="element[1] + Date.now()"> -->
      <div :class="activeHTML === element[2] ? 'list-group-item-selected' : 'list-group-item'" @dblclick="setActiveElement(element)" v-for="(element) in renderList" :key="element[1] + Date.now()">
        {{ element[0] }}
        <i class="fas fa fa-trash fa-md" @click="deleteElement(element[2])"></i>
      </div>
    </draggable>
  </section>
</template>

<script>
import draggable from 'vuedraggable'
import { mapState, mapActions } from 'vuex'
import { setSelectedElementList, deleteSelectedElement, deleteFromComponentHtmlList, setActiveHTML } from '../store/types'
const breadthFirstSearch = (array,id) => {
  let queue = [...array.filter(el => typeof el === 'object')];
  while(queue.length){
    let evaluated = queue.shift()
    if(evaluated.id === id){
      return evaluated
    }
    else{
      if (evaluated.children.length){
      queue.push(...evaluated.children)
      }
    }
  }
  console.log("We shouldn't be ever getting here, how did you even search an id that didn't exist?")
}
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
  // data () {
  //   return {
  //     //component: false
  //   }
  // },
  computed: {
    ...mapState(['selectedElementList', 'componentMap', 'activeComponent', 'activeHTML','activeLayer']),
    renderList: {
      get () {
        if (this.activeComponent === '') return this.selectedElementList.map((el, index) => [el.text, index, el.id])
            // change activeComponent's htmlList into an array of arrays ([element/component name, index in state])
            if (this.activeComponent !== '' && this.activeLayer.id === '') {
              console.log('this works right?')
              let sortedHTML = this.componentMap[this.activeComponent].htmlList.map((el, index) => [el.text, index, el.id]).filter(el => {
                return el[0] !== undefined
              })
              return sortedHTML
            }
            let activeElement = breadthFirstSearch(this.componentMap[this.activeComponent].htmlList, this.activeLayer.id)
            let sortedHTML = activeElement.children.map((el, index) => [el.text, index, el.id]).filter(el => {
              return el[0] !== undefined
            })
            return sortedHTML
      },
      set (value) {
        this.$store.dispatch(setSelectedElementList, value)
      }
    }
  },
  methods: {
    ...mapActions(['setActiveHTML', 'setActiveLayer']),
    deleteElement (id) {
      if (this.activeComponent === '') this.$store.dispatch(deleteSelectedElement, index)
      else this.$store.dispatch(deleteFromComponentHtmlList, id)
    },
    setActiveElement (element) {
      this.$store.dispatch(setActiveHTML, element)
    },
    handleClick (event) {
      console.log(event.target)
      if (event.target.className === 'home-queue') {
        if (!(this.activeHTML === '')) this.setActiveHTML([''])
      }
    }
  },
  components: {
    draggable
  },
  // watch: {
  //   activeComponent: function () {
  //     // console.log('watching activeComponent in HomeQueue')
  //     if (this.activeComponent !== '') {
  //       this.component = true
  //     } else {
  //       this.component = false
  //     }
  //   }
  // }
}
</script>

<style lang="stylus" scoped>
.home-queue {
  height: 100%;
}
li {
  list-style-type: none;
}
.list-title {
  // font-weight: bold;
}

.list-group-item {
  display: inline-block;
  margin: 2px 1.5%;
  width: 30%;
  border-radius: 0.5cm;
  border: 2px solid $secondary;
  background-color: $secondary;
  height: 35px;
  padding-top: 6px;
  text-align: center;
}

.list-group-item-selected {
  display: inline-block;
  margin: 2px 1.5%;
  width: 30%;
  border-radius: 0.5cm;
  border: 2px solid white;
  background-color: $secondary;
  height: 35px;
  padding-top: 6px;
  text-align: center;
}

.fa-trash:hover {
  cursor: pointer;
  color: red;
}
.fa-trash {
  position: relative;
  left: 20px;
}
hr {
  border: 1px solid grey
}
</style>
