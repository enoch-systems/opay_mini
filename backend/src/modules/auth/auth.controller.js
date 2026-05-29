const { registerUser, loginUser } = require("./auth.service");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await registerUser(username, email, password);

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await loginUser(email, password);

    res.status(200).json({
      message: "Login successful",
      token: data.token,
      user: {
        id: data.user._id,
        username: data.user.username,
        email: data.user.email,
      },
    });
  } catch (err) {
    res.status(401).json({
      message: err.message,
    });
  }
};

module.exports = {
  register,
  login,
};