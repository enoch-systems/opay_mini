const Transaction = require("../../models/transaction.model");

const getUserTransactions = async (userId) => {
  const transactions = await Transaction.find({ userId })
    .sort({ createdAt: -1 });

  return transactions;
};

module.exports = {
  getUserTransactions,
};