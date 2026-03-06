/**
 * Paulie's Prediction Partners — Wizard Preload Script
 *
 * Exposes a minimal contextBridge API so the wizard HTML can
 * communicate with the main process to signal completion.
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('wizardBridge', {
  /**
   * Signal wizard completion with user preferences.
   * @param {object} preferences - User-selected preferences from wizard.
   */
  complete(preferences) {
    ipcRenderer.send('wizard-complete', preferences);
  },
});
