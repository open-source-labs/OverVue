<template>

  <div class="q-pa-md box"

  v-if = "this.$store.state.displaylibComponent">


    <q-btn-dropdown color="pink" label="Select Library Component" dropdown-icon="change_history">
      <q-list>
        <q-item clickable v-close-popup @click="pickComponent('e-button')">
          <q-item-section>
           button
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
          <q-btn color="secondary" label="Secondary" />
          <q-icon name="keyboard_arrow_right"/>
        </q-tooltip>
      </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickComponent('e-input')">
          <q-item-section>
            InputBox
            <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
          <img alt="inputbox" src="../../../assets/inputbox.png" class="input-box">
          <q-icon name="keyboard_arrow_right"/>
        </q-tooltip>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickComponent('e-link')">
          <q-item-section>
           Link
           <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
          <img alt="inputbox" src="../../../assets/link.png" class="input-box">
          <q-icon name="keyboard_arrow_right"/>
        </q-tooltip>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickComponent('e-card')">
          <q-item-section>
           Card
           <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
          <img alt="card" src="../../../assets/card.png" class="card">
          <q-icon name="keyboard_arrow_right"/>
        </q-tooltip>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickComponent('e-form')">
          <q-item-section>
           Form
           <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
          <img alt="form" src="../../../assets/form.png" class="form">
          <q-icon name="keyboard_arrow_right"/>
        </q-tooltip>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickComponent('e-checkbox')">
          <q-item-section>
            Checkbox
            <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
          <img alt="checkbox" src="../../../assets/checkbox.png" class="checkbox">
          <q-icon name="keyboard_arrow_right"/>
        </q-tooltip>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickComponent('e-checkbox-button')">
          <q-item-section>
           Checkbox Button
           <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
          <img alt="checkboxbutton" src="../../../assets/checkboxbutton.png" class="checkboxbutton">
          <q-icon name="keyboard_arrow_right"/>
        </q-tooltip>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickComponent('e-date-picker')">
          <q-item-section>
            Date Picker
            <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
          <img alt="datepicker" src="../../../assets/datepicker.png" class="datepicker">
          <q-icon name="keyboard_arrow_right"/>
        </q-tooltip>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickComponent('e-slider')">
          <q-item-section>
  Slider
  <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
          <img alt="slider" src="../../../assets/slider.png" class="slider">
          <q-icon name="keyboard_arrow_right"/>
        </q-tooltip>
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
.input-box{
  width: 300px;
}

.card{
  width: 300px;
}

.form{
  width: 300px;
}

.checkbox{
  width: 130px;
}

.checkboxbutton{
  width: 500px;
}

.datepicker{
  width: 300px;
}


.slider{
  width: 600px;
}
</style>
