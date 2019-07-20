<template>
  <div class="auth">
    <h2>Sign In</h2>
    <form @submit.prevent="signIn">
      <q-input
        class="color-primary"
        square
        filled
        color="teal"
        label="Email"
        v-model="form.username"
      />
      <q-input
        class="color-primary"
        square
        filled
        color="teal"
        label="Password"
        type="password"
        v-model="form.password"
      />
      <div class="row">
        <q-btn type="submit" @click="signIn" label="Sign In" class="authButton">
          <template v-slot:loading>
            <q-spinner-facebook />
          </template>
        </q-btn>
      </div>
    </form>
  </div>
</template>
<script>
export default {
  name: "SignIn",
  data() {
    return {
      form: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    async signIn() {
      const { username, password } = this.form;
      await this.$Auth.signIn(username, password);
      this.$AmplifyEventBus.$emit("authState", "signedIn");
      parent.signedIn = true;
      this.$router.go(-1);
    }
  }
};
</script>
<style type="stylus">
.authButton {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background-color: #2196f3;
  border: none;
  color: white;
  outline: none;
}
.auth {
  margin: 0 auto;
  width: 460px;
}
</style>