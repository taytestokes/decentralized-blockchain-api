/* Package Imports */
const sha256 = require('sha256');

/* Blockchain Data Structure */
function Blockchain(){
    this.chain = [];
    this.pendingTransactions = [];
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
    // create transaction object
    const newTransaction = {
        amount,
        sender,
        recipient
    };
    // add to the transactions array
    this.pendingTransactions.push(newTransaction);
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

/* Export Blockchain Data Structure */
module.exports = Blockchain;