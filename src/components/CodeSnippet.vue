<template>
  <div>
    <!-- <input type="checkbox" v-model="lineNumbers"> Linenumbers -->
    <prism-editor v-model="code" language="js" :line-numbers="lineNumbers" class="code-editor" :style="{ height: `${height}vh` }"/>
  </div>
</template>

<script>
import PrismEditor from 'vue-prism-editor'
import 'prismjs'
import 'prismjs/themes/prism-okaidia.css'
import 'vue-prism-editor/dist/VuePrismEditor.css'

export default {
  data () {
    return {
      code: 'console.log(Hellor world);\naww yis\nsome boilerplate here',
      lineNumbers: true,
      height: null
    }
  },
  components: {
    PrismEditor
  },
  methods: {
    getWindowHeight (e) {
      let minHeight = (window.outerHeight < 900) ? 22 : (window.outerHeight < 1035) ? 24 : 27.5
      this.height = minHeight
    }
  },
  mounted () {
    this.$nextTick(() => {
      window.addEventListener('resize', this.getWindowHeight)

      this.getWindowHeight()
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.getWindowHeight)
  }
}
</script>

<style lang="stylus" scoped>
.code-editor {
}
</style>
