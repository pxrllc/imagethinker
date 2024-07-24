import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // Node.jsモジュールをレンダラープロセスで使用できるようにする
      contextIsolation: false, // セキュリティリスクが高いため、開発時のみ使用
      enableRemoteModule: true // Remoteモジュールを有効にする
    },
  });

  mainWindow.loadFile('index.html');

  // 開発者ツールを開く
  mainWindow.webContents.openDevTools();

  ipcMain.handle('read-file', (event, filePath) => {
    return fs.readFileSync(filePath, 'utf8');
  });

  ipcMain.handle('write-file', (event, filePath, data) => {
    fs.writeFileSync(filePath, data, 'utf8');
    return 'File written successfully';
  });

  ipcMain.handle('readdir', (event, directoryPath) => {
    return fs.readdirSync(directoryPath);
  });

  ipcMain.handle('exists', (event, filePath) => {
    return fs.existsSync(filePath);
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
