#  Multisignature Vault Powered by Safe on the Rootstock Network

This project demonstrates how to implement multisignature functionality using Safe on a vault.  
It consists of a Viem-powered Next.js frontend, a backend, and a vault contract.

## Setup
Install dependencies for the Hardhat and backend components from the project root:

```bash
npm install
```

Navigate to the `frontend` folder and setup the Next.js frontend app:

```bash
cd frontend
npm install
```

## Deployment

Deploy the vault contract with the following command in the project root:

```bash
npx hardhat run scripts/deploy_vault.ts --network rootstockTestnet
```

After running the above command successfully, you will receive a contract address.

## Configuration

Create a new `.env` file in the root of the project to store all your environment variables. Add the vault address and other necessary variables as follows:

```env
VAULT_ADDRESS=<Your Deployed Vault Address>
RSK_RPC_URL=<Your unique Rootstock Testnet URL>
CHAIN_ID=31
SAFE_ADDRESS=<Your Safe account address>
OWNER_1_PUBLIC_KEY=<Your Safe Account Owner's Wallet Public Key>
OWNER_1_PRIVATE_KEY=<Your Safe Account Owner's Wallet Private Key>
```

**Note:**
- Obtain the [Rootstock RPC URL](https://dev.rootstock.io/developers/rpc-api/rootstock/setup/) by following the steps in the official documentation.
- Obtain the [Safe account address](https://rootstock.io/blog/safe-multisig-wallet-now-available-on-rootstock/) by following the instructions in this blog post.


## Running the Backend

```bash
tsx backend/server.ts
```

## Running the Frontend

```bash
cd frontend
npm run dev
```



