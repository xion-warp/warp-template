// FIXME: Port over to Archway once support for local test env & `warp node` is implemented

import { MsgStoreCodeEncodeObject, ArchwayClient, SigningArchwayClient, SigningCosmWasmClient, SigningCosmWasmClientOptions,} from '@archwayhq/arch3.js'
import { GasPrice } from '@cosmjs/stargate';
import * as fs from 'fs'
import { Coin, DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import axios from 'axios';

export async function getConstantineConnection(mnemonic?: string) : Promise<[ArchwayClient, SigningArchwayClient]> {
  const network = {
    chainId: 'constantine-2',
    endpoint: 'https://rpc.constantine-2.archway.tech',
    prefix: 'archway',
  };
  
  let queryClient = await ArchwayClient.connect(network.endpoint);
    
  let signingClient: SigningArchwayClient;
  if (mnemonic) {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: network.prefix });
    let opt: SigningCosmWasmClientOptions = { gasPrice: GasPrice.fromString("0.012uconst") };
    
    signingClient = await SigningArchwayClient.connectWithSigner(network.endpoint, wallet, {
      ...opt,
      prefix: network.prefix,
    });
  }
    return [queryClient, signingClient];
}

export async function getGenesisWallets(): Promise<DirectSecp256k1HdWallet[]> {
    let wallets: DirectSecp256k1HdWallet[] = new Array(4);
    wallets[0] = await DirectSecp256k1HdWallet.fromMnemonic("grant rice replace explain federal release fix clever romance raise often wild taxi quarter soccer fiber love must tape steak together observe swap guitar", {prefix: "archway"});
    wallets[1] = await DirectSecp256k1HdWallet.fromMnemonic("jelly shadow frog dirt dragon use armed praise universe win jungle close inmate rain oil canvas beauty pioneer chef soccer icon dizzy thunder meadow", {prefix: "archway"});
    wallets[1] = await DirectSecp256k1HdWallet.fromMnemonic("chair love bleak wonder skirt permit say assist aunt credit roast size obtain minute throw sand usual age smart exact enough room shadow charge", {prefix: "archway"});
    wallets[1] = await DirectSecp256k1HdWallet.fromMnemonic("word twist toast cloth movie predict advance crumble escape whale sail such angry muffin balcony keen move employ cook valve hurt glimpse breeze brick", {prefix: "archway"});
    return wallets;
}

export async function storeAndInitContract(client: SigningArchwayClient, sender: string, contractPath: string, initMsg: any, label?: string, funds?: Coin[]): Promise<string> {
    const bytecode = fs.readFileSync(contractPath) as Uint8Array;
    let storeTx = await client.upload(sender, bytecode, "auto");
    const codeId = storeTx.codeId;

    const instantiate = await client.instantiate(sender, codeId, initMsg, label, "auto", { funds })

    return instantiate.contractAddress;
}


export async function requestFaucetTokensConstantine(address: string, coin: string): Promise<boolean> {
  let response = await axios.post("https://faucet.constantine-2.archway.tech/", {
    address,
    coins: [
      coin
    ]
  });
  return response.status == 200;
}