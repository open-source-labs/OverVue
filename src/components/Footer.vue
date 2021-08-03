<!--
Description:
  Displays OverVue's footer containing Code Snippet, component details (TBD), Project Tree, and HTML Elements tabs
  Functionality includes: opening/closing drawer, deselecting active html, and
  toggling to html elements tab during component creation
  -->

  <template>
  <q-footer reveal class="gradient text-white" :style="{ height: `${height}vh` }" v-on:click="handleHtmlDeselection">
    <q-toolbar class="toolbar-background">
      <q-btn flat color="subaccent" round @click="openBottomDrawer">
        <i :class="[open ? down : up]" id="btn"></i>
      </q-btn>
      <q-toolbar-title>Dashboard</q-toolbar-title>
    </q-toolbar>
    <q-card id="footer-cards">
      <q-tabs
        v-model="tab"
        dense
        class="bg-subaccent text-white"
        active-color="secondary"
        indicator-color="secondary"
        align="left"
      >

        <q-tab name="code" label="Code Snippet" id="label-text" />
        <q-tab name="detail" label="Component Details" id="label-text" />
        <q-tab name="tree" label="Project Tree" id="label-text" />
        <q-tab name="html" label="HTML Elements" id="label-text" />
        <q-tab name="store" label="Vuex Store" id="label-text" />

      </q-tabs>

      <q-tab-panels v-model="tab" animated class="html-bg text-white" >
        <q-tab-panel name="code">
          <CodeSnippet />
        </q-tab-panel>
      <!-- Work in Progress -->
        <q-tab-panel name="detail">
          <ComponentDetails/>
        </q-tab-panel>
      <!----------------------->
        <q-tab-panel name="tree">
          <Tree />
        </q-tab-panel>

        <q-tab-panel name="html" :style="{height: `${height}vh`}">
          <HomeQueue />
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
import HomeQueue from './HomeQueue'
import CodeSnippet from './CodeSnippet'
import VuexStore from './DashboardVuexStore.vue'
import ComponentDetails from './ComponentDetails'

export default {
  components: {
    Tree,
    HomeQueue,
    CodeSnippet,
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
    // toggles open/close action of footer drawer
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
  // toggles footer to "html" tab when existing component is not in focus
  watch: {
    activeComponent: function () {
      // console.log('watching activeComponent in Footer');
      if (this.activeComponent === '' && this.selectedElementList.length !== 0) {
        this.tab = 'html'
      }
    },
    // toggles footer to "html" tab if component name has value & elements are in queue
    componentNameInputValue: function () {
      // console.log('watching componentNameInputVal')
      if (this.componentNameInputValue !== '' && this.selectedElementList.length !== 0 && this.activeComponent === '') {
        // console.log(this.selectedElementList)
        this.tab = 'html'
      }
    },
    // toggles footer to "html" tab if elements are added to queue on component creation
    selectedElementList: function () {
      // console.log('watching selectedElementList')
      if (this.activeComponent === '' && this.selectedElementList.length !== 0) {
        this.tab = 'html'
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

// styling for the entire footer
.q-footer {
  transition-timing-function: ease-in;
  transition: 0.2s;
  background: $subsecondary;
}

// changes the footer toolbar height
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

#footer-cards {
  height: 100%;
  border-radius: 0px;
  background: #737578;
}
.html-bg {
  // give html background color of grey
  background-color: #202122;
}
</style>
