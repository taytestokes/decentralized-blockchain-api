/* Require Blockchain Data Structure */
const Blockchain = require('./blockchain');

/* New Instance of Blockchain Data Structue */
const crypto = new Blockchain();

/* Tests */
const previousBlockHash = 'ASDFHJVD213'
const currentBlockData = [
    {
        amount: 23,
        sender: 'HGDVKJB234',
        recipient: 'JKHUDS324'
    },
    {
        amount: 333,
        sender: 'KJDBVHJKBSBV324324',
        recipient: 'AVSVEDBV234'
    },
    {
        amount: 103,
        sender: 'CBSBGFJWKBF234',
        recipient: '324KJBFS234'
    }
];


console.log(crypto.hashBlock(previousBlockHash, currentBlockData, 18041));