
<template>

    <q-btn color="purple" class="importBtn"  label="Import element+" @click="pickLibrary('element')"/>

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
    },




  },
  computed: {
    ...mapState([
    'importLibraries'
    ]),
}
  }
</script>
<style>
.importBtn{
  margin-top: 20px;
  width: 260px;
  height: 45px;
}
</style>
