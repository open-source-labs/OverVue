<template>
  <!--Landing page-->
  <section id="welcomeTab">
    <h6 class="tutorialHeading">Welcome to</h6>
    <img alt="OverVue" src="../../../assets/overvue_layeredlogo.png" id="logo">
    <q-btn class="tut-btn" color="secondary" label="What's New in 7.0" @click="newTab" />
    <q-btn class="tut-btn" color="secondary" label="View the Readme"
      @click="openUrl('https://github.com/open-source-labs/OverVue#readme')" />
    <p id="new-text">New to OverVue?</p>
    <q-btn class="tut-btn" color="secondary" label="Explore Functionality" @click="nextTab" />
    <p id="new-text"></p>
    <q-btn class="tut-btn closeAction" label="Close" @click="toggleTutorial" />
  </section>
</template>

<script>
const { ipcRenderer, shell } = window;
import { mapActions } from 'vuex';
export default {
  emits: ['nextTab', 'versionTab'],
  methods: {
    ...mapActions(["toggleTutorial"]),
    nextTab() {
      this.$emit('nextTab')
    },
    versionTab() {
      this.$emit('versionTab')
    },
    openUrl(url) {
      shell.openExternal(url, { activate: true });
    }
  }
}
</script>

<style lang="scss" scoped>
#logo {
  width: 325px;
  height: 325px;
}


p {
  margin-top: 12px;
  margin-bottom: 0px;
}

#welcomeTab {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.tutorialHeading {
  margin: .75rem;
  font-size: 2rem;
  padding-top: 15px;
}

.tutorialContent {
  margin: .75rem;
}

.tut-btn {
  margin: 0.75rem;
  width: 50%;
  min-height: 42px;
  height: auto;
}
</style>
