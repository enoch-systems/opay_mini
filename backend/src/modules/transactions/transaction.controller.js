const { getUserTransactions } = require("./transaction.service");

const listTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await getUserTransactions(userId);

    res.json({
      transactions,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

module.exports = {
  listTransactions,
};

