<template>
  <q-dialog v-model="isDialogOpen">
    <q-card>
      <q-card-section>Custom dialog which should be tested</q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MyDialog',
  data() {
    return {
      isDialogOpen: false,
    };
  },
});
</script>
