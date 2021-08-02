<!--
Description:
  Displays Vuex features for possible iterations.
  Functionality includes: N/A
  -->

<template>
  <div class="input-container">
    <!-- <q-input
      standout="bg-secondary text-white"
      bottom-slots
      v-model="text"
      label="Add Vuex"
      dense
      class="input-add"
    >
      <template v-slot:append>
        <q-btn round dense flat icon="add" />
      </template>
    </q-input> -->
    <q-input
      standout="bg-secondary text-white"
      bottom-slots
      v-model="text"
      label="Create Action"
      dense
      class="input-add"
    >
      <template v-slot:append>
        <q-btn
          round dense flat icon="add"
          @click="createNewAction(text)"
          />
      </template>
    </q-input>
    <!-- <q-input
      standout="bg-secondary text-white"
      bottom-slots
      v-model="text"
      label="Select Action"
      dense
      class="input-add"
    >
      <template v-slot:append>
        <q-btn round dense flat icon="add" />
      </template>
    </q-input> -->
            <!-- :max-height="90"
          :option-height="20" -->
    <template>
      <div id="action-select">
        <br />
        <multiselect
          v-model="value"
          placeholder="Select Action"
          :multiple="true"
          :close-on-select="false"
          @input="selectAction"
          :max-height="90"
          :option-height="20"
          open-direction= "top"
          :options="options"
          :searchable="true"
        >
          <span slot="noResult">No components found.</span>
        </multiselect>
      </div>
    </template>
    <template>
      <div>
        <br />
      <q-btn
      id="add-actions-btn"
      color="secondary"
      label="Add Action(s)"
      @click="addActionToComp"
    />
      </div>
    </template>
  </div>
</template>
   <!-- @click="createComponent" -->
    <!-- :disabled="!componentNameInputValue.trim()" -->
<script>
import { mapState, mapActions } from 'vuex'
import Multiselect from 'vue-multiselect'

export default {
  name: 'VuexForm',
  components: {
    Multiselect
  },
  data () {
    return {
      text: '',
      value: ''
    }
  },
  computed: {
    ...mapState([
      'routes',
      'componentMap',
      'activeComponent',
      'activeRoute',
      'selectedActions',
      'userActions'
    ]),
    options () {
      return this.userActions
    }
  },
  methods: {
    ...mapActions(['setActiveComponent', 'createAction', 'addActionSelected', 'addActionToComponent']),
    selectAction (value) {
      this.addActionSelected(value)
    },
    createNewAction (text) {
      console.log('text:', text)
      if (!this.$store.state.userActions.includes(text)) {
        this.createAction(text)
        console.log('userActions', this.$store.state.userActions)
        console.log('userActionArray', this.userActions)
        this.text = ''
      }
    },
    addActionToComp () {
      this.addActionToComponent(this.selectedActions)
      console.log('activeComponent', (this.routes[this.activeRoute].filter(comp => {
        return comp.componentName === this.activeComponent
      })[0]))
    },
    // when multiselect is opened activeComponent is deselected to allow for parentSelected action
    resetActiveComponent () {
      if (this.activeComponent !== '') {
        this.setActiveComponent('')
      }
    }
  },
  // clears out value in mutiselect on creation of component
  watch: {
    componentMap: {
      handler () {
        // console.log('componentMap has changed')
        this.value = ''
      }
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
  #parent-select {
    height: 30px;
    margin: 0.75rem;
    width: 90%;
  }
</style>

<style lang="stylus" scoped>
.input-add
  margin 0 1em
</style>
