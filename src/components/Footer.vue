<template>
  <q-footer reveal elevated class="gradient text-white" :style="{ height: `${height}vh` }">
    <q-toolbar>
      <q-btn flat color="subaccentbtn" round @click="openBottomDrawer">
        <i :class="[open ? down : up]"></i>
      </q-btn>
      <q-toolbar-title>Dashboard</q-toolbar-title>
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
        <q-tab name="code" label="Code" />
        <q-tab name="tree" label="Tree" />
        <q-tab name="html" label="HTML Elements" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated class="bg-primary text-white">
        <q-tab-panel name="code">
        </q-tab-panel>

        <q-tab-panel name="tree">
          <Tree />
        </q-tab-panel>

        <q-tab-panel name="html">
          <div class="text-h6">HTML Elements</div>HTML Element Component Here
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-footer>
</template>

<script>
import Tree from './Tree'
// import CodeSnippet from './CodeSnippet'

export default {
  components: {
    Tree
    // CodeSnippet
  },
  data () {
    return {
      tab: 'code',
      open: true,
      height: 35,
      up: 'fas fa-chevron-up',
      down: 'fas fa-chevron-down'
    }
  },
  methods: {
    openBottomDrawer () {
      this.height === 35 ? (this.height = 6.5) : (this.height = 35)
      this.open === true ? this.open = false : this.open = true
    }
  }
}
</script>

<style lang="stylus">
.q-footer {
  // height: 35vh;
  transition-timing-function: ease-in;
  transition: 0.2s;
}

.q-tab-panel {
  background: rgb(69,77,102);
  background: linear-gradient(180deg, rgba(69,77,102,1) 0%, rgba(54,60,78,1) 100%);
}

.q-tab-panels {
  height: 24vh;
}

.q-tabs {
  background: #2c384d;
}
</style>
