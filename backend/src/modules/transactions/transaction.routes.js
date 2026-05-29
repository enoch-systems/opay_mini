const express = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const { listTransactions } = require("./transaction.controller");

const router = express.Router();

// GET ALL USER TRANSACTIONS (LEDGER)
router.get("/transactions", authMiddleware, listTransactions);

module.exports = router;