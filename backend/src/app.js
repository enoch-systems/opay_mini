require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./modules/auth/auth.routes");
const protectedRoutes = require("./modules/auth/auth.protected");
const walletRoutes = require("./modules/wallet/wallet.routes");
const transactionRoutes = require("./modules/transactions/transaction.routes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api", walletRoutes);
app.use("/api", transactionRoutes);

app.get("/", (req, res) => {
  res.send("OPAY-MINI API RUNNING");
});

module.exports = app;