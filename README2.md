# opay_mini — Full Architecture Layer Map

> Our project mapped against the **complete 8-layer backend stack** — banking system style.
> This is a **reading manual**, not code. It shows what parts of the stack we've built so far and what's still untouched.

---

## 📊 Quick Summary

| Layer # | Layer Name | Status | What We Have |
|---------|-----------|--------|--------------|
| 1 | Client / Presentation | ❌ UNTOUCHED | No frontend (web/mobile) yet |
| 2 | Communication / API | ✅ TOUCHED | Express REST API with JWT auth |
| 3 | Business Logic | ✅ TOUCHED | Auth & wallet services with domain rules |
| 4 | Data Access | ✅ TOUCHED | Mongoose models & queries |
| 5 | Storage / Data | ✅ TOUCHED | MongoDB document store |
| 6 | Workflow / Background | ❌ UNTOUCHED | No queues, no async jobs |
| 7 | Integration | ❌ UNTOUCHED | No external API calls (payment gateways, SMS, etc.) |
| 8 | Intelligence / Analytics | ❌ UNTOUCHED | No fraud detection, no reporting |

---

## 🏗️ Full Architecture Tree

```
OPAY MINI — FULL SYSTEM STACK
│
├── LAYER 1: CLIENT / PRESENTATION (Bank Front Desk)
│   └── ❌ UNTOUCHED
│       ├── What it is: Where users interact (web app, mobile app, Postman, etc.)
│       ├── Analogy: OPay's mobile app, website, or ATM screen
│       ├── In OPay: The app you open to check balance or send money
│       ├── Tools: React, Next.js, Flutter, Tailwind
│       └── Why missing: We only built the backend so far — no frontend yet
│
├── LAYER 2: COMMUNICATION / API (Bank Reception Desk)
│   ├── ✅ TOUCHED — EXPRESS REST API
│   │
│   ├── What we built:
│   │   └── backend/src/
│   │       ├── server.js              ← HTTP server (port 5000)
│   │       ├── app.js                 ← Route mounting, CORS, JSON parsing
│   │       ├── modules/auth/auth.routes.js    ← POST /register, POST /login
│   │       └── modules/wallet/wallet.routes.js← GET /balance, POST /credit, POST /debit
│   │
│   ├── Analogy: OPay's reception desk — takes your request, routes it to the right department
│   ├── Tools used: Express.js, CORS
│   ├── API type: REST (not GraphQL, not gRPC)
│   └── What's missing: Rate limiting, API gateway, request validation layer
│
├── LAYER 3: BUSINESS LOGIC (Bank Operations Department)
│   ├── ✅ TOUCHED — SERVICE LAYER
│   │
│   ├── What we built:
│   │   └── backend/src/modules/
│   │       ├── auth/auth.service.js    ← Registration rules: check duplicates, hash passwords
│   │       ├── auth/auth.session.js   ← JWT generation (7-day expiry)
│   │       ├── auth/auth.controller.js← Orchestrates register/login flows
│   │       └── wallet/wallet.service.js← Credit/debit rules with atomic $inc
│   │
│   ├── Domain models handled: Users, Wallet balance
│   ├── Patterns used: Service Layer Pattern
│   ├── Analogy: OPay's operations team — decides if you can register, if your PIN is correct,
│   │            if you have enough balance to send money
│   └── What's missing: DDD aggregates, event-driven logic, workflow orchestration
│
├── LAYER 4: DATA ACCESS (Bank Clerk / Filing System)
│   ├── ✅ TOUCHED — MONGOOSE ODM
│   │
│   ├── What we built:
│   │   └── backend/src/
│   │       ├── models/user.model.js   ← User schema (username, email, password, balance)
│   │       └── (queries in services)  
│   │           ├── User.create()       ← Write operations
│   │           ├── User.findOne()      ← Read/lookup operations
│   │           ├── User.findByIdAndUpdate() ← Atomic updates with $inc
│   │           └── User.findOneAndUpdate()  ← Conditional atomic updates
│   │
│   ├── Patterns used: Active Record (Mongoose), Query Building (find, $inc)
│   ├── Analogy: OPay's filing clerk — looks up customer records, updates balances
│   └── What's missing: Repository Pattern, connection pooling config, query optimization
│
├── LAYER 5: STORAGE / DATA (Bank Vault Department)
│   ├── ✅ TOUCHED — MONGODB (DOCUMENT DB)
│   │
│   ├── What we built:
│   │   └── backend/src/config/db.js   ← MongoDB connection via Mongoose
│   │
│   ├── Database: MongoDB Atlas (cloud)
│   ├── Data model: Document model (User with embedded balance field)
│   ├── ACID: Single-document atomicity via $inc (not multi-document transactions)
│   ├── Analogy: OPay's vault — where all account records and money ledgers are stored
│   └── What's missing: Indexing strategy, migration system, backup strategy, multi-doc transactions
│
├── LAYER 6: WORKFLOW / BACKGROUND (Bank Internal Processing Unit)
│   └── ❌ UNTOUCHED
│       ├── What it is: Async jobs that run outside the request-response cycle
│       ├── Examples: Sending confirmation emails, processing scheduled payments,
│       │              retrying failed transactions, generating monthly statements
│       ├── In OPay: When you send money, the SMS notification fires in the background
│       ├── Tools: BullMQ (Redis), RabbitMQ, Kafka, Celery
│       ├── Patterns: Queue-based systems, Pub/Sub, Event-driven
│       └── What we'd add: A transaction after debit to queue email/SMS notification
│
├── LAYER 7: INTEGRATION (Bank External Relations Desk)
│   └── ❌ UNTOUCHED
│       ├── What it is: Talking to third-party systems outside our app
│       ├── Examples: Payment gateways (Stripe, PayPal), SMS/WhatsApp APIs,
│       │              Email providers (SendGrid), KYC verification services
│       ├── In OPay: When you fund your wallet via bank transfer, it hits a bank API
│       ├── Tools: Axios/Fetch for REST, webhook handlers, SDKs (Stripe SDK, etc.)
│       ├── Patterns: Webhooks, API polling, circuit breakers
│       └── What we'd add: Payment gateway integration, SMS notification API
│
└── LAYER 8: INTELLIGENCE / ANALYTICS (Bank Strategy + Risk Unit)
    └── ❌ UNTOUCHED
        ├── What it is: Analyzing data for insights, fraud detection, reporting
        ├── Examples: Flagging unusual transactions, credit scoring,
        │              daily transaction reports, user behavior analytics
        ├── In OPay: Detecting that someone is trying to brute-force your PIN
        ├── Tools: Python (Pandas, sklearn), Elasticsearch, Metabase, Power BI
        ├── Patterns: Aggregation pipelines, ML inference, behavioral analysis
        └── What we'd add: Fraud scoring on debit transactions, daily transaction reports

```

---

## 🔍 Current System Flow (What's Running)

```
Postman/Browser (Client)             ← LAYER 1 (untouched — manual testing only)
    │
    ▼
Express Server (Port 5000)           ← LAYER 2 ✅
    │
    ├── POST /api/auth/register       → bcrypt hash → MongoDB save
    ├── POST /api/auth/login          → bcrypt compare → JWT issue
    ├── GET /api/profile              → JWT verify → return user ID
    ├── GET /api/wallet/balance       → JWT verify → read balance
    ├── POST /api/wallet/credit       → JWT verify → $inc balance (atomic)
    └── POST /api/wallet/debit        → JWT verify → $inc balance (atomic + check)
    │
    ▼
Auth & Wallet Services                ← LAYER 3 ✅
    │
    ▼
Mongoose ODM (User Model)            ← LAYER 4 ✅
    │
    ▼
MongoDB Atlas (Cloud Database)       ← LAYER 5 ✅
```

---

## 📋 What We've Touched vs. What We Haven't

### ✅ Touched (Layers 2–5)
| Layer | Component | Files |
|-------|-----------|-------|
| API | REST routes | `auth.routes.js`, `wallet.routes.js`, `auth.protected.js` |
| API | Middleware | `auth.middleware.js` (JWT gatekeeping) |
| API | Controller | `auth.controller.js`, `wallet.controller.js` |
| Business | Auth logic | `auth.service.js` (register/login rules) |
| Business | Wallet logic | `wallet.service.js` (credit/debit rules) |
| Business | Auth session | `auth.session.js` (JWT token generation) |
| Data Access | User model | `user.model.js` (Mongoose schema) |
| Storage | DB connection | `db.js` (MongoDB Atlas) |

### ❌ Untouched (Layers 1, 6, 7, 8)
| Layer | What's Missing | Real OPay Example |
|-------|---------------|-------------------|
| Client | No frontend app (React, mobile) | OPay's mobile app UI |
| Workflow | No background jobs or queues | OPay sending SMS after a transfer |
| Integration | No external API connections | OPay talking to banks/Paystack |
| Intelligence | No analytics or fraud detection | OPay flagging suspicious logins |

---

## 🧱 Project Tree (Current — Same as README)

```
opay_mini/
│
├── README.md              ← Project intro (short OPay analogy)
├── README2.md             ← THIS FILE — Full architecture layer map
│
└── backend/
    ├── .env
    ├── package.json
    │
    ├── src/
    │   ├── server.js
    │   ├── app.js
    │   │
    │   ├── config/
    │   │   └── db.js
    │   │
    │   ├── middleware/
    │   │   └── auth.middleware.js
    │   │
    │   ├── models/
    │   │   └── user.model.js
    │   │
    │   └── modules/
    │       ├── auth/
    │       │   ├── auth.routes.js
    │       │   ├── auth.controller.js
    │       │   ├── auth.service.js
    │       │   ├── auth.session.js
    │       │   └── auth.protected.js
    │       │
    │       └── wallet/
    │           ├── wallet.routes.js
    │           ├── wallet.controller.js
    │           └── wallet.service.js
    │
    └── node_modules/
```

---

## 🧠 Key Takeaway

We've built the **core backend pipeline** (Layers 2 → 3 → 4 → 5):

```
API Routes → Business Logic → Data Access → Database
```

What's missing is everything around it:
- **Before the API**: A frontend client (Layer 1)
- **After the response**: Background jobs (Layer 6)
- **Outside the system**: Third-party integrations (Layer 7)
- **On top of data**: Analytics and intelligence (Layer 8)

In OPay terms: we built the **vault, the ledger clerk, the operations team, and the reception desk** — but no ATM screen (frontend), no automatic SMS system (background jobs), no bank transfer connections (integrations), and no fraud monitoring (intelligence).

---

> Created for architecture reference. README.md remains the project intro — this is the deep-dive layer analysis.