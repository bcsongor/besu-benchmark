import * as fs from 'fs';
import * as path from 'path';
export import Web3 = require('web3');
export import Web3EEA = require('web3-eea');
import { privateToAddress } from 'web3-eea/src/custom-ethjs-util';

export interface PrivateContractTxOptions {
    privateFrom: string;
    privateFor: string[];
    privateKey: string;
    to?: string;
    from?: string;
    // Validation constraint for private transactions: 
    // https://github.com/hyperledger/besu/blob/master/ethereum/core/src/main/java/org/hyperledger/besu/ethereum/privacy/PrivateTransactionValidator.java#L61
    nonce?: number;
}

export interface PrivateContractOptions {
    dir: string;
    name: string;
    address?: string;
    rpc?: string;
    chainId?: number;
}

export interface PrivateContract {
    deploy(options: PrivateContractTxOptions): Promise<any>;
    send(fn: string, params: any[], options: PrivateContractTxOptions): Promise<any>;
}

type Web3EEA = Web3 & {
    eea: {
        sendRawTransaction: (options: any) => Promise<string>;
    };
    priv: {
        getTransactionReceipt: (txHash: string, publicKey: string) => Promise<any>;
        getTransactionCount: (options: any) => Promise<any>;
    };
}

export class EEAPrivateContract implements PrivateContract {
    private readonly bin: string;
    private readonly web3: Web3EEA;
    private readonly contract: any;
    private address: string;

    constructor(options: PrivateContractOptions) {
        const binPath = path.join(__dirname, options.dir, `${options.name}.bin`);
        const abiPath = path.join(__dirname, options.dir, `${options.name}.abi`);
 
        this.bin = fs.readFileSync(binPath, 'utf8');
        const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));

        this.web3 = new Web3EEA(new Web3(options.rpc || 'http://localhost:8545'), options.chainId || 2018);
        this.contract = new this.web3.eth.Contract(abi);

        if (options.address) this.address = options.address;
    }

    public async deploy(options: PrivateContractTxOptions): Promise<any> {
        const txhash = await this.web3.eea.sendRawTransaction({
            ...options,
            data: `0x${this.bin}`
        });

        const result = await this.web3.priv.getTransactionReceipt(txhash, options.privateFrom);

        return result.contractAddress;
    }

    public async send(fn: string, params: any[], options: PrivateContractTxOptions): Promise<any> {
        const functionAbi = this.contract._jsonInterface.find((e: any) => e.name === fn);
        const functionArgs = this.web3.eth.abi.encodeParameters(functionAbi.inputs, params).slice(2);

        const txHash = await this.web3.eea.sendRawTransaction({
            to: this.address,
            ...options,
            data: functionAbi.signature + functionArgs
        });

        return this.web3.priv.getTransactionReceipt(txHash, options.privateFrom);
    }

    public decodeOutput(fn: string, bytecode: string) {
        const functionAbi = this.contract._jsonInterface.find((e: any) => e.name === fn);
        const types = functionAbi.outputs.map((e: any) => e.type);

        return this.web3.eth.abi.decodeParameters(types, bytecode);
    }
}

export function privateKeyToAddress(privateKey: string): string {
    const hexPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
    return `0x${privateToAddress(hexPrivateKey).toString('hex')}`;
}

