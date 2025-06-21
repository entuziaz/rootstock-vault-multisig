import { ethers } from "hardhat";
import dotenv from "dotenv";

dotenv.config();

async function main() {
const safeAddress = process.env.SAFE_ADDRESS;

if (!safeAddress) {
throw new Error("Safe address not provided in .env file. Add SAFE_ADDRESS=your_safe_address");
}

console.log("Deploying Vault with Safe address:", safeAddress);
const Vault = await ethers.getContractFactory("Vault");
const vault = await Vault.deploy(safeAddress);

console.log("Deploying Vault contract...");
await vault.waitForDeployment();

const vaultAddress = await vault.getAddress();
console.log("Vault deployed to:", vaultAddress);

const deploymentTransaction = vault.deploymentTransaction();
console.log("Deployment transaction hash:", deploymentTransaction?.hash);

console.log("\n---------------------------------------------------");
console.log("Add this to your .env file: VAULT_ADDRESS=", vaultAddress);
console.log("---------------------------------------------------\n");
  

const savedSafeAddress = await vault.safe();
console.log("Verify Safe address:", savedSafeAddress);
console.log("Deployment complete!");

}

  
main()
.then(() => process.exit(0))
.catch((error) => {
console.error("Error during deployment:", error);
process.exit(1);
});

