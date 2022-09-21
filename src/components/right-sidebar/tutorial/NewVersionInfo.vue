<template>
  <section id="newFeatures">
    <h6 class="infoHeading">What's New in OverVue 8.0?</h6>

    <p class="info-sub-heading">Improved Prototyping with Snap to Grid Positioning</p>
    
    <p class="infoContent">Level up your prototyping with snap to grid positioning and component sizing that is exported as CSS grid styling in exported SFC's. Overvue 8.0 also fixes bugs that led to conditional application of color and position styling in previous versions. Click on these buttons below and a menu pull down show appear to change the grid density for either the width or height. </p>
    <img src="../../../assets/snaptogrid.jpg" class="tut-image"> 
    <p class="info-sub-heading">Augmented Component Creation with Element+ Component Library</p>
    <p class="infoContent">Take advantage of the popular, Vue 3.0 compatible component library, Element+. Manipulate these components in app, and rest easy knowing exported code includes both the library elements, and their necessary dependencies.</p>

    <p class="info-sub-heading">OAuth</p>
    <p class="infoContent"> You can now opt-in to add boilerplate code for OAuth with Google or Github to your project. In the exported code, take advantage of Firebase to seemlessly configure OAuth for your organization.
    </p>
    <p class="info-sub-heading">Testing</p>
    <p class="infoContent">All exported projects now come with boilerplate configuration files and unit test templates so you can easily implement testing with Jest and Vue Test Utils.</p>
    <q-btn class="tut-btn" color="secondary" id="advanced-btn" label="Investigate Advanced Functionality" @click="nextTab" />
    <q-btn class="tut-btn closeAction" label="Start Building Now" @click="toggleTutorial" />
  </section>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  emits: ['nextTab'],
  methods: {
    ...mapActions(["toggleTutorial"]),
    nextTab() {
      this.$emit('nextTab')
    }
  }
}
</script>

<style scoped lang="scss">
#newFeatures {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px;
}

.infoHeading {
  margin: .75rem;
  font-size: 2rem;
  padding-top: 15px;
}

.info-sub-heading {
  align-self: flex-start;
  font-size: 1.4rem;
  margin: .75rem;
  margin-bottom: 0px;
}

.html-tag {
  margin: 4px;
  max-width: 150px;
}

.z-index {
  margin: 4px;
  border: 1px solid $primary;
  max-width: 200px;
}

.infoContent {
  margin: .75rem;
  align-self: flex-start;
  font-size: 1rem;
}

.tut-btn {
  margin: 0.75rem;
  width: 50%;
  min-height: 42px;
  height: auto;
}

.tut-image {
  margin: 4px;
}

.tut-screenshot {
  margin: 4px;
  border: 1px solid $primary;
  max-width: 200px;
}

#advanced-btn {
  margin-top: 30px !important;
  margin-bottom: 50px !important;
}
</style>
