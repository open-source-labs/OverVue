This is for future OverVue iteration groups to help in building out the application for github release

# Building Electron App with Electron-Builder

This guide provides instructions on how to use `electron-builder` to package and build your Electron app for different platforms.

## Prerequisites

- Node.js and npm installed on your system.
- Project dependencies installed. Run `npm install` in the project root.

## Files notes

-the electron-builder.yml file holds the instructions for the electron-builder to config when building out the targets for mac,windows, and linux OSs
-the 'main' path (in package.json) should be kept as "main": "./dist/electron/UnPackaged/electron-main.js", as this is the output main js after TypeScript compiles the code

## Building the App

**Build the Electron app**: Run the build script specified in your `package.json` file. The build script should look something like this: `"build": "quasar build -m electron"`. Run the build script with the command `npm run build`.

## Packaging the App for Different Platforms

After building the Electron app, then you can use `electron-builder` to package the app for different platforms:

- **Windows**: Run the command `npm run build:win` to package the app for Windows. This will create a `.exe` file in the `dist` directory.

- **macOS**: Run the command `npm run build:mac` to package the app for macOS. This will create a `.dmg` file in the `dist` directory.

- **Linux**: Run the command `npm run build:linux` to package the app for Linux. This will create an `AppImage` file in the `dist` directory.

## Releasing the App

After packaging the app, you can upload the packaged files to the releases section of your GitHub repository. Users can then download these files to install your Electron app on their respective platforms.
