<h1 align="center">
  <img src="https://raw.githubusercontent.com/jeisele2/OverVue/master/src/assets/overvue-icons/apple-icon-72x72.png">
  <br/>
  OverVue (Beta)
</h1>

<p align="center"><b>Prototyping Tool for Vue Developers</b></p>

<p>OverVue is a prototyping tool that allows developers to <em>dynamically</em> create and visualize a Vue application, implementing a real-time intuitive <em>tree display</em> of component hierarchy and a live-generated <em>code preview</em>. The resulting boilerplate can be <em>exported</em> as a template for further development.</p>

#### Features
+ Upload a frontend mockup image
+ Visualize draggable and resizable components
+ Create parent-child hierarchy of components
+ Add html elements to components
+ Create routes to be used by Vue Router
+ Live-generated previewable code snippets for each component
+ Live-generated tree view to aid in visualizing parent-child hierarchy
+ Save projects and open previous projects
+ Export full boilerplate code for a working frontend


#### How to use
+ Opening the application will create by default a root App component and a root route called "HomeView"
+ Upload an mockup from your filesystem if you'd like. Remove the mockup and choose a new one if needed.
![](https://raw.githubusercontent.com/jeisele2/OverVue/master/src/assets/gifs/upload-image-drawers.gif)

+ To add a new component, type its name in the component name box and select any HTML elements that should be rendered by that component.
+ HTML elements can also be added after creation by selecting the component in the display, then selecting HTML elements.
+ Select a parent component for the new component if needed.
+ After adding, you can move and resize the component in the display.
![alt text](https://raw.githubusercontent.com/jeisele2/OverVue/master/src/assets/gifs/component_creation.gif)

+ You can also add children to components by right-clicking the component to add children to, and you can see the tree rerender as you create new components or change the hierarchy.
![](https://raw.githubusercontent.com/jeisele2/OverVue/master/src/assets/gifs/HTML-elements-tree-rerender.gif)

+ The dashboard shows info about each component (code snippets and HTML elements). Click a component in the display to see its properties.
![](https://raw.githubusercontent.com/jeisele2/OverVue/master/src/assets/gifs/snippets-active-component.gif)

+ You can add new routes and view all components and routes in the sidebar.
![](https://raw.githubusercontent.com/jeisele2/OverVue/master/src/assets/gifs/sidebar-components-routes.gif)

+ When finished creating, you can export to a file location of your choice. Below is the exported file structure:

```
public/
  index.html
src/
  assets/
  components/
    UserCreatedComponent1.vue
    UserCreatedComponent2.vue
    ...
  views/
    HomeView.vue
    UserCreatedRouteComponent1.vue
    UserCreatedRouteComponent2.vue
    ...
  App.vue
  main.js
  router.js
babel.config.js
package.json
```

#### Running a local version
This app was developed using the Quasar framework, so first you will need to install the Quasar cli
```
npm i quasar-cli
```
Install dependencies
```
npm i
```
To run electron app in dev mode
```
quasar dev -m electron
```
To build a new .dmg
```
quasar build -m electron
```

#### Contributing
We'd love for you to test this application out and submit any issues you encounter. Also feel free to fork to your own repo and submit PRs.
Here are some features we're thinking about adding:
+ Vuex state prototyping and boilerplate export
+ Ability to add additional mockup images for more routes
+ Ability to nest HTML elements
+ Option to export files in TypeScript

#### Authors
```
Contributors:
Joseph Eisele @jeisele2
Dean Chung @deanfchung
Dean Ohashi @dnohashi
Drew Nguyen @drewngyen
```
Inspired by [PreVue](https://github.com/open-source-labs/ReacType)
