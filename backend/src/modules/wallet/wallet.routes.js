const express = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const {
  balance,
  credit,
  debit,
} = require("./wallet.controller");

const router = express.Router();

// all wallet routes are protected
router.get("/wallet/balance", authMiddleware, balance);
router.post("/wallet/credit", authMiddleware, credit);
router.post("/wallet/debit", authMiddleware, debit);

module.exports = router;