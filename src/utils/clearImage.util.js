const { dialog } = require('electron').remote;

/**
 * Fires the Electron dialog box to show an alert to confirm clear image
 */

const clearImageDialog = () => {
  const options = {
    buttons: ['Yes', 'Cancel'],
    message: 'Do you want to clear image?',
  };
  return dialog.showMessageBox(options);
};

export default clearImageDialog;
