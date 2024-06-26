export const l1EthDepositAbi = {
  inputs: [
    {
      internalType: "address",
      name: "_contractL2",
      type: "address",
    },
    {
      internalType: "uint256",
      name: "_l2Value",
      type: "uint256",
    },
    {
      internalType: "bytes",
      name: "_calldata",
      type: "bytes",
    },
    {
      internalType: "uint256",
      name: "_l2GasLimit",
      type: "uint256",
    },
    {
      internalType: "uint256",
      name: "_l2GasPerPubdataByteLimit",
      type: "uint256",
    },
    {
      internalType: "bytes[]",
      name: "_factoryDeps",
      type: "bytes[]",
    },
    {
      internalType: "address",
      name: "_refundRecipient",
      type: "address",
    },
  ],
  name: "requestL2Transaction",
  outputs: [
    {
      internalType: "bytes32",
      name: "canonicalTxHash",
      type: "bytes32",
    },
  ],
  stateMutability: "payable",
  type: "function",
};
