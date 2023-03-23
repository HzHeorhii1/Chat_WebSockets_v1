const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const clients = {};
const messages = [];

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
