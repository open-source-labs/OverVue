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

    <q-input @keyup.enter="createAttribute(attributeText)" color="white" dark outlined bottom-slots
      v-model="attributeText" label="Enter Label" dense class="input-add" v-on:keyup.delete.stop>
      <template v-slot:append>
        <q-btn flat icon="add" @click="createAttribute(attributeText)" />
      </template>
    </q-input>

    <button v-if="this.activeComponentObj.htmlAttributes.class !== ''" class="deleteButton"
      @click="deleteAttribute('class')" color="primary">Remove class</button>

    <button v-if="this.activeComponentObj.htmlAttributes.id !== ''" class="deleteButton" @click="deleteAttribute('id')"
      color="primary">Remove id</button>

    <!-- <div>
      <q-btn
        v-if="selectProps.length"
        id="add-props-btn"
        class="add-btn"
        color="secondary"
        label="Add Prop(s)"
        @click="addPropsToComp"
      />
    </div> -->
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

    changeAttribute(attribute) {
      this.attributeSelection = attribute;
    },

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
  // position:absolute;
  // margin-left: 7em;
  // bottom:-100%;
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