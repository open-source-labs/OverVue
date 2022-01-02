<!-- this will display the active/selected component's state. Functionality will include being able to add more state and delete state -->
<!-- Functions:
- display all the component's state as a list
  - maybe with a delete button similar to props right now
- dropdown to add more state to component (multiselect)
- submit button (like props)
-->

<template>
  <div>
    <div id="action-select">
      <VueMultiselect
        v-model="selectAction"
        class="multiselect"
        placeholder="Select Action for Component"
        :multiple="true"
        :close-on-select="false"
        :max-height="180"
        :option-height="20"
        open-direction="top"
        :options="actionOptions"
        :searchable="false"
        @search-change="stopDelete($event)"
      >
        <span slot="noResult">No actions found.</span>
      </VueMultiselect>
      <br/>
      <q-btn
          v-if="selectAction.length"
          id="add-actions-btn"
          class="add-btn"
          color="secondary"
          label="Map Action(s)"
          @click="addActionToComp"
      />
    </div>
    <p v-if="!this.activeComponentObj.actions.length">
      No actions in component
    </p>
    <a
      v-else
      v-for="action in this.activeComponentData.actions"
      :key="action"
    >
      <q-list class="list-item" dense bordered separator>
        <q-item clickable v-ripple class="list-item">
          <q-item-section>
            <div class="component-container">
              <div class="component-info">
                  {{action}}
              </div>
              <q-btn round flat icon="highlight_off" v-on:click.stop="deleteAction(action)" />
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
import VueMultiselect from 'vue-multiselect';

export default {
  name: "ComponentActions",
  components: {
    VueMultiselect
  },
  computed: {
    ...mapState([
      "activeComponentObj",
      "selectedActions",
      "userActions",
    ]),
    activeComponentData () {
      return this.activeComponentObj
    },
    compObj: {
      get() {
        return this.activeComponentObj;
      }
    },
    actionOptions () {
      return this.userActions
    },
    selectAction: {
      get () {
        return this.selectedActions
      },
      set (value) {
        this.addActionSelected(value)
      }
    }
  },
  methods: {
    ...mapActions([
      'addActionSelected',
      'addActionToComponent',
      'deleteActionFromComponent',
    ]),
    // Prevent Delete on changes to searchable multiselect
    stopDelete (e) {
      if (e.code === 'Backspce') e.stopPropogation();
      // console.log(e);
    },
    // adds an action to the currently selected component
    addActionToComp () {
      this.addActionToComponent(this.selectedActions);
    },
    // delete selected action from active component
    deleteAction (action) {
      this.deleteActionFromComponent(action);
      // console.log(this.activeComponentObj);
    },

  }
}
</script>
