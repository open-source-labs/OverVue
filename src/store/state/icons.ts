import { Icons } from "types";

const icons: Icons = {
  div: "far fa-square fa-lg",
  button: "fas fa-toggle-off fa-lg",
  form: "fab fa-wpforms fa-lg",
  img: "far fa-image fa-lg",
  link: "fas fa-link fa-lg",
  list: "fas fa-circle fa-lg",
  paragraph: "fas fa-paragraph fa-lg",
  "list-ol": "fas fa-list-ol fa-lg",
  "list-ul": "fas fa-list-ul fa-lg",
  input: "fas fa-pen fa-lg",
  navbar: "fas fa-window-maximize fa-lg",
  header: ["fas fa-heading fa-lg"],
  footer: ["fas fa-shoe-prints fa-lg"],
  meta: ["fas fa-book fa-lg"],
  h1: ["fa-regular fa-1"],
  h2: ["fa-regular fa-2"],
  h3: ["fa-regular fa-3"],
  h4: ["fa-regular fa-4"],
  h5: ["fa-regular fa-5"],
  h6: ["fa-regular fa-6"],
};

const vuetensilIcon = "fa-solid fa-utensils fa-lg";

const vtIcons: Icons = {
  VAlert: [vuetensilIcon],
  VDate: [vuetensilIcon],
  VDialog: [vuetensilIcon],
  VDrawer: [vuetensilIcon],
  VDropdown: [vuetensilIcon],
  VFile: [vuetensilIcon],
  VNotifications: [vuetensilIcon],
  VResize: [vuetensilIcon],
  VSkip: [vuetensilIcon],
  VTabs: [vuetensilIcon],
  VToggle: [vuetensilIcon],
};

export { icons, vtIcons };
