
<template>
  <div class="q-pa-md">
    <q-btn color="purple" label="Import element+" @click="pickLibrary('element')"/>
  </div>
</template>




<script>
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
      // console.log(this.$store.state.importLibraries.includes('element'));
    },




  },
  computed: {
    ...mapState([
    'importLibraries'
    ]),
}
  }
</script>
<style></style>
