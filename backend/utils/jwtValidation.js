const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

module.exports = {
  generateToken: function (user) {
    return jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      process.env.TOKEN,
      { expiresIn: "24h" }
    );
  },
  getUserId: function (data) {
    if (data !== null) {
      try {
        let token;

        if (data.split(" ").length > 1) {
          token = jwt.verify(data.split(" ")[1], process.env.TOKEN);
        } else {
          token = jwt.verify(data, process.env.TOKEN);
        }
        return token;
      } catch (err) {
        return err.message;
      }
    }
  },
};