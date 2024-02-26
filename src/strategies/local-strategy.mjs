import passport from "passport";
import { Strategy } from "passport-local";
import { data } from "../utils/constants.mjs";

//This fn is responsible for taking the user object and storing it in the session
passport.serializeUser((user, done) => {
  console.log(`Inside Serialize User`);
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log(`Inside Deserialize User`);
  console.log(`Deserialize User ID: ${id}`);
  try {
    const findUser = data.find((user) => user.id === id);
    if (!findUser) throw new Error("User not found");
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy((username, password, done) => {
    console.log(`User: ${username}, Password: ${password}`);
    try {
      const findUser = data.find((user) => user.username === username);
      if (!findUser) throw new Error("User not found");
      if (findUser.password !== password) throw new Error("Incorrect Password");
      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  })
);
