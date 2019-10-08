<a href="https://besu.hyperledger.org/en/latest/" target="_blank">
    <img src="https://www.hyperledger.org/wp-content/uploads/2019/08/Hyperledger_Besu_color.png" height="40"/>
</a>

# Hyperledger Besu benchmarks

## Contents

- [eea.ts](eea.ts), a lightweight TypeScript wrapper around PegaSys's web3.js EEA extensions and private smart contract operations. See [main.ts](main.ts) for example usage;
- [rpc.py](scripts/rpc.py), a utility script to help interact with Besu's JSON RPC.
Usage: `./rpc.py <method> <params> <endpoint>`, for example `./rpc.py admin_nodeInfo`.

## Benchmark

### Environment

- **VM:** Azure D2s_v3 (2 vCPU, 8 GB)
- **OS:** Ubuntu 18.04 LTS
- **DLT**: 4 IBFT 2.0 nodes where only the first two nodes are privacy-enabled
  - Hyperledger Besu 1.2.4 
  - Orion 1.4.0

### Results

#### [KeyValueStore](./contract/KeyValueStore.sol)

| Key-value pairs | Batch size | Parallel? | Store       | Fetch       |
|-----------------|------------|-----------|-------------|-------------|
| 100             | 5          | ❌        | 54432.529ms | 52249.685ms |
| 100             | 10         | ❌        | 26855.693ms | 25716.169ms |
| 100             | 50         | ❌        | 58093.335ms | 37195.854ms |
