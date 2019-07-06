<template>
  <q-layout view="hHh LpR lFf">
    <q-header elevated class="gradient text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title>
          <q-avatar></q-avatar>PreVue 2.0
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="left" side="left" behavior="desktop" bordered>
      <!-- drawer content -->
      <q-list>
        <!-- <UploadImage /> -->
        <HomeSideDropDown />
        <CreateComponent />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
      <Footer />
  </q-layout>
</template>

<script>
import HomeSideDropDown from '../components/HomeSideDropDown'
import Footer from '../components/Footer'
import CreateComponent from '../components/CreateComponent'
// import UploadImage from '../components/UploadImage'

export default {
  data () {
    return {
      left: true,
      bottom: true
    }
  },
  components: {
    HomeSideDropDown,
    Footer,
    CreateComponent
    // UploadImage
  }
}
</script>

<style lang="stylus">
.drawer-menu {
  background: white;
}
.q-list {
  // background: gray;
}
.q-drawer {
  background: white;
  // background: #313131;
}
</style>
