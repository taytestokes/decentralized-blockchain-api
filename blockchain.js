/* Package Imports */
const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v1');

/* Blockchain Data Structure */
function Blockchain(){
    this.chain = [];
    this.pendingTransactions = [];

    // assign current node url
    this.currentNodeUrl = currentNodeUrl;

    // let node be aware of other nodes on the network
    this.networkNodes = [];

    // generate genesis block
    this.createNewBlock(100, '0', '0');
};

/* Blockchain Prototype Methods */
Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash){
    // create a new block on the chain
    const newBlock = {
        index: this.chain.length + 1,
        timeStamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce,
        previousBlockHash,
        hash
    };
    // clear transactions array
    this.pendingTransactions = [];
    // add the new block to the chain
    this.chain.push(newBlock);
    // return the new block
    return newBlock;
};

Blockchain.prototype.getLastBlock = function(){
    // return last block on the chain
    return this.chain[this.chain.length - 1];
};

Blockchain.prototype.createNewTransaction = function(amount, sender, recipient){
    // create a unique transaction id
    const transacationId = uuid().split('-').join('');
    // create transaction object
    const newTransaction = {
        amount,
        sender,
        recipient,
        transacationId 
    };
    // return new transaction
    return newTransaction;
};

Blockchain.prototype.addTransactionToPendingTransactions = function(transaction){
    // add to the transactions array
    this.pendingTransactions.push(transaction);
    // find new transaction (last block on chain)
    const lastBlock = this.getLastBlock();
    // return the number of the block the transaction was added to
    return lastBlock['index'] + 1;
};

Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce){
    // change data to a single string
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    // create hash of data
    const hash = sha256(dataAsString);
    // return the hash
    return hash;
};

Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData){
    // define a nonce
    let nonce = 0;
    // hash data
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    // check for correct hash value
    while (hash.substring(0,4) !== '0000'){
        // increment nonce by 1
        nonce++;
        // run hashblock method again
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    };
    // return nonce
    return nonce;
};

/* Export Blockchain Data Structure */
module.exports = Blockchain;