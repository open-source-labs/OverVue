<template>
  <div class="q-pa-md" style="max-width: 350px">
    <q-list padding bordered class="rounded-borders drawer-menu">
      <q-expansion-item dense dense-toggle expand-separator label="Components">
        <q-card>
          <q-card-section>
            <div class="input-container">
              <ComponentList />
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-expansion-item dense dense-toggle expand-separator label="Routes">
        <q-card>
          <q-card-section>
            <div class="input-container">
              <RouteDisplay />
              <br />
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item dense dense-toggle expand-separator label="Vuex" header-class="text-purple">
        <q-card>
          <q-card-section>
            <div class="input-container">
              <VuexForm />
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</template>
<script>
import RouteDisplay from "../components/RouteDisplay";
import ComponentList from "./HomeSideDropDownItems/ComponentList";
import VuexForm from "./HomeSideDropDownItems/VuexForm";

export default {
  components: {
    RouteDisplay,
    VuexForm,
    ComponentList
  }
};
</script>

<style lang="stylus">
.input-add {
  margin: 0em 1em 0em 1em;
}

.input-container {
  margin-top: 1rem;
  background: $subsecondary;
}

.red {
  background: red;
}
</style>
