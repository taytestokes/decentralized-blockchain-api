/* Blockchain Data Structure */
function Blockchain(){
    this.chain = [];
    this.newTransactions = [];
};

/* Blockchain Prototype Methods */
Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash){
    // create a new block on the chain
    const newBlock = {
        index: this.chain.length + 1,
        timeStamp: Date.now(),
        transactions: this.newTransactions,
        nonce,
        previousBlockHash,
        hash
    };
    // clear transactions array
    this.newTransactions = [];
    // add the new block to the chain
    this.chain.push(newBlock);
    // return the new block
    return newBlock;
};

Blockchain.prototype.getLastBlock = function(){
    // return last block on the chain
    return this.chain[this.chain.length - 1];
};


/* Export Blockchain Data Structure */
module.exports = Blockchain;