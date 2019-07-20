<template>
  <div>
    <h1>Welcome, {{user.username}}</h1>
  </div>
</template>
<script>
export default {
  name: "Profile",
  components: {},
  data() {
    return {
      user: "",
      signedIn: false
    };
  },
  beforeCreate() {
    this.$Auth
      .currentAuthenticatedUser()
      .then(user => {
        this.user = user;
        this.signedIn = true;
      })
      .catch(() => console.log("not signed in..."));
  }
};
</script>
<style>
</style>