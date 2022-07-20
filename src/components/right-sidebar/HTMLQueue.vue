<!--
Description:
  Display of HTML elements in dashboard
  Functionality: delete/set active elements and traverse nested HTML elements
-->

<template>
  <section class="html-queue">
    <span class='list-title' v-if='this.activeLayer.id !== ""'>
      <i class="fas fa fa-chevron-up fa-md" @click="setParentLayer"></i>
      &nbsp; &nbsp; Viewing Elements in {{ this.activeComponent }} '{{ depth }}'
      <hr>
    </span>
    <span class='list-title' v-else-if='!this.activeComponent'></span>
    <div group="people" class="list-group">
      <p v-if='!this.componentMap[this.activeComponent]?.htmlList.length'>No HTML elements in component</p>
      <div id="tooltipCon" :class="activeHTML === element[2] ? 'list-group-item-selected' : 'list-group-item'"
        v-for="(element) in renderList" :key="element[1] + Date.now()">

        <button class="attributeButton" @click="setActiveElement(element)">
          <div class="tooltip"> Edit {{ element[0] }} attributes </div>
        </button>
        <i v-if='activeComponent === "" || exceptions.includes(element[0])'></i>
        <i v-else class="fas fa fa-angle-double-down fa-md" @click="setLayer({ text: element[0], id: element[2] })"></i>
        {{ element[0] }}
        <i class="fas fa fa-trash fa-md" @click.self="deleteElement([element[1], element[2]])"></i>
      </div>
    </div>

    <!-- attribute pop-up -->
    <q-dialog v-model="attributeModal">
      <!-- @update:model-value="setActiveElement" -->
      <div class="AttributeBox">
        <p class="title">Added attributes to {{ this.activeComponent }}</p>
        <div class="AttributeContainer" v-for="element in this.componentMap[this.activeComponent].htmlList"
          :key="element.id + Date.now()">
          <p v-if="element.id === this.activeHTML">Your class is - {{ element.class }}</p>
        </div>
        <div class="formBox">
          <q-form autofocus v-on:submit.prevent="submitClass">
            <p class="title">Add Class Name:</p>
            <q-input label="Add your note here" filled dark autofocus true hide-bottom-space v-model="classText"
              @keyup.enter="submitClass"></q-input>
            <q-btn id="comp-btn" class="sidebar-btn" color="secondary" label="Submit Attribute"
              :disable="classText.length > 0 ? false : true" @click="submitClass(classText, this.activeHTML)" />
            <q-btn label="Close" @click="this.openAttributeModal" />
          </q-form>
        </div>
      </div>
    </q-dialog>
  </section>
</template>

<script>

import { mapState, mapActions } from 'vuex'
import { setSelectedElementList, deleteSelectedElement, deleteFromComponentHtmlList } from '../../store/types'
import { breadthFirstSearch } from '../../utils/search.util'

export default {
  name: 'HTMLQueue',
  props: {
    name: {
      type: String
    },
    listToRender: {
      type: Array
    }
  },
  data() {
    return {
      exceptions: ['input', 'img', 'link'],
      attributeModal: false,
      classText: '',
    }
  },
  computed: {
    ...mapState(['selectedElementList', 'componentMap', 'activeComponent', 'activeHTML', 'activeLayer', 'attributeModalOpen']),
    renderList: {
      get() {
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
      set(value) {
        this.$store.dispatch(setSelectedElementList, value)
      }
    },
    depth: function () {
      let newTitle = '';
      this.activeLayer.lineage.forEach(el => {
        newTitle += ` > ${el}`
      })
      return newTitle;
    }

  },
  methods: {
    ...mapActions(['setActiveHTML', 'setActiveLayer', 'upOneLayer', 'openAttributeModal', 'addActiveComponentClass, addBinding']),
    deleteElement(id) {
      if (this.activeComponent === '') this.$store.dispatch(deleteSelectedElement, id[0])
      else this.$store.dispatch(deleteFromComponentHtmlList, id[1])
    },
    setActiveElement(element) {
      if (this.activeComponent !== '') {
        this.setActiveHTML(element);
        this.openAttributeModal(element);
      }
    },
    setLayer(element) {
      this.setActiveLayer(element)
      element.id = this.activeHTML
    },
    setParentLayer() {
      if (this.activeLayer.id !== '') {
        this.upOneLayer(this.activeLayer.id)
      }
    },
    submitClass(element, idNum) {
      if (element === '') {
        return;
      }
      let payload = {
        class: element,
        id: idNum
      }
      this.addActiveComponentClass(payload);
      this.classText = '';
    },
    // addBinding(element, idNum) {
    //   if (element === '') {
    //     return;
    //   }
    //   let payload = {
    //     binding: element,
    //     id: idNum
    //   }
    // },
  },
  watch: {
    attributeModalOpen() {
      this.attributeModal = this.attributeModalOpen;
    },
    activeComponent: function () {
      if (this.activeComponent !== '') {
        this.component = true
      } else {
        this.component = false
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.html-queue {
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
  border: 2px solid $menutext;
  background-color: $secondary;
  height: 35px;
  padding-top: 6px;
  text-align: center;
}

.fa-trash:hover {
  cursor: pointer;
  color: $darktext;
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
  color: $darktext;
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


#tooltipCon {
  position: relative;
  cursor: pointer;
  margin-top: 2em;
}

.tooltip {
  visibility: hidden;
  z-index: 1;
  opacity: .40;

  width: 300%;

  background: rgba(223, 215, 215, 0.774);
  color: black;

  position: absolute;
  top: -180%;
  left: -100%;


  border-radius: 9px;
  transform: translateY(9px);
  transition: all 0.3s ease-in-out;
  box-shadow: 0 0 3px rgba(56, 54, 54, 0.86);
}




.AttributeBox {
  background-color: $subsecondary;
  color: $menutext;
  width: 65%;
  padding: 15px;
  height: 65vh;
  max-height: 80vh;
}

.attributeButton {
  width: 50px;
  height: 15px;
  position: absolute;
  background: rgba(255, 255, 255, 0);
  border: none;
  left: 35%;
  bottom: 25%
}

.attributeButton:hover .tooltip {
  visibility: visible;
  transform: translateY(-10px);
  opacity: 1;
  transition: .3s linear;
  animation: odsoky 1s ease-in-out infinite alternate;
}

.attributeButton:hover {
  cursor: pointer;
}
</style>

