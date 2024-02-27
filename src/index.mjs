import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { data } from "./utils/constants.mjs";
import passport from "passport";
import "./strategies/local-strategy.mjs";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

const app = express();

mongoose
  .connect("mongodb://localhost/express_tutorial")
  .then(() => console.log(`Connected to Database`))
  .catch((err) => console.log(`Error: ${err}`));

app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(
  session({
    secret: "iamaniksaha.dev",
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

//Everything before the routes are registered
app.use(routes);

app.post("/api/auth", passport.authenticate("local"), (request, response) => {
  response.sendStatus(200);
});

app.get("/api/auth/status", (request, response) => {
  console.log(`Inside /api/auth/status`);
  console.log(request.user);
  return request.user
    ? response.status(200).send(request.user)
    : response.sendStatus(401);
});

app.post("/api/auth/logout", (request, response) => {
  if (!request.user) return response.sendStatus(401);

  request.logOut((err) => {
    if (err) return response.sendStatus(400);
    response.sendStatus(200);
  });
});

const PORT = process.env.PORT || 3000;

//TODO: Server     ==================>
app.listen(PORT, () => {
  console.log(`Running on Port: ${PORT}`);
});

app.get("/", (req, res) => {
  console.log(req.sessionID);
  //the sessionID is same for every single time
  req.session.visited = true;
  //cookie for 10secs
  res.cookie("hello", "world", { maxAge: 10000, signed: true });
  res.status(201).send({ msg: "Hello There!" });
});

app.post("/api/auth", (request, response) => {
  const {
    body: { username, password },
  } = request;

  const findUser = data.find((user) => user.username === username);

  if (!findUser || findUser.password !== password)
    return response.status(401).send({ msg: "Invalid Credentials" });

  request.session.user = findUser;

  return response.status(200).send(findUser);
});

app.get("/api/auth/status", (request, response) => {
  request.sessionStore.get(request.sessionID, (err, session) => {
    if (err) console.log(err);
    console.log(session);
  });

  return request.session.user
    ? response.status(200).send(request.session.user)
    : response.status(401).send({ msg: "Not Authenticated" });
});

app.post("/api/cart", (request, response) => {
  if (!request.session.user) return response.sendStatus(401);
  const { body: item } = request;

  const { cart } = request.session;

  if (cart) {
    cart.push(item);
  } else {
    request.session.cart = [item];
  }

  return response.status(201).send(item);
});

app.get("/api/cart", (request, response) => {
  if (!request.session.user) return response.sendStatus(401);

  return response.send(request.session.cart ?? []);
});
