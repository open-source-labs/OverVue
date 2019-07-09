<template>
  <div>
    <!-- <input type="checkbox" v-model="lineNumbers"> Linenumbers -->
    {{ `${activeComponent}.vue` }}
    <prism-editor
      v-model="code"
      language="js"
      :line-numbers="lineNumbers"
      class="code-editor"
      :style="{ height: `${height}vh`}"
      readonly="true"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PrismEditor from 'vue-prism-editor'
import 'prismjs'
import 'prismjs/themes/prism-okaidia.css'
import 'vue-prism-editor/dist/VuePrismEditor.css'

export default {
  data () {
    return {
      code: `Select a component`,
      lineNumbers: true,
      height: null
    }
  },
  components: {
    PrismEditor
  },
  computed: {
    // needs access to current component aka activeComponent
    ...mapState(['componentMap', 'activeComponent'])
  },
  methods: {
    getWindowHeight (e) {
      let minHeight =
        window.outerHeight < 900 ? 22 : window.outerHeight < 1035 ? 24 : 27.5
      this.height = minHeight
    },
    // calls createTemplate and createBoiler to generate snippet
    createCodeSnippet (componentName, children) {
      let result = `${this.createTemplate(componentName, children)}${this.createBoiler(componentName, children)}`
      console.log(`createCodeSnippet result: ${result}`)
      return result
    },
    createTemplate (componentName, children) {
      let output = ``
      // let htmlArr = this.componentMap[compName].htmlList;
      output += ` <div>\n`
      children.forEach(name => {
        output += `    <${name}>\n    </${name}>\n`
      })
      let templateTagStr = this.writeTemplateTag(componentName)
      return `<template>\n ${output}${templateTagStr}  </div>\n</template>`
    },
    writeTemplateTag (componentName) {
      console.log('writeTemplateTag invoked!')
      // create reference object
      const htmlElementMap = {
        div: ['<div>', '</div>'],
        button: ['<button>', '</button>'],
        form: ['<form>', '</form>'],
        img: ['<img>', ''],
        link: ['<a href="#"/>', ''],
        list: ['<li>', '</li>'],
        paragraph: ['<p>', '</p>'],
        'list-ol': ['<ol>', '</ol>'],
        'list-ul': ['<ul>', '</ul>'],
        input: ['<input />', ''],
        navbar: ['<nav>', '</nav>']
      }
      // loop to iterate through compName arr
      let htmlArr = this.componentMap[componentName].htmlList
      let outputStr = ``
      for (let el of htmlArr) {
        outputStr += `    `
        outputStr += htmlElementMap[el.text][0]
        outputStr += htmlElementMap[el.text][1]
        outputStr += `  \n`
      }
      console.log(`outputStr from writeTemplateTag: ${outputStr}`)
      return outputStr
    },
    createBoiler (componentName, children) {
      let str = ''
      children.forEach(name => {
        str += `import ${name} from '@/components/${name}.vue';\n`
      })
      let childrenComponentNames = ''
      children.forEach(name => {
        childrenComponentNames += `    ${name},\n`
      })
      return `\n\n<script>\n${str}\nexport default {\n  name: '${componentName}',\n  components: {\n${childrenComponentNames}  }\n};\n<\/script>\n\n<style scoped>\n</style>`
    }
  },
  mounted () {
    // https://vuejs.org/v2/api/#Vue-nextTick
    // kinda like a promise, used for the window resize
    this.$nextTick(() => {
      window.addEventListener('resize', this.getWindowHeight)

      this.getWindowHeight()
    })
    // set code to this new string literal mofo
    // this.code = `${this.createCodeSnippet(this.activeComponent, this.componentMap[this.activeComponent].children)}`
  },
  // updates code snippet, but broken cause children undefined, shows `function () { [native code] }`
  updated () {
    console.log(`code: ${this.createCodeSnippet(this.activeComponent, this.componentMap[this.activeComponent].children)}`)
    this.code = `${this.createCodeSnippet(this.activeComponent, this.componentMap[this.activeComponent].children)}`
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.getWindowHeight)
  }
}
</script>

<style lang="stylus" scoped>
// resize handled by vue lifecycle methods
.code-editor {
  font-size: 11px;
}
</style>
