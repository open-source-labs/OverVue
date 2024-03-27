import { app, BrowserWindow, ipcMain, dialog } from 'electron'; // additionally added ipcMain & dialog for ipcMain.handler functions
import path from 'path';
import os from 'os';
import fs from 'fs';

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

let mainWindow: BrowserWindow | undefined;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, "icons/icon.png"), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      // nodeIntegration: true,
      // contextIsolation: false,
      contextIsolation: true,
      allowRunningInsecureContent: false,
      // More info: https://v2.quasar.dev/quasar-cli-webpack/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });

  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow?.webContents.closeDevTools();
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === undefined) {
    createWindow();
  }
});

//Add IPC handlers

//handler for Save functionality
ipcMain.handle('showSaveDialog', async (event, options) => {
  const { filePath } = await dialog.showSaveDialog(options);
  return { filePath };
});

ipcMain.handle('writeJSON', async (event, { filePath, data }) => {
  fs.writeFileSync(filePath, data);
});

//handler for Import

ipcMain.handle('openProject', async (event, options) => {
if (mainWindow) {
  //{ filePaths } destructured comes fromdialog.showOpenDialog() function.
  const { filePaths } = await dialog.showOpenDialog(mainWindow, options);

  if (!filePaths) return;
    const readData = await fs.readFileSync(filePaths[0], "utf8");
    const jsonFile = JSON.parse(readData);
  return { jsonFile };
}
});




//handlers for Export
ipcMain.handle("exportProject", async (event, options) => {
  const { dialog } = require("electron");
  const { filePath } = await dialog.showSaveDialog(options);
  if (filePath === '') {
    throw new Error('No file path selected');
  }
  return { filePath };
});

ipcMain.handle("exportComponent", async (event, options) => {
  const { dialog } = require("electron");
  const { filePath } = await dialog.showSaveDialog(options);
  if (filePath === "") {
    throw new Error("No file path selected");
  }
  return { filePath };
});

ipcMain.handle('writeFile', async (event, filePath, content) => { //possibly merge this with 'writeJSON' handle

  await fs.writeFile(filePath, content, (err) => {
      if (err) {
        console.log(`${err} in fs.writeFile`);
      } else {
        console.log("File written successfully");
      }
    });
  return { status: "success" };

});



ipcMain.handle('check-file-exists', async (event, path) => {
  const fileExists = await fs.existsSync(path);
  if (fileExists) return { status: true };
  return { status: false };
});

ipcMain.handle('mkdirSync', async (event, args: string[] ) => {
  const mkdirPath = await path.join(...args);
  await fs.mkdirSync(mkdirPath);
  return { status: 'success' };
});

ipcMain.handle('pathJoin', (event, ...args: any[]) => {//should expect args and output to be string
  const newPath:string = path.join(...args);
  return newPath; //return string directly instead of object
});

