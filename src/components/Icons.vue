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
      <span class="white--text"
      >{{ elementName }}</span>
    </button>
  </section>
</template>

<script>
import { mapState } from 'vuex'
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
  data () {
    return {
      elementStorage: {}
    }
  },
  name: 'Icons',
  computed: {
    ...mapState(['icons', 'activeComponent', 'componentMap', 'selectedElementList','activeHTML','activeLayer'])
  },
  methods: {
    changeState (elementName) {
      if (this.activeComponent === '') { this.$emit('getClickedIcon', {elementName, date:Date.now()}) }
       else {
         if (this.activeHTML === '' && this.activeLayer.id ==='') {
          this.$emit('activeElement', {elementName,date:Date.now()})
         }
         else if (this.activeLayer.id !== '' && this.activeHTML === '') {
          this.$emit('activeLayer', {elementName, date:Date.now()})
         }else {
           this.$emit('activeHTML', {elementName, date:Date.now()})
         }
       }
    }
  },
  watch: {
    selectedElementList: function() {
      // console.log('watching selectedElementList');
      if (this.activeComponent === '') {
        this.elementStorage = {};
        this.selectedElementList.forEach(el => {
          if (!this.elementStorage[el.text]) {
            this.elementStorage[el.text] = 1;
          } else {
            this.elementStorage[el.text] += 1;
          }
        })
      }
      // console.log('storage is ', this.elementStorage)
    },
    activeLayer: {
      deep: true,
      handler(){
        if (this.activeComponent)
        {
          this.elementStorage = {};
           if (this.activeLayer.id !== '' && this.activeHTML === '') {
            let activeLayerObj =  breadthFirstSearch(this.componentMap[this.activeComponent].htmlList, this.activeLayer.id)
            activeLayerObj.children.forEach(el => {
              if (!this.elementStorage[el.text]) {
                this.elementStorage[el.text] = 1;
              } else {
                this.elementStorage[el.text] += 1;
              }
            })
          }
        }
      }
    },
    // if componentMap is updated (i.e. element is added to component's htmlList), elementStorage will update its cache of elements & frequency

    componentMap: {
      deep: true,
      handler () {
        // console.log('watching componentMap');
        // console.log('activecomponent is ', this.activeComponent)
        // console.log('htmlList', this.componentMap[this.activeComponent].htmlList)
        if (this.activeComponent) {
          this.elementStorage = {};
           if (this.activeLayer.id !== '' && this.activeHTML === '') {
          let activeLayerObj =  breadthFirstSearch(this.componentMap[this.activeComponent].htmlList, this.activeLayer.id)
          activeLayerObj.children.forEach(el => {
            if (!this.elementStorage[el.text]) {
              this.elementStorage[el.text] = 1;
            } else {
              this.elementStorage[el.text] += 1;
            }
          })
          } else if(this.activeHTML !== ''){
            let activeHtmlObj =  breadthFirstSearch(this.componentMap[this.activeComponent].htmlList, this.activeHTML)
            activeHtmlObj.children.forEach(el => {
          if (!this.elementStorage[el.text]) {
            this.elementStorage[el.text] = 1;
          } else {
            this.elementStorage[el.text] += 1;
          }
        })
          } else {
            this.componentMap[this.activeComponent].htmlList.forEach(el => {
              if (!this.elementStorage[el.text]) {
                this.elementStorage[el.text] = 1;
              } else {
                this.elementStorage[el.text] += 1;
              }
            })
          }
          // console.log('elementStorage is ', this.elementStorage);
        }
      },
    },

    activeHTML: function() {
      this.elementStorage = {};
      if (this.activeHTML!== ''){
        let activeHtmlObj =  breadthFirstSearch(this.componentMap[this.activeComponent].htmlList, this.activeHTML)
        activeHtmlObj.children.forEach(el => {
          if (!this.elementStorage[el.text]) {
            this.elementStorage[el.text] = 1;
          } else {
            this.elementStorage[el.text] += 1;
          }
        })
      }
      else{
        if (this.activeLayer.id !== '' && this.activeHTML === '') {
          let activeLayerObj =  breadthFirstSearch(this.componentMap[this.activeComponent].htmlList, this.activeLayer.id)
          activeLayerObj.children.forEach(el => {
            if (!this.elementStorage[el.text]) {
              this.elementStorage[el.text] = 1;
            } else {
              this.elementStorage[el.text] += 1;
            }
          })
          } else {
            this.componentMap[this.activeComponent].htmlList.forEach(el => {
              if (!this.elementStorage[el.text]) {
                this.elementStorage[el.text] = 1;
              } else {
                this.elementStorage[el.text] += 1;
              }
            })
          }
      }
    },
    // if activeComponent is updated, elementStorage will update its cache of elements & frequency to reflect new active component
    activeComponent: function() {
      // console.log('watching activeComponent', this.activeComponent);
      if (this.activeComponent) {
        this.elementStorage = {};
        this.componentMap[this.activeComponent].htmlList.forEach(el => {
          if (!this.elementStorage[el.text]) {
            this.elementStorage[el.text] = 1;
          } else {
            this.elementStorage[el.text] += 1;
          }
        })
        // console.log('elementStorage is ', this.elementStorage);
      } else if (this.activeComponent === '') {
        // console.log(`watching activeComponent, current active is ''`)
        // if component was switched from existing component to '', reset cache and update items
        if (this.elementStorage !== {}) this.elementStorage = {};
        this.selectedElementList.forEach(el => {
          if (!this.elementStorage[el.text]) {
            this.elementStorage[el.text] = 1;
          } else {
            this.elementStorage[el.text] += 1;
          }
        })
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
