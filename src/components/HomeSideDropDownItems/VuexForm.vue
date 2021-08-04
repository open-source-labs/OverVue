<!--
Description:
  Displays Vuex features for possible iterations.
  Functionality includes: N/A
  -->

<template>
  <div class="input-container">
    <!-- ACTION SECTION -->
    <q-input
      standout="bg-secondary text-white"
      bottom-slots
      v-model="textAction"
      label="Create Action"
      dense
      class="input-add"
    >
      <template v-slot:append>
        <q-btn round dense flat icon="add" @click="createNewAction(textAction)" />
      </template>
    </q-input>
    <template>
      <div id="action-select">
        <br />
        <multiselect
          v-model="selectAction"
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
        <br />
        <q-btn
          id="add-actions-btn"
          color="secondary"
          label="Add Action(s)"
          @click="addActionToComp"
        />
      </div>
    </template>
    <!-- STATE PORTION -->
    <q-input
      standout="bg-secondary text-white"
      bottom-slots
      v-model="textState"
      label="Create State"
      dense
      class="input-add"
    >
      <template v-slot:append>
        <q-btn round dense flat icon="add" @click="createNewState(textState)" />
      </template>
    </q-input>
    <template>
      <div id="state-select">
        <br />
        <multiselect
          v-model="selectState"
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
        <br />
        <q-btn
          id="add-actions-btn"
          color="secondary"
          label="Add State(s)"
          @click="addStateToComp"
        />
      </div>
    </template>
    <!-- PROPS PORTION -->
    <q-input
      standout="bg-secondary text-white"
      bottom-slots
      v-model="textProps"
      label="Create Props"
      dense
      class="input-add"
    >
      <template v-slot:append>
        <q-btn round dense flat icon="add" @click="createNewProp(textProps)" />
      </template>
    </q-input>
    <template>
      <div id="props-select">
        <br />
        <multiselect
          v-model="selectProps"
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
        <br />
        <q-btn
          id="add-props-btn"
          color="secondary"
          label="Add Prop(s)"
          @click="addPropsToComp"
        />
      </div>
    </template>
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
        return this.$store.state.selectedActions
      },
      set (value) {
        this.addActionSelected(value)
      }
    },
    selectState: {
      get () {
        return this.$store.state.selectedState
      },
      set (value) {
        this.addStateSelected(value)
      }
    },
    selectProps: {
      get () {
        return this.$store.state.selectedProps
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
    createNewAction (text) {
      if (!this.$store.state.userActions.includes(text)) {
        this.createAction(text)
        this.textAction = ''
      }
    },
    addActionToComp () {
      this.addActionToComponent(this.selectedActions)
      console.log(
        'activeComponent',
        this.routes[this.activeRoute].filter((comp) => {
          return comp.componentName === this.activeComponent
        })[0]
      )
    },
    createNewProp (text) {
      if (!this.$store.state.userProps.includes(text)) {
        this.createProp(text)
        this.textProps = ''
      }
    },
    addPropsToComp () {
      this.addPropsToComponent(this.selectedProps)
    },
    createNewState (text) {
      if (!this.$store.state.userState.includes(text)) {
        this.createState(text)
        this.textState = ''
      }
    },
    addStateToComp () {
      this.addStateToComponent(this.selectedState)
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
