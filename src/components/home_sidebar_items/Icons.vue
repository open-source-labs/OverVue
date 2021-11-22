<!--
Description:
  Displays all html elements icons that can be added to component in createComponent
  Functionality includes: Adding (nesting) html elements to components
  -->

<template>
  <section class="icon-grid">
    <button
      @click.prevent="changeState(elementName)"
      v-for="([elementName, iconString], idx) in Object.entries(icons)"
      :key="idx + Date.now()"
    >
      <span class="badge"> {{ elementStorage[elementName] }}</span>
      <br />
      <i :class="iconString"></i>
      <br />
      <span class="white--text">{{ elementName }}</span>
    </button>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { breadthFirstSearch } from '../../utils/search.util'

export default {
  data () {
    return {
      elementStorage: {}
    }
  },
  name: 'Icons',
  computed: {
    ...mapState([
      'icons',
      'activeComponent',
      'componentMap',
      'selectedElementList',
      'activeHTML',
      'activeLayer'
    ]),
    // elementStorage: function () {
    //   console.log('computed: elementStorage')
    //   if (this.activeComponent) {
    //     return {

    //     }
    //   }
    //   return {

    //   }
    // }
  },
  methods: {
    // Logic to decide where to place selected html element
    changeState (elementName) {
      // console.log('this.elementStorage: ', this.elementStorage)
      // if no active component & creating a new component: add html to selectedElement list
      if (this.activeComponent === '') {
        this.$emit('getClickedIcon', { elementName, date: Date.now() })
      } else {
        if (this.activeHTML === '' && this.activeLayer.id === '') {
          // if active component & no active html: add html to component's htmlList no nesting
          this.$emit('activeElement', { elementName, date: Date.now() })
        } else if (this.activeLayer.id !== '' && this.activeHTML === '') {
          // if active component & in a different layer: add html to current layers htmlList
          this.$emit('activeLayer', { elementName, date: Date.now() })
        } else {
          // if active component, active layer is not selected, but have active html: add html to active html's htmlList
          this.$emit('activeHTML', { elementName, date: Date.now() })
        }
      }
    }
  },
  watch: {
    // watch for changes to selectedElementList when creating a component
    selectedElementList: function () {
      console.log('watching selectedElementList');
      if (this.activeComponent === '') {
        this.elementStorage = {}
        this.selectedElementList.forEach(el => {
          // if user adds an element and the element is not inside of component, give it a value of 1
          if (!this.elementStorage[el.text]) {
            this.elementStorage[el.text] = 1
          } else {
            // otherwise increment count by 1
            this.elementStorage[el.text] += 1
          }
        })
      }
      // console.log('storage is ', this.elementStorage)
    },
    // watch for changes to activeLayer when creating a component
    activeLayer: {
      deep: true,
      handler () {
        console.log('watch: activeLayer');
        if (this.activeComponent) {
          this.elementStorage = {}
          if (this.activeLayer.id !== '' && this.activeHTML === '') {
            let activeLayerObj = breadthFirstSearch(
              this.componentMap[this.activeComponent].htmlList,
              this.activeLayer.id
            )
            activeLayerObj.children.forEach(el => {
              if (!this.elementStorage[el.text]) {
                this.elementStorage[el.text] = 1
              } else {
                this.elementStorage[el.text] += 1
              }
            })
          }
        }
      }
    },
    // if componentMap is updated (i.e. element is added to component's htmlList), elementStorage will update its cache of elements & frequency
    componentMap: {
      deep: true,
      // handler logic for where to increment html element count in element storage
      handler () {
        console.log('watch: componentMap');
        // console.log('watching componentMap');
        // console.log('activecomponent is ', this.activeComponent)
        // console.log('htmlList', this.componentMap[this.activeComponent].htmlList)
        if (this.activeComponent) {
          this.elementStorage = {}
          if (this.activeLayer.id !== '' && this.activeHTML === '') {
            let activeLayerObj = breadthFirstSearch(
              this.componentMap[this.activeComponent].htmlList,
              this.activeLayer.id
            )
            activeLayerObj.children.forEach(el => {
              if (!this.elementStorage[el.text]) {
                this.elementStorage[el.text] = 1
              } else {
                this.elementStorage[el.text] += 1
              }
            })
          } else if (this.activeHTML !== '') {
            let activeHtmlObj = breadthFirstSearch(
              this.componentMap[this.activeComponent].htmlList,
              this.activeHTML
            )
            activeHtmlObj.children.forEach(el => {
              if (!this.elementStorage[el.text]) {
                this.elementStorage[el.text] = 1
              } else {
                this.elementStorage[el.text] += 1
              }
            })
          } else {
            this.componentMap[this.activeComponent].htmlList.forEach(el => {
              if (!this.elementStorage[el.text]) {
                this.elementStorage[el.text] = 1
              } else {
                this.elementStorage[el.text] += 1
              }
            })
          }
          // console.log('elementStorage is ', this.elementStorage);
        }
      }
    },
    // watch for changes to the activeHTML to decide where to place our html element
    activeHTML: function () {
      this.elementStorage = {}
      console.log('watch: activeHTML');
      if (this.activeHTML !== '') {
        let activeHtmlObj = breadthFirstSearch(
          this.componentMap[this.activeComponent].htmlList,
          this.activeHTML
        )
        activeHtmlObj.children.forEach(el => {
          if (!this.elementStorage[el.text]) {
            this.elementStorage[el.text] = 1
          } else {
            this.elementStorage[el.text] += 1
          }
        })
      } else {
        if (this.activeLayer.id !== '' && this.activeHTML === '') {
          let activeLayerObj = breadthFirstSearch(
            this.componentMap[this.activeComponent].htmlList,
            this.activeLayer.id
          )
          activeLayerObj.children.forEach(el => {
            if (!this.elementStorage[el.text]) {
              this.elementStorage[el.text] = 1
            } else {
              this.elementStorage[el.text] += 1
            }
          })
        } else {
          this.componentMap[this.activeComponent].htmlList.forEach(el => {
            if (!this.elementStorage[el.text]) {
              this.elementStorage[el.text] = 1
            } else {
              this.elementStorage[el.text] += 1
            }
          })
        }
      }
    },
    // if activeComponent is updated, elementStorage will update its cache of elements & frequency to reflect new active component
    activeComponent: {
      // deep: true,
      handler () {
      // console.log('watching activeComponent', this.activeComponent);
        console.log('watch: activeComponent');
        if (this.activeComponent) {
          this.elementStorage = {}
          this.componentMap[this.activeComponent].htmlList.forEach(el => {
            if (!this.elementStorage[el.text]) {
              this.elementStorage[el.text] = 1
            } else {
              this.elementStorage[el.text] += 1
            }
          })
          // console.log('elementStorage is ', this.elementStorage);
        } else if (this.activeComponent === '') {
          // console.log(`watching activeComponent, current active is ''`)
          // if component was switched from existing component to '', reset cache and update items
          if (this.elementStorage !== {}) this.elementStorage = {}
          this.selectedElementList.forEach(el => {
            if (!this.elementStorage[el.text]) {
              this.elementStorage[el.text] = 1
            } else {
              this.elementStorage[el.text] += 1
            }
          })
        }
      }
    }
  }
}
</script>

<style scoped>
.icon-grid {
  display: grid;
  grid-template-columns: 33% 33% 33%;
  grid-row-gap: 1em;
  padding-top: 10px;
}

@media (max-width: 680px) {
  .icon-grid {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-row-gap: 1em;
    width: 100%;
  }
}
button {
  background: none;
  color: white;
  border: none;
}
button:hover {
  cursor: pointer;
  color: #00ffff;
}
button:focus {
  outline: none;
  color: #00ffff;
}
button:active {
  box-shadow: 0 5px inherit;
  transform: translateY(4px);
}
.badge {
  width: 15px;
  line-height: 15px;
  text-align: center;
  font-size: 10px;
  font-weight: bold;
  float: right;
  border-radius: 50%;
  background-color: #228585;
  color: white;
}
</style>
