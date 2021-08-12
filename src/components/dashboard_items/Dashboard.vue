<!--
Description:
  Displays OverVue's dashboard containing Component Details, Vuex Store, and the Project Tree
  Functionality includes: opening/closing drawer, and contains the different Tabs
  As of now, no default tab selected when not selecting anything, but might change to Project Tree in the future if we want
  -->

  <template>
  <q-footer reveal class="gradient text-white" :style="{ height: `${height}vh` }" v-on:click="handleHtmlDeselection">
    <q-toolbar class="toolbar-background">
      <q-btn flat color="subaccent" round @click="openBottomDrawer">
        <i :class="[open ? down : up]" id="btn"></i>
      </q-btn>
      <q-toolbar-title>Dashboard</q-toolbar-title>
    </q-toolbar>
    <q-card id="dashboard-cards">
      <q-tabs
        v-model="tab"
        dense
        class="bg-subaccent text-white"
        active-color="secondary"
        indicator-color="secondary"
        align="left"
      >
        <q-tab name="detail" label="Component Details" id="label-text" />
        <q-tab name="tree" label="Project Tree" id="label-text" />
        <q-tab name="store" label="Vuex Store" id="label-text" />
      </q-tabs>
      <q-tab-panels v-model="tab" animated class="html-bg text-white" >
        <q-tab-panel name="detail">
          <ComponentDetails/>
        </q-tab-panel>
        <q-tab-panel name="tree">
          <Tree />
        </q-tab-panel>
        <q-tab-panel name="store">
          <VuexStore/>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-footer>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Tree from './Tree'
import VuexStore from './DashboardVuexStore.vue'
import ComponentDetails from './ComponentDetails'

export default {
  components: {
    Tree,
    VuexStore,
    ComponentDetails
  },
  computed: {
    ...mapState(['activeComponent', 'componentNameInputValue', 'selectedElementList', 'activeHTML'])
  },
  data () {
    return {
      tab: 'code',
      open: true,
      height: 40,
      up: 'fas fa-chevron-up',
      down: 'fas fa-chevron-down'
    }
  },
  methods: {
    ...mapActions(['setActiveHTML']),
    // toggles open/close action of dashboard drawer
    openBottomDrawer () {
      // 15in mb pro - 1027 px 3.75
      // big screens 2.5
      let minHeight =
        window.outerHeight < 900 ? 4.5 : window.outerHeight < 1035 ? 3.75 : 2.5
      this.height === 40 ? (this.height = minHeight) : (this.height = 40)
      this.open === true ? (this.open = false) : (this.open = true)
    },
    // function that will handle deselection from active HTML element
    handleHtmlDeselection (event) {
      // console.log('target html element: ', event.target)
      if (event.target.className !== 'list-group-item') {
        // if html element classname is not equal to this string that all html elements have
        if (!(this.activeHTML === '')) this.setActiveHTML(['']) // if activeHtml is not already deselected, do so
      }
    }
  },
  watch: {
    // toggles dashboard to "Component Details" tab when a components is selected
    activeComponent: function () {
      if (this.activeComponent !== '') {
        this.tab = 'detail'
      } else {
        // otherwise toggle dashboard to 'Project Tree' tab if no component is selected
        this.tab = 'tree'
      }
    },
    // otherwise toggle dashboard to 'Project Tree' tab if no component is selected or the
    // user is in the process of creating a component
    componentNameInputValue: function () {
      if (this.componentNameInputValue !== '' && this.activeComponent === '') {
        console.log(this.selectedElementList.length)
        this.tab = 'tree'
      }
    },
    // // toggles dashboard to "Project Tree" tab if:
    // // no component is selected and either:
    // // elements are being added to component or name is being typed
    selectedElementList: function () {
      if (this.activeComponent === '' && this.selectedElementList.length !== 0) {
        this.tab = 'tree'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
i {
  font-size: 11px;
}

.q-btn {
  font-size: 8px;
  margin: 5px;
}

// styling for the entire dashboard
.q-footer {
  transition-timing-function: ease-in;
  transition: 0.2s;
  background: $subsecondary;
}

// changes the dashboard toolbar height
.q-toolbar {
  min-height: 25px !important;
  padding: 0 6px !important;
}

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
  height: 90%;
  padding: 0px !important;
}

.q-tabs {
  background: #11120F;
}

.toolbar-background {
  background: black;
}

#dashboard-cards {
  height: 100%;
  border-radius: 0px;
  background: #737578;
}
.html-bg {
  // give html background color of grey
  background-color: #202122;
}
</style>
