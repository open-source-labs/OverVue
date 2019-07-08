<template>
  <div class="input-container">
    <q-input
      standout="bg-secondary text-white"
      bottom-slots
      v-model="text"
      label="Add Vuex"
      :dense="dense"
      class="input-add"
    >
      <template v-slot:append>
        <q-btn round dense flat icon="add" />
      </template>
    </q-input>
    <q-input
      standout="bg-secondary text-white"
      bottom-slots
      v-model="text"
      label="Add Action"
      :dense="dense"
      class="input-add"
    >
      <template v-slot:append>
        <q-btn round dense flat icon="add" />
      </template>
    </q-input>
    <q-input
      standout="bg-secondary text-white"
      bottom-slots
      v-model="text"
      label="Add Mutation"
      :dense="dense"
      class="input-add"
    >
      <template v-slot:append>
        <q-btn round dense flat icon="add" />
      </template>
    </q-input>
  </div>
</template>

<style lang="stylus" scoped>
.input-add {
  margin: 0em 1em 0em 1em;
}
</style>
