<!-- this will display the active/selected component's state. Functionality will include being able to add more state and delete state -->
<!-- Functions:
- display all the component's state as a list
  - maybe with a delete button similar to props right now
- dropdown to add more state to component (multiselect)
- submit button (like props)
-->

<template>
  <div class="selection-container">
    <div id="state-select">
      <VueMultiselect
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
      </VueMultiselect>
      <br />
      <q-btn
        v-if="selectState.length"
        id="add-state-btn"
        class="add-btn"
        color="secondary"
        label="Map State"
        @click="addStateToComp"
      />
    </div>
    <p v-if="!this.componentMap[this.activeComponent].state.length">
      No state in component
    </p>
    <a
      v-else
      v-for="state in this.componentMap[this.activeComponent].state"
      :key="state"
    >
      <q-list class="list-item" dense bordered separator>
        <q-item clickable v-ripple class="list-item">
          <q-item-section>
            <div class="component-container">
              <div class="component-info">
                {{ state }}
              </div>
              <q-btn
                round
                flat
                icon="highlight_off"
                v-on:click.stop="deleteState(state)"
              />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </a>
    <br />
  </div>
</template>

<script>
export default { name: "StateSubMenu" };
</script>

<script setup>
import VueMultiselect from "vue-multiselect";
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();

const selectedState = computed(() => store.state.selectedState);
const userState = computed(() => store.state.userState);
const componentMap = computed(() => store.state.componentMap);
const activeComponent = computed(() => store.state.activeComponent);

const stateOptions = userState.value;
const selectState = computed({
  get() {
    return [...selectedState.value];
  },
  set(value) {
    addStateSelected(value);
  },
});

const addStateSelected = (payload) =>
  store.dispatch("addStateSelected", payload);
const addStateToComponent = (payload) =>
  store.dispatch("addStateToComponent", payload);
const deleteStateFromComponent = (payload) =>
  store.dispatch("deleteStateFromComponent", payload);

const stopDelete = (e) => {
  if (e.code === "Backspace") e.stopPropogation();
};

const addStateToComp = () => addStateToComponent([...selectedState.value]);

const deleteState = (state) => deleteStateFromComponent(state);
</script>

<!-- <script>
import { mapState, mapActions } from "vuex";
import VueMultiselect from "vue-multiselect";

export default {
  name: "StateSubMenu",
  components: {
    VueMultiselect,
  },
  computed: {
    ...mapState([
      "selectedState",
      "userState",
      "componentMap",
      "activeComponent",
    ]),

    stateOptions() {
      return this.userState;
    },
    selectState: {
      get() {
        return this.selectedState;
      },
      set(value) {
        this.addStateSelected(value);
      },
    },
  },
  methods: {
    ...mapActions([
      "addStateSelected",
      "addStateToComponent",
      "deleteStateFromComponent",
    ]),
    // Prevent Delete on changes to searchable multiselet
    stopDelete(e) {
      if (e.code === "Backspace") e.stopPropogation();
    },
    // adds a state to the currently selected component
    addStateToComp() {
      this.addStateToComponent(this.selectedState);
    },
    // delete selected state from active component
    deleteState(state) {
      this.deleteStateFromComponent(state);
    },
  },
};
</script> -->

<style lang="scss" scoped>
.selection-container {
  padding: 30px 0;
}

.component-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
