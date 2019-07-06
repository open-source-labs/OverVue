<template>
  <div class="home-sidebar">
    <a
      v-for="componentData in activeRouteDisplay"
      :key="componentData.componentName"
      v-on:click="onActivated(componentData)"
    >
      <q-list dense bordered separator>
        <q-item clickable v-ripple>
          <q-item-section>
            <div class="component-container">
              <div class="component-info">
                <q-item-label overline class="component">{{componentData.componentName}}</q-item-label>
                <q-item-label>Child Components Here</q-item-label>
                <!-- {{componentData.componentName}} -->
              </div>
              <q-btn round flat icon="delete_forever" />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </a>
  </div>
</template>

<script>
/**
 * TODO: Needs functionality to delete component, and (maybe) show child components
 */
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState(['routes', 'activeRoute', 'activeComponent']),
    activeRouteDisplay () {
      let component = this.routes[this.activeRoute]
      return component
    },
    activeComponentData () {
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

<style>
/* modifies entire container */
.home-sidebar {
  margin: 1rem;
  padding-bottom: 1rem;
  border-radius: 5px;
}
/* modifies top label */
.component {
  text-transform: uppercase;
}
/* modifies each list element */
.q-list {
  margin-bottom: 0.5rem;
  border-radius: 5px;
}
/* modifies content in list element */
.component-container {
  display: flex;
  justify-content: space-between;
}
</style>
