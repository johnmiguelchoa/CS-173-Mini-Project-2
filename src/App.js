import React from "react";
import { useState, useEffect, useRef } from "react";

// Components
import Navbar from "./components/Navbar";

// Operation
import { addBalanceOwnerOperation, addBalanceCounterpartyOperation, claimCounterpartyOperation, claimOwnerOperation, requestWithdrawalOperation, retractWithdrawalOperation, authorizeWithdrawalOperation } from './utils/operation';

// Storage
import { fetchStorage } from "./utils/storage";

function App() {
  // Variables
  const [balanceOwner, setBalanceOwner] = useState(0);
  const [balanceCounterparty, setBalanceCounterparty] = useState(0);
  const [withdrawOwner, setWithdrawOwner] = useState("No");
  const [withdrawCounterparty, setWithdrawCounterparty] = useState("No");
  const [epoch, setEpoch] = useState("");
  const [fromOwner, setFromOwner] = useState(0);
  const [fromCounterparty, setFromCounterparty] = useState(0);

  const secretInputRef = useRef();

  // Set variables
  useEffect(() => {
    // Fetch variables from storage
    (async () => {
      const storage = await fetchStorage();
      console.log(storage)
      setBalanceOwner(storage.balanceOwner / 1000000);
      setBalanceCounterparty(storage.balanceCounterparty / 1000000);
      setWithdrawOwner(storage.withdrawOwner ? "Yes" : "No");
      setWithdrawCounterparty(storage.withdrawCounterparty ? "Yes" : "No");
      const date = new Date(storage.epoch);
      setEpoch(date.toLocaleString());
      setFromOwner(storage.fromOwner / 1000000);
      setFromCounterparty(storage.fromCounterparty / 1000000);
    })();
  }, []);

  const onAddBalanceOwner = async () => {
    try{
      await addBalanceOwnerOperation();
      alert("Transaction Confirmed!");
    }catch(err) {
      alert("Transaction Failed: ", err.message)
    }
  };

  const onAddBalanceCounterparty = async () => {
    try{
      await addBalanceCounterpartyOperation();
      alert("Transaction Confirmed!");
    }catch(err) {
      alert("Transaction Failed: ", err.message)
    }
  };

  const onClaimOwner = async () => {
    try{
      await claimOwnerOperation();
      alert("Transaction Confirmed!");
    }catch(err) {
      alert("Transaction Failed: ", err.message)
    }
  };

  const onClaimCounterparty = async (event) => {
    event.preventDefault();

    const enteredSecret = secretInputRef.current.value;
    
    try{
      await claimCounterpartyOperation(enteredSecret);
      alert("Transaction Confirmed!");
    }catch(err) {
      alert("Transaction Failed: ", err.message)
    }
  };

  const onRequestWithdrawal = async () => {
    try{
      await requestWithdrawalOperation();
      alert("Transaction Confirmed!");
    }catch(err) {
      alert("Transaction Failed: ", err.message)
    }
  };

  const onRetractWithdrawal = async () => {
    try{
      await retractWithdrawalOperation();
      alert("Transaction Confirmed!");
    }catch(err) {
      alert("Transaction Failed: ", err.message)
    }
  };

  const onAuthorizeWithdrawal = async () => {
    try{
      await authorizeWithdrawalOperation();
      alert("Transaction Confirmed!");
    }catch(err) {
      alert("Transaction Failed: ", err.message)
    }
  };

  return (
    <div className="h-100">
      <Navbar />
      <div className="d-flex flex-column justify-content-center align-items-center h-100">
        {/* Display variables */}
        <div className="py-1"><h4>Epoch: {epoch}</h4></div>
        <div className="py-1"><h4>Owner Balance: {balanceOwner} ꜩ</h4></div>
        <div className="py-1"><h4>Counterparty Balance: {balanceCounterparty} ꜩ</h4></div>
        <div className="py-1"><h4>Owner has requested to withdraw: {withdrawOwner}</h4></div>
        <div className="py-1"><h4>Counterparty has requested to withdraw: {withdrawCounterparty}</h4></div>
        {/* Action Buttons related to Owner*/}
        <button onClick={onAddBalanceOwner} className="btn btn-primary btn-lg">
          Add {fromOwner} ꜩ to Owner Balance
        </button>
        <button onClick={onClaimOwner} className="btn btn-primary btn-lg">
          Claim Escrow Balance (Owner)
        </button>

        {/*Action Buttons related to Counterparty*/}
        <button onClick={onAddBalanceCounterparty} className="btn btn-success btn-lg">
          Add {fromCounterparty} ꜩ to Counterparty Balance
        </button>

        <form onSubmit={onClaimCounterparty}>
          <div>
            <button onClick={onClaimCounterparty} className="btn btn-success btn-lg">
              Claim Escrow Balance (Counterparty)
            </button>
            <label htmlFor="secret">Secret</label>
            <input type="text" required id="secret" ref={secretInputRef} />
          </div>
        </form>

        {/*Action Buttons related to Withdrawal*/}
        <button onClick={onRequestWithdrawal} className="btn btn-warning btn-lg">
          Request to Withdraw
        </button>
        <button onClick={onRetractWithdrawal} className="btn btn-warning btn-lg">
          Retract Request to Withdraw
        </button>

        {/*Action Buttons for Admin*/}
        <button onClick={onAuthorizeWithdrawal} className="btn btn-danger btn-lg">
          Authorize Withdrawal (Admin Only)
        </button>
      </div>
    </div>
  );
}

export default App;
