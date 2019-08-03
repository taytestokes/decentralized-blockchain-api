/* Require Blockchain Data Structure */
const Blockchain = require('./blockchain');

/* New Instance of Blockchain Data Structue */
const chain = new Blockchain();

/* Tests */

// createNewBlock
chain.createNewBlock(1234, 'LKHJSP234DFS', 'SDKLFHVPOE987632');
chain.createNewBlock(2343, 'SDKLFHVPOE987632', 'KJDAFJKHV832');
chain.createNewBlock(32454, 'SDGVIDNDCJKS23', 'LDJCIS23');




console.log(chain);