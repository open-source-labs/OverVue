<template>
  <section id="new features">
    <h6 class="feature list">What's New?</h6>

    <p class="info-sub-heading">More Semantic HMTL</p>
    <p class="infoContent"></p>

    <p class="info-sub-heading">Component Customization</p>
    <p class="infoContent"></p>

    <p class="info-sub-heading">Drag and Drop for HTML Tags </p>
    <p class="infoContent"></p>

    <p class="info-sub-heading">Add class, id, and v-model Attributes </p>
    <p class="infoContent"></p>

    <p class="info-sub-heading">Added Scoped Tags</p>
    <p class="infoContent"></p>

    <p class="info-sub-heading">Ability to Nest Components</p>
    <p class="infoContent"></p>

  </section>
</template>

<style scoped lang="scss">
#basicFunctions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px;
}

.tutorialHeading {
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
