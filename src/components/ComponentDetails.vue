<template>
  <div class="container">
    <q-card id="store-cards" v-if="this.activeComponentObj">
      <q-tabs
        v-model="tab"
        dense
        class="bg-subaccent text-white"
        active-color="secondary"
        indicator-color="secondary"
        align="left"
      >
        <q-tab name="state" label="Component State" id="label-text" />
        <q-tab name="actions" label="Component Actions" id="label-text" />
        <q-tab name="props" label="Component Props" id="label-text" />
      </q-tabs>
      <q-tab-panels v-model="tab" animated class="html-bg text-white">
        <q-tab-panel name="state" v-model="activeState">
          <ul id="stateList">
            <li v-for="comp in activeState" :key="comp">
              {{ comp }}
            </li>
          </ul>
        </q-tab-panel>
        <q-tab-panel name="actions" v-model="activeActions">
          <ul id="actionList">
            <li v-for="comp in activeActions" :key="comp">
              {{ comp }}
            </li>
          </ul>
        </q-tab-panel>
        <q-tab-panel name="props" v-model="activeProps">
          <ul id="propsList">
            <li v-for="comp in activeProps" :key="comp">
              {{ comp }}
            </li>
          </ul>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
    <q-card v-else>Select a component to show details</q-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ComponentDetails',
  computed: {
    ...mapState(['activeComponentObj']),
    activeState: {
      get () {
        if (this.activeComponentObj) return this.activeComponentObj.state
        return []
      }
    },
    activeProps: {
      get () {
        if (this.activeComponentObj) return this.activeComponentObj.props
        return []
      }
    },
    activeActions: {
      get () {
        if (this.activeComponentObj) return this.activeComponentObj.actions
        return []
      }
    }
    // componentActions: {
    //   get() {
    //     return this.$store.state.activeComponentObj.actions;
    //   },
    // },
    // componentState: {
    //   get() {
    //     return this.$store.state.activeComponentObj.state;
    //   },
    // },
    // componentProps: {
    //   get() {
    //     return this.$store.state.activeComponentObj.props;
    //   },
    // },
  },
  data () {
    return {
      tab: 'state'
    }
  }
}
</script>

<style lang="stylus" scoped>
i
  font-size 11px

.q-btn
  font-size 8px
  margin 5px

// styling for the entire dashboard
.q-footer
  transition-timing-function ease-in
  transition .2s
  background $subsecondary

// changes the dashboard toolbar height
.q-toolbar
  min-height 25px !important
  padding 0 6px !important

.q-toolbar__title
  font-size 14px
  text-transform uppercase
  padding 5px

// this class selector does not change anything
.q-tab__label
  // font-size not changing
  font-size 10px !important
  line-height 1.718em
  font-weight 500

// changes the tab label styling
#label-text
  font-size 4px !important
  text-transform capitalize

.q-tab-panel
  height 80%
  // matchs the code editor bg
  background $subprimary

// changes the length of the tab panels
.q-tab-panels
  height 80%
  padding 0 !important

.q-tabs
  background #11120F

.toolbar-background
  background black

#store-cards
  height 100%
  border-radius 0
  background #737578

.html-bg
  // give html background color of grey
  background-color #202122
</style>

let active = (state.routes[state.activeRoute].filter(comp => {
      return comp.componentName === state.activeComponent
    })[0])

    active.props
    active.state
    active.actions
