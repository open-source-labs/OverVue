<template>
  <div>
    codsnypets
    <PrismEditor
      language="js"
      lineNumbers="true"
    />
  </div>
</template>

<script>
import PrismEditor from 'vue-prism-editor'
import 'prismjs'
import 'prismjs/themes/prism.css'

export default {
  components: {
    PrismEditor
  }
}
</script>
