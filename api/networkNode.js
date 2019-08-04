const express = require('express');
const app = express();
const uuid = require('uuid/v1');
const port = process.argv[2];
const axios = require('axios');

// unique string for node address
const nodeAdress = uuid().split('-').join('');

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
    res.json({ note: `transaction will be added in ${blockIndex}` });
});

// broadcast transaction
app.post('/transaction/broadcast', (req, res) => {
    const { amount, sender, recipient } = req.body;
    const requestPromises = [];
    const newTransaction = blockchain.createNewTransaction(amount, sender, recipient);
    blockchain.addTransactionToPendingTransactions(newTransaction);
    // broadcast new transaction to other nodes
    blockchain.networkNodes.forEach((nodeUrl) => {
        const networkPromise = axios.post(`${nodeUrl}/transaction`, { newTransaction });
        // add the return promise from axios into the requestPromises array
        requestPromises.push(networkPromise);
    });
    // execute all promises
    Promise.all(requestPromises)
        .then(data => {
            res.json({
                note: 'Transaction created and broadcasted!'
            })
        })
        .catch(error => {
            res.json({
                error: 'Warning: broadcast failed!'
            })
        });
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
    blockchain.createNewTransaction(12.5, "00", nodeAdress);

    res.json({
        note: "New block mined succesfully!",
        block: newBlock
    });
});

// register a node and broadcast it to the network
app.post('/register-and-broadcast-node', (req, res) => {
    // create the new node url
    const { newNodeUrl } = req.body;
    // create an array to hold the promises made for each node
    const registerNodePromises = [];
    console.log(newNodeUrl)
    // register node url to the network if it isn't already on the network
    if (blockchain.networkNodes.indexOf(newNodeUrl) === -1) {
        blockchain.networkNodes.push(newNodeUrl);
    };
    console.log(blockchain.networkNodes)
    // broadcast new node to other nodes in the network
    blockchain.networkNodes.forEach(nodeUrl => {
        // for every node on the network make a req to '/register-new-node'
        const request = axios.post(`${nodeUrl}/register-new-node`, { newNodeUrl });
        // push the request promise obj into 
        registerNodePromises.push(request);
    });
    console.log(registerNodePromises)
    // run all of the promises in registerNodePromises
    Promise.all(registerNodePromises)
        .then(data => {

            return axios.post(`${newNodeUrl}/register-network-nodes`, { allNetworkNodes: [...blockchain.networkNodes, blockchain.currentNodeUrl] })
        })
        .then(data => {
            res.json({
                note: 'New node registered with network succesfully!'
            })
        })
        .catch(error => {
            res.json({
                note: 'Something went wrong, please try again!',
                error
            })
        });
});

// register node to the network
app.post('/register-new-node', (req, res) => {
    // define new node url
    const { newNodeUrl } = req.body;
    // variable to see if node is already in network
    const nodeNotPresent = blockchain.networkNodes.indexOf(newNodeUrl);
    // variable to see if new node url doesnt match current nodes url
    const notCurrentNode = blockchain.currentNodeUrl !== newNodeUrl;
    // register new node url to the current nodes network if it doesnt exist and not the same as the current node
    if (nodeNotPresent && notCurrentNode) {
        blockchain.networkNodes.push(newNodeUrl);
    };
    // send response
    res.json({
        note: 'New node has been registered!'
    });
});

// register multiple nodes at once
app.post('/register-network-nodes', (req, res) => {
    // get all network nodes from body
    const { allNetworkNodes } = req.body;
    // register all node urls with the new node
    allNetworkNodes.forEach(nodeUrl => {
        // coniditions to not add nodeUrl
        const nodeNotPresent = blockchain.networkNodes.indexOf(nodeUrl) === -1;
        const uniqueNodeUrl = blockchain.currentNodeUrl !== nodeUrl;
        // check for the conditions
        if (nodeNotPresent && uniqueNodeUrl) {
            blockchain.networkNodes.push(nodeUrl);
        };
    });

    res.json({
        note: 'Added network nodes to the new node'
    });
});

app.listen(port, () => console.log(`Network node running on port: ${port}`));