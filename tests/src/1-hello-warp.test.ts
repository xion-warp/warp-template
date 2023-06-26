import { TestConsts } from "./consts";

import { SigningArchwayClient } from '@archwayhq/arch3.js';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { getConstantineConnection } from "./utils/arch";
import { expect } from "chai";

describe('Hello Warp!', () => {
    const consts = new TestConsts();

    before(async () => {
        await consts.initClients();
    });

    it('checks if the chain is up and running', async () => {
        let chainId = await consts.queryClient.getChainId();
        expect(chainId).to.be.eq("constantine-3");
    });
    

})