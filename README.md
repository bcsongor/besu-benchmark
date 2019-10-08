<a href="https://besu.hyperledger.org/en/latest/" target="_blank">
    <img src="https://www.hyperledger.org/wp-content/uploads/2019/08/Hyperledger_Besu_color.png" height="40"/>
</a>

# Hyperledger Besu benchmarks

## Environment

- **VM:** Azure D2s_v3 (2 vCPU, 8 GB)
- **OS:** Ubuntu 18.04 LTS
- **DLT**: 4 IBFT 2.0 nodes where only the first two nodes are privacy-enabled
  - Hyperledger Besu 1.2.4 
  - Orion 1.4.0

## Results

### [KeyValueStore](./contract/KeyValueStore.sol)

| Key-value pairs | Batch size | Parallel? | Store       | Get       |
|-----------------|------------|-----------|-------------|-----------|
| 100             | 10         | ❌        | 25955.590ms |           |
| 100             | 50         | ❌        | 50390.871ms |           |
