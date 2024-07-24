const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');

// contextBridgeを使用して、Node.jsの機能をwindowオブジェクトに安全にエクスポートする
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (...args) => ipcRenderer.invoke(...args),
    on: (...args) => ipcRenderer.on(...args),
    once: (...args) => ipcRenderer.once(...args)
  },
  path: {
    join: (...args) => path.join(...args),
    basename: (...args) => path.basename(...args),
    dirname: (...args) => path.dirname(...args),
  }
});
