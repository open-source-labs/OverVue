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
  </div>
</template>

<script>
import { openURL } from "quasar";
export default {
  name: "UserAuth",
  data() {
    return {
      user: "",
      signedIn: "false"
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
      this.$router.push({ name: "auth" });
    }
  }
};
</script>