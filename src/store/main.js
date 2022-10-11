import { defineStore } from "pinia";
import state from "./state";
import actions from "./mainactions";

export const useStore = defineStore("main", {
  state: () => state,
  actions: actions,
});
