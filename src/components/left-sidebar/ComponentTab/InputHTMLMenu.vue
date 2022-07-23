<!-- Menu for inputting information into first layer HTML Elements, giving them class, binding, size, location, color -->

<template >
  <div id="html_element_card" class="no-shadow">
    <h1>Here is a card</h1>
      <div class="AttributeBox">
        <p class="title">Add attributes to: {{ this.activeComponent }}</p>
        <div class="AttributeContainer" v-for="element in this.componentMap[this.activeComponent].htmlList"
          :key="element.id + Date.now()">
          <p v-if="element.id === this.activeHTML">Your class is - {{ element.class }}</p>
        </div>
        <div class="formBox">
          <q-form autofocus v-on:submit.prevent="submitClass">
            <p class="title">Add Class Name:</p>
            <q-input label="Add your class here" filled dark autofocus true hide-bottom-space v-model="classText"
              @keyup.enter="submitClass"></q-input>
            <q-btn id="comp-btn" class="sidebar-btn" color="secondary" label="Submit Attribute"
              :disable="classText.length > 0 ? false : true" @click="submitClass(classText, this.activeHTML)" />

            <p class="title">Change Height:</p>
            <q-input label="Adjust height (0-100)" filled dark autofocus true hide-bottom-space v-model="heightText"
              @keyup.enter="submitHeight"></q-input>
            <q-btn id="comp-btn" class="sidebar-btn" color="secondary" label="Submit Height"
              :disable="heightText.length > 0 ? false : true" @click="submitHeight(heightText, this.activeHTML)" />

            <p class="title">Change Width:</p>
            <q-input label="Adjust width (0-100)" filled dark autofocus true hide-bottom-space v-model="widthText"
              @keyup.enter="submitWidth"></q-input>
            <q-btn id="comp-btn" class="sidebar-btn" color="secondary" label="Submit Width"
              :disable="widthText.length > 0 ? false : true" @click="submitWidth(widthText, this.activeHTML)" />
            
            <p class="title">Change Elevation:</p>
            <q-input label="Adjust Elevation (0-100)" filled dark autofocus true hide-bottom-space v-model="topText"
              @keyup.enter="submitTop"></q-input>
            <q-btn id="comp-btn" class="sidebar-btn" color="secondary" label="Submit Height"
              :disable="topText.length > 0 ? false : true" @click="submitTop(topText, this.activeHTML)" /> 
            
            <p class="title">Change Left Distance:</p>
            <q-input label="Adjust Distance (0-100)" filled dark autofocus true hide-bottom-space v-model="leftText"
              @keyup.enter="submitLeft"></q-input>
            <q-btn id="comp-btn" class="sidebar-btn" color="secondary" label="Submit Left"
              :disable="leftText.length > 0 ? false : true" @click="submitLeft(leftText, this.activeHTML)" />
            <q-btn label="Close" @click="this.openAttributeModal" />
          </q-form>
        </div>
      </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      attributeModal : "false",
      classText: '',
      heightText: '30',
      widthText: '30',
      topText: '30',
      leftText: '30',


      // tab: 'details',
    }
  },
  computed: {
    ...mapState([
      'activeComponent',
      'selectedElementList', 
      'componentMap', 
      'activeComponent', 
      'activeHTML', 
      'activeLayer', 
      'attributeModalOpen'
    ])
  },
  components: {
  },
  methods: {
    ...mapActions([
      'setActiveHTML', 
      'setActiveLayer',
      'openAttributeModal', 
      'addActiveComponentClass',
      'addActiveComponentHeight',
      'addActiveComponentWidth',
      'addActiveComponentTop',
      'addActiveComponentLeft',
      ]),
    submitClass(element, idNum) {
      if (element === '') {
        return;
      }
      let payload = {
        class: element,
        id: idNum
      }
      this.addActiveComponentClass(payload);
      this.classText = '';
    },
    submitHeight(element, idNum) {
      if (element === '') {
        return;
      }
      let payload = {
        height: element,
        id: idNum
      }
      this.addActiveComponentHeight(payload);
      this.classText = '';
    },
    submitWidth(element, idNum) {
      if (element === '') {
        return;
      }
      let payload = {
        width: element,
        id: idNum
      }
      this.addActiveComponentWidth(payload);
      this.widthText = '';
    },
    submitTop(element, idNum) {
      if (element === '') {
        return;
      }
      let payload = {
        top: element,
        id: idNum
      }
      this.addActiveComponentTop(payload);
      this.topText = '';
    },
    submitLeft(element, idNum) {
      if (element === '') {
        return;
      }
      let payload = {
        left: element,
        id: idNum
      }
      this.addActiveComponentLeft(payload);
      this.leftText = '';
    },

  },
  watch: {
    attributeModalOpen() {
      this.attributeModal = this.attributeModalOpen;
    },
  }
}
</script>

<style lang="scss">
// give html background color of grey
.html-bg {
    background-color: $subprimary;
}
#store-cards {
  height: 100%;
  border-radius: 0px !important;
  background-color: $subprimary;
  
}
.q-tab-panel {
  height: calc(100% - 30px);
  // matches the code editor bg
  background: $subprimary;
  padding: 0px;
  border-radius: 0px !important;
  // changes the length of the tab panels
}
.q-tab-panels {
  height: 100%;
  border-radius: 0px !important;
}
.q-tabs {
  background: $subprimary;
}

.q-tab__content{
  padding: 10px 0;
}
</style>