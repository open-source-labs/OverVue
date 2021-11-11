<template>
  <div>
    <q-input
      @keyup.enter.native="createNewProp(textProps)"
      standout="bg-secondary text-white"
      bottom-slots
      v-model="textProps"
      label="Create Prop"
      dense
      class="input-add"
      v-on:keyup.delete.stop
    >
      <template v-slot:append>
        <q-btn round dense flat icon="add" @click="createNewProp(textProps)" />
      </template>
    </q-input>
    
    <div id="props-select">
      <multiselect
        v-model="selectProps"
        class="multiselect"
        placeholder="Select Props for Component"
        :multiple="true"
        :close-on-select="false"
        :max-height="180"
        :option-height="20"
        open-direction="top"
        :options="propsOptions"
        :searchable="false"
        @search-change="stopDelete($event)"
      >
        <span slot="noResult">No props found.</span>
      </multiselect>
    </div>
    <br/>
    <div>
      <q-btn
        v-if="selectProps.length"
        id="add-props-btn"
        class="add-btn"
        color="secondary"
        label="Add Prop(s)"
        @click="addPropsToComp"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Multiselect from 'vue-multiselect'

export default {
  name: 'addProps',
  components: {
    Multiselect
  },
  data () {
    return {
      textProps: ''
    }
  },

  computed: {
    ...mapState([
      'selectedProps',
      'userProps',
    ]),
    propsOptions () {
      return this.userProps
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
      'createProp',
      'addPropsSelected',
      'addPropsToComponent'
    ]),
    // Prevent Delete on changes to searchable multiselect
    stopDelete (e) {
      if (e.code === 'Backspace') e.stopPropogation()
      console.log(e)
    },

    // Create's a new prop that will be stored in the userProps array within store, and it will be added to the props drop-down menu
    createNewProp (text) {
      if (!this.userProps.includes(text) && text) {
        this.createProp(text)
        this.textProps = ''
      }
    },

    addPropsToComp () {
      this.addPropsToComponent(this.selectedProps)
    }
  }
}
</script>
