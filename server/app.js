const express = require('express');
const { EventEmitter } = require('events');
const cors = require('cors');

const app = express();
const port = 3001;
const eventEmitter = new EventEmitter();

app.use(cors());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: false,
    }),
);
app.set('eventEmitter', eventEmitter);

app.use('/polling', require('./polling'));
app.use('/long-polling', require('./longPolling'));
app.use('/sse', require('./sse'));

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
});