<!-- Menu for inputting information into first layer HTML Elements, giving them class, binding, size, location, and inner text-->

<template >
    <div class="AttributeBox">
      <div class="AttributeContainer" v-for="element in this.componentMap[this.activeComponent].htmlList"
        :key="element.id + Date.now()">
        <p v-if="element.id === this.activeHTML" class="title">Your class {{ element.class.length !== 0 ? 'is ' + element.class : 'has not been stated yet' }}</p>
      </div>
        <div class="formBox">
          <q-form autofocus v-on:submit.prevent="submitClass">
            <q-input label="Add/Change your class name" filled dark autofocus true hide-bottom-space v-model="classText"
              @keyup.enter="submitClass">
            <i id="comp-btn" class="fa-solid fa-right-to-bracket"
              :disable="classText.length > 0 ? false : true" @click.self="submitClass(classText, this.activeHTML)"></i>
            </q-input>
            <div class="AttributeContainer" v-for="element in this.componentMap[this.activeComponent].htmlList"
              :key="element.id + Date.now()">
            <div v-if="exceptions.includes(element.text) && element.id === this.activeHTML">
            <q-input label="Add Inner Text" filled dark autofocus true hide-bottom-space v-model="noteText"  @keyup.enter="submitNote">
              <i class="fa-solid fa-right-to-bracket" color="secondary" label="Submit Note"
                :disable="noteText.length > 0 ? false : true" @click.self="submitNote(noteText, this.activeHTML)">
              </i>
            </q-input>
            <p class="title">Adjust Height and Elevation:</p> 
            <q-slider
              v-model="heightText"
              :min="0"
              :max="100"
              tabindex="element.h"
              vertical
              label
              label-always
              :label-value="'Height:' + heightText"
              inner-track-color="primary"
              color="secondary"
              @change="submitHeight(heightText, this.activeHTML)"
              @update:model-value="submitHeight(heightText, this.activeHTML)"
              style="float: left; margin-left: 5% "
            />
            <q-slider
              v-model="topText"
              :min="0"
              :max="100"
              vertical
              label
              label-always
              :label-value="'Elevation:' + topText"
              inner-track-color="primary"
              color="secondary"
              @change="submitTop(topText, this.activeHTML)"
              @update:model-value="submitTop(topText, this.activeHTML)"
              style="float: left; margin-left: 35%"
            />
            <q-slider
              v-model="widthText"
              :min="0"
              :max="100"
              label
              label-always
              :label-value="'Width:' + widthText"
              inner-track-color="primary"
              color="secondary"
              @change="submitWidth(widthText, this.activeHTML)"
              @update:model-value="submitWidth(widthText, this.activeHTML)"
              style="margin-top: 20%"
            />
            <q-slider
              v-model="leftText"
              :min="0"
              :max="100"
              label
              label-always
              :label-value="'Position:' + leftText"
              inner-track-color="primary"
              color="secondary"
              @change="submitLeft(leftText, this.activeHTML)"
              @update:model-value="submitLeft(leftText, this.activeHTML)"
              style="margin-top: 20%"
            />
            <q-input label="Adjust height (0-100)" filled dark autofocus true hide-bottom-space v-model="heightText" @keyup.enter="submitHeight">
              <i class="fa-solid fa-right-to-bracket" color="secondary" label="Submit Height"
                @click.self="submitHeight(heightText, this.activeHTML)">
              </i>
            </q-input>
            <q-input label="Adjust width (0-100)" filled dark autofocus true hide-bottom-space v-model="widthText" @keyup.enter="submitWidth">
              <i class="fa-solid fa-right-to-bracket" color="secondary" label="Submit Width"
                @click.self="submitWidth(widthText, this.activeHTML)">
              </i>
            </q-input>
            <q-input label="Adjust Elevation (0-100)" filled dark autofocus true hide-bottom-space v-model="topText" @keyup.enter="submitTop">
              <i class="fa-solid fa-right-to-bracket" color="secondary" label="Submit Height"
                @click.self="submitTop(topText, this.activeHTML)">
              </i>
            </q-input>
            <q-input label="Adjust Distance (0-100)" filled dark autofocus true hide-bottom-space v-model="leftText"  @keyup.enter="submitLeft">
              <i class="fa-solid fa-right-to-bracket" color="secondary" label="Submit Position"
                @click="submitLeft(leftText, this.activeHTML)">
              </i>
            </q-input>
            </div>
            </div>
            <q-btn label="Close HTML Element"  class="closeBtn" @click="closeMenu({text: 'reset', id: 'reset' })" />
          </q-form>
        </div>
      </div>
  
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      exceptions: ['div','button','form','img','list','paragraph','list-ol','list-ul','input','h1','h2','h3','h4','h5','h6'],
      attributeModal : "false",
      classText: '',
      heightText: '',
      widthText: '',
      topText: '',
      leftText: '',
      noteText: '',
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
      'addActiveComponentElementNote',
      'addActiveComponentHeight',
      'addActiveComponentWidth',
      'addActiveComponentTop',
      'addActiveComponentLeft',
      'clearActiveHTML'
      ]),
    submitClass(element, idNum) {
      console.log(this.componentMap)
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
    submitNote(element, idNum) {
      if (element === '') {
        return;
      }
      let payload = {
        note: element,
        id: idNum
      }
      this.addActiveComponentElementNote(payload);
      this.note = '';
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

    },
    closeMenu(element) {
      if (this.activeComponent !== '') {
        this.clearActiveHTML()
        this.openAttributeModal(element);
      }
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
.fa-solid {
  position: relative;
  top: 25%;
  font-size: 200%;
  float: left;
}

.fa-solid:hover {
  cursor: pointer;
  color: $secondary;
}

.title {
  font-size: 1.3em
}

.closeBtn {
  background-color: $primary;
  margin-bottom: 2em;
  width: 100%;
} 
</style>