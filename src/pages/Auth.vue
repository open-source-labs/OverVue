<template>
  <div class="auth">
    <sign-up :toggle="toggle" v-if="formState === 'signUp'"></sign-up>
    <sign-in v-if="formState === 'signIn'"></sign-in>
    <div class="row justify-end">
      <q-btn @click="toggle" type="submit" class="authButton">
        {{ formState === 'signUp' ?
        'Already signed up? Sign In' : 'Need an account? Sign Up'
        }}
      </q-btn>
      <q-btn @click="goHome" type="submit">Back</q-btn>
    </div>
  </div>
</template>
<script>
import SignUp from "./SignUp";
import SignIn from "./SignIn";
export default {
  name: "app",
  components: {
    SignUp,
    SignIn
  },
  data() {
    return {
      formState: "signUp"
    };
  },
  methods: {
    toggle() {
      this.formState === "signUp"
        ? (this.formState = "signIn")
        : (this.formState = "signUp");
    },
    goHome() {
      this.$router.go(-1);
    }
  }
};
</script>
<style scoped>
.auth {
  margin: 0 auto;
  width: 460px;
}
.toggle {
  cursor: pointer;
  font-size: 18px;
}
* {
  box-sizing: border-box;
}
.authButton {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background-color: #2196f3;
  border: none;
  color: white;
  outline: none;
}
.button {
  cursor: pointer;
}
.button:hover {
  opacity: 0.5;
}
.text {
  margin-top: 4px;
  margin-bottom: 0px;
}
.delete {
  color: #2196f3;
}
.todo {
  display: block;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  text-align: center;
  padding-top: 8px;
  padding-bottom: 9px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
</style>
