import * as fs from 'fs';
import * as toml from 'toml';
import { EEAPrivateContract, PrivateContractTxOptions, privateKeyToAddress } from './eea';

(async function main() {
    const config = toml.parse(fs.readFileSync('./config.toml', 'utf8'));

    const privacyOptions: PrivateContractTxOptions = {
        from: privateKeyToAddress(config.node1.privateKey),
        privateFrom: config.node1.publicKey,
        privateFor: [config.node2.publicKey],
        privateKey: config.node1.privateKey
    };

    const contract = new EEAPrivateContract({ dir: './contract', name: 'KeyValueStore', rpc: config.node1.rpc });

    // Deploy private contract.
    const address = await contract.deploy(privacyOptions);
    console.log(`Contract address: ${address}`);

    const sendTxOptions: PrivateContractTxOptions = { ...privacyOptions, to: address };

    const { count, batchSize } = config;
    const keys = [...Array(count)].map((_, i: number) => `key${i}`);
    const values = [...Array(count)].map((_, i: number) => `value${i}`);

    // Store n key-value pairs in the private contract.
    let offset = 0;

    console.time('store');

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

    // Read n key-value pairs from the private contract.
    offset = 0;

    console.time('get');

    console.log(`Reading ${count} key-value pairs`);
    while (offset < count) {
        const keysBatch = keys.slice(offset, offset + batchSize);

        console.log(`Retrieving batch ${offset}..${offset + batchSize}`);
        await contract.send('get', [keysBatch], sendTxOptions);
        console.log(`Retrieved batch ${offset}..${offset + batchSize}`);
        offset += config.batchSize;
    }

    console.timeEnd('get');
})().then();
