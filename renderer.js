// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { BrowserWindow } = require('electron').remote
const ipcRenderer = require('electron').ipcRenderer

let myNotification = new Notification('标题', {
    body: '通知正文内容'
})

myNotification.onclick = () => {
    console.log('通知被点击')
}

//向主进程发送消息
console.log(ipcRenderer.sendSync('synchronous-message', 'sync ping')) // prints "pong"

ipcRenderer.on('asynchronous-reply', (event, arg) => {
    console.log(arg) // prints "pong"
})
ipcRenderer.send('asynchronous-message', 'async ping')

//接收主进程发来的消息
//vue项目中，在index.html中直接引入该文件
//引进为该文件时全局变量，所以如果用到如下代码时，直接copy到对应vue组件里即可
ipcRenderer.on('ping', function(event, message) {
    console.log(message);  // Prints "whoooooooh!"
});
