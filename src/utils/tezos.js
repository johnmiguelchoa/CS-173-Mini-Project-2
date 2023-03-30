// Setup Tezos Toolkit
import { wallet } from "./wallet";

import { TezosToolkit } from "@taquito/taquito";
export const tezos = new TezosToolkit("https://ghostnet.smartpy.io");

// Specify wallet provider for Tezos instance
tezos.setWalletProvider(wallet);