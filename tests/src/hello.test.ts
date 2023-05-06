import { expect } from 'chai';
import { ArchwayClient, SigningArchwayClient } from '@archwayhq/arch3.js';
import { getGenesisWallets, getConstantineConnection, storeAndInitContract, requestFaucetTokensConstantine } from './utils/arch'
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';

describe('Hello World', () => {
    
    let queryClient: ArchwayClient;
    let signingClient: SigningArchwayClient;
    let a: DirectSecp256k1HdWallet;
    let signerAddress: string;

    before(async () => {
        [a] = await getGenesisWallets();
        [queryClient, signingClient] = await getConstantineConnection(a.mnemonic);
        signerAddress = (await a.getAccounts())[0].address;
    })

    it('Can get current chain id (is Constantine-2?)', async () => {
        const chainId = await queryClient.getChainId();
        expect(chainId).to.be.eq("constantine-2");
    });
    it("Genesis account needs to have sufficient balance", async () => {
        let balance = await queryClient.getBalance((await a.getAccounts())[0].address, "uconst");
        if (Number(balance.amount) < 1000000) {
            let addr = signerAddress;
            console.log(addr);
            let result = await requestFaucetTokensConstantine(addr, "500000uconst");
            expect(result).to.be.eq(true);
            balance = await queryClient.getBalance((await a.getAccounts())[0].address, "uconst");
        }
        expect(Number(balance.amount)).to.be.gte(1000000);
    });


    it("Correctly instantiates a contract", async() => {
        let address = await storeAndInitContract(signingClient, signerAddress, "./cool.wasm", { owner: signerAddress, message: "Hi!" }, "New Contract "+Date.now());
        console.log("instantiated demo contract at: ", address);
        expect(address).to.be.not.eq("");
    });
});