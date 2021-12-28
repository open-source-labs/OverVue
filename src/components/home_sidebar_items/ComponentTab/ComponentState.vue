<!-- this will display the active/selected component's state. Functionality will include being able to add more state and delete state -->
<!-- Functions:
- display all the component's state as a list
  - maybe with a delete button similar to props right now
- dropdown to add more state to component (multiselect)
- submit button (like props)
-->

<template>
  <div>
    <div id="state-select">
      <multiselect
        v-model="selectState"
        class="multiselect"
        placeholder="Select State for Component"
        :multiple="true"
        :close-on-select="false"
        :max-height="180"
        :option-height="20"
        open-direction="top"
        :options="stateOptions"
        :searchable="false"
        @search-change="stopDelete($event)"
      >
        <span slot="noResult">No state found.</span>
      </multiselect>
      <br/>
      <q-btn
          v-if="selectState.length"
          id="add-state-btn"
          class="add-btn"
          color="secondary"
          label="Map State"
          @click="addStateToComp"
      />
    </div>
    <p v-if="!this.activeComponentObj.state.length">
      No state in component
    </p>
    <a
      v-else
      v-for="state in this.activeComponentData.state"
      :key="state"
    >
      <q-list class="list-item" dense bordered separator>
        <q-item clickable v-ripple class="list-item">
          <q-item-section>
            <div class="component-container">
              <div class="component-info">
                  {{state}}
              </div>
              <q-btn round flat icon="highlight_off" v-on:click.stop="deleteState(state)" />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </a>
    <br/>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
// import Multiselect from 'vue-multiselect';

export default {
  name: "ComponentState",
  components: {
    // Multiselect
  },
  computed: {
    ...mapState([
      "activeComponentObj",
      "selectedState",
      "userState",
    ]),
    activeComponentData () {
      return this.activeComponentObj
    },
    compObj: {
      get() {
        return this.activeComponentObj;
      }
    },
    stateOptions () {
      return this.userState
    },
    selectState: {
      get () {
        return this.selectedState
      },
      set (value) {
        this.addStateSelected(value)
      }
    }
  },
  methods: {
    ...mapActions([
      'addStateSelected',
      'addStateToComponent',
      'deleteStateFromComponent',
    ]),
    // Prevent Delete on changes to searchable multiselet
    stopDelete (e) {
      if (e.code === 'Backspce') e.stopPropogation();
      // console.log(e);
    },
    // adds a state to the currently selected component
    addStateToComp () {
      this.addStateToComponent(this.selectedState);
    },
    // delete selected state from active component
    deleteState (state) {
      this.deleteStateFromComponent(state);
      // console.log(this.activeComponentObj);
    },

  }
}
</script>
