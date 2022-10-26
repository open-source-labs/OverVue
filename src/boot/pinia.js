import { boot } from "quasar/wrappers";
import { createPinia } from "pinia";

export default boot(({ app }) => {
  app.use(createPinia());
});
