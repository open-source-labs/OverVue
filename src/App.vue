<template>
  <div id="q-app" v-if="hydrated">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      signedIn: false,
      hydrated: false
    };
  },
  async mounted() {
    await this.$apollo.provider.defaultClient.hydrated();
    this.hydrated = true;
  },
  beforeCreate() {
    this.$AmplifyEventBus.$on("authState", info => {
      if (info === "signedIn") {
        this.signedIn = true;
        this.$router.push("/");
      }
      if (info === "signedOut") {
        this.$router.push("/auth");
        this.signedIn = false;
      }
    });
    this.$Auth
      .currentAuthenticatedUser()
      .then(user => {
        this.signedIn = true;
      })
      // eslint-disable-next-line
      .catch(() => (this.signedIn = false));
  }
};
</script>

<style>
</style>
