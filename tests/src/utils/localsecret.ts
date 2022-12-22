import { MsgStoreCode, SecretNetworkClient, Wallet } from 'secretjs'
import * as fs from 'fs'
import CryptoJS from 'crypto-js'

export function getLocalSecretConnection(wallet?: Wallet) : SecretNetworkClient {
    let client = new SecretNetworkClient({
        url: "http://localhost:1317",
        wallet,
        walletAddress: wallet?.address,
        chainId: "secretdev-1"
    });
    return client;
}

export function getGenesisWallets(): Wallet[] {
    let wallets: Wallet[] = new Array(4);
    wallets[0] = new Wallet("grant rice replace explain federal release fix clever romance raise often wild taxi quarter soccer fiber love must tape steak together observe swap guitar");
    wallets[1] = new Wallet("jelly shadow frog dirt dragon use armed praise universe win jungle close inmate rain oil canvas beauty pioneer chef soccer icon dizzy thunder meadow");
    wallets[1] = new Wallet("chair love bleak wonder skirt permit say assist aunt credit roast size obtain minute throw sand usual age smart exact enough room shadow charge");
    wallets[1] = new Wallet("word twist toast cloth movie predict advance crumble escape whale sail such angry muffin balcony keen move employ cook valve hurt glimpse breeze brick");
    return wallets;
}

export async function storeAndInitContract(client: SecretNetworkClient, contractPath: string, initMsg: any, label: string): Promise<string> {
    const bytecode = fs.readFileSync(contractPath) as Uint8Array;
    let storeTx = await client.tx.compute.storeCode({
        sender: client.address,
        wasm_byte_code: bytecode, 
        source: '',
        builder: ''
    }, { gasLimit: 1000000 });
    const codeId = Number(
        storeTx.arrayLog.find((log) => log.type === "message" && log.key === "code_id")
          .value,
    );

    const code_hash = (await client.query.compute.codeHashByCodeId({code_id: codeId.toString()})).code_hash;
    console.log("hash len", code_hash.length);
    const tx = await client.tx.compute.instantiateContract(
        {
          sender: client.address,
          code_id: codeId,
          code_hash, // optional but way faster
          init_msg: initMsg,
          label,
          init_funds: [], // optional
        },
        {
          gasLimit: 200_000,
        },
      );

      console.log(tx);
      const contractAddress = tx.arrayLog.find(
        (log) => log.type === "message" && log.key === "contract_address",
      ).value;
      return contractAddress;
}