<template>
  <div>
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
      <q-item clickable @click="icon = true">
        <q-item-section avatar>
          <q-icon name="group" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Login/SignUp</q-item-label>
          <q-item-label caption>Login or Signup</q-item-label>
        </q-item-section>
      </q-item>
    </div>

    <q-dialog v-model="icon">
      <q-card class="login-modal">
        <q-card-section class="row items-center">
          <div class="text-h6">PreVue 2.0</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <Auth />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { openURL } from "quasar";
import Auth from "./AuthComponents/Auth";

export default {
  name: "UserAuth",
  components: {
    Auth
  },
  data() {
    return {
      user: "",
      signedIn: "false",
      icon: false
    };
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
      // this.$router.push({ name: "auth" });
    }
  }
};
</script>

<style lang="stylus" scoped>
.login-modal {
  padding: 1rem;
}
</style>
