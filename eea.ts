import * as fs from 'fs';
import * as path from 'path';
import Web3 = require('web3');
import Web3EEA = require('web3-eea');

export interface PrivateContractTxOptions {
    to?: string;
    from?: string;
    privateFrom: string;
    privateFor: string[];
    privateKey: string;
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
    send(fn: string, params: string[], options: PrivateContractTxOptions): Promise<any>;
}

type Web3EEA = Web3 & {
    eea: {
        sendRawTransaction: (options: any) => Promise<any>;
    };
    priv: {
        getTransactionReceipt: (txHash: string, publicKey: string) => Promise<any>;
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

    public deploy(options: PrivateContractTxOptions): Promise<any> {
        return this.web3.eea.sendRawTransaction({
            ...options,
            data: `0x${this.bin}`
        });
    }

    public send(fn: string, params: string[], options: PrivateContractTxOptions): Promise<any> {
        const functionAbi = this.contract._jsonInterface.find((e: any) => e.name === fn);
        const functionArgs = this.web3.eth.abi.encodeParameters(functionAbi.inputs, params).slice(2);

        return this.web3.eea.sendRawTransaction({
            to: this.address,
            ...options,
            data: functionAbi.signature + functionArgs
        });
    }
}

