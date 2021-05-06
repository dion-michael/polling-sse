const router = require('express').Router();
const { EventEmitter } = require('events');

const eventEmitter = new EventEmitter();

const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
};

let clients = [];

const messages = [];

router.get('/messages-stream', (req, res) => {
    // SET THE HEADERS TO EVENT STREAM
    res.set(headers);
    res.flushHeaders();

    // SEND THE INITIAL DATA
    const data = `data: ${JSON.stringify(messages)}\n\n`;
    res.write(data);

    // ADD A NEW CLIENT
    const clientId = Date.now();
    const newClient = {
        id: clientId,
        response: res,
    };
    clients.push(newClient);

    console.log(`client ${clientId} connected`)

    // KEEP ALIVE THE CONNECTION
    const interval = setInterval(() => {
        res.write('event: KEEP_ALIVE\n')
        res.write('data: \n\n');
        res.flushHeaders()
    }, 100000);

    // ON CLOSE CALLBACK
    req.on('close', () => {
        console.log(`client ${clientId} disconnected`);
        clearInterval(interval);
        clients = clients.filter(client => client.id !== clientId);
    }); 
});

router.post('/message', (req, res) => {
    const { from, message } = req.body;
    messages.push(req.body);
    res.json({ status: 'delivered' });
    return sendToAll({from, message});
});

const sendToAll = (data) => {
    clients.forEach(client => client.response.write(`data: ${JSON.stringify(data)}\n\n`))
};

module.exports = router