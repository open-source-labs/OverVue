<!--
Description:
  Displays multiselect dropdown for already existing components in CreateComponent
  Functionality includes: selects parent for created component
  -->

<template>
  <div id="parent-select">
    <VueMultiselect
      v-model="value"
      placeholder="Set parent component"
      :multiple="false"
      :close-on-select="true"
      :options="options"
      @select="selectParent"
      @open="resetActiveComponent"
      :max-height="150"
      :option-height="20"
      :searchable="true"
    >
     <template v-slot:noResult>No components found.</template>
    </VueMultiselect>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import VueMultiselect from "vue-multiselect";

export default {
  name: "ParentMultiselect",
  components: {
    VueMultiselect,
  },
  data() {
    return { value: "" };
  },
  computed: {
    ...mapState([
      "routes",
      "componentMap",
      "activeComponent",
      "activeRoute",
      // 'routes'
    ]),
    options() {
      return this.routes[this.activeRoute].map(
        (component) => component.componentName
      );
    },
  },
  methods: {
    ...mapActions(["parentSelected", "setActiveComponent"]),
    selectParent(value) {
      this.parentSelected(value);
    },
    // when multiselect is opened activeComponent is deselected to allow for parentSelected action
    resetActiveComponent() {
      if (this.activeComponent !== "") {
        this.setActiveComponent("");
      }
    },
  },
  // clears out selected in mutiselect on creation of component
  watch: {
    componentMap: {
      handler() {
        this.value = "";
      },
    },
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style scoped lang="scss">
  :global(.multiselect__tags) {
    background-color: $subprimary;
    border: 1px solid rgb(180, 180, 180);
  }
  :global(.multiselect__input) {
    background-color: $subprimary;
    color: $menutext;
  }
  :global(.multiselect__content) {
    background-color: $subprimary;
    color: $menutext;
  }
  :global(.multiselect__option) {
    color: $menutext;
  }
  :global(.multiselect__option--selected) {
    background-color: $accent;
    color: #155158;

  }
  :global(.multiselect__single) {
    background-color: $subprimary;
    color: $menutext;
  }
  :global(.multiselect__single:focus) {
    background-color: $subprimary;
    color: $menutext;
  }
  :global(.multiselect__input::placeholder) {
  color: $menutext;
}
</style>
