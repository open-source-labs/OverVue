<template>
  <div>

    <q-btn-dropdown class="attributeDropDown" color="primary" :label="attributeSelection">
      <q-list>
        <q-item clickable v-close-popup @keyup.enter="changeAttribute('id')" @click="changeAttribute('id')">
          <q-item-section>
            <q-item-label>ID</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @keyup.enter="changeAttribute('class')" @click="changeAttribute('class')">
          <q-item-section>
            <q-item-label>Class</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
<!--Attribute (id/class so far) change function for main component parent-->
    <q-input @keyup.enter="createAttribute(attributeText)" color="white" dark outlined bottom-slots
      v-model="attributeText" label="Enter Label" dense class="input-add" v-on:keyup.delete.stop>
      <template v-slot:append>
        <q-btn flat icon="add" @click="createAttribute(attributeText)" />
      </template>
    </q-input>
<!--delete buttons to remove class/id-->
    <button v-if="this.activeComponentObj.htmlAttributes.class !== ''" class="deleteButton"
      @click="deleteAttribute('class')" color="primary">Remove class</button>

    <button v-if="this.activeComponentObj.htmlAttributes.id !== ''" class="deleteButton" @click="deleteAttribute('id')"
      color="primary">Remove id</button>
  </div>
</template>

<script>
   export default {
    name: "AttributesSubMenu",
  };
</script>



<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import VueMultiselect from "vue-multiselect";

const store = useStore();

//data

let attributeText = ref("");
let attributeSelection = ref("id");
let deleteText = ref("");

//computed

const selectedProps = computed(() => store.state.selectedProps);
const userProps = computed(() => store.state.userProps);
const activeComponentObj = computed(() => store.state.activeComponentObj);
let activeComponent = computed(() => store.state.activeComponent);
const routes = computed(() => store.state.routes);
const activeRoute = computed(() => store.state.activeRoute);
const activeRouteKey = computed(() => store.state.routes[store.state.activeRoute])
//actions

const editAttribute = (payload) => store.dispatch("editAttribute", payload);

// const activeComponentData = () => store.dispatch("activeComponentData");
const activeComponentData = () => {
      return cloneDeep(activeComponentObj.value);
    }


//methods

 // Prevent Delete on changes to searchable multiselect
const stopDelete = (e) => {if (e.code === "Backspace") e.stopPropogation()}

//function to change the state of the attribute selection dropdown menu
const changeAttribute = (attribute) => {
  attributeSelection.value = attribute
};

//attribute change function to create attribute
const createAttribute = (attributeText) => {

// console.log("What is my attributeSelection?", typeof attributeSelection, attributeSelection)
// console.log("What is my attributeText?", typeof attributeText, attributeText)
// console.log("What is my activeComponent.value?", typeof activeComponent.value, activeComponent.value)
// console.log("What is my activeRouteKey.value?", typeof activeRouteKey.value, activeRouteKey.value)
// console.log("What is my activeComponent?", typeof activeComponentData, activeComponentData)

      editAttribute({
        attribute: attributeSelection.value,
        value: attributeText,
        activeComponent: activeComponent.value,
        routeArray: activeRouteKey.value,
        activeComponentData: activeComponentData,
      })
      attributeText = "";
    };


//delete attribute after the delete bvutton has been clicked
const deleteAttribute = (attribute) => {
      editAttribute({
        attribute: attribute,
        value: "",
        activeComponent: activeComponent.value,
        routeArray: activeRouteKey.value,
        activeComponentData: activeComponentData,
      })
    };



</script>


<!-- 
<script>
  //old Options API code
import { mapState, mapActions } from "vuex";
import VueMultiselect from "vue-multiselect";

export default {
  name: "AttributesSubMenu",
  components: {
    VueMultiselect,
  },
  data() {
    return {
      attributeText: "",
      attributeSelection: "id",
      deleteText: "",
    };
  },
  computed: {
    ...mapState([
      "selectedProps",
      "userProps",
      "activeComponentObj",
      "activeComponent",
      "routes",
    ]),
  },

  methods: {
    ...mapActions([
      "editAttribute",
      "activeRoute",
      "activeComponentData"
    ]),
    // Prevent Delete on changes to searchable multiselect
    stopDelete(e) {
      if (e.code === "Backspace") e.stopPropogation();
    },
//attribute change function to create attribute
    createAttribute(attributeText) {
      // console.log("what is attributeSelection?", typeof this.attributeSelection, this.attributeSelection)
      // console.log("what is attributeText?", typeof attributeText, attributeText)
      // console.log("what is activeComponent?", typeof this.activeComponent, this.activeComponent)
      // console.log("what is this.routes[this.activeRoute]?", typeof this.routes[this.activeRoute], this.routes[this.activeRoute])
      // console.log("what is this.activeComponentData?", typeof this.activeComponentData, this.activeComponentData)
      this.editAttribute({
        attribute: this.attributeSelection,
        value: attributeText,
        activeComponent: this.activeComponent,
        routeArray: this.routes[this.activeRoute],
        activeComponentData: this.activeComponentData,
      })
      this.attributeText = "";
    },
//function to change the state of the attribute selection dropdown menu
    changeAttribute(attribute) {
      this.attributeSelection = attribute;
    },

//delete attribute after the delete bvutton has been clicked
    deleteAttribute(attribute) {
      this.editAttribute({
        attribute: attribute,
        value: "",
        activeComponent: this.activeComponent,
        routeArray: this.routes[this.activeRoute],
        activeComponentData: this.activeComponentData,
      })
    }
  },
};
</script> -->

<style lang="scss" scoped>
.attributeDropDown {
  margin-top: 15px;
  padding-right: 10px;
  font-size: 1em;
}

.input-add {
  margin-top: 1em;
  margin-bottom: -1em;
}

.deleteButton {
  width: 100px;
  height: 30px;
  background-color: rgba(204, 190, 190, 0.164);
  color: $menutext;
  margin-right: 2em;
}

.deleteButton:hover {
  cursor: pointer;
}
</style>