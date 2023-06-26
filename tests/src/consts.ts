import { ArchwayClient, SigningArchwayClient } from "@archwayhq/arch3.js/build";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { getConstantineConnection } from "./utils/arch";
import 'dotenv/config';

export class TestConsts {
    
    // You can keep your contract addresses here for easy access
    public contract = "archway1r87rfdff3ve29g62v9u792d7r092y22w54sx6zf6alyus2l0lr0squ8r53";
    
    public queryClient: ArchwayClient;
    public signingClient: SigningArchwayClient;
    public signerAddress: string;
    public nativeDenom: string;

    async initClients() {
        const { queryClient, signingClient, defaultAddress } = await getConstantineConnection(process.env.TEST_MNEMONIC);
        this.queryClient = queryClient;
        this.signingClient = signingClient;
        this.signerAddress = defaultAddress;
        this.nativeDenom = "aconst";
    }
}