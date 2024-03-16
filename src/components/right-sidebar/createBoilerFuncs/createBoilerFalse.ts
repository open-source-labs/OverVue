// import { computed, ref, defineProps } from "vue";
// import { useStore } from "../../../store/main.js";
// import { vtIcons } from "src/store/state/icons";
// import { Component } from "../../../../types";

// /* COMPUTED VALUES */
// const store = useStore(); // template
// const componentMap = computed(() => store.componentMap);
// const activeComponent = computed(() => store.activeComponent);
// const activeComponentObj = computed(() => store.activeComponentObj);
// const exportAsTypescript = computed(() => store.exportAsTypescript);
// const activeRoute = computed(() => store.activeRoute);

// const props = defineProps({
//   value: { type: Boolean, default: false }
// });

// const checked = ref(props.value);

/* --------------- creates boiler text for <script> and <style> --------------- */
export const createBoiler = (componentName: string, children: string[]) => {
  // add import mapstate and mapactions if they exist
  let imports = "";
  const activeComp = componentMap.value[activeComponent.value] as Component;
  if (checked.value === false) {
    if (activeComp.actions.length || activeComp.state.length) {
      imports += "import { ";
      if (activeComp.actions.length && activeComp.state.length) {
        imports += "mapState, mapActions";
      } else if (activeComp.state.length) imports += "mapState";
      else imports += "mapActions";
      imports += ` } from "pinia";\nimport { /* store */} from '/* ./store */'`; // changed from 'vuex' pinia
    }
  }
  // if Typescript toggle is on, import defineComponent
  if (exportAsTypescript.value === "on") {
    imports += 'import { defineComponent } from "vue";\n';
  }

  // add imports for children
  children.forEach((name) => {
    imports += `import ${name} from './components/${name}.vue';\n`;
  });

  // add components section
  let childrenComponentNames = "";
  children.forEach((name) => {
    childrenComponentNames += `    ${name},\n`;
  });

  // if true add data section and populate with props
  let data = "";
  if (activeComp.props.length) {
    data += "  props: {";
    activeComp.props.forEach((prop: string) => { // Explicitly specify the type of the 'prop' parameter as string
      data += `\n    ${prop}: "PLACEHOLDER FOR VALUE",`;
    });
    data += "\n";
    //data += "    }\n";
    data += "  },\n";
  }

  const htmlBinding = componentMap.value[activeComponent.value].htmlList;

  // [OverVue v.10.0] add Vuetensils import statements to <script setup>

  const vuetensilsSet = new Set(Object.keys(vtIcons));

  let vuetensilsImports = "";

  const vtComponents: string[] = [];

  htmlBinding.forEach((el) => {
    if (vuetensilsSet.has(el.text)) {
      // Add import statement for Vuetensils components
      vtComponents.push(el.text);
    }
  });

  if (vtComponents.length) {
    vuetensilsImports += `import { ${vtComponents.join(
      ", "
    )} } from 'vuetensils/src/components';\n`;
  }

  data += "  data() {\n    return {\n";
  htmlBinding.forEach((el) => {
    if (el.binding !== "") {
      data += `      ${el.binding}: "PLACEHOLDER FOR VALUE", `;
      data += "\n";
    }
  });
  data += `    }`;
  data += ` \n  },  \n `;

  // if true add computed section and populate with state
  let computed = "";
  if (activeComp.state.length) {
    computed += " computed: {";
    computed += "\n    ...mapState(/* store */, [";
    activeComp.state.forEach((state) => {
      computed += `\n      "${state}", `;
    });
    computed += "\n    ]),\n";
    computed += "  },\n";
  }

  // if true add methods section and populate with actions
  let methods = "";
  if (activeComp.actions.length) {
    methods += "  methods: {";
    methods += "\n    ...mapActions(/* store */, [";
    activeComp.actions.forEach((action) => {
      methods += `\n      "${action}", `;
    });
    methods += "\n    ]),\n";
    methods += "  },\n";
  }

  let htmlArray = componentMap.value[componentName].htmlList;
  let styleString = "";
  const activeCompObj = activeComponentObj.value as Component; // typed this to fix activeComponentObj.value "is possibly null" error
  if (
    activeComponentObj.value &&
    (activeComponentObj.value as Component).htmlAttributes.class !== ""
  ) {
    styleString += `.${
      (activeComponentObj.value as Component).htmlAttributes.class
    } { \n\tbackground-color: ${(activeComponentObj.value as Component).color};
\tgrid-area: ${
      (activeComponentObj.value as Component).htmlAttributes.gridArea[0]
    } / ${
      (activeComponentObj.value as Component).htmlAttributes.gridArea[1]
    } / ${
      (activeComponentObj.value as Component).htmlAttributes.gridArea[2]
    } / ${(activeComponentObj.value as Component).htmlAttributes.gridArea[3]};
\tz-index: ${(activeComponentObj.value as Component).z};
} \n`;
  }

  for (const html of htmlArray) {
    if (html.class === " ") styleString = "";
    if (html.class) {
      styleString += `.${html.class} {\n height: ${html.h}%; \n width: ${html.w}%; \n top: ${html.x}%;
       \n left: ${html.y}%; \n z-index: ${html.z};}\n`;
    }
  }

  // concat all code within script tags
  // if exportAsTypescript is on, out should be <script lang="ts">
  let output;
  if (exportAsTypescript.value === "on") {
    output = "\n\n<script lang='ts'>\n";
    output +=
      vuetensilsImports +
      imports +
      "\nexport default defineComponent ({\n  name: '" +
      componentName +
      "';";
  } else {
    output = "\n\n<script>\n";
    output +=
      vuetensilsImports +
      imports +
      "\nexport default {\n  name: '" +
      componentName +
      "'";
  }
  output += ",\n  components: {\n";
  output += childrenComponentNames + "  },\n";
  output += data;
  output += computed;
  output += methods;

  if (exportAsTypescript.value === "on") {
    output += "});\n<\/script>\n\n<style scoped>\n</style>";
  } else {
    output += `}; \n <\/script>\n\n<style scoped>\n${styleString}</style > `;
  }

  return output;
};

// export default createBoiler;