// Telling main Electron process to open a dialog for open an image file
// const { dialog } = require('electron').remote
const { ipcRenderer } = window;

const types = [
  {
    name: 'images',
    extensions: ['jpg', 'jpeg', 'png']
  }
]

const options = {
  filters: types,
  properties: ['openFile']
}

/**
 * Opens a dialog to open an image file
 * @returns { String } file path
 */

// Used in uploadImage.vue
const uploadImage = async () => {
  const helper = await ipcRenderer.invoke('uploadImage', options)
    .then(res => {
      return res.filePaths[0]
    })
    .catch(err => {
      console.log(err);
      return err;
    })

    return helper;
}

export default uploadImage
