// import { tezos } from './tezos';
import axios from 'axios';

export const fetchStorage = async () => {
    try{
        // const contract = await tezos.wallet.at("KT19J4eadpqnhfkT1ZBMo24MwmQtBBn7RSpQ");
        // const storage = await contract.storage();
        // console.log(storage);
        // return storage;
        const res = await axios.get("https://api.ghostnet.tzkt.io/v1/contracts/KT19J4eadpqnhfkT1ZBMo24MwmQtBBn7RSpQ/storage");
        return res.data;
    }catch(err){
        throw err;
    }
};
