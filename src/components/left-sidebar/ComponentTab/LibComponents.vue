<template>

  <div class="q-pa-md box"

  v-if = "this.$store.state.displaylibComponent">


    <q-btn-dropdown color="pink" label="Select Library Component" dropdown-icon="change_history">
      <q-list>
        <q-item clickable v-close-popup @click="pickComponent('element')">
          <q-item-section>
            <q-item-label>Button <q-btn  class="demo-button" color="blue" label="Default" /></q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup >
          <q-item-section>
            <q-item-label>InputBox <q-input class="demo-input" outlined  /></q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>
<script>
  import { pauseTracking } from "@vue/reactivity";
import { mapState, mapActions } from "vuex";



  export default {
  name: "LibComponents",




  components: {


  },
  methods:{
    ...mapActions([

    'changeLibComponentDisplay',
    'addLibComponents'

    ]),
    pickComponent(componentName){
      const payload = {

      };
      payload[componentName] = ['fas fa-toggle-on fa-lg']

      this.addLibComponents(payload);

    }




  },
  computed: {
    ...mapState([
    'importLibraries'
    ]),
}
  }
</script>
<style>

.demo-button{
  margin-left: 50px;
}
.demo-input{
  border: 1px solid white;
}
</style>
