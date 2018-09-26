const notifier = require('node-notifier');
const path = require('path');
const http = require('http');
const axios = require('axios');

const minutes = 0.25, theInterval = minutes * 60 * 1000;

function categoria(tag){
    if(tag === 0) return "Erro";
    else if(tag === 1) return "Aviso";
    else if(tag === 2) return "Recomendação";
}

function searchNotification(){
    axios.get('http://127.0.0.1:8000/api/notification/')

    .then(response => {
        for(let i = 0; i < response.data.length; i++){
            let item = response.data[i].fields;

            notifier.notify ({
                title: item.title,
                message: item.message,
                sound: true,
                wait: true            
            }, (err, response) => {
                console.log(err);    
            });
        }
    })
    .catch(error => {
        console.log(error);
    });
}

setInterval(() => {
    console.log("Realizando checagem...");
    document.getElementById('content').innerHTML += 'Realizando Checagem...<br />';
    searchNotification();
}, theInterval);