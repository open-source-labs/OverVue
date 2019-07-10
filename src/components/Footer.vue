<template>
  <q-footer reveal class="gradient text-white" :style="{ height: `${height}vh` }">
    <q-toolbar>
      <q-btn flat color="subaccent" round @click="openBottomDrawer">
        <i :class="[open ? down : up]" id="btn" ></i>
      </q-btn>
      <q-toolbar-title >Dashboard</q-toolbar-title>
    </q-toolbar>
    <q-card>
      <q-tabs
        v-model="tab"
        dense
        class="bg-subaccent text-white"
        active-color="secondary"
        indicator-color="secondary"
        align="left"
      >
        <q-tab name="code" label="Code Snippet" id="label-text"/>
        <q-tab name="detail" label="Component Details" id="label-text"/>
        <q-tab name="tree" label="Project Tree" id="label-text"/>
        <q-tab name="html" label="HTML Elements" id="label-text"/>
      </q-tabs>

      <q-tab-panels v-model="tab" animated class="bg-primary text-white full-footer">
        <q-tab-panel name="code">
          <CodeSnippet />
        </q-tab-panel>

        <q-tab-panel name="detail">
          <div class="text-h6">Vuex</div>
          Component Info Here
        </q-tab-panel>

        <q-tab-panel name="tree">
          <Tree />
        </q-tab-panel>

        <q-tab-panel name="html">
          <HomeQueue />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-footer>
</template>

<script>
import Tree from './Tree'
import HomeQueue from './HomeQueue'
import CodeSnippet from './CodeSnippet'

export default {
  components: {
    Tree,
    HomeQueue,
    CodeSnippet
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
    openBottomDrawer () {
      // 15in mb pro - 1027 px 3.75
      // big ass screens 2.5
      let minHeight = (window.outerHeight < 900) ? 4.5 : (window.outerHeight < 1035) ? 3.75 : 2.5
      this.height === 40 ? (this.height = minHeight) : (this.height = 40)
      this.open === true ? this.open = false : this.open = true
    }
  }
}
</script>

<style lang="stylus" scoped>
i {
  font-size: 11px;
}
.q-btn {
  // background: $secondary;
  font-size: 8px;
  margin: 5px;
}
// styling for the entire footer
.q-footer {
  // height: 35vh;
  transition-timing-function: ease-in;
  transition: 0.2s;
  // background: #313131;
  background: black;
}
// changes the footer toolbar height
.q-toolbar {
  min-height: 25px !important;
  padding: 0 6px !important;
}
.q-toolbar__title {
  font-size 14px;
  text-transform: uppercase;
  // font-weight: 700;
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
  background: #272822
  // background: rgb(69,77,102);
  // background: linear-gradient(180deg, rgba(69,77,102,1) 0%, rgba(54,60,78,1) 100%);
}
// changes the length of the tab panels
.q-tab-panels {
  height: 31vh;
  padding: 0px !important;
}
.q-tabs {
  background: #11120F;
}
.full-footer {
  height: 100vh;  
}
</style>
