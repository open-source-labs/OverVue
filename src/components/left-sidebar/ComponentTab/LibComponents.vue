<template>
  <div class="">
    <q-btn-dropdown
      class="selectLib"
      color="pink"
      label="Select Element+ Component"
      dropdown-icon="change_history"
    >
      <q-list class="dropButton">
        <q-item clickable v-close-popup @click="pickComponent('e-alert')">
          <q-item-section>
            Alert
            <q-tooltip
              anchor="center right"
              self="center left"
              :offset="[10, 10]"
            >
              <img alt="slider" src="../../../assets/alert.png" class="alert" />
              <q-icon name="keyboard_arrow_right" />
            </q-tooltip>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickComponent('e-button')">
          <q-item-section>
            button
            <q-tooltip
              anchor="center right"
              self="center left"
              :offset="[10, 10]"
            >
              <img
                alt="button"
                src="../../../assets/button.png"
                class="buttongroup"
              />
              <q-icon name="keyboard_arrow_right" />
            </q-tooltip>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickComponent('e-badge')">
          <q-item-section>
            Badge
            <q-tooltip
              anchor="center right"
              self="center left"
              :offset="[10, 10]"
            >
              <img alt="badge" src="../../../assets/badge.png" class="badge" />
              <q-icon name="keyboard_arrow_right" />
            </q-tooltip>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickComponent('e-dropdown')">
          <q-item-section>
            Dropdown
            <q-tooltip
              anchor="center right"
              self="center left"
              :offset="[10, 10]"
            >
              <img
                alt="slider"
                src="../../../assets/dropdown.png"
                class="dropdown"
              />
              <q-icon name="keyboard_arrow_right" />
            </q-tooltip>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickComponent('e-input')">
          <q-item-section>
            InputBox
            <q-tooltip
              anchor="center right"
              self="center left"
              :offset="[10, 10]"
            >
              <img
                alt="inputbox"
                src="../../../assets/inputbox.png"
                class="input-box"
              />
              <q-icon name="keyboard_arrow_right" />
            </q-tooltip>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickComponent('e-link')">
          <q-item-section>
            Link
            <q-tooltip
              anchor="center right"
              self="center left"
              :offset="[10, 10]"
            >
              <img
                alt="inputbox"
                src="../../../assets/link.png"
                class="input-box"
              />
              <q-icon name="keyboard_arrow_right" />
            </q-tooltip>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickComponent('e-card')">
          <q-item-section>
            Card
            <q-tooltip
              anchor="center right"
              self="center left"
              :offset="[10, 10]"
            >
              <img alt="card" src="../../../assets/card.png" class="card" />
              <q-icon name="keyboard_arrow_right" />
            </q-tooltip>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickComponent('e-form')">
          <q-item-section>
            Form
            <q-tooltip
              anchor="center right"
              self="center left"
              :offset="[10, 10]"
            >
              <img alt="form" src="../../../assets/form.png" class="form" />
              <q-icon name="keyboard_arrow_right" />
            </q-tooltip>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickComponent('e-checkbox')">
          <q-item-section>
            Checkbox
            <q-tooltip
              anchor="center right"
              self="center left"
              :offset="[10, 10]"
            >
              <img
                alt="checkbox"
                src="../../../assets/checkbox.png"
                class="checkbox"
              />
              <q-icon name="keyboard_arrow_right" />
            </q-tooltip>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-close-popup
          @click="pickComponent('e-checkbox-button')"
        >
          <q-item-section>
            Checkbox Button
            <q-tooltip
              anchor="center right"
              self="center left"
              :offset="[10, 10]"
            >
              <img
                alt="checkboxbutton"
                src="../../../assets/checkboxbutton.png"
                class="checkboxbutton"
              />
              <q-icon name="keyboard_arrow_right" />
            </q-tooltip>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickComponent('e-date-picker')">
          <q-item-section>
            Date Picker
            <q-tooltip
              anchor="center right"
              self="center left"
              :offset="[10, 10]"
            >
              <img
                alt="datepicker"
                src="../../../assets/datepicker.png"
                class="datepicker"
              />
              <q-icon name="keyboard_arrow_right" />
            </q-tooltip>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="pickComponent('e-slider')">
          <q-item-section>
            Slider
            <q-tooltip
              anchor="center right"
              self="center left"
              :offset="[10, 10]"
            >
              <img
                alt="slider"
                src="../../../assets/slider.png"
                class="slider"
              />
              <q-icon name="keyboard_arrow_right" />
            </q-tooltip>
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="pickComponent('e-tag')">
          <q-item-section>
            Tag
            <q-tooltip
              anchor="center right"
              self="center left"
              :offset="[10, 10]"
            >
              <img alt="tag" src="../../../assets/tag.png" class="tag" />
              <q-icon name="keyboard_arrow_right" />
            </q-tooltip>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script>
export default { name: "LibComponents" };
</script>

<script setup>
import { useStore } from "vuex";
import { computed } from "vue";
const store = useStore();

const changeLibComponentDisplay = () =>
  store.dispatch("changeLibComponentDisplay");
const computedLibraries = computed(() => store.state.computedLibraries);

const addLibComponents = (payload) =>
  store.dispatch("addLibComponents", payload);

const pickComponent = (componentName) => {
  const payload = {};
  payload[componentName] = ["fa-brands fa-elementor fa-xl"];
  addLibComponents(payload);
};
</script>

// OLD SCRIPT CODE USING OPTIONS API
<!-- <script>
import { mapState, mapActions } from "vuex";
import { pauseTracking } from "@vue/reactivity";
name: "LibComponents",
  components: {
  },
  methods:{
    ...mapActions([

    'changeLibComponentDisplay',
    'addLibComponents'

    ]),
    pickComponent(componentName){
      const payload = {

      };
      payload[componentName] = ['fa-brands fa-elementor fa-xl']
      this.addLibComponents(payload);

    }
  },
  computed: {
    ...mapState([
    'importLibraries'
    ]),
}
</script> -->

<style>
.demo-button {
  margin-left: 50px;
}

.demo-input {
  border: 1px solid white;
}

.input-box {
  width: 300px;
}

.card {
  width: 300px;
}

.form {
  width: 300px;
}

.checkbox {
  width: 130px;
}

.checkboxbutton {
  width: 500px;
}

.datepicker {
  width: 300px;
}

.badge {
  width: 500px;
}

.alert {
  width: 600px;
}

.slider {
  width: 600px;
}

.dropButton {
  overflow-y: scroll;
  height: 300px;
}

.buttongroup {
  width: 600px;
}

.selectLib {
  margin-top: 20px;
  width: 260px;
  height: 45px;
}
</style>
