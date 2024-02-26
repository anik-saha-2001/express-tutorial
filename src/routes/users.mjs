import { Router } from "express";
import { data } from "../utils/constants.mjs";
import {
  checkSchema,
  matchedData,
  query,
  validationResult,
} from "express-validator";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/helpers.mjs";

const router = Router();

router.get(
  "/api/users",
  query("filter")
    .isString()
    .isEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must have 3-10 chars"),
  (request, response) => {
    console.log(request.sessionID);

    request.sessionStore.get(request.sessionID, (err, sessionData) => {
      if (err) {
        console.log(err);
        throw err;
      }

      console.log("Session Data: ", sessionData);
    });

    const result = validationResult(request);

    console.log(result);

    //Query Parameters usage
    const {
      query: { filter, value },
    } = request;

    if (filter && value)
      return response.send(data.filter((user) => user[filter].includes(value)));

    return response.send(data);
  }
);

router.get("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  const findUser = data[findUserIndex];
  if (!findUser) return response.sendStatus(404);
  return response.send(findUser);
});

router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  async (request, response) => {
    const result = validationResult(request);

    if (!result.isEmpty()) return response.status(400).send(result.array());

    const data = matchedData(request);
    // console.log(data);
    data.password = hashPassword(data.password);
    // console.log(data);
    const newUser = new User(data);
    try {
      const savedUser = await newUser.save();
      return response.status(201).send(savedUser);
    } catch (error) {
      console.log(error);
      return response.status(400).send({ msg: error.message });
    }
  }
);

router.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  //All of the logic is defined in resolveIndexByUserId
  const { body, findUserIndex } = request; // never modify request body
  data[findUserIndex] = { id: data[findUserIndex].id, ...body };
  return response.sendStatus(200);
});

router.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  data[findUserIndex] = { ...data[findUserIndex], ...body };
  return response.sendStatus(200);
});

router.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  data.splice(findUserIndex, 1);
  return response.sendStatus(200);
});

export default router;
