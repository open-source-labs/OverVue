// Telling main Electron process to open a dialog for open an image file
const { dialog } = require('electron').remote;

const types = [
  {
    name: 'images',
    extensions: ['jpg', 'jpeg', 'png'],
  },
];

const options = {
  filters: types,
  properties: ['openFile'],
};

/**
 * Opens a dialog to open an image file
 * @returns { String } file path
 */

const uploadImage = () => {
  const output = dialog.showOpenDialog(options);
  if (output) {
    // console.log('image output', output)
    return output[0];
  }
  return '';
};

export default uploadImage;
