<!--
  LOCATION IN APP:
  [left sidebar] STORE

  FUNCTIONALITY:
  - Displays user-added state variables & store actions for incorporation in Code Preview
  - Enables user to custom state variables & store actions
-->

<template>
  <div class="container">
    <q-card id="store-cards">
      <!-- tabs -->
      <q-tabs
        v-model="tab"
        dense
        class="bg-subaccent text-white"
        active-color="secondary"
        indicator-color="secondary"
        align="left"
      >
        <q-tab name="state" label="State" id="label-text" />
        <q-tab name="actions" label="Actions" id="label-text" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated class="html-bg text-white">
        <!-- state tab -->
        <q-tab-panel name="state">
          <!-- input field -->
          <q-input
            @keyup.enter="createNewState(textState)"
            color="white"
            dark
            outlined
            v-model="textState"
            label="Add state variable to store"
            dense
            class="input-add"
            no-error-icon
            reactive-rules
            :rules="[
              (val) =>
                !userState.includes(val) ||
                'A state variable with this label already exists',
            ]"
            @keyup.delete.stop
          >
            <template v-slot:append>
              <q-btn flat icon="add" @click="createNewState(textState)" />
            </template>
          </q-input>

          <!-- state options list -->
          <q-list
            class="list-item"
            v-for="state in stateOptions"
            :key="state"
            dense
            bordered
            separator
          >
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
                    class="inner-button"
                    v-on:click.stop="deleteState(state)"
                  />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>

        <!-- actions tab -->
        <q-tab-panel name="actions">
          <!-- input field -->
          <q-input
            @keyup.enter="createNewAction(textAction)"
            color="menutext"
            dark
            outlined
            bottom-slots
            v-model="textAction"
            label="Add action to store"
            dense
            class="input-add"
            @keyup.delete.stop
            no-error-icon
            reactive-rules
            :rules="[
              (val) =>
                !userActions.includes(val) ||
                'An action with this label already exists',
            ]"
          >
            <template v-slot:append>
              <q-btn flat icon="add" @click="createNewAction(textAction)" />
            </template>
          </q-input>

          <!-- action options list -->
          <q-list
            class="list-item"
            v-for="action in actionOptions"
            :key="action"
            dense
            bordered
            separator
          >
            <q-item clickable v-ripple class="list-item">
              <q-item-section>
                <div class="component-container">
                  <div class="component-info">
                    {{ action }}
                  </div>
                  <q-btn
                    round
                    flat
                    icon="highlight_off"
                    v-on:click.stop="deleteAction(action)"
                  />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script setup lang="ts">
/* IMPORTS */
import { computed, ref } from "vue";
import { useStore } from "../../../stores/main";

/* DATA */
const tab = ref("state");
const textAction = ref("");
const textState = ref("");

/* COMPUTED VALUES */
const store = useStore();
const userActions = computed(() => store.userActions);
const userState = computed(() => store.userState);
const actionOptions = userActions;
const stateOptions = userState;

/* STORE ACTIONS */
const createAction: typeof store.createAction = (payload) =>
  store.createAction(payload);
const createState: typeof store.createState = (payload) =>
  store.createState(payload);
const deleteUserActions: typeof store.deleteUserActions = (payload) =>
  store.deleteUserActions(payload);
const deleteUserState: typeof store.deleteUserState = (payload) =>
  store.deleteUserState(payload);

/* METHODS */

// creates new state variable
const createNewState = (text: string) => {
  if (![...userState.value].includes(text) && text) {
    createState(text);
    textState.value = "";
  }
};

// deletes state variable
const deleteState = (state: string) => {
  deleteUserState(state);
};

// creates new action
const createNewAction = (text: string) => {
  if (![...userActions.value].includes(text) && text) {
    createAction(text);
    textAction.value = "";
  }
};

// deletes action
const deleteAction = (action: string) => {
  // if delete request comes in, send to actions
  deleteUserActions(action);
};
</script>

<style lang="scss" scoped>
.list-item {
  border-radius: 10px;
}

i {
  font-size: 11px;
}

// styling for the entire Dashboard
.q-footer {
  transition-timing-function: ease-in;
  transition: 0.2s;
  background: $subsecondary;
}

// changes the Dashboard toolbar height
.q-toolbar {
  min-height: 25px !important;
  padding: 0 6px !important;
}

.q-toolbar__title {
  font-size: 14px;
  text-transform: uppercase;
  padding: 5px;
}

// this class selector does not change anything
.q-tab__label {
  // font-size not changing
  font-size: 10px !important;
  line-height: 1.718em;
  font-weight: 500;
}

// changes the tab label styling
#label-text {
  font-size: 4px !important;
  text-transform: capitalize;
}

.q-tab-panel {
  height: 100%;
  // matches the code editor bg
  background: $subprimary;
}

// changes the length of the tab panels
.q-tab-panels {
  height: 100%;
  padding: 0 !important;
}

.q-tabs {
  background: #11120f;
}

#store-cards {
  height: 80%;
  border-radius: 0;
  background: #737578;
}

.html-bg {
  // give html background color of grey
  background-color: $subprimary;
}

.component-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>

