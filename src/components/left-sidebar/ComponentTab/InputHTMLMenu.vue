<!-- Menu for inputting information into first layer HTML Elements, giving them class, binding, size, location, color -->

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
          <p class="title">Adjust Height and Elevation:</p> 
          <q-slider
            v-model="heightText"
            :min="0"
            :max="100"
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

          <q-item id="layer-item" filled dark autofocus true hide-bottom-space color="secondary">
            <q-item-section v-model="z" class="layer">Component Layer = {{z}}</q-item-section>
            <q-btn
              class="minorAction"
              color="transparent"
              text-color="primary"
              label="&ndash;"
              @click="(e) => handleLayer(e)"
            />
            <p id="counter">{{ z }}</p>
            <q-btn
              class="minorAction"
              color="transparent"
              text-color="primary"
              label="+"
              @click="(e) => handleLayer(e)"
            />
          </q-item>
          


          <q-btn label="Close" @click="this.openAttributeModal" />
        </q-form>
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
      heightText: '0',
      widthText: '0',
      topText: '0',
      leftText: '0',
      z: '0',
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
      'attributeModalOpen',
      'activeRoute',
      'routes',
      'activeComponentData',
      'activeComponentObj',
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
      'updateHTMLLayer',
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

    handleLayer(e) {
      e.preventDefault();

    let htmlZ;

    this.activeComponentObj.htmlList.forEach( element => {
      if (element.id === this.activeHTML) {
        htmlZ = element.z;
      }
    })

      const payload = {
        activeHTML: this.activeHTML,
        z: htmlZ,
      };
      
      if (e.target.innerText === "+")  {
        payload.z++;
        this.z++;
      }
      if (e.target.innerText === "–" && payload.z > 0)  {
        payload.z--;
        this.z--;
      }
      this.updateHTMLLayer(payload);
      console.log('here')
      console.log(this.activeHTML)
  },

  watch: {
    attributeModalOpen() {
      this.attributeModal = this.attributeModalOpen;
    },
  }
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

.minorAction {
  margin-right:5px;
  margin-left: 5px;
  width:2em;
  height: 1.5em;
}
#counter {
padding-top:5px;
}
</style>