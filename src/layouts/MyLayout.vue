<template>
  <q-layout view="hHh LpR lFf">

    <q-header elevated class="bg-primary text-black">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title>
          <q-avatar>
          </q-avatar>
          PreVue 2.0
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="left" side="left" behavior="desktop" bordered>
      <!-- drawer content -->
      <q-list>
        <HomeSideDropDown />
        <CreateComponent />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          Dashboard
        </q-toolbar-title>
          <FooterTabView />
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script>
import HomeSideDropDown from '../components/HomeSideDropDown'
import FooterTabView from '../components/FooterTabView'
import CreateComponent from '../components/CreateComponent'

export default {
  data () {
    return {
      left: true
    }
  },
  components: {
    HomeSideDropDown,
    FooterTabView,
    CreateComponent
  }
}
</script>
