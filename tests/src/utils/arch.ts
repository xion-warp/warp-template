// FIXME: Port over to Archway once support for local test env & `warp node` is implemented

import { ArchwayClient, SigningArchwayClient, getSigningCosmosClientOptions} from '@archwayhq/arch3.js'
import * as fs from 'fs'
import { Coin, DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import axios from 'axios';
import { TestConsts } from '../consts';

export async function getConstantineConnection(mnemonic?: string) : Promise<{queryClient: ArchwayClient, signingClient: SigningArchwayClient, defaultAddress: string}> {
  const network = {
    chainId: 'constantine-3',
    endpoint: 'https://rpc.constantine.archway.tech',
    prefix: 'archway',
  };
  const queryClient = await ArchwayClient.connect(network.endpoint);

  let wallet: DirectSecp256k1HdWallet;
  if (mnemonic) {
    wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: network.prefix, });
  } else {
    wallet = await DirectSecp256k1HdWallet.generate(12, { prefix: network.prefix });
  }
  
  const defaultAddress = (await wallet.getAccounts())[0].address;
  const signingClient = await SigningArchwayClient.connectWithSigner(network.endpoint, wallet);
  return {queryClient, signingClient, defaultAddress};
}

export async function getExampleWallets(): Promise<DirectSecp256k1HdWallet[]> {
    const wallets: DirectSecp256k1HdWallet[] = [];
    wallets.push(await DirectSecp256k1HdWallet.fromMnemonic("grant rice replace explain federal release fix clever romance raise often wild taxi quarter soccer fiber love must tape steak together observe swap guitar", {prefix: "archway"}));
    wallets.push(await DirectSecp256k1HdWallet.fromMnemonic("jelly shadow frog dirt dragon use armed praise universe win jungle close inmate rain oil canvas beauty pioneer chef soccer icon dizzy thunder meadow", {prefix: "archway"}));
    wallets.push(await DirectSecp256k1HdWallet.fromMnemonic("chair love bleak wonder skirt permit say assist aunt credit roast size obtain minute throw sand usual age smart exact enough room shadow charge", {prefix: "archway"}));
    wallets.push(await DirectSecp256k1HdWallet.fromMnemonic("word twist toast cloth movie predict advance crumble escape whale sail such angry muffin balcony keen move employ cook valve hurt glimpse breeze brick", {prefix: "archway"}));
    
    return wallets;
}

export async function storeAndInitContract(client: SigningArchwayClient, sender: string, contractPath: string, initMsg: any, label: string, funds?: Coin[]): Promise<string> {
    const bytecode = fs.readFileSync(contractPath) as Uint8Array;
    const storeTx = await client.upload(sender, bytecode, "auto");
    const instantiate = await client.instantiate(sender, storeTx.codeId, initMsg, label, "auto", { funds })

    return instantiate.contractAddress;
}


export async function requestFaucetTokensConstantine(address: string, coin: string): Promise<boolean> {
  const response = await axios.post("https://faucet.constantine.archway.tech/", {
    address,
    coins: [
      coin
    ]
  });
  
  return response.status == 200;
}