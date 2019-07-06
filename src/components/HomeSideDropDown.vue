<template>
  <div class="q-pa-md" style="max-width: 350px">
    <q-list padding bordered class="rounded-borders">
      <q-expansion-item dense dense-toggle expand-separator label="Components">
        <q-card>
          <q-card-section>
            <div class="input-container">
              <!--
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
              -->
              <a v-for="componentData in activeRouteDisplay"
                :key="componentData.componentName"
                 v-on:click="onActivated(componentData)"
                >
   <q-list bordered separator>
      <q-item clickable v-ripple>
        <q-item-section>{{componentData.componentName}}</q-item-section>

      </q-item>

    </q-list>
    </a>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item dense dense-toggle expand-separator label="Routes">
        <q-card>
          <q-card-section>
            <div class="input-container">
              <RouteDisplay />
              <br>
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
<script>
import RouteDisplay from '../components/RouteDisplay'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    RouteDisplay
  },
  computed: {
    ...mapState(['routes', 'activeRoute', 'activeComponent', 'componentMap']),
    // used in VueDraggableResizeable component
    activeRouteDisplay () {
      // console.log('active route array method', this.routes[this.activeRoute])
      let component = this.routes[this.activeRoute]
      // console.log('component:', component)
      return component
    },
    activeComponentData () {
      // find out what this does
      return this.activeRouteDisplay.filter(componentData => {
        return componentData.componentName === this.activeComponent
      })[0]
    }
  },
  methods: {
    ...mapActions(['setActiveComponent']),
    onActivated (componentData) {
      this.setActiveComponent(componentData.componentName)
      this.activeComponentData.isActive = true
      console.log('this.activeComponent', this.activeComponent)
    }
  }
}
</script>

<style lang="stylus" scoped>
.input-add {
    margin: 0em 1em 0em 1em;
  }
.input-container {
    margin-top: 1rem;
  }

</style>
