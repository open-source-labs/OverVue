<template>
  <q-card id="dashboard-cards" class="board" >
    <q-tabs
      v-model="tutorialPage"
      class="bg-subaccent text-white"
      active-color="secondary"
      indicator-color="secondary"
      align="left"
      dense
      breakpoint="950"
    >
      <q-tab
        name="landing"
        label="Welcome to Overvue"
        id="label-text"
        style="border-right: 3px solid black"
        >
      </q-tab>
      <q-tab 
        name="basics" 
        label="Basic Functions" 
        id="label-text"
        style="border-right: 3px solid black"
        >
      </q-tab>
      <q-tab 
        name="advanced" 
        label="Advanced Functions" 
        id="label-text"
        style="border-right: 3px solid black"
        >
      </q-tab>
    </q-tabs>
    <q-tab-panels v-model="tutorialPage" animated class="html-bg text-white">
      <q-tab-panel name="landing">
        <Landing @nextTab="tutorialPage = 'basics'"/>
      </q-tab-panel>
      <q-tab-panel name="basics">
        <BasicFunctions @nextTab="tutorialPage = 'advanced'"/>
      </q-tab-panel>
      <q-tab-panel name="advanced">
        <AdvancedFunctions />
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script>
import BasicFunctions from './tutorial/BasicFunctions.vue'
import AdvancedFunctions from './tutorial/AdvancedFunctions.vue'
import Landing from './tutorial/Landing.vue'

export default {
  components: {
    BasicFunctions,
    AdvancedFunctions,
    Landing,
  },
  data(){
    return {
      tutorialPage: 'landing'
    }
  }
}

</script>

<style lang="scss" scoped>
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

.q-toolbar__title {
  font-size: 14px;
  text-transform: uppercase;
  padding: 5px;
}

/* this class selector does not change anything */
.q-tab__label {
  /* // font-size not changing */
  font-size: 10px !important;
  line-height: 1.718em;
  font-weight: 500;
}

/* // changes the tab label styling */
#label-text {
  font-size: 4px !important;
  text-transform: capitalize;
}

.q-tab-panel {
  /* // matchs the code editor bg */
  background: $subprimary;
}

.q-tab-panels {
  padding: 0px !important;
  border-top: 3px solid black;
}

.q-tabs {
  background: #11120f;
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
  /* // give html background color of grey */
  background-color: #202122;
}

.inner-div {
  height: 100%;
}

.board {
  border-left: 3px solid black;
  border-right: 3px solid black;
}
</style>