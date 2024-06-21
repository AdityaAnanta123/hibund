const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require("../models/User");

require("dotenv").config();

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
(accessToken, refreshToken, profile, done) => {
  // Ambil data yang diinginkan dari profil Google
  const user = {
    googleId: profile.id,
    username: profile.displayName,
    email: profile.emails[0].value,
  };
  
  // Simpan atau periksa pengguna di database
  return done(null, user);
}
));


passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Generate Access Token
async function getAccessToken() {
  const oauth2Client = new (require('google-auth-library').OAuth2Client)(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });

  const tokenResponse = await oauth2Client.getAccessToken();
  return tokenResponse.token;
}

async function createTransporter() {
  const accessToken = await getAccessToken();
  const expirationTime = Date.now() + 60 * 1000; // 1 menit dalam milidetik
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL_USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken,
      expires: expirationTime, // Atur waktu tokenisasi
    },
    tls: {
      rejectUnauthorized: false
    },
    headers: {
      'Auto-Submitted': 'auto-generated', // Atur email agar tidak dapat dibalas
      'Reply-To': '', // Atur agar email tidak dapat dibalas (non-reply)
    },
  });
};

// Signup function
exports.signup = async (req, res) => {
  const { username, email, phone, password } = req.body;
  const authCode = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`Generated authCode: ${authCode}`);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      phone,
      password: hashedPassword,
      authCode,
      isVerified: false, // Setelah signup, pengguna belum diverifikasi
    });

    console.log(`New User before save: ${JSON.stringify(newUser, null, 2)}`);

    // Tidak langsung menyimpan ke database, tetapi ke penyimpanan sementara
    req.session.tempUser = newUser;

    // Kirim kode otorisasi ke email pengguna
    const transporter = await createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Authentication Code',
      text: `Your authentication code is: ${authCode}`,
    });

    res.status(201).json({ message: "User registered. Please check your email for the authentication code." });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ error: "Error registering user" });
  }
};

// Verify function
exports.verify = async (req, res) => {
  console.log("Verify endpoint hit");
  const { email, authCode } = req.body;
  console.log(`Received authCode: ${authCode}`);

  try {
    // Ambil informasi pengguna dari penyimpanan sementara
    const tempUser = req.session.tempUser;

    if (!tempUser) {
      return res.status(400).json({ error: "User not found" });
    }

    // Lakukan verifikasi kode otorisasi
    if (tempUser.authCode !== authCode) {
      return res.status(400).json({ error: "Invalid authentication code" });
    }

    // Simpan pengguna ke dalam database
    const hashedPassword = await bcrypt.hash(tempUser.password, 10);
    const newUser = new User({
      username: tempUser.username,
      email: tempUser.email,
      phone: tempUser.phone,
      password: hashedPassword,
      isVerified: true, // Setelah verifikasi, pengguna telah diverifikasi
    });
    await newUser.save();

    // Hapus informasi sementara dari session atau cache
    delete req.session.tempUser;

    res.status(200).json({ message: "User verified and registered successfully" });
  } catch (error) {
    console.error("Error verifying user:", error.message);
    res.status(500).json({ error: "Error verifying user" });
  }
};

// Login success function
exports.loginSuccess = (req, res) => {
  if (req.user) {
    const { googleId, username, email } = req.user;

    // Simpan data pengguna ke MongoDB dengan nilai default untuk phone dan password
    const newUser = new User({
      googleId,
      username,
      email,
      password: "", // Nilai default untuk password
      phone: "", // Nilai default untuk phone
      isVerified: true,
    });

    newUser.save()
      .then(() => {
        res.status(200).json({
          error: false,
          message: "Successfully Logged In",
          user: req.user,
        });
      })
      .catch((error) => {
        console.error("Error saving user to MongoDB:", error.message);
        res.status(500).json({ error: "Error saving user to MongoDB" });
      });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
};



// Login failed function
exports.loginFailed = (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
};

// Google auth function
exports.googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

// Google auth callback function
exports.googleAuthCallback = passport.authenticate("google", {
  failureRedirect: "/auth/login/failed",
  successRedirect: "/auth/login/success"
});

// Logout function
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};

// Request password reset function
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`Generated resetCode: ${resetCode}`);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    user.resetCode = resetCode;
    await user.save();

    const transporter = await createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Code',
      text: `Your password reset code is: ${resetCode}`,
    });

    res.status(200).json({ message: "Password reset code sent to your email." });
  } catch (error) {
    console.error("Error sending password reset code:", error.message);
    res.status(500).json({ error: "Error sending password reset code" });
  }
};

// Verify reset code function
exports.verifyResetCode = async (req, res) => {
  console.log("Verify endpoint hit");
  const { email, resetCode } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (user.resetCode !== resetCode) {
      return res.status(400).json({ error: "Invalid reset code" });
    }

    user.resetCode = undefined;
    await user.save();

    res.status(200).json({ message: "Reset code verified. You can now reset your password." });
  } catch (error) {
    console.error("Error verifying reset code:", error.message);
    res.status(500).json({ error: "Error verifying reset code" });
  }
};

// Reset password function
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error.message);
    res.status(500).json({ error: "Error resetting password" });
  }
};