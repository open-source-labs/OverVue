<template>
  <section id="welcomeTab">
    <h6 class="tutorialHeading">Welcome to</h6>
    <img
      alt="OverVue"
      src="../../../../src/assets/right_sidebar325x325.svg"
      id="logo"
    />
    <p id="new-text"></p>
    <q-btn
      class="tut-btn closeAction"
      label="Start Building Now"
      @click="toggleTutorial"
    />
    <p id="new-text"></p>
    <p id="new-text"></p>
    <p id="new-text">New to Overvue?</p>
    <br />
    <q-btn
      class="tut-btn"
      color="secondary"
      label="New User Tutorial"
      @click="nextTab"
    />
    <q-btn
      class="tut-btn"
      color="secondary"
      label="Official Documentation"
      @click="openUrl('https://www.overvue.org/')"
    />
  </section>
</template>

<script setup lang="ts">
// @ts-nocheck
// No check for the shell
import { useStore } from "../../../store/main.js";
const { shell } = window;

const emit = defineEmits(["nextTab", "versionTab"]);
const nextTab = () => emit("nextTab");

const store = useStore();
const toggleTutorial = () => store.toggleTutorial();

const openUrl = (url: string) => shell.openExternal(url, { activate: true });
</script>

<style lang="scss" scoped>
#logo {
  width: auto;
  height: auto;
  max-width: 18rem;
  max-height: 18rem;
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
  margin: 0.75rem;
  font-size: 2rem;
  padding-top: 15px;
}

.tutorialContent {
  margin: 0.75rem;
}

.tut-btn {
  margin: 0.75rem;
  width: 50%;
  min-height: 42px;
  height: auto;
}
</style>
