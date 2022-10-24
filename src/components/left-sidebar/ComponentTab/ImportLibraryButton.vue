<template>
  <q-btn
    color="purple"
    class="importBtn"
    label="Import element+"
    @click="pickLibrary('element')"
  />
</template>

<script setup lang="ts">
// new script for Composition API
import { computed } from "vue";
import { useStore } from "../../../store/main.js";

const store = useStore();

const importLibraries = computed(() => store.importLibraries);

const changeLib: typeof store.changeLib = (payload) => store.changeLib(payload);
const addLibComponents: typeof store.addLibComponents = (payload) =>
  store.addLibComponents(payload);
const changeLibComponentDisplay: typeof store.changeLibComponentDisplay = (
  payload
) => store.changeLibComponentDisplay(payload);

const pickLibrary = (libName: string) => {
  let payload = {
    libName: libName,
    displaylibComponent: true,
  };
  changeLibComponentDisplay(payload);
  changeLib(payload);
};
</script>

<!-- <script>
  //old Options API code
  import { mapState, mapActions } from "vuex";
  export default {
  name: "ImportLibraryButton",
  components: {

  },
  methods:{
    ...mapActions([


      "changeLib",
      'addLibComponents',
      'changeLibComponentDisplay'


    ]),
    pickLibrary(libName){
      let payload = {
        libName:libName,
        displaylibComponent:true

      }
      this.changeLibComponentDisplay(payload);
      this.changeLib(payload);
    },




  },
  computed: {
    ...mapState([
    'importLibraries'
    ]),
}
  }
</script> -->

<style>
.importBtn {
  margin-top: 20px;
  width: 260px;
  height: 45px;
}
</style>
