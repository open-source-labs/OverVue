<!--
Description:
  Displays OverVue's dashboard containing Component Details, Vuex Store, and the Project Tree
  Functionality includes: opening/closing drawer, and contains the different Tabs
  As of now, no default tab selected when not selecting anything, but might change to Project Tree in the future if we want
  -->

<template>
<span v-if="showTutorial === false">
  <q-card id="dashboard-cards" >
    <q-tabs
      v-model="tab"
      class="bg-subaccent text-white"
      active-color="secondary"
      indicator-color="secondary"
      align="left"
      dense
      breakpoint="1050"
    >
      <q-tab name="routes" label="Routes" id="label-text"></q-tab>
      <q-tab name="tree" label="Project Tree" id="label-text"></q-tab>
      <q-tab name="detail" label="Component Details" id="label-text"></q-tab>
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="routes">
        <RouteDisplay />
      </q-tab-panel>
      <q-tab-panel name="tree">
        <Tree />
      </q-tab-panel>
      <q-tab-panel name="detail">
        <ComponentDetails />
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</span>
<span v-else>
  <GetStarted />
</span>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Tree from "./Tree.vue";
import ComponentDetails from "./ComponentDetails.vue";
import RouteDisplay from "./RouteDisplay.vue";
import GetStarted from "./GetStarted.vue";

export default {
  components: {
    Tree,
    ComponentDetails,
    RouteDisplay,
    GetStarted,
  },
  computed: {
    ...mapState([
      "activeComponent",
      "componentNameInputValue",
      "selectedElementList",
      "activeHTML",
      "showTutorial",
    ]),
  },
  data() {
    return {
      tab: "code",
      open: true,
      height: 40,
      up: "fas fa-chevron-up",
      down: "fas fa-chevron-down",
    };
  },
  methods: {
    ...mapActions(["setActiveHTML"]),
    // toggles open/close action of dashboard drawer
    openBottomDrawer() {
      // 15in mb pro - 1027 px 3.75
      // big screens 2.5
      let minHeight =
        window.outerHeight < 900 ? 4.5 : window.outerHeight < 1035 ? 3.75 : 2.5;
      this.height === 40 ? (this.height = minHeight) : (this.height = 40);
      this.open === true ? (this.open = false) : (this.open = true);
    },
    // function that will handle deselection from active HTML element
    handleHtmlDeselection(event) {
      if (event.target.className !== "list-group-item") {
        // if html element classname is not equal to this string that all html elements have
        if (!(this.activeHTML === "")) this.setActiveHTML([""]); // if activeHtml is not already deselected, do so
      }
    },
  },
  watch: {
    // otherwise toggle dashboard to 'Project Tree' tab if no component is selected or the
    // user is in the process of creating a component

    componentNameInputValue: function () {
      if (this.componentNameInputValue !== "" && this.activeComponent === "") {
        this.tab = "tree";
      }
    },

    // toggles dashboard to "Project Tree" tab if:
    // no component is selected and either:
    // elements are being added to component or name is being typed
    selectedElementList: function () {
      if (
        this.activeComponent === "" &&
        this.selectedElementList.length !== 0
      ) {
        this.tab = "tree";
      }
    },
  },
};
</script>

<style lang="scss" scoped>

.home-sidebar {
  padding: 1rem;
  justify-content: center;
  border-radius: 5px;
  background: $subsecondary;
}

.q-btn {
  font-size: 8px;
  margin: 5px;
}

.q-toolbar__title {
  font-size: 14px;
  text-transform: uppercase;
  padding: 5px;
}

/* // changes the tab label styling */
#label-text {
  font-size: 4px !important;
  text-transform: uppercase;
}

.q-tab-panel {
  /* // matches the code editor bg */
  background: $subprimary;
  padding: 16px;
}

// changes the length of the tab panels
.q-tab-panels {
  padding: 0px !important;
  background: $subprimary;
}

.q-tabs {
  background: $subprimary;
}

.toolbar-background {
  background: $subprimary;
}

#dashboard-cards {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 0px;
  background: $subprimary;
}

.inner-div {
  height: 100%;
}

</style>
