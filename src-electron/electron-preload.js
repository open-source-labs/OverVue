/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 */


const {ipcRenderer, shell, contextBridge} = require('electron');
const path = require('path');
const fs = require('fs-extra');

 // ipcRenderer contextBridge
 // on: used in SlackLoginWindow
 // 
 contextBridge.exposeInMainWorld("ipcRenderer",{
     on: (channel, func) => ipcRenderer.on(channel,(event, ...args) => func(args)), 
     invoke: async (channel, ...args) => await ipcRenderer.invoke(channel, ...args)
 });

 // shell, used in SlackLoginWindow
 contextBridge.exposeInMainWorld("shell", {
     openExternal: (url, options) => shell.openExternal(url, options)
 })

 // fs from fs-extra, used in ExportProject
 contextBridge.exposeInMainWorld("fs", {
    writeFileSync: (file, data, options) => fs.writeFileSync(file, data, options), 
    existsSync: (data) => fs.existsSync(data), 
    mkdirSync: (data) => fs.mkdirSync(data)
})

 // Exposing path module
 contextBridge.exposeInMainWorld("path", {
    join: (...paths) => path.join(...paths)
})

