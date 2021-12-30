import { app, BrowserWindow, nativeTheme, dialog, ipcMain } from "electron";
import { Deeplink } from "electron-deeplink";
import isDev from "electron-is-dev";
import path from "path";
import os from "os";

if (process.env.PROD) {
  global.__statics = require("path")
    .join(__dirname, "statics")
    .replace(/\\/g, "\\\\");
}

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

try {
  if (platform === "win32" && nativeTheme.shouldUseDarkColors === true) {
    require("fs").unlinkSync(
      path.join(app.getPath("userData"), "DevTools Extensions")
    );
  }
} catch (_) {}

let mainWindow;
// Added
let authCode;
const protocol = isDev ? "overvuedev" : "overvue";

// Used to console log for main process in production mode
// ** Only works on production level application; throws errors if you run quasar dev
if (process.env.PROD) {
  const deeplink = new Deeplink({
    app,
    mainWindow,
    protocol,
    isDev,
    debugLogging: true,
    // electronPath: '/node_modules/electron/dist/Electron.app'
  });
}

// Handle dialogs for ExportProjectComponent
ipcMain.handle("exportProject", async (event, arg) => {
  const result = await dialog.showSaveDialog(arg);
  return result;
});

// Handle dialogs for SaveProjectComponent
ipcMain.handle("saveProject", async (event, arg) => {
  const result = await dialog.showSaveDialog(arg);
  return result;
});

// Handle dialogs for OpenProjectComponent
ipcMain.handle("openProject", async (event, arg) => {
  const result = await dialog.showOpenDialog(arg);
  return result;
<<<<<<< HEAD
});
=======
})
>>>>>>> quasar

// ************** Slack OAuth functions **********************
// Sends request to Slack for User's information,
// then sends user information back to renderer process
function slackErrorHandler(err) {
  return mainWindow.webContents.send("slackError", err);
}

function sendTokenRequest() {
  // Send Post request for user information
  const request = net.request({
    method: "POST",
    url:
      "https://slack.com/api/oauth.v2.access?" +
      "client_id=" +
      process.env.SLACK_CLIENT_ID +
      "&client_secret=" +
      process.env.SLACK_CLIENT_SECRET +
      "&code=" +
      authCode +
      "&grant_type=authorization_code" +
      "&redirect_uri=" +
      process.env.SLACK_REDIRECT_URI,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  // Listens for response from token request
  request.on("response", (response) => {
    // logEverywhere("request.on response received");
    response.on("end", () => {
      // logEverywhere("Response ended ");
    });
    response.on("data", (data) => {
      const decoded = JSON.parse(data.toString());
      if (decoded.error) {
        return slackErrorHandler(decoded.error);
      }
      // console.log('Is there an error? ', !!decoded.error, 'if true, this shouldnt be logging')
      mainWindow.webContents.send("tokenReceived", decoded);
      // getSlackUser(decoded.access_token, decoded.authed_user.id)
    });
  });
  request.end();
}

function getSlackUser(token, userId) {
  const request = net.request({
    method: "POST",
    url:
      "https://slack.com/api/users.profile.get?" +
      "token=" +
      token +
      "&user=" +
      userId,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  request.on("response", (response) => {
    response.on("end", () => {
      // logEverywhere('User data recieved')
    });
    response.on("data", (data) => {
      const decoded = JSON.parse(data.toString());
      if (decoded.error) {
        return slackErrorHandler(decoded.error);
      }
      // logEverywhere('slackUser decoded data in getSlackUser' + decoded)
      mainWindow.webContents.send("slackUser", decoded);
    });
  });
  request.end();
}

function setOauthListener() {
  // logEverywhere(`process.env.SLACK_CLIENT_ID in electron-main:  ${process.env.SLACK_CLIENT_ID}`);
  // logEverywhere(`process.env.SLACK_CLIENT_SECRET in electron-main:  ${process.env.SLACK_CLIENT_SECRET}`);

<<<<<<< HEAD
  return deeplink.on("received", (link) => {
    // logEverywhere(`auth worked here link: ${link}`);
    // Extracts Slack authorization code from deep link
    authCode = link.split("=")[1];
    sendTokenRequest();
  });
=======
  if (process.env.PROD) {
    return deeplink.on("received", link => {
      // logEverywhere(`auth worked here link: ${link}`);
      // Extracts Slack authorization code from deep link
      authCode = link.split("=")[1];
      sendTokenRequest();
    });
  }
>>>>>>> quasar
}

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
      // nodeIntegration: true,
      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });

  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on("devtools-opened", () => {
      mainWindow.webContents.closeDevTools();
    });
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Default from quasar
// app.whenReady().then(createWindow)
// New
app
  .whenReady()
  .then(() => {
    createWindow();
    setOauthListener();
  })
  .catch((err) => {
    console.log(err);
  });

app.on("window-all-closed", () => {
  if (platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
    setOauthListener();
  }
});
