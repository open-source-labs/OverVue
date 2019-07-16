<template>
  <q-layout view="hHh LpR lFf">
    <q-header elevated class="gradient text-white">
      <q-toolbar>
        <q-btn dense flat color="subaccent" round @click="left = !left" >
          <i :class="[left ? 'fas fa-chevron-left' : 'fas fa-list-ul']" id="btn" ></i>
        </q-btn>
        <q-toolbar-title>
          <!-- <q-avatar></q-avatar> -->
          PreVue 2.0
        </q-toolbar-title>
        <OpenProjectComponent />
        <SaveProjectComponent />
        <ExportProjectComponent />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="left" side="left" behavior="desktop" bordered>
      <!-- drawer content -->
      <q-list class="q-list-drawer">
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
import ExportProjectComponent from '../components/ExportProject'
import SaveProjectComponent from '../components/SaveProjectComponent'
import OpenProjectComponent from '../components/OpenProjectComponent'
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
    CreateComponent,
    ExportProjectComponent,
    SaveProjectComponent,
    OpenProjectComponent
    // UploadImage
  }
}
</script>

<style lang="stylus">
.q-layout {
  transition-timing-function: ease-in;
}
.export-btn {
  margin-left: 0.3rem;
}
.q-toolbar {
  min-height:  30px;
}
.deano-size {
  min-height: 2in
  height: 3in
}
// css styling for the drawer items
.drawer-menu {
  background: white;
  // background: #27282268;
}
// css styling for the drawer list (not entire bg)
.q-list-drawer {
  // background: gray;
  height: 100vh;
  border-radius: 5px;
  box-shadow: none;
}
// styling between input and elements in q-list drawer
.q-field--with-bottom {
  // pading-bottom:
}
// css styling for entire drawer
.q-drawer {
  // background: white;
  background: #272822;
}
::-webkit-scrollbar {
  display: none;
}
</style>
