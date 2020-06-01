<template>
  <div class="codesnippet-container">
    <!-- <input type="checkbox" v-model="lineNumbers"> Linenumbers -->
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
import { mapState } from 'vuex';
import PrismEditor from 'vue-prism-editor';
import 'prismjs';
import 'prismjs/themes/prism-okaidia.css';
import 'vue-prism-editor/dist/VuePrismEditor.css';

export default {
  data() {
    return {
      code: `Your component boilerplate will be displayed here.`,
      lineNumbers: true,
      height: null,
    };
  },
  components: {
    PrismEditor,
  },
  computed: {
    // needs access to current component aka activeComponent
    ...mapState(['componentMap', 'activeComponent']),
  },
  methods: {
    getWindowHeight(e) {
      let minHeight =
        window.outerHeight < 900 ? 22 : window.outerHeight < 1035 ? 24 : 27.5;
      this.height = minHeight;
    },
    // calls createTemplate and createBoiler to generate snippet
    createCodeSnippet(componentName, children) {
      let result = `${this.createTemplate(
        componentName,
        children
      )}${this.createBoiler(componentName, children)}`;
      return result;
    },
    createTemplate(componentName, children) {
      let output = ``;
      output += ` <div>\n`;
      // children.forEach(name => {
      //   output += `    <${name}>\n    </${name}>\n`;
      // });
      let templateTagStr = this.writeTemplateTag(componentName);
      return `<template>\n ${output}${templateTagStr}  </div>\n</template>`;
    },

    // We need a helper function to recursively iterate through the given html element's children and their children's children.

    writeTemplateTag(componentName) {
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
        navbar: ['<nav>', '</nav>'],
      };
      // loop to iterate through compName arr
      let htmlArr = this.componentMap[componentName].htmlList;
      let outputStr = ``;
      for (let el of htmlArr) {
        outputStr += `    `;
        if (el.text) {
          outputStr += htmlElementMap[el.text][0];
          outputStr += htmlElementMap[el.text][1];
        } else {
          outputStr += `<${el} />`
        }
        outputStr += `  \n`;
      }
      // console.log(`outputStr from writeTemplateTag: ${outputStr}`)
      return outputStr;
    },
    createBoiler(componentName, children) {
      let str = '';
      children.forEach(name => {
        str += `import ${name} from '@/components/${name}.vue';\n`;
      });
      let childrenComponentNames = '';
      children.forEach(name => {
        childrenComponentNames += `    ${name},\n`;
      });
      return `\n\n<script>\n${str}\nexport default {\n  name: '${componentName}',\n  components: {\n${childrenComponentNames}  }\n};\n<\/script>\n\n<style scoped>\n</style>`;
    },
  },
  mounted() {
    // https://vuejs.org/v2/api/#Vue-nextTick
    // kinda like a promise, used for the window resize
    this.$nextTick(() => {
      window.addEventListener('resize', this.getWindowHeight);

      this.getWindowHeight();
    });
  },
  // updates code snippet, but broken cause children undefined, shows `function () { [native code] }`
  updated() {
    // console.log(`code: ${this.createCodeSnippet(this.activeComponent, this.componentMap[this.activeComponent].children)}`)
    // console.log('component map: ', this.componentMap);
    if (this.componentMap[this.activeComponent]) {
      this.code = `${this.createCodeSnippet(
        this.activeComponent,
        this.componentMap[this.activeComponent].children
      )}`;
    } else {
      this.code = `Your component boilerplate will be displayed here.`;
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getWindowHeight);
  },
  watch: {
    componentMap: {
      deep: true,
      handler() {
        // console.log('component Map has changed');
        if (this.componentMap[this.activeComponent]) {
          this.code = `${this.createCodeSnippet(
            this.activeComponent,
            this.componentMap[this.activeComponent].children
          )}`;
        }
      },
    },
    activeComponent: function() {
      // console.log('watching active component');
    },
  },
};
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
