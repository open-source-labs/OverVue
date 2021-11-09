import { app, BrowserWindow, shell, ipcMain } from "electron";

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = require("path")
    .join(__dirname, "statics")
    .replace(/\\/g, "\\\\");
}

let mainWindow;

// ipcMain.handle('slackAuth', slackAuth)

// function slackAuth () {
//   shell.openExternal()
//   app.listen(443, () => {
//     console.log('Listening on port 443')
//   })
//   app.listen()
// }

function createWindow() {
  /**
   * Initial window options
   */

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  });

  mainWindow.loadURL(process.env.APP_URL);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  // shell.openExternal('http://google.com/')
}

app.on("ready", () => {
  createWindow()
  // window.open('http://google.com/')
  shell.openExternal('http://google.com/', { activate: true })
})

// listener for OAuth response with URL encoded auth token
// ipcMain.once('slackAuth', )
// app.listen(443, () => {

// })

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
