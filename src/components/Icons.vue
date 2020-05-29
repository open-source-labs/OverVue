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

export default {
  data () {
    return {
      elementStorage: {}
    }
  },
  name: 'Icons',
  computed: {
    ...mapState(['icons', 'activeComponent', 'componentMap', 'selectedElementList'])
  },
  methods: {
    changeState (elementName) {
      if (this.activeComponent === '') { this.$emit('getClickedIcon', elementName) } else this.$emit('activeElement', elementName)
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
    // if componentMap is updated (i.e. element is added to component's htmlList), elementStorage will update its cache of elements & frequency
    componentMap: {
      deep: true,
      handler () {
        // console.log('watching componentMap');
        // console.log('activecomponent is ', this.activeComponent)
        // console.log('htmlList', this.componentMap[this.activeComponent].htmlList)
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
        }
      },
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
