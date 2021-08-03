<template>
  <div class="container">
    <q-card id="store-cards">
      <q-tabs
        v-model="tab"
        dense
        class="bg-subaccent text-white"
        active-color="secondary"
        indicator-color="secondary"
        align="left"
      >
        <q-tab name="state" label="Store State" id="label-text" />
        <q-tab name="actions" label="Store Actions" id="label-text" />
      </q-tabs>
      <q-tab-panels v-model="tab" animated class="html-bg text-white">
        <q-tab-panel name="state">
          <ul id="stateList">
            <li v-for="state in stateOptions" v-bind:key="state">
              {{ state }}
            </li>
          </ul>
        </q-tab-panel>
        <q-tab-panel name="actions">
          <ul id="actionList">
            <li v-for="action in actionOptions" :key="action">
              {{ action }}
            </li>
          </ul>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "VuexStore",
  computed: {
    ...mapState(["userActions", "userState"]),
    actionOptions() {
      return this.userActions;
    },
    stateOptions() {
      return this.userState;
    },
  },
  data() {
    return {
      tab: "state",
    };
  },
};
</script>

<style lang="stylus" scoped>
i
  font-size 11px

.q-btn
  font-size 8px
  margin 5px

// styling for the entire footer
.q-footer
  transition-timing-function ease-in
  transition .2s
  background $subsecondary

// changes the footer toolbar height
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
