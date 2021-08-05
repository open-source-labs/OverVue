<!--
Description:
  Displays Vuex features for possible iterations.
  Functionality includes: N/A
  -->

<template>
  <div class="input-container">
    <hr />
    <!-- ACTION SECTION -->
    <q-input
      @keyup.enter.native="createNewAction(textAction)"
      standout="bg-secondary text-white"
      bottom-slots
      v-model="textAction"
      label="Create Action in Store"
      dense
      class="input-add"
    >
      <template v-slot:append>
        <q-btn
          round
          dense
          flat
          icon="add"
          @click="createNewAction(textAction)"
        />
      </template>
    </q-input>
    <template>
      <div id="action-select">
        <multiselect
          v-model="selectAction"
          class="multiselect"
          placeholder="Select Action"
          :multiple="true"
          :close-on-select="false"
          :max-height="90"
          :option-height="20"
          open-direction="top"
          :options="actionOptions"
          :searchable="true"
        >
          <span slot="noResult">No actions found.</span>
        </multiselect>
      </div>
    </template>
    <template>
      <div>
        <q-btn
          id="add-actions-btn"
          class="add-btn"
          color="secondary"
          label="Add Action(s)"
          @click="addActionToComp"
        />
      </div>
    </template>
    <hr />
    <!-- STATE PORTION -->
    <q-input
      @keyup.enter.native="createNewState(textState)"
      standout="bg-secondary text-white"
      bottom-slots
      v-model="textState"
      label="Create State in Store"
      dense
      class="input-add"
    >
      <template v-slot:append>
        <q-btn round dense flat icon="add" @click="createNewState(textState)" />
      </template>
    </q-input>
    <template>
      <div id="state-select">
        <multiselect
          v-model="selectState"
          class="multiselect"
          placeholder="Select State"
          :multiple="true"
          :close-on-select="false"
          :max-height="90"
          :option-height="20"
          open-direction="top"
          :options="stateOptions"
          :searchable="true"
        >
          <span slot="noResult">No state found.</span>
        </multiselect>
      </div>
    </template>
    <template>
      <div>
        <q-btn
          id="add-state-btn"
          class="add-btn"
          color="secondary"
          label="Add State"
          @click="addStateToComp"
        />
      </div>
    </template>
    <!-- PROPS PORTION -->
    <hr />
    <q-input
      @keyup.enter.native="createNewProp(textProps)"
      standout="bg-secondary text-white"
      bottom-slots
      v-model="textProps"
      label="Create Prop in Store"
      dense
      class="input-add"
    >
      <template v-slot:append>
        <q-btn round dense flat icon="add" @click="createNewProp(textProps)" />
      </template>
    </q-input>
    <template>
      <div id="props-select">
        <multiselect
          v-model="selectProps"
          class="multiselect"
          placeholder="Select Props"
          :multiple="true"
          :close-on-select="false"
          :max-height="90"
          :option-height="20"
          open-direction="top"
          :options="propsOptions"
          :searchable="true"
        >
          <span slot="noResult">No props found.</span>
        </multiselect>
      </div>
    </template>
    <template>
      <div>
        <q-btn
          id="add-props-btn"
          class="add-btn"
          color="secondary"
          label="Add Prop(s)"
          @click="addPropsToComp"
        />
      </div>
    </template>
    <hr/>
  </div>
</template>
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
      textAction: '',
      textState: '',
      textProps: ''
    }
  },
  computed: {
    ...mapState([
      'routes',
      'componentMap',
      'activeComponent',
      'activeRoute',
      'selectedActions',
      'selectedState',
      'selectedProps',
      'userActions',
      'userState',
      'userProps'
    ]),
    actionOptions () {
      return this.userActions
    },
    propsOptions () {
      return this.userProps
    },
    stateOptions () {
      return this.userState
    },
    selectAction: {
      get () {
        return this.selectedActions
      },
      set (value) {
        this.addActionSelected(value)
      }
    },
    selectState: {
      get () {
        return this.selectedState
      },
      set (value) {
        this.addStateSelected(value)
      }
    },
    selectProps: {
      get () {
        return this.selectedProps
      },
      set (value) {
        this.addPropsSelected(value)
      }
    }
  },
  methods: {
    ...mapActions([
      'setActiveComponent',
      'createAction',
      'createState',
      'createProp',
      'addActionSelected',
      'addStateSelected',
      'addPropsSelected',
      'addActionToComponent',
      'addStateToComponent',
      'addPropsToComponent'
    ]),

    // Create's a new action that will be stored in the userActions array within store, and it will be added to the action drop-down menu
    createNewAction (text) {
      if (!this.userActions.includes(text) && text) {
        this.createAction(text)
        this.textAction = ''
      }
    },

    // Adds an action to the currently selected component
    addActionToComp () {
      this.addActionToComponent(this.selectedActions)
    },

    // Create's a new prop that will be stored in the userProps array within store, and it will be added to the props drop-down menu
    createNewProp (text) {
      if (!this.userProps.includes(text) && text) {
        this.createProp(text)
        this.textProps = ''
      }
    },

    // Adds a prop to the currently selected component
    addPropsToComp () {
      this.addPropsToComponent(this.selectedProps)
    },

    // Create's a new state property that will be stored in the userState array within store, and it will be added to the state drop-down menu
    createNewState (text) {
      if (!this.userState.includes(text) && text) {
        this.createState(text)
        this.textState = ''
      }
    },

    // Adds a state to the currently selected component
    addStateToComp () {
      this.addStateToComponent(this.selectedState)
    },

    // when multiselect is opened activeComponent is deselected to allow for parentSelected action
    resetActiveComponent () {
      if (this.activeComponent !== '') {
        this.setActiveComponent('')
      }
    }
  }
  // clears out value in mutiselect on creation of component
  // watch: {
  //   componentMap: {
  //     handler () {
  //       // console.log('componentMap has changed')
  //       this.value = ''
  //     }
  //   }
  // }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
.multiselect {
  height: 30px;
  margin: 0.75rem;
  width: 90%;
}
.add-btn {
  height: 15px;
  margin: 0.75rem;
  width: 90%;
}
.home-sidebar {
  margin: 1rem;
  padding: 0.5rem;
  border-radius: 5px;
}

hr {
  height: 1px;
  background-color: #ccc;
  border: none;
}
</style>

<style lang="stylus" scoped>
.input-add
  margin 0 1em
</style>
