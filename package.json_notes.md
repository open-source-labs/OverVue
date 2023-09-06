 ## Disclaimer: These notes were created at the beginning of iteration to understand the codebase and may be inaccurate or outdated. 8/14/2023 OverVue 10.0
 
  ```json
  
  "dependencies": {
    "@quasar/cli": "^1.3.2", // Quasar CLI tool that allows dev, build, etc. (uses webpack/vite under the hood)
    "@quasar/extras": "^1.12.5", // Material fonts, icons, designs, etc.
    "@ssthouse/vue3-tree-chart": "^0.2.3", // Current library (https://github.com/ssthouse/tree-chart) used to display the tree in Tree view, working to bring this to main view and make it interactive 
    "@types/node": "^18.8.0", // Used to load all type definitions for TypeScript in node app
    "@typescript-eslint/eslint-plugin": "^5.36.2", // ESLint plugin that provides linting rules for TypeScript codebases
    "@typescript-eslint/parser": "^5.36.2", // ESLint parser that leverages TypeScript ESTree to allow ESLint to lint TypeScript source code
    "bootstrap": "^5.2.0", // Bootstrap, provides powerful components, designs, layouts, snippets, etc.
    "bootstrap-vue": "^2.22.0", // Bootstrap, but for Vue
    "core-js": "^3.21.1", // The standard library for JavaScript
    "dotenv": "^16.0.0", // Allows access of environment variables in .env file through process.env
    "electron-deeplink": "^1.0.10", // Sets the default handler for a given protocol (deep link) in Electron apps (need to understand how Electron works for this)
    "element-plus": "^2.2.16", // Vue 3 component library
    "fs-extra": "^10.0.0", // Replaces 'fs' with extra fs methods, fs methods now return promises if callback isn't passed
    "http": "^0.0.1-security", // Docs seem to point towards this being unnecessary and potentially dangerous, http is built in to Node
    "https": "^1.0.0", // Not a lot of information on this either, not sure if necessary, might be built in
    "jest-cli": "^27.5.1", // CLI tool for running jest commands
    "localforage": "^1.10.0", // Improves offline web app experience by providing localStorage-esque async storage
    "lodash.clonedeep": "^4.5.0", // cloneDeep method (https://www.geeksforgeeks.org/lodash-_-clonedeep-method)
    "lodash.isequal": "^4.5.0", // isEqual method (https://www.geeksforgeeks.org/lodash-_-isequal-method/), performs deep comparison
    "lodash.throttle": "^4.1.1", // throttle method (https://www.geeksforgeeks.org/lodash-_-throttle-method/) to create a throttle-able function
    "mousetrap": "^1.6.5", // for handling keyboard shortcuts (keypress event handling)
    "net": "^1.0.2", // Globalizes the "net" module functions for convenience...? (https://github.com/sleeplessinc/net) it's like 3 lines of code and 1 line of testing.. not sure what it's used for
    "node-gyp": "^8.4.1", // CLI tool for compiling native add-on modules (none of the build commands seem to be used in package.json scripts)
    "pinia": "^2.0.23", // Store library for Vue, allowing for sharing of state
    "prismjs": "^1.27.0", // Syntax highlighting library (highlights code?)
    "quasar": "^2.5.5", // Vue framework package that helps deploy cross-platform (SPA, SSR, PWA, Electron, etc.) with one codebase
    "quasar-dotenv": "^1.0.5", // Wraps dotenv for Quasar runtime to access process.env
    "typescript": "^4.8.3", // Language that adds optional static typing to JavaScript, compiles to JavaScript
    "vue": "^3.2.31", // JavaScript framework
    "vue-accessible-color-picker": "^4.0.3", // Color picker component
    "vue-draggable-resizable": "^2.3.0", // Vue2 Component for draggable and resizable elements
    "vue-loader": "^17.0.0", // Webpack loader for Vue Single-File Components
    "vue-multiselect": "^3.0.0-alpha.2", // Multiselect component
    "vue-prism-editor": "^2.0.0-alpha.2", // Simple code editor (used in CodeSnippet.vue)
    "vue-router": "4.0.13", // Routing library
    "vue-sfc-parser": "^0.1.2", // Vue.js single file component parser for static analysis (seems like it was used for a feature that was being implemented, but not finished) (used in extractor.js)
    "vue3-draggable-resizable": "^1.6.4", // Draggable and resizable component for Vue 3 (being imported in Canvas.vue, but not used. May have been transitioning to this component but not implemented)
    "vue3-tree": "^0.11.0", // Tree viewer? Doesn't seem to be used, not much documentation
    "vued3tree": "^5.1.0", // Different tree viewer based on D3 layout, also doesn't seem to be used
    "vuedraggable": "^4.1.0", // 3rd Draggable element library, doesn't seem to be used
    "vuex": "^4.0.2" // Old store/state management library, seems to be mostly just in comments or unused, but is in some tests and ExportMenu, ExportMenuOptions, CodeSnippet, so not sure if safe to remove
  },
  "devDependencies": {
    "@babel/eslint-parser": "^7.17.0", // Linting for all valid babel code
    "@pinia/testing": "^0.0.14", // Testing module for pinia
    "@quasar/app": "^3.3.3", // Not a lot of documentation on this
    "@quasar/quasar-app-extension-testing-unit-jest": "^3.0.0-alpha.7", // Quasar and Jest integration for both JS and TS
    "@vue/devtools": "^6.0.12", // Vue Dev Tools
    "@vue/test-utils": "^2.0.0-rc.18", // Component testing utils for Vue 3
    "@vue/tsconfig": "^0.1.3", // tsconfig (typescript configurations) for Vue
    "@vue/vue3-jest": "^27.0.0-alpha.4", // Jest transformer for Vue Single File Components
    "electron": "^17.4.10", // Electron framework - allows creation of desktop applications
    "electron-builder": "^23.0.2",
    "electron-is-dev": "^2.0.0",
    "electron-packager": "^15.4.0",
    "eslint": "^8.23.0", // ESLint configs
    "eslint-config-prettier": "^8.3.0",
    "eslint-plugin-jest": "^26.1.1",
    "eslint-plugin-vue": "^8.4.1",
    "eslint-webpack-plugin": "^3.1.1"
  },