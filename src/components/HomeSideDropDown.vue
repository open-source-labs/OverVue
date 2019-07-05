<template>
  <div class="q-pa-md" style="max-width: 350px">
    <q-list padding bordered class="rounded-borders">
      <q-expansion-item dense dense-toggle expand-separator label="Components">
        <q-card>
          <q-card-section>
            <div class="input-container">
              <q-input
                standout="bg-teal text-white"
                bottom-slots
                v-model="text"
                label="Add Component"
                :dense="dense"
                class="input-add"
              >
                <template v-slot:append>
                  <q-btn round dense flat icon="add" />
                </template>
              </q-input>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item dense dense-toggle expand-separator label="Routes">
        <q-card>
          <q-card-section>
            <div class="input-container">
              <q-input
                standout="bg-teal text-white"
                bottom-slots
                v-model="text"
                label="Add Route"
                :dense="dense"
                class="input-add"
              >
                <template v-slot:append>
                  <q-btn round dense flat icon="add" />
                </template>
              </q-input>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item dense dense-toggle expand-separator label="Vuex" header-class="text-purple">
        <q-card>
          <q-card-section>
            <div class="input-container">
              <q-input
                standout="bg-teal text-white"
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
                standout="bg-teal text-white"
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
                standout="bg-teal text-white"
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
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<style lang="stylus" scoped>
.input-add {
    margin: 0em 1em 0em 1em;
  }
.input-container {
    margin-top: 1rem;
  }

</style>
