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
      contextIsolation: true,
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

ipcMain.handle('writeFile', async (event, { filePath, data }) => {
  fs.writeFileSync(filePath, data);
});

// //handler for Import
ipcMain.handle('openProject', async (event, options) => {
if (mainWindow) {
  //{ filePaths } destructured comes fromdialog.showOpenDialog() function.
const { filePaths } = await dialog.showOpenDialog(mainWindow, options);
return { filePaths };
}
});

//START: OLD import code block below
//   try {
//     if (mainWindow) {
//       const { filePaths } = await dialog.showOpenDialog(mainWindow, options);
//       console.log('Import dialog result:', filePaths); // Log the filePaths
//       if (filePaths.length > 0) {
//         const data = fs.readFileSync(filePaths[0], 'utf8');
//         return JSON.parse(data); // Return the imported data
//       }
//     } else {
//       console.error('Main window is undefined');
//     }
//   } catch (error) {
//     console.error('Failed to import project:', error);
//   }
//END


// //handler for Export
ipcMain.handle("exportProject", async (event, options) => {
  const { dialog } = require("electron");
  const { filePath } = await dialog.showSaveDialog(options);
  return { filePath };
});
