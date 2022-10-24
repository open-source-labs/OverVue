<template>
  <!--Landing page-->
  <section id="welcomeTab">
    <h6 class="tutorialHeading">Welcome to</h6>
    <img
      alt="OverVue"
      src="../../../assets/overvue_layeredlogo.png"
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
    <p id="new-text">New To Overvue?</p>
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

<!-- COMPOSITION API SYNTAX -->
<script setup lang="ts">
import { useStore } from "../../../store/main.js";
const { shell } = window;

const store = useStore();
const emit = defineEmits(["nextTab", "versionTab"]);

const toggleTutorial = () => store.toggleTutorial();
const nextTab = () => emit("nextTab");
const openUrl = (url: string) => shell.openExternal(url, { activate: true });
</script>

<!-- OLD OPTIONS API SYNTAX -->
<!-- <script>
const { ipcRenderer, shell } = window;
import { mapActions } from 'vuex';
export default {
  emits: ['nextTab', 'versionTab'],
  methods: {
    ...mapActions(["toggleTutorial"]),
    nextTab() {
      this.$emit('nextTab')
    },
    openUrl(url) {
      shell.openExternal(url, { activate: true });
    }
  }
}
</script> -->

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
