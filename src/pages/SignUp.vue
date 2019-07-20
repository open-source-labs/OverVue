<template>
  <div class="auth">
    <h2>{{ formState === 'signUp' ? 'Sign Up' : 'Confirm Sign Up' }}</h2>
    <form @submit.prevent="signUp">
      <div v-if="formState === 'signUp'">
        <q-input square filled color="teal" label="Username" v-model="form.username" />
        <q-input
          square
          filled
          color="teal"
          label="Password"
          type="password"
          v-model="form.password"
        />
        <q-input square filled color="teal" label="E-mail" v-model="form.email" />
        <div class="row">
          <q-btn type="submit" @click="signUp" label="Sign Up" class="authButton">
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </div>
      </div>
      <div v-if="formState === 'confirmSignUp'">
        <q-input square filled color="teal" v-model="form.authCode" />
        <div class="row">
          <q-btn type="submit" @click="confirmSignUp" label="Verification code" class="authButton">
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
export default {
  name: "home",
  props: ["toggle"],
  data() {
    return {
      formState: "signUp",
      form: {
        username: "",
        password: "",
        email: ""
      }
    };
  },
  methods: {
    async signUp() {
      const { username, password, email } = this.form;
      await this.$Auth.signUp({
        username,
        password,
        attributes: { email }
      });
      this.formState = "confirmSignUp";
    },
    async confirmSignUp() {
      const { username, authCode } = this.form;
      await this.$Auth.confirmSignUp(username, authCode);
      this.toggle();
    }
  }
};
</script>
<style>
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