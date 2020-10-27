import { hederaClient } from "./client";
import {EventBus} from "@/eventBus";
const {
  Ed25519PrivateKey,
  AccountCreateTransaction,
  Hbar
} = require("@hashgraph/sdk");

export async function accountCreate(wallet) {

  const client = hederaClient();

  const privateKey = await Ed25519PrivateKey.generate();

  const transactionId = await new AccountCreateTransaction()
    .setKey(privateKey.publicKey)
    .setMaxTransactionFee(new Hbar(1))
    .setInitialBalance(new Hbar(process.env.VUE_APP_INITIAL_BALANCE))
    .execute(client);

  const transactionReceipt = await transactionId.getReceipt(client);
  const newAccountId = transactionReceipt.getAccountId();

  const transaction = {
    id: transactionId,
    type: "cryptoCreate",
    inputs: "initialBalance=" + process.env.VUE_APP_INITIAL_BALANCE,
    outputs: "accountId=" + newAccountId.toString()
  };
  EventBus.$emit("addTransaction", transaction);

  return {
    accountId: newAccountId.toString(),
    account: {
      wallet: wallet,
      privateKey: privateKey.toString(),
      tokenRelationships: {}
    }
  };
}
