const User = require("../../models/user.model");

// GET BALANCE
const getBalance = async (userId) => {
  const user = await User.findById(userId).select("balance");
  return user.balance;
};

// CREDIT (ATOMIC)
const creditWallet = async (userId, amount) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { balance: amount } },
    { new: true }
  );

  await Transaction.create({
    userId,
    type: "credit",
    amount,
    balanceAfter: user.balance,
  });

  return user.balance;
};

// DEBIT (ATOMIC + SAFETY CHECK)
const debitWallet = async (userId, amount) => {
  const user = await User.findOneAndUpdate(
    {
      _id: userId,
      balance: { $gte: amount },
    },
    {
      $inc: { balance: -amount },
    },
    { new: true }
  );

  if (!user) {
    throw new Error("Insufficient balance");
  }

  await Transaction.create({
    userId,
    type: "debit",
    amount,
    balanceAfter: user.balance,
  });

  return user.balance;
};


module.exports = {
  getBalance,
  creditWallet,
  debitWallet,
};