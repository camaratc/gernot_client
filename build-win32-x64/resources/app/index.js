const {app, BrowserWindow, Tray} = require('electron');

let mainWindow;
let tray = null;

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function () {
    // mainWindow = null;
  })
}

// app.on('ready', createWindow);

app.on('ready', () => {
  tray = new Tray('../assets/img/destaque.jpg');
  tray.setTitle('Gernot')
  tray.setToolTip('Nenhuma notificação no momento.');
});


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    // createWindow();
  }
})

// Requisição

const notifier = require('node-notifier');
const axios = require('axios');

const minutes = 0.1, theInterval = minutes * 60 * 1000;

let recentNotifications = [];

function notificationPool(notification){
    for(let i = 0; i < recentNotifications.length; i++){
        if(notification === recentNotifications[i]){
            return;
        }
    }

    if(recentNotifications.length >= 10){
        recentNotifications.shift();
        recentNotifications.push(notification);
    }
    else{
        recentNotifications.push(notification);
    }

    return recentNotifications;
}

function setTag(tag){
    if(tag === 0) return "Erro";
    else if(tag === 1) return "Aviso";
    else if(tag === 2) return "Recomendação";
}

function searchNotification(){
    axios.get('http://192.168.1.253:8030/api/notification/')

    .then(response => {
        for(let i = 0; i < response.data.length; i++){
            let notify = true;

            let item = response.data[i].fields;

            for(let j = 0; j < recentNotifications.length; j++){
                if(response.data[i].pk === recentNotifications[j]){
                    notify = false;
                }
            }

            if(notify){
                notifier.notify ({
                    title: item.title,
                    message: item.message,
                    sound: true,
                    wait: true            
                }, (err, response) => {
                    // console.log(err);    
                });
            }

            notificationPool(response.data[i].pk);
        }

        // console.log(`Lista de Notificações: ${recentNotifications}`);
    })
    .catch(error => {
        console.log(error);
    });
}

setInterval(() => {
    // console.log("Realizando checagem...");
    searchNotification();
}, theInterval);