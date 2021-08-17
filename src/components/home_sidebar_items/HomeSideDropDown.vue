<!--
Description:
  Displays dropdown for Components, Routes, and Vuex in Home Sidebar
-->

<template>
  <div class="q-pa-md" style="max-width: 350px">
    <q-list padding bordered class="rounded-borders drawer-menu">
      <q-expansion-item dense dense-toggle expand-separator label="Edit/Delete Components">
          <q-card>
            <div class="input-container" style='height: 100%'>
              <EditDeleteComponents />
            </div>
          </q-card>
      </q-expansion-item>
      <q-expansion-item dense dense-toggle expand-separator label="Routes">
        <q-card>
          <div class="input-container" style="height: 150px">
            <RouteDisplay />
            <br />
          </div>
        </q-card>
      </q-expansion-item>
      <q-expansion-item dense dense-toggle expand-separator label="Vuex">
        <q-card>
          <div class="input-container">
            <VuexForm />
          </div>
        </q-card>
      </q-expansion-item>
      <!----------------------->
    </q-list>
  </div>
</template>

<script>
import RouteDisplay from './RouteDisplay.vue'
import EditDeleteComponents from './EditDeleteComponents.vue'
import VuexForm from './VuexForm.vue'

export default {
  components: {
    RouteDisplay,
    VuexForm,
    EditDeleteComponents
  }
}
</script>

<style lang="stylus">

 .input-add {
   margin: 0em 1em 0em 1em;
 }

.input-container {
   margin-top: 1rem;
   background: $subsecondary;
   overflow-y: auto;
 }

.red {
   background: red;
 }
</style>
