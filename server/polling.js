const router = require('express').Router();

const messages = [];

router.get('/messages', (req, res) => {
    res.json(messages);
});

router.post('/message', (req, res) => {
    messages.push(req.body);
    res.json({ status: 'delivered' });
});

module.exports = router