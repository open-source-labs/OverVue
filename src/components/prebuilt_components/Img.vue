<template>
<div>
  </div>
</template>

<script>

import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'

export default {
  name: 'Buttons',
  components: {
    VueDraggableResizable
  },
pu// Vue calls the data function as part of creating a new component instance. data should return an object. Vue will then store on the component instance as $data.
  data() {
    return ({})
  }
}
</script>