const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const express = require("express");
const User = require("../models/user");

const googleAuthRouter = express.Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName || email?.split("@")[0] || "User";

        if (!email) {
          return done(new Error("No email found in Google profile"), null);
        }

        let user = await User.findOne({ googleId });

        if (user) {
          return done(null, user);
        }

        // Check if a user with this email already exists
        user = await User.findOne({ email });

        if (user) {
          user.googleId = googleId;
          user.name = name;
          await user.save();
          return done(null, user);
        }

        // Generate a unique username from the email prefix
        const baseUsername = email.split("@")[0];
        let username = baseUsername;
        let counter = 1;
        while (await User.findOne({ username })) {
          username = `${baseUsername}${counter}`;
          counter++;
        }

        const newUser = new User({
          username,
          email,
          googleId,
          name,
        });
        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

googleAuthRouter.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

googleAuthRouter.get(
  "/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (request, response) => {
    const user = request.user;
    const userForToken = {
      username: user.username,
      id: user._id.toString(),
      name: user.name,
    };

    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 60 * 60,
    });

    const redirectUrl = new URL("/auth/callback", process.env.CLIENT_URL);
    redirectUrl.searchParams.set("token", token);
    redirectUrl.searchParams.set("username", user.username);
    redirectUrl.searchParams.set("id", user._id.toString());
    if (user.name) {
      redirectUrl.searchParams.set("name", user.name);
    }

    response.redirect(redirectUrl.toString());
  }
);

module.exports = googleAuthRouter;
