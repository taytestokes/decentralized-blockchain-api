const express = require('express');
const app = express();
const uuid = require('uuid/v1');
const port = process.argv[2];
const axios = require('axios');

// unique string for node address
const nodeAdress = uuid().split('-').join('');

// require blockchain
const BC = require('../blockchain_structure/blockchain');
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
    // store new transaction
    const { newTransaction } = req.body;
    // add new transaction to pending transactions
    const blockIndexToRecieveTransaction = blockchain.addTransactionToPendingTransactions(newTransaction);
    // send response
    res.json({
        note: `Transaction will be added to block ${blockIndexToRecieveTransaction}`
    });
});

// broadcast transaction
app.post('/transaction/broadcast', (req, res) => {
    const { amount, sender, recipient } = req.body;
    const requestPromises = [];
    const newTransaction = blockchain.createNewTransaction(amount, sender, recipient);
    console.log(newTransaction)
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
    // capture the last block in the chain
    const lastBlock = blockchain.getLastBlock();
    // get the hash of the previous block
    const previousBlockHash = lastBlock['hash'];
    // create the current block data to store transactions and an index
    const currentBlockData = {
        transactions: blockchain.pendingTransactions,
        index: lastBlock['index'] + 1
    };
    // create a nonce using the proofOfWork
    const nonce = blockchain.proofOfWork(previousBlockHash, currentBlockData);
    // develope the blockhash
    const blockHash = blockchain.hashBlock(previousBlockHash, currentBlockData, nonce);
    // create the new block
    const newBlock = blockchain.createNewBlock(nonce, previousBlockHash, blockHash);

    // array to store every promise return from the requests below
    const networkRequests = [];
    // send new block as data to nodes in the network
    blockchain.networkNodes.forEach((nodeUrl) => {
        // make a req for each node on the network
        const requestPromise = axios.post(`${nodeUrl}/recieve-new-block`, { newBlock });
        // push requestPrmise into the networkPromises array
        networkRequests.push(requestPromise);
    });

    // execute the promises in networkRewquests
    Promise.all(networkRequests)
        .then(data => {
            // create a body for the req for the mining reward
            const reqBody = {
                amount: 12.5,
                sender: '00',
                recipient: nodeAdress
            };
            // send a req to /transaction/broadcast to the current nodoe to broadcast the mining reward data
            return axios.post(`${blockchain.currentNodeUrl}/transaction/broadcast`, reqBody);
        })
        .then(data => {
            // send a response
            res.json({
                note: "New block mined succesfully and broadcasted!",
                block: newBlock
            });
        })
        .catch(error => {
            res.json({
                error: 'An Error has appeared, please try again!'
            })
        })
});

// recieve the broadcasted block
app.post('/recieve-new-block', (req, res) => {
    // take the new block off of the req body
    const { newBlock } = req.body;
    // get the last block on chain
    const lastBlock = blockchain.getLastBlock();
    // test if the lastblock hash matches the newblock previous hash
    const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    // test to see if new block has correct index
    const correctIndex = lastBlock['index'] + 1 === newBlock['index'];
    // run the test
    if (correctHash && correctIndex) {
        // add block to chain
        blockchain.chain.push(newBlock);
        // clear pending transactions
        blockchain.pendingTransactions = [];
        // send response with note and new block
        res.json({
            note: 'Block was added to the chain!',
            newBlock
        });
    } else {
        // send a failure response
        res.json({
            note: 'New block was rejected',
            newBlock
        });
    };
});

// register a node and broadcast it to the network
app.post('/register-and-broadcast-node', (req, res) => {
    // create the new node url
    const { newNodeUrl } = req.body;
    // create an array to hold the promises made for each node
    const registerNodePromises = [];
    // register node url to the network if it isn't already on the network
    if (blockchain.networkNodes.indexOf(newNodeUrl) === -1) {
        blockchain.networkNodes.push(newNodeUrl);
    };
    // broadcast new node to other nodes in the network
    blockchain.networkNodes.forEach(nodeUrl => {
        // for every node on the network make a req to '/register-new-node'
        const request = axios.post(`${nodeUrl}/register-new-node`, { newNodeUrl });
        // push the request promise obj into 
        registerNodePromises.push(request);
    });
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

// endpoint to check to see if the current nodes blockchain matches up
app.get('/consensus', (req, res) => {
    // create an array to hold promises
    const reqPromises = [];
    // get the block chain for every node
    blockchain.networkNodes.forEach((nodeUrl) => {
        const reqPromise = axios.get(`${nodeUrl}/blockchain`)
        // push the promise into the array
        reqPromises.push(reqPromise);
    });
    // execute the promises in the array
    Promise.all(reqPromises)
        .then(blockchains => {
            // create data to use
            const currentBlockchainLength = blockchain.chain.length;
            let maxChainLength = currentBlockchainLength;
            let newLongestChain = null;
            let newPendingTransactions = null;
            // iterate through blockchains and check to make sure they match
            blockchains.forEach((blockchain) => {
                // compare current blockchain in the iteration to the maxchainlength
                if (blockchain.chain.length > maxChainLength) {
                    // reassign max length
                    maxChainLength = blockchain.chain.length;
                    // set new longest chain to the one in the current iteration
                    newLongestChain = blockchain.chain
                    // replace pending transactions with the one in the current iteration
                    newPendingTransactions = blockchain.pendingTransactions;
                };
            });
            // check to see if the current chain has been replaced
            if (!newLongestChain || (newLongestChain && blockchain.chainIsValid(newLongestChain))) {
                // send a response
                res.json({
                    note: 'The chain on the current node has not been replaced!',
                    chain: blockchain.chain
                })
            } else if (newLongestChain && blockchain.chainIsValid(newLongestChain)) {
                // replace the current nodes chain
                blockchain.chain = newLongestChain;
                // replaces the current nodes transactions
                blockchain.pendingTransactions = newPendingTransactions;
                // send a response with a message and the new chain
                res.json({
                    note: 'This chain has been replaced!',
                    chain: block.chain
                });
            };
        })
        .catch(error => {
            // send error message if somethings fails
            res.json({
                note: 'Error, something went wrong!'
            });
        });
});

app.get('/bock/:blockHash', (req, res) => {
    // get the block hash from the params of the req
    const { blockHash } = req.params;
    // find the block using the hash
    const result = blockchain.getBlock(blockHash);
    // send back the result
    res.json({
        block: result
    });
});

app.get('/transaction/:transactionId', (req, res) => {
    // take transaction id from req params
    const { transactionId } = req.params;
    // use get transaction
    const result = blockchain.getTransaction(transactionId);
    // send result back
    res.json({
        transaction: result.transaction,
        block: transaction.block
    })
});

app.get('/address/:address', (req, res) => {
    // store address from params
    const { address } = req.params;
    // use proto method to find address
    const result = blockchain.getAddressData(address);
    // send response with data
    res.json({
        addressData: result
    });
});

app.listen(port, () => console.log(`Network node running on port: ${port}`));