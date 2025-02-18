const { app, BrowserWindow } = require('electron');
const path = require('path');
const electronReload = require('electron-reload');

electronReload(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration: true
    }
});

    mainWindow.loadFile('index.html');
    //mainWindow.webContents.openDevTools();
});
