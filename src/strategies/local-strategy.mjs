import passport from "passport";
import { Strategy } from "passport-local";
import { data } from "../utils/constants.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { comparePassword, hashPassword } from "../utils/helpers.mjs";

//This fn is responsible for taking the user object and storing it in the session
passport.serializeUser((user, done) => {
  console.log(`Inside Serialize User`);
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log(`Inside Deserialize User`);
  console.log(`Deserialize User ID: ${id}`);
  try {
    const findUser = await User.findById(id);
    if (!findUser) throw new Error("User not found");
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const findUser = await User.findOne({ username });
      if (!findUser) throw new Error(`User ${username} not found`);
      if (!comparePassword(password, hashPassword(password)))
        throw new Error(`Invalid Password`);
      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  })
);
