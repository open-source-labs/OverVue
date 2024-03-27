import { openHtmlElementMap } from "src/stores/state/htmlElementMap";
import { computed } from "vue";
import { useStore } from "src/stores/main";
// @ts-ignore
const { ipcRenderer } = window;

/* COMPUTED VALUES */
const store = useStore();
const activeComponent = computed(() => store.activeComponent);

export const showExportProjectDialog = async () => {
  if (activeComponent.value === '') return alert('At least one component needs to be created');
  return await ipcRenderer
  .invoke("exportProject", {
    title: "Choose location to save folder in",
    message: "Choose location to save folder in",
    nameFieldLabel: "Application Name",
  })
}

export const exportComponent = async () => {
  if (activeComponent.value === "")
    return alert("At least one component needs to be created");
  return await ipcRenderer
    .invoke("exportComponent", {
      title: "Choose location to save folder in",
      message: "Choose location to save folder in",
      nameFieldLabel: "Component Name",
    })
  }

export const writeFile = async (filePath: any, content: any) => {
  if (!filePath) {
    console.error("filePath is undefined");
    return;
  }
  await ipcRenderer
    .invoke("writeFile", filePath, content)
    .catch((error: any) => console.error(error));
};

export async function checkFileExists(path: string) {
  const fileExistBool = await ipcRenderer.invoke("check-file-exists", path);
  return fileExistBool.status;
}

export const mkdirSync = async (...args: string[]) => {
  await ipcRenderer
    .invoke("mkdirSync", [...args])
    .catch((error: any) => console.error(error));
};

export const pathJoin = (...args: string[]) => {
  if (args.some((arg) => arg === undefined)) {
    //undefined handler for if any args are undefined
    console.error("arguments are undefined)");
    return;
  }

  return ipcRenderer
    .invoke("pathJoin", ...args)
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {
      console.error(error);
      throw error;
    });
};
