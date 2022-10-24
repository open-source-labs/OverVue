<!--
Description:
  Display of HTML elements in dashboard
  Functionality: delete/set active elements and traverse nested HTML elements
-->

<template>
  <section class="html-queue" @dragover="dragOver($event), false">
    <span class="list-title" v-if="activeLayer.id !== ''">
      <i class="fas fa fa-chevron-up fa-md" @click="setParentLayer"></i>
      &nbsp; &nbsp; Viewing Elements in {{ activeComponent }} '{{ depth }}'
      <hr />
    </span>
    <span class="list-title" v-else-if="!activeComponent"></span>
    <div group="people" class="list-group">
      <p v-if="!componentMap[activeComponent]?.htmlList.length">
        No HTML elements in component
      </p>
      <div
        v-for="element in renderList"
        :key="element[1] + Date.now()"
        @dragenter="dragEnter($event, element[2])"
      >
        <div
          id="tooltipCon"
          :class="
            activeHTML === element[2]
              ? 'list-group-item-selected'
              : 'list-group-item'
          "
          @dragstart="startDrag($event, element[2])"
          @dragend="endDrag($event)"
          draggable="true"
        >
          <!--invisible button for tooltip-->
          <button class="attributeButton" @click="setActiveElement(element)">
            <div class="tooltip">Edit {{ element[0] }} attributes</div>
          </button>
          <i
            v-if="
              activeComponent === '' ||
              exceptions.includes(element[0]) ||
              moreExceptions().includes(element[0])
            "
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
import { ref, computed, watch } from "vue";
import { useStore } from "../../store/main.js";
import { breadthFirstSearch } from "../../utils/search.util";
import { HtmlElement, Component } from "../../../types";
import { string } from "yargs";

const store = useStore();

const props = defineProps({
  name: String,
  listToRender: Array,
});

const exceptions = ref(["input", "img", "link"]);
const attributeModal = ref(false);
const classText = ref("");
const bindingText = ref("");

const activeComponentObj = computed(() => store.activeComponentObj);
const selectedElementList = computed(() => store.selectedElementList);
const componentMap = computed(() => store.componentMap);
const activeComponent = computed(() => store.activeComponent);
const activeHTML = computed(() => store.activeHTML);
const activeLayer = computed(() => store.activeLayer);
const attributeModalOpen = computed(() => store.attributeModalOpen);

const renderList = computed({
  get() {
    if (activeComponent.value === "")
      return selectedElementList.value.map((el, index) => [
        el.text,
        index,
        el.id,
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
      .map((el: HtmlElement, index: number) => [el.text, index, el.id])
      .filter((el: HtmlElement[]) => {
        return el[0] !== undefined;
      });
    return sortedHTML;
  },
  set(value) {
    store.setSelectedElementList(value);
  },
});

const depth = () => {
  let newTitle = "";
  activeLayer.value.lineage.forEach((el) => {
    newTitle += ` > ${el}`;
  });
  return newTitle;
};

//make child components in htmlList exceptions
const moreExceptions = () => {
  let childComponent: string[] = [];
  if (activeComponent.value) {
    childComponent = componentMap.value[activeComponent.value].children;
  }
  return childComponent;
};

const parentSelected: typeof store.parentSelected = (payload: any) =>
  store.parentSelected(payload);

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
const dragDropSortHtmlElements = () => store.dragDropSortHtmlElements();
const dragDropSortSelectedHtmlElements = () =>
  store.dragDropSortSelectedHtmlElements();
const openAttributeModal = () => store.openAttributeModal();
const addActiveComponentClass: typeof store.addActiveComponentClass = (
  payload
) => store.addActiveComponentClass(payload);
const addBindingText: typeof store.addBindingText = (payload) =>
  store.addBindingText(payload);
const clearActiveHTML = () => store.clearActiveHTML();

const deleteElement = (id: number[]) => {
  if (activeComponent.value === "") store.deleteSelectedElement(id[0]);
  else store.deleteFromComponentHtmlList(id[1]);
};

const closeMenu = () => {
  if (activeComponent.value !== "") {
    clearActiveHTML();
    openAttributeModal();
  }
};

const setActiveElement = (element: string[]) => {
  if (activeComponent.value !== "") {
    setActiveHTML(element);
    if (attributeModal.value === false) {
      openAttributeModal();
    } else {
      closeMenu();
    }
  }
};

const setLayer = (element: { text: string; id: string }) => {
  setActiveLayer(element);
  element.id = activeHTML.value;
};

const setParentLayer = () => {
  if (activeLayer.value.id !== "") {
    upOneLayer(activeLayer.value.id);
  }
};

//METHODS FOR DRAG-AND-DROP
const startDrag = (event: MouseEvent, id: string) => {
  //add a class to make the html element currently being drag transparent
  (event.target as HTMLElement).classList.add("currentlyDragging");
  const dragId = id;
  //store the id of dragged element
  if (activeComponent.value === "") setSelectedIdDrag(dragId);
  else setIdDrag(dragId);
};

const dragEnter = (event: MouseEvent, id: string) => {
  event.preventDefault();
  const dropId = id;
  //store the id of the html element whose location the dragged html element could be dropped upon
  if (activeComponent.value === "") setSelectedIdDrop(dropId);
  else setIdDrop(dropId);
};

const dragOver = (event: MouseEvent) => {
  //needed stop the dragend animation so endDrag is invoked automatically
  event.preventDefault();
};

const endDrag = (event: MouseEvent) => {
  //remove the 'currentlyDragging' class after the HTML is dropped to remove transparency
  event.preventDefault();
  (event.target as HTMLElement).classList.remove("currentlyDragging");
  //invoke the action that will use the idDrag and idDrop to sort the HtmlList
  if (activeComponent.value === "") dragDropSortSelectedHtmlElements();
  else dragDropSortHtmlElements();
};

const submitClass = (element: string, idNum: string) => {
  if (element === "") {
    return;
  }

  let payload = {
    class: element,
    id: idNum,
  };
  addActiveComponentClass(payload);
  classText.value = "";
};

const addBinding = (input: string, idNum: number) => {
  if (input === "") {
    return;
  }
  const payload: { binding: string; id: number } = {
    binding: input,
    id: idNum,
  };
  addBindingText(payload);
  bindingText.value = "";
};

watch(attributeModalOpen, () => {
  attributeModal.value = attributeModalOpen.value;
});

// watch(activeComponent, () => {
//   if (activeComponent.value !== "") {
//     (store.componentMap[activeComponent.value] as Component).isActive = true;
//   } else {
//     (store.componentMap[activeComponent.value] as Component).isActive = false;
//   }
// });
</script>

<!-- <script>
import { keys } from "localforage";
import { mapState, mapActions } from "vuex";
import {
  setSelectedElementList,
  deleteSelectedElement,
  deleteFromComponentHtmlList,
} from "../../store/types";
import { breadthFirstSearch } from "../../utils/search.util";

export default {
  name: "HTMLQueue",
  props: {
    name: {
      type: String,
    },
    listToRender: {
      type: Array,
    },
  },
  data() {
    return {
      exceptions: ["input", "img", "link"],
      attributeModal: false,
      classText: "",
      bindingText: "",
    };
  },
  computed: {
    ...mapState([
      "activeComponentObj",
      "selectedElementList",
      "componentMap",
      "activeComponent",
      "activeHTML",
      "activeLayer",
      "attributeModalOpen",
    ]),
    renderList: {
      get() {
        if (this.activeComponent === "")
          return this.selectedElementList.map((el, index) => [
            el.text,
            index,
            el.id,
          ]);
        // change activeComponent's htmlList into an array of arrays ([element/component name, index in state])
        if (this.activeComponent !== "" && this.activeLayer.id === "") {
          let sortedHTML = this.componentMap[this.activeComponent].htmlList
            .map((el, index) => [el.text, index, el.id, el.z])
            .filter((el) => {
              return el[0] !== undefined;
            });
          return sortedHTML;
        }
        let activeElement = breadthFirstSearch(
          this.componentMap[this.activeComponent].htmlList,
          this.activeLayer.id
        );
        let sortedHTML = activeElement.children
          .map((el, index) => [el.text, index, el.id])
          .filter((el) => {
            return el[0] !== undefined;
          });
        return sortedHTML;
      },
      set(value) {
        this.$store.dispatch(setSelectedElementList, value);
      },
    },
    depth: function () {
      let newTitle = "";
      this.activeLayer.lineage.forEach((el) => {
        newTitle += ` > ${el}`;
      });
      return newTitle;
    },
    //make child components in htmlList exceptions
    moreExceptions: function () {
      let childComponent = [];
      if (this.activeComponent) {
        childComponent = this.componentMap[this.activeComponent].children;
      }
      return childComponent;
    },
  },
  methods: {
    ...mapActions([
      "setActiveHTML",
      "setActiveLayer",
      "upOneLayer",
      "setSelectedIdDrag",
      "setIdDrag",
      "setSelectedIdDrop",
      "setIdDrop",
      "dragDropSortHtmlElements",
      "dragDropSortSelectedHtmlElements",
      "openAttributeModal",
      "addActiveComponentClass",
      "addBindingText",
      "clearActiveHTML",
    ]),
    deleteElement(id) {
      if (this.activeComponent === "")
        this.$store.dispatch(deleteSelectedElement, id[0]);
      else this.$store.dispatch(deleteFromComponentHtmlList, id[1]);
    },

    closeMenu(element) {
      if (this.activeComponent !== "") {
        this.clearActiveHTML();
        this.openAttributeModal(element);
      }
    },

    setActiveElement(element) {
      if (this.activeComponent !== "") {
        this.setActiveHTML(element);
        if (this.attributeModal === false) {
          this.openAttributeModal(element);
        } else {
          this.closeMenu(element);
        }
      }
    },

    setLayer(element) {
      this.setActiveLayer(element);
      element.id = this.activeHTML;
    },
    setParentLayer() {
      if (this.activeLayer.id !== "") {
        this.upOneLayer(this.activeLayer.id);
      }
    },
    //METHODS FOR DRAG-AND-DROP
    startDrag(event, id) {
      //add a class to make the html element currently being drag transparent
      event.target.classList.add("currentlyDragging");
      const dragId = id;
      //store the id of dragged element
      if (this.activeComponent === "") this.setSelectedIdDrag(dragId);
      else this.setIdDrag(dragId);
    },
    dragEnter(event, id) {
      event.preventDefault();
      const dropId = id;
      //store the id of the html element whose location the dragged html element could be dropped upon
      if (this.activeComponent === "") this.setSelectedIdDrop(dropId);
      else this.setIdDrop(dropId);
    },
    dragOver(event) {
      //needed stop the dragend animation so endDrag is invoked automatically
      event.preventDefault();
    },
    endDrag(event) {
      //remove the 'currentlyDragging' class after the HTML is dropped to remove transparency
      event.preventDefault();
      event.target.classList.remove("currentlyDragging");
      //invoke the action that will use the idDrag and idDrop to sort the HtmlList
      if (this.activeComponent === "") this.dragDropSortSelectedHtmlElements();
      else this.dragDropSortHtmlElements();
    },
    submitClass(element, idNum) {
      if (element === "") {
        return;
      }

      let payload = {
        class: element,
        id: idNum,
      };
      this.addActiveComponentClass(payload);
      this.classText = "";
    },
    addBinding(input, idNum) {
      if (input === "") {
        return;
      }
      const payload = {
        binding: input,
        id: idNum,
      };
      this.addBindingText(payload);
      this.bindingText = "";
    },
  },
  /*
  watch(attributeModalOpen, () => attributeModal = attributeModalOpen);

  watch(activeComponent, () => {
    if (activeComponent !== '') {
      component = true;
    } else {
      component = false;
    }
  }) */
  watch: {
    attributeModalOpen() {
      this.attributeModal = this.attributeModalOpen;
    },
    activeComponent: function () {
      if (this.activeComponent !== "") {
        this.component = true;
      } else {
        this.component = false;
      }
    },
  },
};
</script> -->

<style lang="scss" scoped>
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
  cursor: move;
}

.list-group-item-selected {
  display: inline-block;
  margin: 4px 1.5%;
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
  color: $darktext;
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

#tooltipCon {
  position: relative;
  cursor: pointer;
  margin-top: 1em;
}

.tooltip {
  visibility: hidden;
  z-index: 1;
  opacity: 0.4;

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
  bottom: 25%;
}

.attributeButton:hover .tooltip {
  visibility: visible;
  transform: translateY(-10px);
  opacity: 1;
  transition: 0.3s linear;
  animation: odsoky 1s ease-in-out infinite alternate;
}

.attributeButton:hover {
  cursor: pointer;
}
</style>
