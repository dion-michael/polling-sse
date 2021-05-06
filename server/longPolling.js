const router = require('express').Router();

const messages = [];

router.get('/messages', (req, res) => {
    const eventEmitter = req.app.get('eventEmitter');
    req.on('close', () => {
        eventEmitter.removeListener('newMessage', () => res.end());
    });
    // LISTEN FOR NEW MESSAGES HERE
    eventEmitter.once('newMessage', (data) => {
        res.json(data);
    });
});

router.post('/message', (req, res) => {
    const eventEmitter = req.app.get('eventEmitter');
    // SAVE THE DATA TO DB
    messages.push(req.body);
    // GET THE NEW ARRAY OF MESSAGES AND PASS IT VIA EMIT
    eventEmitter.emit('newMessage', messages);
    res.json({ status: 'delivered' });
});

module.exports = router