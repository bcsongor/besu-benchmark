import * as fs from 'fs';
import * as toml from 'toml';
import { EEAPrivateContract, PrivateContractTxOptions } from './eea';

(async function main() {
    const config = toml.parse(fs.readFileSync('./config.toml', 'utf8'));

    const privacyOptions: PrivateContractTxOptions = {
        privateFrom: config.node1.publicKey,
        privateFor: [config.node2.publicKey],
        privateKey: config.node1.privateKey
    };

    const contract = new EEAPrivateContract({ dir: './contract', name: 'KeyValueStore', rpc: config.node1.rpc });

    // Deploy private contract.
    const address = await contract.deploy(privacyOptions);
    console.log(`Contract address: ${address}`);

    const sendTxOptions: PrivateContractTxOptions = { ...privacyOptions, to: address };

    // Store n key-value pairs in the private contract.
    console.time('store');

    const { count, batchSize } = config;
    const keys = [...Array(count)].map((_, i: number) => `key${i}`);
    const values = [...Array(count)].map((_, i: number) => `value${i}`);

    let offset = 0;

    console.log(`Storing ${count} key-value pairs`);
    while (offset < count) {
        const keysBatch = keys.slice(offset, offset + batchSize);
        const valuesBatch = values.slice(offset, offset + batchSize);

        console.log(`Storing batch ${offset}..${offset + batchSize}`);
        await contract.send('put', [keysBatch, valuesBatch], sendTxOptions);
        console.log(`Stored batch ${offset}..${offset + batchSize}`);
        offset += config.batchSize;
    }

    console.timeEnd('store');
)().then();
