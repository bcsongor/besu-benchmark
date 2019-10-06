import fs from 'fs';
import toml from 'toml';
import { EEAPrivateContract, PrivateContractTxOptions } from './eea';

(async function main() {
    const config = toml.parse(fs.readFileSync('./config.toml', 'utf8'));

    const privacyOptions: PrivateContractTxOptions = {
        privateFrom: config.node1.publicKey,
        privateFor: [config.node2.publicKey],
        privateKey: config.node1.privateKey
    };

    const contract = new EEAPrivateContract({ dir: './contract', name: 'KeyValueStore' });

    // Deploy private contract.
    const address = await contract.deploy(privacyOptions);
    console.log(address);
    // const sendTxOptions: PrivateContractTxOptions = { ...privacyOptions, to: '' };

    // Store 1000 key-value pairs in the private contract.
    // contract.send('put', ['foo', 'bar'], sendTxOptions);

    // Read back the stored values from the contract.
})().then();
