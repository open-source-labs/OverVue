<!--
Description:
  Display of HTML elements in dashboard
  Functionality: delete/set active elements and traverse nested HTML elements
-->

<template>
  <section class="html-queue" @dragover="dragOver($event), false">
    <div group="people" class="list-group">
      <div
        @dblclick.self="setActiveElement(element)"
        v-for="element in renderList"
        :key="element[1] + Date.now()"
        @dragenter="dragEnter($event, element[2])"
      >
        <div
          :class="
            activeHTML === element[2]
              ? 'list-group-item-selected'
              : 'list-group-item'
          "
          @dblclick.self="setActiveElement(element)"
          @dragstart="startDrag($event, element[2])"
          @dragend="endDrag($event)"
          draggable="true"
        >
          <i
            v-if="activeComponent === '' || exceptions.includes(element[0])"
          ></i>
          <i
            v-else
            class="fas fa fa-angle-double-down fa-md"
            @click="setLayer({ text: element[0], id: element[2] })"
          ></i>
          {{ element[0] }}
          <i
            class="fas fa fa-trash fa-md"
            @click.self="deleteElement([element[1], element[2]])"
          ></i>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// new script for Composition API
import { breadthFirstSearch } from "../../../utils/search.util";
import { computed, ref, watch } from "vue";
import { useStore } from "../../../store/main.js";
import { HtmlElement, Component } from "app/types";

const store = useStore();

const props = defineProps({
  name: {
    type: String,
  },
  listToRender: {
    type: Array,
  },
});

const exceptions = ref(["input", "img", "link"]);

const selectedElementList = computed(() => store.selectedElementList);
const componentMap = computed(() => store.componentMap);
const activeComponent = computed(() => store.activeComponent);
const activeHTML = computed(() => store.activeHTML);
const activeLayer = computed(() => store.activeLayer);

const renderList = computed({
  get() {
    if (activeComponent.value === "")
      return selectedElementList.value.map((el, index) => [
        el.text,
        index,
        el.id,
        el.z,
      ]);
    // change activeComponent's htmlList into an array of arrays ([element/component name, index in state])
    if (activeComponent.value !== "" && activeLayer.value.id === "") {
      let sortedHTML = componentMap.value[activeComponent.value].htmlList
        .map((el, index) => [el.text, index, el.id, el.z])
        .filter((el) => {
          return el[0] !== undefined;
        });
      return sortedHTML;
    }
    let activeElement = breadthFirstSearch(
      componentMap.value[activeComponent.value].htmlList,
      activeLayer.value.id
    );
    let sortedHTML = activeElement.children
      .map((el: HtmlElement, index: number) => [el.text, index, el.id, el.z])
      .filter((el: HtmlElement[]) => {
        return el[0] !== undefined;
      });
    return sortedHTML;
  },
  set(value) {
    store.setSelectedElementList(value);
  },
});

const depth = computed(() => {
  let newTitle = "";
  activeLayer.value.lineage.forEach((el) => {
    newTitle += ` > ${el}`;
  });
  return newTitle;
});

//methods

const setActiveHTML: typeof store.setActiveHTML = (payload) =>
  store.setActiveHTML(payload);
const setActiveLayer: typeof store.setActiveLayer = (payload) =>
  store.setActiveLayer(payload);
const upOneLayer: typeof store.upOneLayer = (payload) =>
  store.upOneLayer(payload);
const setSelectedIdDrag: typeof store.setSelectedIdDrag = (payload) =>
  store.setSelectedIdDrag(payload);
const setIdDrag: typeof store.setIdDrag = (payload) => store.setIdDrag(payload);
const setSelectedIdDrop: typeof store.setSelectedIdDrop = (payload) =>
  store.setSelectedIdDrop(payload);
const setIdDrop: typeof store.setIdDrop = (payload) => store.setIdDrop(payload);
const dragDropSortHtmlElements: typeof store.dragDropSortHtmlElements = () =>
  store.dragDropSortHtmlElements();
const dragDropSortSelectedHtmlElements: typeof store.dragDropSortSelectedHtmlElements =
  () => store.dragDropSortSelectedHtmlElements();

const deleteElement = (id: number[]) => {
  if (activeComponent.value === "") store.deleteSelectedElement(id[0]);
  else store.deleteFromComponentHtmlList(id[1]);
};

const setActiveElement = (element: string[]) => {
  if (activeComponent.value !== "" && !exceptions.value.includes(element[0])) {
    setActiveHTML(element);
  }
};

const setLayer = (element: { text: string; id: string }) => {
  setActiveLayer(element);
};

const setParentLayer = () => {
  if (activeLayer.value.id !== "") {
    upOneLayer(activeLayer.value.id);
  }
};

//METHODS FOR DRAG-AND-DROP
const startDrag = (event: Event, id: string) => {
  //add a class to make the html element currently being drag transparent
  (event.target as HTMLElement).classList.add("currentlyDragging");
  const dragId = id;
  //store the id of dragged element
  if (activeComponent.value === "") setSelectedIdDrag(dragId);
  else setIdDrag(dragId);
};

const dragEnter = (event: Event, id: string) => {
  event.preventDefault();
  const dropId = id;
  //store the id of the html element whose location the dragged html element could be dropped upon
  if (activeComponent.value === "") setSelectedIdDrop(dropId);
  else setIdDrop(dropId);
};

const dragOver = (event: Event) => {
  //needed stop the dragend animation so endDrag is invoked automatically
  event.preventDefault();
};

const endDrag = (event: Event) => {
  //remove the 'currentlyDragging' class after the HTML is dropped to remove transparency
  event.preventDefault();
  (event.target as HTMLElement).classList.remove("currentlyDragging");
  //invoke the action that will use the idDrag and idDrop to sort the HtmlList
  if (activeComponent.value === "") dragDropSortSelectedHtmlElements();
  else dragDropSortHtmlElements();
};

watch(activeComponent, () => {
  if (activeComponent.value !== "") {
    (store.componentMap[activeComponent.value] as Component).isActive = true;
  } else {
    (store.componentMap[activeComponent.value] as Component).isActive = false;
  }
});
</script>

<!-- <script>
//old Options API script
import { mapState, mapActions } from 'vuex'
import { setSelectedElementList, deleteSelectedElement, deleteFromComponentHtmlList } from '../../../store/types'
import { breadthFirstSearch } from '../../../utils/search.util'

export default {
  name: 'CreateMenuHTMLQueue',
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
        if (this.activeComponent === '') return this.selectedElementList.map((el, index) => [el.text, index, el.id, el.z])
        // change activeComponent's htmlList into an array of arrays ([element/component name, index in state])
        if (this.activeComponent !== '' && this.activeLayer.id === '') {
          let sortedHTML = this.componentMap[this.activeComponent].htmlList.map((el, index) => [el.text, index, el.id, el.z]).filter(el => {
            return el[0] !== undefined
          })
          return sortedHTML
        }
        let activeElement = breadthFirstSearch(this.componentMap[this.activeComponent].htmlList, this.activeLayer.id)
        let sortedHTML = activeElement.children.map((el, index) => [el.text, index, el.id, el.z]).filter(el => {
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
    ...mapActions(['setActiveHTML', 'setActiveLayer', 'upOneLayer', 'setSelectedIdDrag', 'setIdDrag', 'setSelectedIdDrop', 'setIdDrop', 'dragDropSortHtmlElements', 'dragDropSortSelectedHtmlElements']),
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
    },
    //METHODS FOR DRAG-AND-DROP
    startDrag (event, id) {
      //add a class to make the html element currently being drag transparent
      event.target.classList.add('currentlyDragging')
      const dragId = id;
      //store the id of dragged element
      if (this.activeComponent === '') this.setSelectedIdDrag(dragId)
      else this.setIdDrag(dragId)
    },
    dragEnter (event, id) {
      event.preventDefault();
      const dropId = id;
      //store the id of the html element whose location the dragged html element could be dropped upon
      if (this.activeComponent === '') this.setSelectedIdDrop(dropId)
      else this.setIdDrop(dropId)
    },
    dragOver (event) {
      //needed stop the dragend animation so endDrag is invoked automatically
      event.preventDefault();
    },
    endDrag (event) {
      //remove the 'currentlyDragging' class after the HTML is dropped to remove transparency
      event.preventDefault();
      event.target.classList.remove('currentlyDragging')
      //invoke the action that will use the idDrag and idDrop to sort the HtmlList
      if (this.activeComponent === '') this.dragDropSortSelectedHtmlElements()
      else this.dragDropSortHtmlElements()
    },
  },
  watch: {
    activeComponent: function () {
      if (this.activeComponent !== '') {
        this.component = true
      } else {
        this.component = false
      }
    }
  }
}
</script> -->

<style lang="scss" scoped>
.html-queue {
  padding-bottom: 40px;
}

li {
  list-style-type: none;
}

.list-group {
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  color: white;
  cursor: move;
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
  cursor: move;
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
  color: #41b883;
}

.fa-chevron-up {
  position: relative;
}

.fa-chevron-up:hover {
  cursor: pointer;
  color: #41b883;
}

#unavailable {
  color: #686868;
  cursor: default;
}

hr {
  border: 1px solid grey;
}

.currentlyDragging {
  opacity: 0.5;
}

.ignoreByDragover {
  pointer-events: none;
}
</style>
