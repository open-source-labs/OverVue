<!--
Description:
  Display of HTML elements in dashboard
  Functionality: delete/set active elements and traverse nested HTML elements
-->

<template>
  <section class="home-queue">
    <i v-if='this.activeLayer.id !== ""' class="fas fa fa-chevron-up fa-md" @click="setParentLayer"></i>
    <span class='list-title' v-if='this.activeLayer.id !== ""'> Viewing Elements in '{{ this.activeComponent }} {{ depth }}' </span>
    <span class='list-title' v-else-if='this.activeComponent !==""'> Viewing Elements in '{{ this.activeComponent }}' </span>
    <span class='list-title' v-else> Elements in Queue </span>
    <hr>
    <div
      group="people"
      class="list-group"
    >

      <div
      :class="activeHTML === element[2] ? 'list-group-item-selected' : 'list-group-item'"
      @dblclick.self="setActiveElement(element)"
      v-for="(element) in renderList" :key="element[1] + Date.now()"
      >
        <i v-if='activeComponent === "" || exceptions.includes(element[0]) ' class="fas fa fa-angle-double-down fa-md" id="unavailable"></i>
        <i v-else class="fas fa fa-angle-double-down fa-md" @click="setLayer({text: element[0], id: element[2]})"></i>
        {{ element[0] }}
        <i class="fas fa fa-trash fa-md" @click.self="deleteElement([element[1],element[2]])"></i>
      </div>

    </div>
  </section>
</template>

<script>

import { mapState, mapActions } from 'vuex'
import { setSelectedElementList, deleteSelectedElement, deleteFromComponentHtmlList } from '../store/types'
import { breadthFirstSearch } from '../utils/search.util'

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
  data () {
    return {
      exceptions: ['input', 'img', 'link']
    }
  },
  computed: {
    ...mapState(['selectedElementList', 'componentMap', 'activeComponent', 'activeHTML', 'activeLayer']),
    renderList: {
      get () {
        if (this.activeComponent === '') return this.selectedElementList.map((el, index) => [el.text, index, el.id])
        // change activeComponent's htmlList into an array of arrays ([element/component name, index in state])
        if (this.activeComponent !== '' && this.activeLayer.id === '') {
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
    },
    depth: function () {
      let newTitle = ''
      this.activeLayer.lineage.forEach(el => {
        newTitle += ` > ${el}`
      })
      return newTitle
    }
    
  },
  methods: {
    ...mapActions(['setActiveHTML', 'setActiveLayer', 'upOneLayer']),
    deleteElement (id) {
      if (this.activeComponent === '') this.$store.dispatch(deleteSelectedElement, id[0])
      else this.$store.dispatch(deleteFromComponentHtmlList, id[1])
    },
    setActiveElement (element) {
      if (this.activeComponent !== '' && !this.exceptions.includes(element[0])) {
        this.setActiveHTML(element)
      }
    },
    setLayer (element) {
      this.setActiveLayer(element)
    },
    setParentLayer () {
      if (this.activeLayer.id !== '') {
        this.upOneLayer(this.activeLayer.id)
      }
    }
  },
  watch: {
    activeComponent: function () {
      // console.log('watching activeComponent in HomeQueue')
      if (this.activeComponent !== '') {
        this.component = true
      } else {
        this.component = false
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.home-queue {
  padding-bottom: 40px;
}

li {
  list-style-type: none;
}

.list-group-item {
  display: inline-block;
  margin: 2px 1.5%;
  min-width: 175px;
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
  min-width: 175px;
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
  top: 2px;
  right: 35px;
  float: right;
}
.fa-angle-double-down {
  position: relative;
  top: 2px;
  left: 35px;
  float: left;
}

.fa-angle-double-down:hover {
  cursor: pointer;
  color: #41B883;
}

.fa-chevron-up {
  position: relative;
}

.fa-chevron-up:hover {
  cursor: pointer;
  color: #41B883;
}

#unavailable {
  color: #686868;
  cursor: default
}

hr {
  border: 1px solid grey
}
</style>
