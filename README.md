#  Multisignature Vault Powered by Safe on the Rootstock Network

This project demonstrates how to implement multisignature functionalities using [Safe](safe.global) on a vault deployed on the [Rootstock](http://rootstock.io/) network.  
It consists of a vault contract deployed to the Rootstock testnet, a Viem-powered Next.js frontend that uses Viem to interact with deployed contracts, and backend that uses Safe to handle multisignature key management.

# Quick Start Guide

## 1. Install Dependencies
**Root dependencies** (Hardhat & backend):
```bash
npm install
```

**Frontend dependencies** (Next.js):
```bash
cd frontend
npm install
cd ..
```

## 2. Set Up Environment Files
**Create root `.env.example`** (for deployment):
Create a `.env.example` file in the root of the project directory and add the following variables inside it.

```bash
# .env.example
PRIVATE_KEY=your_deployer_private_key
ROOTSTOCK_TESTNET_RPC_URL=your_rsk_testnet_rpc_url
CHAIN_ID=31
```

**Create backend `.env.example`** (for server):
Create a `.env.example` file in the root of the backend directory and add the following variables inside it.

```bash
# backend/.env.example
RSK_RPC_URL=your_rsk_rpc_url
CHAIN_ID=31
SAFE_ADDRESS=your_gnosis_safe_address
VAULT_ADDRESS=your_deployed_vault_contract_address
OWNER_1_PUBLIC_KEY=your_safe_owner_public_key
OWNER_1_PRIVATE_KEY=your_safe_owner_private_key
FRONTEND_ORIGIN=http://localhost:3000
SAFE_TX_SERVICE_URL=https://safe-transaction.rsk.co
```

**Update frontend `.env.local`** (for Next.js):
Create a `.env.local` file in the root of the frontend directory and add the following variables inside it.

```bash
# frontend/.env.local
NEXT_PUBLIC_RPC_URL=your_public_rpc_url
NEXT_PUBLIC_SAFE_ADDRESS=your_safe_address
NEXT_PUBLIC_VAULT_ADDRESS=your_vault_address
```

## 3. Deploy Vault Contract
```bash
npx hardhat run scripts/deploy_vault.ts --network rootstockTestnet
```

## 4. Verify on Blockscout
```bash
npx hardhat verify --network rootstockTestnet <DEPLOYED_VAULT_ADDRESS> <YOUR_SAFE_ADDRESS>
```

## 5. Start Backend Server
```bash
npm run dev:server
```

## 6. Start Frontend Development Server
```bash
cd frontend
npm run dev
```

## 7. Access Application
Open http://localhost:3000 in your browser



**Note**: Replace all placeholder values with your actual keys and addresses. Never commit actual `.env` files to version control.```

**Note:**
- Obtain the [Rootstock RPC URL](https://dev.rootstock.io/developers/rpc-api/rootstock/setup/) by following the steps in the official documentation.
- Obtain the [Safe account address](https://rootstock.io/blog/safe-multisig-wallet-now-available-on-rootstock/) by following the instructions in this blog post.

