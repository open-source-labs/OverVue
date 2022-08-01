<!-- Menu for inputting information into first layer HTML Elements, giving them class, binding, size, location, and inner text-->

<template >
  <div class="AttributeBox">
    <div class="AttributeContainer" v-for="element in this.componentMap[this.activeComponent].htmlList"
      :key="element.id + Date.now()">
      <p v-if="element.id === this.activeHTML" class="title">Your class {{ element.class.length !== 0 ? 'is ' + element.class : 'has not been stated yet' }}</p>    
    </div>
      <q-form autofocus v-on:submit.prevent="submitClass">
        <q-input label="Add/Change your class name" filled dark autofocus true hide-bottom-space v-model="classText"
          @keydown.enter="submitClass">
          <i id="comp-btn" class="fa-solid fa-right-to-bracket"
            :disable="classText.length > 0 ? false : true" @click.self="submitClass(classText, this.activeHTML)">
          </i>
        </q-input>
      </q-form>
      <q-form autofocus v-on:submit.prevent="addBinding">
        <q-input label="Add/Change two-way binding" filled dark autofocus true hide-bottom-space v-model="bindingText"
          @keydown.enter="addBinding(bindingText, this.activeHTML)">
          <i id="compt-btn" class="fa-solid fa-right-to-bracket" label="Add Binding"
            :disable="bindingText.length > 0 ? false : true" @click.self="addBinding(bindingText, this.activeHTML)">
          </i>
        </q-input>
      </q-form>  
    <div class="AttributeContainer" v-for="element in this.componentMap[this.activeComponent].htmlList"
      :key="element.id + Date.now()">
      <div v-if="exceptions.includes(element.text) && element.id === this.activeHTML">
        <q-form autofocus v-on:submit.prevent="submitNote">
          <q-input label="Add Inner Text" filled dark autofocus true hide-bottom-space v-model="noteText"  @keydown.enter="submitNote">
            <i class="fa-solid fa-right-to-bracket" color="secondary" label="Submit Note"
              :disable="noteText.length > 0 ? false : true" @click.self="submitNote(noteText, this.activeHTML)">
            </i>
          </q-input>
        </q-form>
        <p class="title">Adjust Height and Elevation:</p> 
        <q-form autofocus v-on:submit.prevent="submitHeight">
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
        </q-form>
        <q-form autofocus v-on:submit.prevent="submitTop">
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
        </q-form>
        <q-form autofocus v-on:submit.prevent="submitWidth">
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
        </q-form>
        <q-form autofocus v-on:submit.prevent="submitLeft">
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
        </q-form>
        <q-form autofocus v-on:submit.prevent="submitHeight">
          <q-input label="Adjust height (0-100)" filled dark autofocus true hide-bottom-space v-model="heightText" @keydown="submitHeight">
            <i class="fa-solid fa-right-to-bracket" color="secondary" label="Submit Height"
              @click.self="submitHeight(heightText, this.activeHTML)">
            </i>
          </q-input>
        </q-form>
        <q-form autofocus v-on:submit.prevent="submitWidth">
          <q-input label="Adjust width (0-100)" filled dark autofocus true hide-bottom-space v-model="widthText" @keydown.enter="submitWidth">
            <i class="fa-solid fa-right-to-bracket" color="secondary" label="Submit Width"
              @click.self="submitWidth(widthText, this.activeHTML)">
            </i>
          </q-input>
        </q-form>
        <q-form autofocus v-on:submit.prevent="submitTop">
          <q-input label="Adjust Elevation (0-100)" filled dark autofocus true hide-bottom-space v-model="topText" @keydown.enter="submitTop">
            <i class="fa-solid fa-right-to-bracket" color="secondary" label="Submit Height"
              @click.self="submitTop(topText, this.activeHTML)">
            </i>
          </q-input>
        </q-form>
        <q-form autofocus v-on:submit.prevent="submitLeft">
          <q-input label="Adjust Distance (0-100)" filled dark autofocus true hide-bottom-space v-model="leftText"  @keydown.enter="submitLeft">
            <i class="fa-solid fa-right-to-bracket" color="secondary" label="Submit Position"
              @click="submitLeft(leftText, this.activeHTML)">
            </i>
          </q-input>
        </q-form>
        <q-item id="layer-item" filled dark autofocus true hide-bottom-space color="secondary">
          <q-item-section class="layer">Component Layer = </q-item-section>
            <q-btn
              class="minorAction"
              color="transparent"
              text-color="primary"
              label="-"
              @click="(e) => handleLayer(e)"
            />
      <!--nested for loop to iterate to display current z-index for selected htmlElement-->
            <template v-for="element in this.routes[this.activeRoute]">
              <template v-for="element1 in element.htmlList">
                <p v-if="element1.id === this.activeHTML" id="counter" :key="element1.id">{{ element1.z }} </p>
              </template>
            </template>
            <q-btn
              class="minorAction"
              color="transparent"
              text-color="primary"
              label="+"
              @click="(e) => handleLayer(e)"
            />
        </q-item>
      </div>
    </div>
    <q-btn label="Close HTML Element"  class="closeBtn" @click="closeMenu({text: 'reset', id: 'reset' })" />
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
      z: '0',
      noteText: '',
      bindingText: '',
    }
  },

  mounted () {
    //for loop to access nested HTML elements of components - sets height/width/top/left sliders to current value of selected HTML element
    for (let i = 0; i <this.routes[this.activeRoute].length; i++) {
      for (let j = 0; j < this.routes[this.activeRoute][i].htmlList.length; j++) {
        if(this.activeHTML === this.routes[this.activeRoute][i].htmlList[j].id) {
          this.heightText = this.routes[this.activeRoute][i].htmlList[j].h;
          this.widthText = this.routes[this.activeRoute][i].htmlList[j].w;
          this.topText = this.routes[this.activeRoute][i].htmlList[j].x;
          this.leftText = this.routes[this.activeRoute][i].htmlList[j].y;
        }
      }
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
      'componentData'
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
      'clearActiveHTML',
      'updateComponentLayer',
      'updateHTMLLayer',
      'addBindingText'
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
//function that adds/subtracts z-index on html Elements
    handleLayer(e) {
      e.preventDefault();
      let HTMLZ;
      for (let i = 0; i <this.routes[this.activeRoute].length; i++) {
        for (let j = 0; j < this.routes[this.activeRoute][i].htmlList.length; j++) {
          if(this.activeHTML === this.routes[this.activeRoute][i].htmlList[j].id) {
              HTMLZ = this.routes[this.activeRoute][i].htmlList[j].z
          }
        }
      }
      const payload = {
        activeComponent: this.activeComponent,
        activeHTML: this.activeHTML,
        routeArray: this.routes[this.activeRoute],
        z: HTMLZ,
      };
      if (e.target.innerText === "+") {
          payload.z++;
      }
      if (e.target.innerText === "-" && payload.z > 0)  {
        payload.z--;
      }
      this.updateHTMLLayer(payload);
    },
    activeRouteArray() {
      return this.routes[this.activeRoute];
    },
    addBinding(input, idNum) {
      if (input === '') {
        return;
      }
      const payload = {
        binding: input,
        id: idNum
      }
      this.addBindingText(payload);
      this.bindingText = '';
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

.closeBtn {
  background-color: $primary;
  margin-top: 2em;
  margin-bottom: 2em;
  width: 100%;
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