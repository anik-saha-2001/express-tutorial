import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(routes);

const PORT = process.env.PORT || 3000;

//TODO: Server     ==================>
app.listen(PORT, () => {
  console.log(`Running on Port: ${PORT}`);
});

app.get("/", (req, res) => {
  //cookie for 1hr
  res.cookie("hello", "world", { maxAge: 10000, signed: true });
  res.status(201).send({ msg: "Hello There!" });
});
