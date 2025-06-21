import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
    networks: {
        rootstockTestnet: {
          url: process.env.RSK_RPC_URL,
          accounts: [process.env.PRIVATE_KEY || ""],
          chainId: 31, // Rootstock Testnet
        },
    },
    solidity: "0.8.20",
};

export default config;
