import { app, BrowserWindow, net, shell, ipcMain } from "electron";
import { Deeplink } from "electron-deeplink";
import isDev from "electron-is-dev";
import jwt_decode from 'jwt-decode';

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
let authCode;
const protocol = isDev ? "overvuedev" : "overvue";

// Used to console log for main process in production mode
function logEverywhere(toBeLogged) {
  if (isDev) {
    console.log(toBeLogged);
  } else {
    console.log(toBeLogged);
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.executeJavaScript(
        'console.log("' + toBeLogged + '" )'
      );
    }
  }
}

const deeplink = new Deeplink({
  app,
  mainWindow,
  protocol,
  isDev,
  debugLogging: true,
  // electronPath: '../../node_modules/electron/dist/electron.app'
});
// logEverywhere(`electron path:  ${require('path').join(__dirname, '../../node_modules/electron/dist/electron.exe')}`);
// Sends request to Slack for User's information,
// then sends user information back to renderer process
function sendTokenRequest() {
  logEverywhere("inside sendTokenRequest");

  const authData = {
    client_id: process.env.SLACK_CLIENT_ID,
    client_secret: process.env.SLACK_CLIENT_SECRET,
    code: authCode,
    redirect_uri: isDev ? "overvuedev://test" : "overvue://slack"
  };
  logEverywhere(authData.code);

  const url =
    "https://slack.com/api/openid.connect.token?" +
    "client_id=" +
    authData.client_id +
    "&client_secret=" +
    authData.client_secret +
    "&code=" +
    authData.code +
    "&grant_type=authorization_code" +
    "&redirect_uri=" +
    authData.redirect_uri;

  logEverywhere(`Token Request URL: ${url}`);

  // Send Post request for user information
  const request = net.request({
    method: "POST",
    url: url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });

  // Listens for response from token request
  request.on("response", response => {
    // logEverywhere("request.on response received");
    response.on("end", () => {
      logEverywhere("Response ended ");
    });
    response.on("data", data => {
      // logEverywhere("response.on data ");
      // decodes utf8 Buffer into JSON, then parses it
      const decoded = JSON.parse(data.toString())

      // decodes JSON Web Token and places decoded JWT back into response data
      decoded.id_token = jwt_decode(decoded.id_token)
      // logEverywhere(`decoded in response.on data: ${decoded}`)
      // send user information back to renderer process
      mainWindow.webContents.send("tokenReceived", decoded);
    });
  });
  request.end();
}

// Turns on event listener for Slack Oauth deep linking back app
// TODO: Deep linking currently doesn't work properly in dev mode - requires fix
function setOauthListener() {
  logEverywhere(`process.env.SLACK_CLIENT_ID in electron-main:  ${process.env.SLACK_CLIENT_ID}`);
  logEverywhere(`process.env.SLACK_CLIENT_SECRET in electron-main:  ${process.env.SLACK_CLIENT_SECRET}`);

  return deeplink.on("received", link => {
    logEverywhere(`auth worked here link: ${link}`);
    // Extracts Slack authorization code from deep link
    authCode = link.split("=")[1];
    sendTokenRequest();
  });
}

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

  logEverywhere(`Current deeplink Protocol: ${deeplink.getProtocol()}`);
  mainWindow.loadURL(process.env.APP_URL);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", () => {
  createWindow();
  setOauthListener();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
    setOauthListener();
  }
});
