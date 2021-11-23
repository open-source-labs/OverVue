<!--
Description:
  Displays OverVue's dashboard containing Component Details, Vuex Store, and the Project Tree
  Functionality includes: opening/closing drawer, and contains the different Tabs
  As of now, no default tab selected when not selecting anything, but might change to Project Tree in the future if we want
  -->

<template>
  <q-card id="dashboard-cards" class="bord">
    <q-tabs
      v-model="tab"
      dense
      class="bg-subaccent text-white "
      active-color="secondary"
      indicator-color="secondary"
      align="left"
    >
      <q-tab name="detail" id="label-text" style="border-right: 3px solid black"
        ><i class="fas fa-code"></i
      ></q-tab>
      <q-tab name="tree" id="label-text"
        ><i class="fas fa-code-branch fa-flip-vertical"
      /></q-tab>
      <q-tab name="routes" id="label-text"
        ><i class="fas fa-project-diagram"></i
      ></q-tab>
    </q-tabs>
    <q-tab-panels v-model="tab" animated class="html-bg text-white">
      <q-tab-panel name="detail">
        <ComponentDetails />
      </q-tab-panel>
      <q-tab-panel name="tree">
        <Tree />
      </q-tab-panel>
      <!-- added Routes to the right side -->
      <q-tab-panel name="routes">
        <RouteDisplay />
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Tree from "./Tree.vue";
import ComponentDetails from "./ComponentDetails.vue";
import RouteDisplay from "../home_sidebar_items/RouteDisplay.vue";

export default {
  components: {
    Tree,
    ComponentDetails,
    RouteDisplay
  },
  computed: {
    ...mapState([
      "activeComponent",
      "componentNameInputValue",
      "selectedElementList",
      "activeHTML"
    ])
  },
  data() {
    return {
      tab: "code",
      open: true,
      height: 40,
      up: "fas fa-chevron-up",
      down: "fas fa-chevron-down"
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
      // console.log('target html element: ', event.target)
      if (event.target.className !== "list-group-item") {
        // if html element classname is not equal to this string that all html elements have
        if (!(this.activeHTML === "")) this.setActiveHTML([""]); // if activeHtml is not already deselected, do so
      }
    }
  },
  watch: {
    // toggles dashboard to "Component Details" tab when a components is selected
    // activeComponent: function () {
    //   if (this.activeComponent !== '') {
    //     this.tab = 'detail'
    //   } else {
    //     // otherwise toggle dashboard to 'Project Tree' tab if no component is selected
    //     this.tab = 'tree'
    //   }
    // },
    // otherwise toggle dashboard to 'Project Tree' tab if no component is selected or the
    // user is in the process of creating a component
    componentNameInputValue: function() {
      if (this.componentNameInputValue !== "" && this.activeComponent === "") {
        this.tab = "tree";
      }
    },
    // // toggles dashboard to "Project Tree" tab if:
    // // no component is selected and either:
    // // elements are being added to component or name is being typed
    selectedElementList: function() {
      if (
        this.activeComponent === "" &&
        this.selectedElementList.length !== 0
      ) {
        this.tab = "tree";
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
i {
  font-size: 11px;
}

.home-sidebar {
  margin: 1rem;
  justify-content: center;
  border-radius: 5px;
  padding: 0px;
  background: $subsecondary;
}

.q-btn {
  font-size: 8px;
  margin: 5px;
}

// styling for the entire dashboard
// .q-footer {
//   transition-timing-function: ease-in;
//   transition: 0.2s;
//   background: $subsecondary;
// }

// // changes the dashboard toolbar height
// .q-toolbar {
//   min-height: 25px !important;
//   padding: 0 6px !important;
// }

.q-toolbar__title {
  font-size: 14px;
  text-transform: uppercase;
  padding: 5px;
}

// this class selector does not change anything
.q-tab__label {
  // font-size not changing
  font-size: 10px !important;
  line-height: 1.718em;
  font-weight: 500;
}

// changes the tab label styling
#label-text {
  font-size: 4px !important;
  text-transform: capitalize;
}

.q-tab-panel {
  // matchs the code editor bg
  background: $subprimary;

}

// changes the length of the tab panels
.q-tab-panels {
padding: 0px !important;
border-top: 3px solid black;
}

.q-tabs {
  background: #11120F
}

.toolbar-background {
  background: black;
}

#dashboard-cards {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 0px;
  background: #737578;
}
.html-bg {
  // give html background color of grey
  background-color: #202122;
}

.inner-div {
  height: 100%;
}

.bord {
  border-left: 3px solid black;
  border-right: 3px solid black;
}
</style>
