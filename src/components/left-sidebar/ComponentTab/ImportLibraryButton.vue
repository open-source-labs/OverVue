
<template>

    <q-btn color="purple" class="importBtn"  label="Import element+" @click="pickLibrary('element')"/>

</template>

<script>
export default {
    name: "ImportLibraryButton",
  };
</script>

<script setup>
// new script for Composition API
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const importLibraries = computed(() => store.state.importLibraries);

const changeLib = (payload) => store.dispatch("changeLib", payload);
const addLibComponents = (payload) => store.dispatch("addLibComponents", payload);
const changeLibComponentDisplay = (payload) => store.dispatch("changeLibComponentDisplay", payload);

const pickLibrary = (libName) => {
      let payload = {
        libName:libName,
        displaylibComponent:true

      }
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
.importBtn{
  margin-top: 20px;
  width: 260px;
  height: 45px;
}
</style>
