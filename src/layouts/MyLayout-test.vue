<template>
  <q-layout view="hHh LpR lFf">
    <q-header elevated class="gradient text-white">
      <q-toolbar>
        <q-btn dense flat color="subaccent" round @click="left = !left">
          <i :class="[left ? 'fas fa-chevron-left' : 'fas fa-list-ul']" id="btn"></i>
        </q-btn>
        <q-toolbar-title>
          <!-- <q-avatar></q-avatar> -->
          PreVue 2.0
        </q-toolbar-title>
        <!-- <OpenProjectComponent />
        <SaveProjectComponent />
        <ExportProjectComponent />-->
      </q-toolbar>
    </q-header>

    <q-drawer v-model="left" side="left" behavior="desktop" bordered>
      <!-- drawer content -->
      <q-list class="q-list-drawer">
        <div v-if="isLoggedIn">
          <q-item clickable :to="{name: 'profile'}">
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Profile</q-item-label>
              <q-item-label caption>view your profile</q-item-label>
            </q-item-section>
          </q-item>
        </div>

        <div v-if="isLoggedIn">
          <q-item clickable @click="signOut">
            <q-item-section avatar>
              <q-icon name="stop" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Logout</q-item-label>
            </q-item-section>
          </q-item>
        </div>

        <div v-if="!isLoggedIn">
          <q-item clickable :to="{name: 'auth'}">
            <q-item-section avatar>
              <q-icon name="group" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Login/SignUp</q-item-label>
              <q-item-label caption>Login or Signup</q-item-label>
            </q-item-section>
          </q-item>
        </div>
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
import HomeSideDropDown from "../components/HomeSideDropDown";
import Footer from "../components/Footer";
import CreateComponent from "../components/CreateComponent";
// electron build features
// import ExportProjectComponent from "../components/ExportProject";
// import SaveProjectComponent from "../components/SaveProjectComponent";
// import OpenProjectComponent from "../components/OpenProjectComponent";
// import UploadImage from '../components/UploadImage'
import { openURL } from "quasar";

export default {
  data() {
    return {
      left: true,
      bottom: true,
      user: "",
      signedIn: "false"
    };
  },
  components: {
    HomeSideDropDown,
    Footer,
    CreateComponent
    // ExportProjectComponent,
    // SaveProjectComponent,
    // OpenProjectComponent
    // UploadImage
  },
  computed: {
    isLoggedIn() {
      return this.signedIn;
    }
  },
  mounted() {
    this.$AmplifyEventBus.$on("authState", info => {
      this.signedIn = true;
    });
  },
  beforeCreate() {
    this.$Auth
      .currentAuthenticatedUser()
      .then(user => {
        this.user = user;
        this.signedIn = true;
      })
      .catch(() => {
        this.signedIn = false;
      });
  },
  methods: {
    openURL,
    async signOut() {
      await this.$Auth
        .signOut()
        .then(data => console.log(data))
        .catch(err => console.log(err));
      this.signedIn = false;
      parent.signedIn = false;
      this.$router.push({ name: "auth" });
    }
  }
};
</script>

<style lang="stylus">
.q-layout {
  transition-timing-function: ease-in;
}

.export-btn {
  margin-left: 0.3rem;
}

.q-toolbar {
  min-height: 30px;
}

// css styling for the drawer items
.drawer-menu {
  // background: white;
  background: $subsecondary;
  // background: #27282268;
}

// css styling for the drawer list (not entire bg)
.q-list-drawer {
  height: 100vh;
  // border-radius: 5px;
  box-shadow: none;
}

// styling between input and elements in q-list drawer
.q-field--with-bottom {
  // pading-bottom:
}

// css styling for entire drawer
.q-drawer {
  // background: white;
  background: $subprimary;
  // background: #272822;
}

::-webkit-scrollbar {
  display: none;
}
</style>
