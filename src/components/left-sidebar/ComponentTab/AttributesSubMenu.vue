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
</script>

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