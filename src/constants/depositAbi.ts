export const abi = [
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint256',
          name: 'priorityOpId',
          type: 'uint256',
        },
        {
          components: [
            {
              internalType: 'address',
              name: 'gateway',
              type: 'address',
            },
            {
              internalType: 'bool',
              name: 'isContractCall',
              type: 'bool',
            },
            {
              internalType: 'address',
              name: 'sender',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'txId',
              type: 'uint256',
            },
            {
              internalType: 'address',
              name: 'contractAddressL2',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'l2Value',
              type: 'uint256',
            },
            {
              internalType: 'bytes',
              name: 'l2CallData',
              type: 'bytes',
            },
            {
              internalType: 'uint256',
              name: 'l2GasLimit',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'l2GasPricePerPubdata',
              type: 'uint256',
            },
            {
              internalType: 'bytes[]',
              name: 'factoryDeps',
              type: 'bytes[]',
            },
            {
              internalType: 'address',
              name: 'refundRecipient',
              type: 'address',
            },
          ],
          indexed: false,
          internalType: 'struct IMailbox.ForwardL2Request',
          name: 'l2Request',
          type: 'tuple',
        },
      ],
      name: 'NewPriorityRequest',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint256',
          name: 'txId',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'bytes32',
          name: 'txHash',
          type: 'bytes32',
        },
        {
          indexed: false,
          internalType: 'uint64',
          name: 'expirationTimestamp',
          type: 'uint64',
        },
        {
          components: [
            {
              internalType: 'uint256',
              name: 'txType',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'from',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'to',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'gasLimit',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'gasPerPubdataByteLimit',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'maxFeePerGas',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'maxPriorityFeePerGas',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'paymaster',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'nonce',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'value',
              type: 'uint256',
            },
            {
              internalType: 'uint256[4]',
              name: 'reserved',
              type: 'uint256[4]',
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
            {
              internalType: 'bytes',
              name: 'signature',
              type: 'bytes',
            },
            {
              internalType: 'uint256[]',
              name: 'factoryDeps',
              type: 'uint256[]',
            },
            {
              internalType: 'bytes',
              name: 'paymasterInput',
              type: 'bytes',
            },
            {
              internalType: 'bytes',
              name: 'reservedDynamic',
              type: 'bytes',
            },
          ],
          indexed: false,
          internalType: 'struct IMailbox.L2CanonicalTransaction',
          name: 'transaction',
          type: 'tuple',
        },
        {
          indexed: false,
          internalType: 'bytes[]',
          name: 'factoryDeps',
          type: 'bytes[]',
        },
      ],
      name: 'NewPriorityRequest',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'l2DepositTxHash',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'from',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'to',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'l1Token',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'DepositInitiated',
      type: 'event',
    },
  ];
  