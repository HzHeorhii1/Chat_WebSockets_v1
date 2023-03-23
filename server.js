const WebSocket = require('ws');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const clients = {};
const messages = [];
const db = "mongodb+srv://admin:admin1234@cluster0.3bct53e.mongodb.net/?retryWrites=true&w=majority"


const wss = new WebSocket.Server({port: 3060});
wss.on('connection', (ws) => {
    const id = uuidv4();
    clients[id] = ws;

    console.log(`New client ${id}`);

    ws.send(JSON.stringify(messages));

    ws.on('message', (rawMessage) => {
        const {name, message} = JSON.parse(rawMessage);
        messages.push({name, message});
        for(const id in clients){
            clients[id].send(JSON.stringify([{name, message}]))
        }
    })

    ws.on('close', () => {
        delete clients[id];
        console.log(`client ${id} was closed`)
    })
});

process.on('SIGINT', () => {
    wss.close();
    messages.save(function(err) {
        if (err) throw err;
        console.log('Message saved successfully!');
        process.exit();
    });
})

async function dbStart(){
    try{
        await mongoose.connect(db);
        console.log("connected to database!");
    } catch {
        console.log(e);
    }
}

dbStart();