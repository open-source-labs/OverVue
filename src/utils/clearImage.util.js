// const { dialog } = require('electron').remote
const { ipcRenderer } = window;
/**
 * Fires the Electron dialog box to show an alert to confirm clear image
 */

const clearImageDialog = async () => {
  const options = {
    buttons: ['Yes', 'Cancel'],
    message: 'Do you want to clear image?'
  }
  // return dialog.showMessageBox(options)
  const helper = await ipcRenderer.invoke('clearImage', options)
    .then(res => {
      console.log('Res from clear image util: ')
      console.log(res)
      return res;
    })
    .catch(err => console.log(err))
  
  return helper;
}

export default clearImageDialog
