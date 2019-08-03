const express = require('express');

const app = express();

// fetch entire block chain
app.get('/blockchain', (req, res) => {

});

// create new transaction
app.post('/transaction', (req, res) => {

});

// create a new block
app.get('/mine', (req, res) => {

});


app.listen(3005, () => console.log('Server running!'));