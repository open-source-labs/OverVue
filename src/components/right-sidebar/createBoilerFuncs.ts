import { computed } from 'vue';
import { useStore } from "../../store/main.js";
import { vtIcons } from "src/store/state/icons";
import { Component, HtmlElement, HtmlElementMap, RouteComponentMap } from "../../../types";

export function useComputedStore() {
  const store = useStore();
  const componentMap = computed(() => store.componentMap);
  const activeComponent = computed(() => store.activeComponent);
  const activeComponentObj = computed(() => store.activeComponentObj);
  const exportAsTypescript = computed(() => store.exportAsTypescript);
  const activeRoute = computed(() => store.activeRoute);

  return {
    componentMap,
    activeComponent,
    activeComponentObj,
    exportAsTypescript,
    activeRoute
  };
}


export const createBoilerOptions = (componentName: string, children: string[] | {
  [key: string]: RouteComponentMap | Component;
  App: RouteComponentMap;
  HomeView: RouteComponentMap;
}) => {
  const {
    componentMap,
    activeComponent,
    exportAsTypescript,
    activeComponentObj,
  } = useComputedStore();
  // add import mapstate and mapactions if they exist
  let imports = "";
  const activeComp = componentMap.value[activeComponent.value] as Component;
  // if (checked.value === false) {
  if (activeComp.actions.length || activeComp.state.length) {
    imports += "import { ";
    if (activeComp.actions.length && activeComp.state.length) {
      imports += "mapState, mapActions";
    } else if (activeComp.state.length) imports += "mapState";
    else imports += "mapActions";
    imports += ` } from "pinia";\nimport { /* store */} from '/* ./store */'`; // changed from 'vuex' pinia
  }
  // }
  // if Typescript toggle is on, import defineComponent
  if (exportAsTypescript.value === "on") {
    imports += 'import { defineComponent } from "vue";\n';
  }

  // add imports for children
  let childrenComponentNames = "";
  if (Array.isArray(children)) {
    children.forEach((name) => {
      imports += `import ${name} from './components/${name}.vue';\n`;
    });

    // add components section
    children.forEach((name) => {
      childrenComponentNames += `    ${name},\n`;
    });
  }

  // if true add data section and populate with props
  let data = "";
  if (activeComp.props.length) {
    data += "  props: {";
    activeComp.props.forEach((prop) => {
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

  htmlBinding.forEach((el: { text: string }) => {
    if (vuetensilsSet.has(el.text)) {
      // Add import statement for Vuetensils components
      vtComponents.push(el.text);
    }
  });

  if (vtComponents.length) {
    vuetensilsImports += `import { ${vtComponents.join(
      ", ",
    )} } from 'vuetensils/src/components';\n`;
  }

  data += "  data() {\n    return {\n";
  htmlBinding.forEach((el: { binding: string }) => {
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
    output += "});\n</script>\n\n<style scoped>\n</style>";
  } else {
    output += `}; \n <\/script>\n\n<style scoped>\n${styleString}</style > `;
  }

  return output;
};

export const createBoilerComposition = (componentName: string, children: string[]) => {
  const {
    componentMap,
    activeComponent,
    activeComponentObj,
    exportAsTypescript,
  } = useComputedStore();
  // add import mapstate and mapactions if they exist
  let imports = "";
  const activeComp = componentMap.value[activeComponent.value] as Component;
  // if (checked.value === false) {
  if (activeComp.actions.length || activeComp.state.length) {
    imports += `import { /* useStore */ } from '/* ./store */';\n`; // changed from 'vuex' pinia
  }
  // }
  // if Typescript toggle is on, import defineComponent
  if (exportAsTypescript.value === "on") {
    imports += 'import { defineComponent } from "vue";\n';
  }

  // add imports for children
  let childrenComponentNames = "\n";
  if (Array.isArray(children)) {
    children.forEach((name) => {
      imports += `import ${name} from './components/${name}.vue';\n`;
    });

    // add components section
    children.forEach((name) => {
      childrenComponentNames += `    ${name},\n`;
    });
  }

  // if true add data section and populate with props
  let data = "";
  if (activeComp.props.length) {
    data += "  props: {";
    activeComp.props.forEach((prop) => {
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

  htmlBinding.forEach((el: { text: string }) => {
    if (vuetensilsSet.has(el.text)) {
      // Add import statement for Vuetensils components
      vtComponents.push(el.text);
    }
  });

  if (vtComponents.length) {
    vuetensilsImports += `import { ${vtComponents.join(
      ", ",
    )} } from 'vuetensils/src/components';\n`;
  }
  /*------------- setup() function -------------*/
  data += "  setup() {";
  if (activeComp.state.length || activeComp.actions.length) {
    data += "   \n    const /* testStore */ = useStore();  ";
  }
  htmlBinding.forEach((el: { binding: string }) => {
    if (el.binding !== "") {
      data += `      ${el.binding}: "PLACEHOLDER FOR VALUE", `;
      data += "\n";
    }
  });

  let returnStatement = "";

  if (activeComp.state.length || activeComp.actions.length) {
    returnStatement = "\n    return { \n";
  }

  // if true add computed section and populate with state
  let computed = "";
  if (activeComp.state.length) {
    const currState = activeComp.state.forEach((state) => {
      data += `\n    const ${state} = computed(() => /* testStore */.${state}); `;
      returnStatement += `      ${state}, \n`;
    });
  }

  data += "\n";

  // if true add methods section and populate with actions
  let methods = "";
  if (activeComp.actions.length) {
    activeComp.actions.forEach((action) => {
      methods += `\n    const ${action} = () => /* testStore */.${action}();`;
      returnStatement += `      ${action}, \n`;
    });
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
  output += ",\n  components: {";
  output += childrenComponentNames + "  },\n";
  output += data;
  output += computed;
  output += methods;

  if (exportAsTypescript.value === "on") {
    output += `    \n  ${returnStatement}    };  \n  }; \n});\n<\/script>\n\n<style scoped>\n</style>`;
  } else if (activeComp.state.length || activeComp.actions.length) {
    output += `    \n  ${returnStatement}    }; \n  };\n};\n<\/script>\n\n<style scoped>\n${styleString}</style > `;
  } else {
    output += `   \n}; \n\n<\/script>\n\n<style scoped>\n${styleString}</style > `;
  }

  return output;
};
