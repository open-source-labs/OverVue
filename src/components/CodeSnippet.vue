<!--
Description:
  Dynamically renders Code Snippet in Footer
  Functionality includes: Displays children components and (nested) HTML elements in order of selection.
  -->

<template>
  <div class="codesnippet-container">
    <div class="top-p" v-if="activeComponent === ''">Select a component</div>
    <div v-else>{{ `${activeComponent}.vue` }}</div>
    <prism-editor
      v-model="code"
      language="js"
      :line-numbers="lineNumbers"
      class="code-editor"
      :style="{ height: `${height}vh`}"
      :readonly="true"
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
      code: `Your component boilerplate will be displayed here.`,
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
    // Calls createTemplate and createBoiler to generate snippet
    createCodeSnippet (componentName, children) {
      let result = `${this.createTemplate(
        componentName,
        children
      )}${this.createBoiler(componentName, children)}`
      return result
    },
    // Creates beginner boilerplate
    createTemplate (componentName, children) {
      let output = ``
      output += ` <div>\n`
      let templateTagStr = this.writeTemplateTag(componentName)
      return `<template>\n ${output}${templateTagStr}  </div>\n</template>`
    },
    // Creates <template> boilerplate
    writeTemplateTag (componentName) {
      // console.log('writeTemplateTag invoked!')
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

      // Helper function that recursively iterates through the given html element's children and their children's children.
      function writeNested (childrenArray, indent) {
        if (!childrenArray.length) {
          return ''
        }
        let indented = indent + '  '
        let nestedString = ''

        childrenArray.forEach(child => {
          nestedString += indented
          // console.log(child)
          if (!child.text) {
            nestedString += `<${child}/>\n`
          } else {
            if (child.children.length) {
              nestedString += htmlElementMap[child.text][0]
              nestedString += '\n'
              nestedString += writeNested(child.children, indented)
              nestedString += indented + htmlElementMap[child.text][1]
              nestedString += '\n'
            } else {
              nestedString += htmlElementMap[child.text][0] + htmlElementMap[child.text][1] + '\n'
            }
          }
        })
        return nestedString
      }

      // Iterates through active component's HTML elements list and adds to code snippet
      let htmlArr = this.componentMap[componentName].htmlList
      let outputStr = ``
      for (let el of htmlArr) {
        // console.log(el)
        if (!el.text) {
          outputStr += `    <${el}/>\n`
        } else {
          outputStr += `    `
          if (el.children.length) {
            outputStr += htmlElementMap[el.text][0]
            outputStr += '\n'
            outputStr += writeNested(el.children, `    `)
            outputStr += `    `
            outputStr += htmlElementMap[el.text][1]
            outputStr += `  \n`
          } else {
            outputStr += htmlElementMap[el.text][0] + htmlElementMap[el.text][1] + '\n'
          }
        }
      }
      // console.log(`outputStr from writeTemplateTag: ${outputStr}`)
      return outputStr
    },
    // Creates boiler text for <script> and <style>
    createBoiler (componentName, children) {
      let str = ''
      children.forEach(name => {
        str += `import ${name} from '@/components/${name}.vue';\n`
      })
      let childrenComponentNames = ''
      children.forEach(name => {
        childrenComponentNames += `    ${name},\n`
      })
      // eslint-disable-next-line no-useless-escape
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
  },
  // Updates code snippet
  updated () {
    // console.log(`code: ${this.createCodeSnippet(this.activeComponent, this.componentMap[this.activeComponent].children)}`)
    // console.log('component map: ', this.componentMap);
    if (this.componentMap[this.activeComponent]) {
      this.code = `${this.createCodeSnippet(
        this.activeComponent,
        this.componentMap[this.activeComponent].children
      )}`
    } else {
      this.code = `Your component boilerplate will be displayed here.`
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.getWindowHeight)
  },
  watch: {
    // If HTML elements or components are added, rerenders Code Snippet
    componentMap: {
      deep: true,
      handler () {
        // console.log('component Map has changed');
        if (this.componentMap[this.activeComponent]) {
          this.code = `${this.createCodeSnippet(
            this.activeComponent,
            this.componentMap[this.activeComponent].children
          )}`
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
// resize handled by vue lifecycle methods
.code-editor {
  font-size: 12px;
}

.codesnippet-container {
  margin-bottom: 1rem;
}

::-webkit-scrollbar {
  display: none;
}
</style>
