import { defineStore } from "pinia";
import state from "./state";
import actions from "./actions";

export const useStore = defineStore("main", {
  state: () => state,
  actions: actions,
});
