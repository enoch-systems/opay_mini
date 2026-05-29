const express = require("express");
const authMiddleware = require("../../middleware/auth.middleware");

const router = express.Router();

// protected route
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected data accessed",
    userId: req.user.id,
  });
});

module.exports = router;