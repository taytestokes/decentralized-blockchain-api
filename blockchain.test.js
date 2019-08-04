/* Require Blockchain Data Structure */
const Blockchain = require('./blockchain');

/* New Instance of Blockchain Data Structue */
const crypto = new Blockchain();

// Test Chain
const blockchain_one = {
    chain: [
        {
            index: 1,
            timeStamp: 1564943760256,
            transactions: [],
            nonce: 100,
            previousBlockHash: "0",
            hash: "0"
        },
        {
            index: 2,
            timeStamp: 1564943793629,
            transactions: [],
            nonce: 18140,
            previousBlockHash: "0",
            hash: "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
        },
        {
            index: 3,
            timeStamp: 1564943848765,
            transactions: [
                {
                    amount: 12.5,
                    sender: "00",
                    recipient: "b4bd50f0b6e611e9a3b231fdb6313296",
                    transacationId: "c8a6d1e0b6e611e9a3b231fdb6313296"
                },
                {
                    amount: 100,
                    sender: "KJHSDKJBD897234234",
                    recipient: "234DKJBD13242345",
                    transacationId: "dbff8480b6e611e9a3b231fdb6313296"
                },
                {
                    amount: 30,
                    sender: "KJHSDKJBD897234234",
                    recipient: "234DKJBD13242345",
                    transacationId: "e0a73aa0b6e611e9a3b231fdb6313296"
                },
                {
                    amount: 50,
                    sender: "KJHSDKJBD897234234",
                    recipient: "234DKJBD13242345",
                    transacationId: "e2f06750b6e611e9a3b231fdb6313296"
                },
                {
                    amount: 1,
                    sender: "KJHSDKJBD897234234",
                    recipient: "234DKJBD13242345",
                    transacationId: "e579f860b6e611e9a3b231fdb6313296"
                }
            ],
            nonce: 107666,
            previousBlockHash: "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
            hash: "0000bc069834223487879162468b35315965b76b32972e1e0ad6b2b514797004"
        },
        {
            index: 4,
            timeStamp: 1564943902199,
            transactions: [
                {
                    amount: 12.5,
                    sender: "00",
                    recipient: "b4bd50f0b6e611e9a3b231fdb6313296",
                    transacationId: "e97f2cf0b6e611e9a3b231fdb6313296"
                },
                {
                    amount: 15,
                    sender: "KJHSDKJBD897234234",
                    recipient: "234DKJBD13242345",
                    transacationId: "fad90250b6e611e9a3b231fdb6313296"
                },
                {
                    amount: 60,
                    sender: "KJHSDKJBD897234234",
                    recipient: "234DKJBD13242345",
                    transacationId: "fcbe3d10b6e611e9a3b231fdb6313296"
                },
                {
                    amount: 20,
                    sender: "KJHSDKJBD897234234",
                    recipient: "234DKJBD13242345",
                    transacationId: "feabb530b6e611e9a3b231fdb6313296"
                }
            ],
            nonce: 137913,
            previousBlockHash: "0000bc069834223487879162468b35315965b76b32972e1e0ad6b2b514797004",
            hash: "00000b8c8ea98e0d240d9f8cf0882d0b5cb8859afe7397dd457ffe8bd3c7dd49"
        },
        {
            index: 5,
            timeStamp: 1564943908094,
            transactions: [
                {
                    amount: 12.5,
                    sender: "00",
                    recipient: "b4bd50f0b6e611e9a3b231fdb6313296",
                    transacationId: "0958b5a0b6e711e9a3b231fdb6313296"
                }
            ],
            nonce: 69152,
            previousBlockHash: "00000b8c8ea98e0d240d9f8cf0882d0b5cb8859afe7397dd457ffe8bd3c7dd49",
            hash: "0000a3730cf576e557bf8048c06add9861ca93527246a1f39d2c45c8f41f7c12"
        },
        {
            index: 6,
            timeStamp: 1564943911127,
            transactions: [
                {
                    amount: 12.5,
                    sender: "00",
                    recipient: "b4bd50f0b6e611e9a3b231fdb6313296",
                    transacationId: "0cdc1000b6e711e9a3b231fdb6313296"
                }
            ],
            nonce: 129759,
            previousBlockHash: "0000a3730cf576e557bf8048c06add9861ca93527246a1f39d2c45c8f41f7c12",
            hash: "000076679dbe3a04bb25c19cc96f20d7b224eff9a878e695bd0c85bec7a097f8"
        }
    ],
        pendingTransactions: [
            {
                amount: 12.5,
                sender: "00",
                recipient: "b4bd50f0b6e611e9a3b231fdb6313296",
                transacationId: "0eab2ab0b6e711e9a3b231fdb6313296"
            }
        ],
            currentNodeUrl: "http://localhost:3001",
                networkNodes: []
};

console.log(crypto.chainIsValid(blockchain_one.chain));