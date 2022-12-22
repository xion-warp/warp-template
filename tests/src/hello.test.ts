import { expect } from 'chai';
import { SecretNetworkClient } from 'secretjs';
import { getGenesisWallets, getLocalSecretConnection, storeAndInitContract } from './utils/localsecret'

describe('Hello World', () => {
    
    let client: SecretNetworkClient;
    
    before(() => {
        client = getLocalSecretConnection();
    })

    it('Can get current block height', async () => {
        const block = await client.query.tendermint.getLatestBlock({});
        expect(block.block_id.hash).to.not.be.null;
    });

    it("Has correct account balance", async () => {
        const [a, b, c, d] = getGenesisWallets();
        let balance = await client.query.bank.balance({ address: a.address, denom: "uscrt" });
        expect(parseInt(balance.balance.amount)).to.be.gte(99 * 1e6);
    });
    it("Correctly instantiates a contract", async() => {
        let [a] = getGenesisWallets();
        let signingClient = getLocalSecretConnection(a);
        let address = await storeAndInitContract(signingClient, "./contract.wasm", {}, "New Contract "+Date.now());
        console.log(address);
        expect(address).to.be.not.eq("");
    });
});