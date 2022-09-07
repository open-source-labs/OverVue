
<template>
  <div class="q-pa-md">
    <q-btn-dropdown color="purple" label="Choose Library">
      <q-list>
        <q-item clickable v-close-popup @click="pickLibrary('element')">
          <q-item-section>
            <q-item-label>Element+</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickLibrary('bootstrap')">
          <q-item-section>
            <q-item-label>Bootstrap</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickLibrary('vuetify')">
          <q-item-section>
            <q-item-label>Vuetify</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
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
