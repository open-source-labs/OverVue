<!--
Description:
  Displays all html elements icons that can be added to component in createComponent
  Functionality includes: Adding (nesting) html elements to components
  -->

<template>
  <section class="icon-grid">
    <button @click.prevent="changeState(elementName)" v-for="([elementName, iconString], idx) in Object.entries(icons)"
      :key="idx + Date.now()">
      <span class="badge"> {{ elementStorage[elementName] }}</span>
      <br />
      <i :class="iconString"></i>
      <br />
      <span>{{ elementName }}</span>
    </button>
<!-- Icons for activeComponent's Child Components-->
    <button
      @click.prevent="changeState(elementName)"
      v-for="(elementName, idx) in childrenComp"
      :key="idx + Date.now()"
    >
      <span class="badge"> {{ elementStorage[elementName] }}</span>
      <br />
      <i :class="childIcon"></i>
      <br />
      <span>{{ elementName }}</span>
    </button>
    
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      //to give the child componenets of the active components icons
      childIcon: ["fas fa-code fa-lg"]
    };
  },
  name: "Icons",
  computed: {
    ...mapState([
      "icons",
      "activeComponent",
      "componentMap",
      "selectedElementList",
      "activeHTML",
      "activeLayer",
    ]),
    //it increments html elements when creating component
    elementStorage: function () {
      let computedElementalStorage = {};
      if (this.activeComponent) {
        computedElementalStorage = {};

        //function searches through HtmlList and is invoke recursively to search its children(Html Elements that are nested)
        const checkHtmlElements = array => {
          for (let html of array) {
            if (html.children.length) {
              checkHtmlElements(html.children)
            } 
            if (!computedElementalStorage[html.text]) {
              computedElementalStorage[html.text] = 1
            } else {
              ++computedElementalStorage[html.text]
            }
          }
        }
        //invoke the recursive function
        checkHtmlElements(this.componentMap[this.activeComponent].htmlList)
      } else if (this.activeComponent === "") {
        // if component was switched from existing component to '', reset cache and update items
        if (computedElementalStorage !== {}) computedElementalStorage = {};
        this.selectedElementList.forEach((el) => {
          if (!computedElementalStorage[el.text]) {
            computedElementalStorage[el.text] = 1;
          } else {
            computedElementalStorage[el.text] += 1;
          }
        });
      }
      return computedElementalStorage;
    },
    //Compute Child Components of the activeComponent to include them as icons
    childrenComp: function () {
      let childrenAvailable = [];
      if(this.activeComponent) {
        childrenAvailable = this.componentMap[this.activeComponent].children
      }
      return childrenAvailable;
    },
  },
  methods: {
    // Logic to decide where to place selected html element
    changeState(elementName) {
      // if no active component & creating a new component: add html to selectedElement list
      if (this.activeComponent === "") {
        this.$emit("getClickedIcon", { elementName, date: Date.now() });
      } else {
        if (this.activeHTML === "" && this.activeLayer.id === "") {
          // if active component & no active html: add html to component's htmlList no nesting
          this.$emit("activeElement", { elementName, date: Date.now() });
        } else if (this.activeLayer.id !== "" && this.activeHTML === "") {
          // if active component & in a different layer: add html to current layers htmlList
          this.$emit("activeLayer", { elementName, date: Date.now() });
        } else {
          // if active component, active layer is not selected, but have active html: add html to active html's htmlList
          this.$emit("activeHTML", { elementName, date: Date.now() });
        }
      }
    },
  },
  //  watch: {
  // watch for changes to selectedElementList when creating a component
  //  },
};
</script>

<style scoped lang="scss">
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
  color: $menutext;
  border: none;
}

button:hover {
  cursor: pointer;
  color: $secondary;
}

button:focus {
  outline: none;
  color: $secondary;
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
  background-color: $secondary;
  color: $menutext;
}
</style>
