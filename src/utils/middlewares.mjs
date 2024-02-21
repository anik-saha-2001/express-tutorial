import { data } from "./constants.mjs";

export const resolveIndexByUserId = (request, response, next) => {
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

