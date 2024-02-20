import express from "express";
import {
  query,
  validationResult,
  body,
  matchedData,
  checkSchema,
} from "express-validator";
import {
  createQuerySchema,
  createUserValidationSchema,
} from "./utils/validationSchemas.mjs";

const app = express();

app.use(express.json());

//Middleware Function
const loggingMiddleware = (request, response, next) => {
  console.log(`${request.method} - ${request.url}`);
  next();
};

//Using Middleware globally
app.use(loggingMiddleware);

const resolveIndexByUserId = (request, response, next) => {
  const {
    body,
    params: { id },
  } = request;
  const parsedID = parseInt(id);
  if (isNaN(parsedID)) return response.sendStatus(400);
  const findUserIndex = data.findIndex((user) => user.id === parsedID);
  if (findUserIndex === -1) return response.sendStatus(404);
  request.findUserIndex = findUserIndex;
  next();
};

const PORT = process.env.PORT || 3000;

app.get(
  "/",
  //Middleware
  (request, response, next) => {
    console.log("BASE URL");
    next();
  },
  (request, response) => {
    // response.send("Response sent!");
    response.status(201).send({ msg: "Response Sent!" });
  }
);

//Mock Users
const data = [
  { id: 1, username: "anik", displayName: "Anik" },
  { id: 2, username: "debi", displayName: "Debi" },
  { id: 3, username: "manoj", displayName: "Manoj" },
  { id: 4, username: "none1", displayName: "None1" },
  { id: 5, username: "none2", displayName: "None2" },
  { id: 6, username: "none3", displayName: "None3" },
  { id: 7, username: "none4", displayName: "None4" },
];

//api/users
app.get("/api/users", checkSchema(createQuerySchema), (request, response) => {
  const result = validationResult(request);
  console.log(result);
  //Query Parameters usage
  const {
    query: { filter, value },
  } = request;

  if (filter && value)
    return response.send(data.filter((user) => user[filter].includes(value)));

  return response.send(data);
});

//Post Requests

//The data that we send to backend server via payload or request body, then it takes and does its work!

app.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  (request, response) => {
    const result = validationResult(request);
    console.log(result);

    if (!result.isEmpty())
      return response.status(400).send({ errors: result.array() });

    const matchData = matchedData(request);

    const newUser = { id: data[data.length - 1].id + 1, ...matchData };
    data.push(newUser);
    return response.status(200).send(data);
  }
);

//api/products
app.get("/api/products", (request, response) => {
  response.send([
    { pid: 10, name: "MacBook" },
    { pid: 20, name: "Gaming Computer" },
  ]);
});

//Route Parameters
app.get("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  const findUser = data[findUserIndex];
  if (!findUser) return response.sendStatus(404);
  return response.send(findUser);
});

//Put Requests (used to update entire record)

app.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  //All of the logic is defined in resolveIndexByUserId
  const { body, findUserIndex } = request; // never modify request body
  data[findUserIndex] = { id: data[findUserIndex].id, ...body };
  return response.sendStatus(200);
});

//Patch Requests (used to update some part of record)

app.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  data[findUserIndex] = { ...data[findUserIndex], ...body };
  return response.sendStatus(200);
});

//Delete Requests

app.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  data.splice(findUserIndex, 1);
  return response.sendStatus(200);
});

//      Server     ==================>

app.listen(PORT, () => {
  console.log(`Running on Port: ${PORT}`);
});
