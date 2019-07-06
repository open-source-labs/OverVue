<template>
  <div class="snip">
    <q-editor
      v-model="editor"
      :definitions="{
        bold: {label: 'Bold', icon: null, tip: 'My bold tooltip'}
      }"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      editor: 'Here we are overriding the <b>bold</b> command to include a label instead of an icon and also changing its tooltip.'
    }
  }
}
</script>

<style>
.snip{
  height: 150px;
}
</style>
