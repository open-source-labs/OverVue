<template>

  <div class="q-pa-md box"

  v-if = "this.$store.state.displaylibComponent">


    <q-btn-dropdown color="pink" label="Select Library Component" dropdown-icon="change_history">
      <q-list>
        <q-item clickable v-close-popup @click="pickComponent('e-button')">
          <q-item-section>
            <q-item-label>Button <q-btn  class="demo-button" color="blue" label="Default" /></q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickComponent('e-input')">
          <q-item-section>
            <q-item-label>InputBox <q-input class="demo-input" outlined  /></q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickComponent('e-link')">
          <q-item-section>
            <q-item-label>Link <a href="#">Link</a></q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickComponent('e-card')">
          <q-item-section>
            <q-item-label>Card 
              <q-card class="my-card">
      <q-card-section>
        Card
      </q-card-section>
    </q-card>

            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickComponent('e-form')">
          <q-item-section>
            <q-item-label>Form <q-form class="demo-form" outlined  /></q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickComponent('e-checkbox')">
          <q-item-section>
            <q-item-label>Checkbox <q-checkbox class="demo-checkbox" outlined  /></q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickComponent('e-checkbox-button')">
          <q-item-section>
            <q-item-label>Checkbox-button <q-checkbox-button class="demo-checkbox-button" color="blue" outlined  /></q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickComponent('e-date-picker')">
          <q-item-section>
            <q-item-label>Date-picker <q-date-picker class="demo-date-picker"   v-model="value1"
        type="date"
        placeholder="Pick a day"
        :size="size" outlined  /></q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickComponent('e-slider')">
          <q-item-section>
            <q-item-label>Slider <q-slider class="demo-slider"   v-model="value1" color="blue"
       outlined  /></q-item-label>
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
