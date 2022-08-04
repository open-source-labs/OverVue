<template>
  <section id="newFeatures">
    <h6 class="infoHeading">What's New?</h6>

    <p class="info-sub-heading">Drag and Drop for HTML Tags </p>
    <p class="infoContent">Choose HTML tags to include in the component. Click on a tag and drag to the desired
      position. </p>

    <p class="info-sub-heading">Component Customization</p>
    <p class="infoContent">Assign a class to the HTML tag. To change the color of the component, click on the palette
      icon
      <img style="vertical-align:middle" alt="save" src="../../../assets/tinypalatte.png" class="tut-image">
      in the top left corner of the component. To alter the size of the component, click and drag on the white
      squares surrounding the component. <br> To access advanced styling options, double click the purple HTML <img
        style="vertical-align:middle" alt="save" src="../../../assets/HTMLtag.png" class="html-tag"> button. Here, you
      may freely adjust the Purple HTML elements to your liking.
      <br> <img style="vertical-align:middle" alt="save" src="../../../assets/zindex-1.png" class="z-index">
      There is also an option to change the z-index.
    </p>

    <p class="info-sub-heading">Added Scoped Tags</p>
    <p class="infoContent">Style tags are automatically available as stylistic changes are made to the component. The
      tags can be found under the Code Snippet tab, towards the bottom.</p>

    <p class="info-sub-heading">Add class, id, and v-model Attributes </p>
    <p class="infoContent">There are multiple ways to add attributes.
      One method is to click on the Component Attributes drop down button. Specify the attribute by selecting either id or
      class. Click the <img style="vertical-align:middle" alt="save" src="../../../assets/plussign.png"
        class="tut-image"> or enter to apply the attribute. <br>
      Another method is to double click the purple HTML tag.<img style="vertical-align:middle" alt="save"
        src="../../../assets/HTMLtag.png" class="html-tag">
      Above the styling options are inputs for class, two-way
      binding,
      and inner text. Make sure to click on the submit icon <img style="vertical-align:middle" alt="save"
        src="../../../assets/inputButton.png" class="tut-image"> located inside the input to apply your changes.
    </p>

    <p class="info-sub-heading">Ability to Nest Components</p>
    <p class="infoContent">Create a new component. Navigate to the component you wish to be the parent, and add the
      child component to the drop down button of <img style="vertical-align:middle" alt="save"
        src="../../../assets/add:removeChild.png" class="z-index"> Add/remove children. </p>
    <q-btn class="tut-btn" color="secondary" id="advanced-btn" label="Advanced Functionality" @click="nextTab" />
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
  max-width: 300px;
}

#advanced-btn {
  margin-top: 30px !important;
  margin-bottom: 50px !important;
}
</style>
