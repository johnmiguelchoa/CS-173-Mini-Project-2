import { tezos } from "./tezos";

export const addBalanceOwnerOperation = async () => {
    try{
        const contract = await tezos.wallet.at("KT19J4eadpqnhfkT1ZBMo24MwmQtBBn7RSpQ");
        const storage = await contract.storage();
        const op = await contract.methods.addBalanceOwner().send({
            amount: storage.fromOwner / 1000000,
            mutez: false,
        });
        await op.confirmation(1);
    } catch(err){
        throw err;
    }
};

export const addBalanceCounterpartyOperation = async () => {
    try{
        const contract = await tezos.wallet.at("KT19J4eadpqnhfkT1ZBMo24MwmQtBBn7RSpQ");
        const storage = await contract.storage();
        const op = await contract.methods.addBalanceCounterparty().send({
            amount: storage.fromCounterparty / 1000000,
            mutez: false,
        });
        await op.confirmation(1);
    } catch(err){
        throw err;
    }
};

export const claimCounterpartyOperation = async (secret) => {
    try{
        const contract = await tezos.wallet.at("KT19J4eadpqnhfkT1ZBMo24MwmQtBBn7RSpQ");
        const op = await contract.methods.claimCounterparty(secret).send();
        await op.confirmation(1);
    } catch(err){
        throw err;
    }
};

export const claimOwnerOperation = async () => {
    try{
        const contract = await tezos.wallet.at("KT19J4eadpqnhfkT1ZBMo24MwmQtBBn7RSpQ");
        const op = await contract.methods.claimOwner().send();
        await op.confirmation(1);
    } catch(err){
        throw err;
    }
};

export const requestWithdrawalOperation = async () => {
    try{
        const contract = await tezos.wallet.at("KT19J4eadpqnhfkT1ZBMo24MwmQtBBn7RSpQ");
        const op = await contract.methods.requestWithdrawal().send();
        await op.confirmation(1);
    } catch(err){
        throw err;
    }
};

export const retractWithdrawalOperation = async () => {
    try{
        const contract = await tezos.wallet.at("KT19J4eadpqnhfkT1ZBMo24MwmQtBBn7RSpQ");
        const op = await contract.methods.retractWithdrawal().send();
        await op.confirmation(1);
    } catch(err){
        throw err;
    }
};

export const authorizeWithdrawalOperation = async () => {
    try{
        const contract = await tezos.wallet.at("KT19J4eadpqnhfkT1ZBMo24MwmQtBBn7RSpQ");
        const op = await contract.methods.authorizeWithdrawal().send();
        await op.confirmation(1);
    } catch(err){
        throw err;
    }
};