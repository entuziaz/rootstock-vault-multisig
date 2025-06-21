import { useState } from "react";
import { ethers } from "ethers";
import { useEffect } from "react";

declare var window: any;

export default function Home() {
  const [wallet, setWallet] = useState<ethers.Signer | null>(null);
  const [vaultBalance, setVaultBalance] = useState<string>("0.0");
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [recipient, setRecipient] = useState<string>("");

  const vaultAddress = process.env.NEXT_PUBLIC_VAULT_ADDRESS as string;

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setWallet(signer);
        fetchVaultBalance();
        console.log("Wallet connected:", signer);
        alert("Wallet connected!");
      } catch (error) {
        console.error("Wallet connection failed:", error);
        alert("Please connect your wallet!");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const fetchVaultBalance = async () => {
    if (!vaultAddress) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(vaultAddress);
      setVaultBalance(ethers.formatEther(balance));
    } catch (err) {
      console.error("Failed to fetch vault balance: ", err);
    }
  };

  useEffect(() => {
    fetchVaultBalance();
  }, []);

  const deposit = async () => {
    if (!wallet || !vaultAddress) {
      alert("Please connect your wallet or set vault address!");
      return;
    }

    try {
      const vault = new ethers.Contract(
        vaultAddress,
        ["function deposit() payable"],
        wallet
      );
      const tx = await vault.deposit({
        value: ethers.parseEther(depositAmount),
      });
      await tx.wait();
      await fetchVaultBalance();
      alert("Deposit successful!");
    } catch (error) {
      console.error("Deposit error:", error);
      alert("Failed to deposit.");
    }
  };

  const proposeWithdrawal = async () => {
    if (!recipient || !withdrawAmount) {
      alert("Please fill in both recipient and amount.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/proposeTransaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipient,
          value: ethers.parseEther(withdrawAmount).toString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Transaction proposal failed");
      }

      alert("Withdrawal proposed successfully!");
      console.log("Proposal response:", data);
    } catch (err) {
      console.error("Proposal error:", err);
      alert("Failed to propose withdrawal. Check the console for details.");
    }
  };

  return (
    <>
      <style>{`
        .app-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        min-height: 100vh;
        background-color: #f4f4f4;
        font-family: sans-serif;
        }

        .card {
        background: #fff;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 500px;
        }

        .card h1 {
        text-align: center;
        margin-bottom: 1.5rem;
        color: #2c6eec;
        }

        .section {
        margin-top: 2rem;
        }

        .section h2 {
        margin-bottom: 0.75rem;
        color: #333;
        }

        input[type="text"] {
        width: 94%;
        padding: 0.5rem 0.75rem;
        margin-bottom: 0.75rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 1rem;
        }

        button {
        padding: 0.5rem 1rem;
        font-size: 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        }

        .primary-button {
        background-color: #2c6eec;
        color: #fff;
        width: 100%;
        margin-bottom: 1rem;
        }

        .secondary-button {
        background-color: #28a745;
        color: #fff;
        width: 100%;
        }

        .warning-button {
        background-color:rgb(255, 34, 0);
        color: #fff;
        width: 100%;
        }

        button:hover {
        opacity: 0.9;
        }
    `}</style>

      <div className="app-container">
        <div className="card">
          <h1>Rootstock Safe Multisig</h1>

          <button onClick={connectWallet} className="primary-button">
            {wallet ? "Connected" : "Connect Wallet"}
          </button>

          <p>
            <strong>Vault Balance:</strong> {vaultBalance} RBTC
          </p>

          <div className="section">
            <h2>Deposit into Vault</h2>
            <input
              type="text"
              placeholder="Amount (RBTC)"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
            <button onClick={deposit} className="secondary-button">
              Deposit
            </button>
          </div>

          <div className="section">
            <h2>Propose Withdrawal</h2>
            <input
              type="text"
              placeholder="Recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <input
              type="text"
              placeholder="Amount (RBTC)"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <button onClick={proposeWithdrawal} className="warning-button">
              Propose Withdrawal
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
