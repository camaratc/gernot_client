const notifier = require('node-notifier');
const path = require('path');
const http = require('http');
 
const axios = require('axios');

function categoria(tag){
    if(tag === 0) return "Erro";
    else if(tag === 1) return "Aviso";
    else if(tag === 2) return "Recomendação";
}

function searchNotification(){
    let writeContent = document.getElementById('content');
    writeContent.innerHTML = ``;

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

            writeContent.innerHTML += `
                ID: ${response.data[i].pk} <br />
                Título: ${item.title} <br />
                Mensagem: ${item.message} <br />
                Autor: ${item.author} <br />
                Data de Envio: ${item.send_date} <br />
                Categoria: ${categoria(item.tag)} <br />
                <br />
            `;
        }
    })
    .catch(error => {
        console.log(error);
    });
}

/* document.getElementById('notify').onclick = (event) => {
    notifier.notify ({
        title: 'Teste Notificação',
        message: 'Esta é uma notificação teste...',
        icon: path.join('','/home/ayushgp/Desktop/images.png'),
        sound: true,
        wait: true            
    }, (err, response) => {
        // ...
    });
}
 */
