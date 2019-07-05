<template>
  <q-card>
    <q-tabs
      v-model="tab"
      dense
      class="text-white"
      active-color="secondary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="tree" label="Tree" />
      <q-tab name="code" label="Code" />
      <q-tab name="movies" label="Something" />
    </q-tabs>

    <q-separator />
  <q-list>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="Tree">
        <div class="text-h6">Tree</div>Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>

      <q-tab-panel name="Code">
        <div class="text-h6">Code</div>Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>

      <q-tab-panel name="Something">
        <div class="text-h6">Something</div>Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>
    </q-tab-panels>
  </q-list>
  </q-card>
</template>

<script>
export default {
  data () {
    return {
      tab: 'tree'
    }
  }
}
</script>
