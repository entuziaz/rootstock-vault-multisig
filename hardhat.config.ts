require("@nomicfoundation/hardhat-verify");
import "@nomicfoundation/hardhat-verify";

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

// const config: HardhatUserConfig = {
//     networks: {
//         rootstockTestnet: {
//           url: process.env.RSK_RPC_URL,
//           accounts: [process.env.PRIVATE_KEY || ""],
//           chainId: 31, // Rootstock Testnet
//         },
//     },
//     solidity: "0.8.28",
// };

// export default config;


// Hardhat configuration
const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            // If you want to do some forking, uncomment this
            // forking: {
            //   url: MAINNET_RPC_URL
            // }
        },
        rootstockTestnet: {
          url: process.env.RSK_RPC_URL,
          accounts: [process.env.PRIVATE_KEY || ""],
          chainId: 31, // Rootstock Testnet
        },
    },
    // namedAccounts: {
    //     deployer: {
    //         default: 0, // Default is the first account
    //         mainnet: 0,
    //     },
    //     owner: {
    //         default: 0,
    //     },
    // },
    solidity: {
        compilers: [
            {
                version: "0.8.28",
            },
        ],
    },
    sourcify: {
        enabled: false
      },      
    etherscan: {    
        apiKey: {
          // Is not required by blockscout. Can be any non-empty string
          rskTestnet: 'RSK_TESTNET_RPC_URL',
        },
        customChains: [
          {
            network: "rskTestnet",
            chainId: 31,
            urls: {
              apiURL: "https://rootstock-testnet.blockscout.com/api/",
              browserURL: "https://rootstock-testnet.blockscout.com/",
            }
          },
        ]
      },
};

export default config;