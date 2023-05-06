import { expect } from 'chai';
import { ArchwayClient, SigningArchwayClient } from '@archwayhq/arch3.js';
import { getGenesisWallets, getConstantineConnection, storeAndInitContract, /*requestFaucetTokensConstantine*/ } from './utils/arch'
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';

describe('Hello World', () => {
    
    let queryClient: ArchwayClient;
    let signingClient: SigningArchwayClient;
    let [a,b,c,d]: DirectSecp256k1HdWallet[] = Array(4);
    

    before(async () => {
        [a,b,c,d] = await getGenesisWallets();
        [queryClient, signingClient] = await getConstantineConnection(a.mnemonic);
    })

    it('Can get current chain id (is Constantine-2?)', async () => {
        const chainId = await queryClient.getChainId();
        expect(chainId).to.be.eq("constantine-2");
    });

    it("Genesis account has a balance bigger than 0UCONST", async () => {
        let balance = await queryClient.getBalance(a.getAccounts()[0], "uconst");
        expect(Number(balance.amount)).to.be.gt(0);
    });
    /* This is not active due to fetch problems <--- FIXME:
    it("equests 0.5CONST from the faucet", async () => {
        let result = await requestFaucetTokensConstantine(a.getAccounts()[0], "500000uconst");
        expect(result).to.be.eq(true);
    });
    */
    it("Correctly instantiates a contract", async() => {
        let address = await storeAndInitContract(signingClient, a.getAccounts()[0], "./contract.wasm", {}, "New Contract "+Date.now());
        console.log("instantiated demo contract at: ", address);
        expect(address).to.be.not.eq("");
    });
});