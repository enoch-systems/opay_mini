# opay_mini

> A mini fintech backend built with Node.js + Express + MongoDB — like OPay's core engine but simplified.

---

## 📁 Project Tree

```
opay_mini/
│
├── README.md                   ← You are here
│
└── backend/                    ← The API server (like OPay's backend)
    ├── .env                    ← Secrets: DB URI, JWT key (like OPay's vault)
    ├── package.json            ← Dependencies (express, mongoose, bcrypt, jwt)
    ├── package-lock.json       ← Locked versions
    │
    ├── src/                    ← All source code
    │   ├── server.js           ← Entry point — starts the HTTP server on port 5000
    │   ├── app.js              ← Express app — mounts routes, middleware, DB
    │   │
    │   ├── config/
    │   │   └── db.js           ← MongoDB connection (like OPay connecting to its database)
    │   │
    │   ├── middleware/
    │   │   └── auth.middleware.js  ← JWT check (like OPay's gate guard checking your token)
    │   │
    │   ├── models/
    │   │   └── user.model.js   ← User schema (name, email, password, balance)
    │   │
    │   └── modules/
    │       │
    │       ├── auth/           ← Authentication module (like OPay's login/signup)
    │       │   ├── auth.routes.js      ← POST /register, POST /login
    │       │   ├── auth.controller.js  ← Handles HTTP requests (register/login)
    │       │   ├── auth.service.js     ← Business logic (hash password, check creds)
    │       │   ├── auth.session.js     ← JWT token generation (like OPay issuing a session)
    │       │   └── auth.protected.js   ← GET /profile (requires JWT token)
    │       │
    │       └── wallet/         ← Wallet module (like OPay's wallet: send/receive money)
    │           ├── wallet.routes.js    ← GET /balance, POST /credit, POST /debit
    │           ├── wallet.controller.js← Handles HTTP requests (balance/credit/debit)
    │           └── wallet.service.js   ← Core logic: atomic $inc (race condition safe)
    │
    └── node_modules/           ← Installed packages (not tracked in git)
```

---

## 🧩 OPay Analogy (Short, Inline)

| Component | OPay Analogy |
|---|---|
| `server.js` | OPay's server room — powers on the whole app |
| `app.js` | OPay's control panel — wires everything together |
| `db.js` | OPay's vault (database) connection |
| `user.model.js` | A customer's account record (name, email, PIN, balance) |
| `auth.middleware.js` | OPay's security guard at the door — checks your JWT badge |
| `auth.routes.js` | OPay's sign-up / login pages |
| `auth.service.js` | OPay's backend logic: hash your PIN, verify identity |
| `auth.session.js` | OPay issuing you a session token (like a wristband for 7 days) |    
| `auth.protected.js` | OPay's "My Profile" page — only accessible when logged in |
| `wallet.routes.js` | OPay's wallet menu: Check Balance, Add Money, Send Money |
| `wallet.controller.js` | OPay's teller — receives your request and processes it |
| `wallet.service.js` | OPay's ledger — actually moves the money in/out of the vault |

---

## ⚡ Race Condition: The Problem and The Fix

### 🛑 The Problem (Race Condition)

Imagine two simultaneous requests to **debit** the same user's wallet:

```
User balance = ₦100
Debit ₦80 (Request A) and Debit ₦80 (Request B) arrive at the exact same time.
```

**Without protection (bad code):**
```
1. Request A reads balance → ₦100
2. Request B reads balance → ₦100  (still ₦100, A hasn't saved yet!)
3. Request A writes new balance → ₦20  (100 - 80)
4. Request B writes new balance → ₦20  (100 - 80 — overwrote A's change!)
```

**Result:** User lost ₦80! Two debits went through but balance only dropped by ₦80 instead of ₦160.

### ✅ The Fix: Atomic Operations (`$inc`)

The wallet service uses **MongoDB's atomic `$inc`** — like OPay's banking system:

```js
// Credit (always safe)
User.findByIdAndUpdate(id, { $inc: { balance: amount } })

// Debit (safe + overdraft protection)
User.findOneAndUpdate(
  { _id: id, balance: { $gte: amount } },  // only debit if balance >= amount
  { $inc: { balance: -amount } }
)
```

**How this fixes it:**
- `$inc` is **atomic** — MongoDB locks the document internally
- Only one update executes at a time, even with concurrent requests
- The debit query also checks `balance >= amount` before deducting, preventing overdrafts
- If both debits arrive at once, MongoDB serializes them → one succeeds, one fails with "Insufficient balance"

---

## 🧱 Dependencies & What They Do

| Package | Role (in OPay terms) |
|---|---|
| `express` | The HTTP server framework — OPay's counter where customers place orders |
| `mongoose` | MongoDB ODM — OPay's ledger clerk that writes/reads the vault |
| `bcrypt` | Password hasher — OPay's PIN encryptor (never stores raw PINs) |
| `jsonwebtoken` | JWT generator/verifier — OPay's session wristband maker |
| `cors` | Allows cross-origin requests — OPay accepting requests from the mobile app |
| `dotenv` | Loads .env variables — OPay's safe combination (kept secret) |
| `nodemon` | Dev auto-restart — auto-refreshes OPay's system when code changes |

---

## 🔐 How the Auth Flow Works (OPay Style)

```
1. Register → POST /api/auth/register
   → User sends: { username, email, password }
   → bcrypt hashes password → User saved in MongoDB
   → Response: "User created successfully"

2. Login → POST /api/auth/login
   → User sends: { email, password }
   → bcrypt compares hash → JWT generated (valid 7 days)
   → Response: { token, user }

3. Access profile → GET /api/profile
   → Header: Authorization: Bearer <token>
   → auth.middleware verifies JWT → next() → profile data returned
```

## 💰 How Wallet Transactions Work (OPay Style)

```
1. Check balance → GET /api/wallet/balance (protected)
   → JWT verified → user.balance returned

2. Credit wallet → POST /api/wallet/credit (protected)
   → JWT verified → amount added via $inc (atomic)
   → New balance returned

3. Debit wallet → POST /api/wallet/debit (protected)
   → JWT verified → MongoDB checks balance >= amount
   → $inc decrements (atomic) → new balance or "Insufficient balance"
```

---

## 🚀 Running the Project

```bash
cd backend
npm install
npm start          # or: npx nodemon src/server.js
```

Environment variables needed (`.env`):
```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/opay_mini
PORT=5000
JWT_SECRET=your_secret_key
```

---

> Built with ❤️ by enoch-systems — inspired by OPay's fintech infrastructure.