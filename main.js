// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu ,ipcMain} = require('electron')
const path = require('path')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// 在package.json中开启主进程调试
// "start": "electron --inspect=5858 .",

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        alwaysOnTop: true,
        width: 800,
        height: 600,

        webPreferences: {
            devTools:true,  // 开启调试 ，
            nodeIntegration: true  // 渲染进程开启requir关键字s有效 ，
        }
    })
    mainWindow.setAlwaysOnTop(true, 'modal-panel', 9999)
    // and load the index.html of the app.
    mainWindow.loadFile('index.html')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })

    mainWindow.webContents.openDevTools({ mode: 'bottom' })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow()
})

var template = [{
    label: 'Edit',
    submenu: [
        {
            label: 'item1',
            click: function () {
                // mainWindow.webContents.on('did-finish-load', function() {
                //     mainWindow.webContents.send('ping', 'whoooooooh!');
                // });
                //向渲染进程发送信息
                mainWindow.webContents.send('ping', 'whoooooooh!');
            }
        },
        {
            type: 'separator'
        }
    ]
}];

var menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// main.js
const createDockMenu = () => {
    const dockTempalte = [
        {
            label: 'New Window',
            click () {
                console.log('New Window');
            }
        }, {
            label: 'New Window with Settings',
            submenu: [
                { label: 'Basic' },
                { label: 'Pro' }
            ]
        },
        {
            label: 'New Command...'
        }
    ];

    const dockMenu = Menu.buildFromTemplate(dockTempalte);
    app.dock.setMenu(dockMenu);
}

app.on('ready', function() {
    createDockMenu();
});

//接收渲染进程发来的信息
ipcMain.on('asynchronous-message', (event, arg) => {
    console.log(arg) // prints "ping"
    event.reply('asynchronous-reply', 'async pong')
})

ipcMain.on('synchronous-message', (event, arg) => {
    console.log(arg) // prints "ping"
    event.returnValue = 'sync pong'
})
