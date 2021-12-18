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
// import path from 'path';
// import fs from 'fs';
// const { contextBridge } = require('electron');

// contextBridge.exposeInMainWorld(
//     'path',
//     {
//         resolve: (...pathSegments) => path.resolve(pathSegments)
//     }
// );

// contextBridge.exposeInMainWorld(
//     'fs',
//     {
//         existsSync: (pathFile) => fs.existsSync(pathFile)
//     }
// )