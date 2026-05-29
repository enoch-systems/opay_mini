const {
  getBalance,
  creditWallet,
  debitWallet,
} = require("./wallet.service");

// GET BALANCE
const balance = async (req, res) => {
  try {
    const userId = req.user.id;

    const bal = await getBalance(userId);

    res.json({
      balance: bal,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// CREDIT WALLET
const credit = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;

    const newBalance = await creditWallet(userId, amount);

    res.json({
      message: "Wallet credited",
      balance: newBalance,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// DEBIT WALLET
const debit = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;

    const newBalance = await debitWallet(userId, amount);

    res.json({
      message: "Wallet debited",
      balance: newBalance,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

module.exports = {
  balance,
  credit,
  debit,
};