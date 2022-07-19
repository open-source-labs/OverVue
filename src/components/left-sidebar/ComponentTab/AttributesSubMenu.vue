<template>
  <div>

<q-btn-dropdown class="attributeDropDown" color="primary" :label="attributeSelection">
      <q-list>
        <q-item clickable v-close-popup @click="changeAttribute('id')">
          <q-item-section>
            <q-item-label>ID</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="changeAttribute('class')">
          <q-item-section>
            <q-item-label>Class</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>


    <q-input
      @keyup.enter="createAttribute(attributeText)"
      color="white"
      dark
      outlined
      bottom-slots
      v-model="attributeText"
      label="Enter Label"
      dense
      class="input-add"
      v-on:keyup.delete.stop
    >
      <template v-slot:append>
        <q-btn flat icon="add" @click="createAttribute(attributeText)" />
      </template>
    </q-input>


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
      attributeSelection: "ID",
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
    },
    changeAttribute(attribute) {
      this.attributeSelection = attribute;
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
    position:absolute;
    margin-left: 7em;
    bottom:-60%;
    // padding:20px;
  }
</style>