import React from "react";
import { useEffect, useState } from "react";

import { connectWallet, getAccount } from "../utils/wallet";

const Navbar = () => {
  const [account, setAccount] = useState("");

  useEffect(() => {
    (async () => {
      // Get the active account
      const activeAccount = await getAccount();
      setAccount(activeAccount);
    })();
  }, []);

  const onConnectWallet = async () => {
    await connectWallet();
    const activeAccount = await getAccount();
    setAccount(activeAccount);
  };

  return (
    <div className="navbar navbar-dark bg-dark fixed-top">
      <div className="container py-2">
        <a href="/" className="navbar-brand">
          Tezos Escrow
        </a>
        <div className="d-flex">
          {/* Call connectWallet function onClick  */}
          <button onClick = {onConnectWallet} className="btn btn-outline-info">
            {/* Show account address if wallet is connected */}
            {account !== "" ? account : "Connect Wallet"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
