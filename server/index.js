const express = require('express');
const app = express();

// require blockchain
const BC = require('../blockchain');
const blockchain = new BC();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// fetch entire block chain
app.get('/blockchain', (req, res) => {
    res.send(blockchain);
});

// create new transaction
app.post('/transaction', (req, res) => {
    const { amount, sender, recipient } = req.body;
    const blockIndex = blockchain.createNewTransaction(amount, sender, recipient);
    res.json({note: `transaction will be added in ${blockIndex}`});
});

// create a new block
app.get('/mine', (req, res) => {
    const lastBlock = blockchain.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transactions: blockchain.pendingTransactions,
        index: lastBlock['index'] + 1
    };
    const nonce = blockchain.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = blockchain.hashBlock(previousBlockHash, currentBlockData, nonce);
    const newBlock = blockchain.createNewBlock(nonce, previousBlockHash, blockHash);

    // reward for ne block
    // 00 address is a mining reward
    blockchain.createNewTransaction(12.5, "00", )

    res.json({
        note: "New block mined succesfully!",
        block: newBlock
    });
});

app.listen(3005, () => console.log('Server running!'));