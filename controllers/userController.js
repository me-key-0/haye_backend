const User = require("../models/usersModel");
const Code = require("../models/verificationCode");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const {
  userRegistrationSchema,
  loginSchema,
} = require("../validation/validate");

// GET /users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET /users/:id
const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// POST /users
const createUser = async (req, res) => {
  const { code } = req.body;
  console.log(code);
  try {
    if (!req.cookies && !req.cookies.Token) {
      res.status(401).json({ message: "Cookie missing" });
    }

    console.log(req.cookies);

    const decoded = jwt.verify(
      req.cookies.Token,
      process.env.ACCESS_TOKEN_SECRET
    );

    const { username, email, password } = decoded;

    const verify = await Code.findOne({ email });

    if (verify.code != code) {
      res.status(400).json({
        message: "Incorrect code!",
      });
    }

    // Calculate expiration time (adjust expiration time as needed)
    const expirationTime = 30 * 60 * 1000; // 30 minutes in milliseconds

    // Check if code has expired
    if (Date.now() - verify.createdAt.getTime() > expirationTime) {
      return res.status(400).json({ message: "Code expired" });
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    //register/create a user
    console.log("creating...");
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    console.log("user");

    if (user) {
      await Code.deleteOne({ email });
      res.status(201).json({
        message: "User registered Successfully",
        id: user._id,
        email: user.email,
      });
    } else {
      res.status(400).json({
        message: "User data is not valid",
      });
      // throw new Error("User data is not valid")
    }

    // console.log(hashedPassword);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

// PUT /users/:id
const updateUser = async (req, res) => {
  const { _id } = res.locals.user;

  try {
    const user = await User.findByIdAndUpdate(_id, req.body, { new: true });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE /users/:id
const deleteUser = async (req, res) => {
  const { _id } = res.locals.user;

  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    const user = await User.findByIdAndDelete(_id);
    res.json({
      message: "User Deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const { error } = loginSchema.validate({
    email,
    password,
  });

  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      details: error.details[0].message,
    });
  }

  try {
    //Check if the user exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // compare password with the one in the db(hashed one)
    if (await bcrypt.compare(password, user.password)) {
      // Acces token generation
      const accessToken = jwt.sign(
        {
          username: user.username,
          email: user.email,
          id: user._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
      );

      // Sending access token to browser Cookie
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        // secure:true,
        maxAge: 25 * 60 * 1000,
        sameSite: "strict",
      });

      // Refresh token generation
      const refreshToken = jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
      );

      const refToken = user.refToken;

      if (!refToken) {
        console.log("ref token missing");
        user.refToken = refreshToken;
        user.save();
      } else {
        console.log("refToken exists!");
        user.refToken = null;
        user.refToken = refreshToken;
        user.save();
      }

      // Sending refresh token to browser Cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        // secure:true;
        maxAge: 15 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });

      res.status(200).json({
        message: "User logged in successfully!",
      });
    } else {
      res.status(401).json({
        error: "invalid password!",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Server error",
    });
  }
};

const logoutUser = async (req, res) => {
  // Delete refToken from Database
  const user = await User.findOne({ email: res.locals.user.email });
  user.refToken = null;
  user.save();

  res.clearCookie("accessToken", {
    httpOnly: true,
    // secure:true,
    sameSite: "strict",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    // secure:true,
    sameSite: "strict",
  });
  res.status(200).json({
    message: "Logged out succesfully",
  });
};

const updatePassword = async (req, res) => {
  const { _id } = res.locals.user;
  const { password } = req.body;
  try {
    const hashedP = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(
      _id,
      { password: hashedP },
      { new: true }
    );
    res.json({
      message: "it works",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      error: "server error",
    });
  }
};

const isUser = async (req, res, next) => {
  console.log(req.body.email);
  const user = await User.findOne({
    email: req.body.email,
  });
  console.log(req.body);
  if (user && user.role === "user") {
    next();
  } else {
    return res.status(403).json({
      message: "Not a user",
    });
  }
};

const isAdmin = (req, res, next) => {
  console.log(res.locals.user);
  if (res.locals.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      message: "Not an Admin",
    });
  }
};

const currentUser = async (req, res) => {
  res.json(res.locals.user);
};

const refreshController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  console.log(refreshToken);
  if (!refreshToken) {
    res.status(401).json({
      error: "refresh token missing",
    });
  }
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findById(decoded.id);

  if (user) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 20 * 60 * 1000,
      sameSite: "strict",
    });

    res.status(200).json({
      accessToken: accessToken,
    });
  } else {
    res.status(401).json({
      error: "invalid refresh token",
    });
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      error: "User not found",
    });
  }

  user.pwdToken = null;

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.PASSWORD_RETRIEVAL_TOKEN,
    {
      expiresIn: process.env.PASSWORD_RETRIEVAL_EXPIRY,
    }
  );

  const resetLink = `https://${process.env.HOST}:${process.env.PORT}/resetPassword?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Send the password reset link to the user's email
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USERNAME,
      to: email,
      subject: "Password Reset Request",
      text: `Click the link to reset your password: ${resetLink}`,
      html: `<p>Click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
    });

    user.pwdToken = token;
    await user.save();

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Error sending email", error });
  }
};

const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.query;

  if (!password || !token) {
    return res.status(400).json({
      error: "Password or token is missing!",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.PASSWORD_RETRIEVAL_TOKEN);
    console.log(decoded);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.pwdToken !== token) {
      console.log("token not similar");
      return res.status(401).json({
        message: "invalid token",
      });
    } else {
      console.log("token validated");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.pwdToken = null;
    await user.save();
    return res.status(200).json({
      message: "Password reset successfully",
    });

    // process.env.PASSWORD_RETRIEVAL_EXPIRY = new Date(0);
  } catch (error) {
    return res.status(401).json({
      message: "token expires",
      error,
    });
  }
};

const verifyEmail = async (req, res) => {
  const { username, password, email } = req.body;

  const { error } = userRegistrationSchema.validate({
    username,
    password,
    email,
  });
  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      details: error.details[0].message,
    });
  }

  try {
    // Check if user already registered, and throw an error
    const userAvailable = await User.findOne({
      email,
    });
    if (userAvailable) {
      res.status(400).json({
        message: "User already exist",
      });
    }

    // Generating registration Token
    const token = jwt.sign(
      {
        username,
        email,
        password,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );
    console.log(token);

    // Sending access token to browser Cookie
    res.cookie("Token", token, {
      httpOnly: true,
      // secure:true,
      maxAge: 30 * 60 * 1000,
      sameSite: "strict",
    });

    // A
    const generateRandomNumber = () => {
      // Generate a 6-digit random number
      const code = Math.floor(100000 + Math.random() * 900000);
      return code;
    };

    const code = generateRandomNumber();
    console.log(`verification code: ${code}`);

    await Code.findOneAndDelete({ email });
    const stg = await Code.create({ email, code, token });
    if (!stg) {
      return res
        .status(401)
        .json({ message: "Generated code can not be stored" });
    }
    console.log("passed!");

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail(
      {
        from: process.env.SMTP_USERNAME, // sender address
        to: email, // receiver address
        subject: "Account Verification Code", // Subject line
        text: `Your verification code is: ${code}`, // plain text body
        html: `
        <p>Dear ${username},</p>
        <p>Thank you for registering with us.</p>
        <p>Your verification code is: <strong>${code}</strong></p>
        <p>Please enter this code to verify your email address.</p>
        <p>This code is valid for 30 minutes.</p>
        <p>If you did not request this verification, please ignore this email.</p>
        <p>Best regards,</p>
        <p>Your Company Name</p>
      `, // html body
      },
      (error, info) => {
        if (error) {
          return res.status(500).json({
            message: "Error sending email",
            error,
          });
        }

        console.log("verified!");
        res.status(200).json({
          message: "User verification email sent",
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  refreshController,
  currentUser,
  updatePassword,
  forgetPassword,
  resetPassword,
  verifyEmail,
  isUser,
  isAdmin,
};
