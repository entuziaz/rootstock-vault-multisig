import express, { Request, Response } from 'express';
import { ethers } from 'ethers';
import SafeApiKit from '@safe-global/api-kit';
import Safe from '@safe-global/protocol-kit';
import { MetaTransactionData, OperationType } from '@safe-global/types-kit';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
  credentials: true 
}));

interface TransactionRequest {
  to: string;
  value: string;
}


const vaultInterface = new ethers.Interface([
  "function withdraw(address recipient, uint256 amount)"
]);


app.post('/proposeTransaction', async (req: Request<{}, {}, TransactionRequest>, res: Response) => {
  try {
    const { to, value } = req.body;

    if (!to || !value) {
      res.status(400).json({ error: 'Missing required parameters: (to, value)' });
      return;
    }

    if (!ethers.isAddress(to)) {
      res.status(400).json({ error: 'Invalid recipient address (to)' });
      return;
    }

    const amount = value.toString();
    console.log("Amount in Ether: ", amount.toString()); 
    


    const encodedData = vaultInterface.encodeFunctionData("withdraw", [
      to,
      amount
    ]);

    // Setup Env Variables
    const RPC_URL = process.env.RSK_RPC_URL
    const SAFE_ADDRESS = ethers.getAddress(process.env.SAFE_ADDRESS!);
    const OWNER_1_ADDRESS_FROM = process.env.OWNER_1_PUBLIC_KEY
    const OWNER_1_ADDRESS = ethers.getAddress(OWNER_1_ADDRESS_FROM!)
    const OWNER_1_PRIVATE_KEY = process.env.OWNER_1_PRIVATE_KEY
    const VAULT_ADDRESS = process.env.VAULT_ADDRESS

    // Initialize the API Kit 
    const apiKit = new SafeApiKit({
      chainId: BigInt(process.env.CHAIN_ID!),
      txServiceUrl: 'https://transaction-testnet.safe.rootstock.io/api'
    }); 
    console.log('✅ 1. Safe API Kit initialized.');


    // Initialize the Protocol Kit 
    let protocolKitOwner1 = await Safe.init({
      provider: RPC_URL!,
      signer: OWNER_1_PRIVATE_KEY,
      safeAddress: SAFE_ADDRESS!
    });
    console.log('✅ 2. Safe Protocol Kit initialized.');
    
    
    // Propose a transaction to the service 
    const safeTransactionData: MetaTransactionData = {
      to: VAULT_ADDRESS!,
      value:'0', 
      data: encodedData,
      operation: OperationType.Call
    } 

    const nonce = parseInt(await apiKit.getNextNonce(SAFE_ADDRESS!));

    let safeTransaction = await protocolKitOwner1.createTransaction({
        transactions: [safeTransactionData],
        options: { nonce },  
        onlyCalls: true,
    });


    // Sign Transaction
    const safeTxHash = await protocolKitOwner1.getTransactionHash(safeTransaction)
    const signature = await protocolKitOwner1.signHash(safeTxHash)


    // Propose transaction to the service
    await apiKit.proposeTransaction({
      safeAddress: SAFE_ADDRESS!,
      safeTransactionData: safeTransaction.data,
      safeTxHash,
      senderAddress: OWNER_1_ADDRESS!,
      senderSignature: signature.data,
    })

    console.log('✅ 3. Transaction successfully proposed!');
    console.log('🎯 View in Safe UI: https://safe.rootstock.io');

    res.status(200).json({success: true, safeTxHash, transaction: safeTransaction.data});
    return;


  } catch (error: any) {
    console.error('Transaction error:', error);
    res.status(500).json({
      error: 'Transaction failed',
      details: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
    return;
  }
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


