import { Router } from "express";

const router = Router();

router.get("/api/products", (request, response) => {
  console.log(request.headers.cookie);
  console.log(request.cookies);
  console.log(request.signedCookies);
  if (request.signedCookies.hello && request.signedCookies.hello === "world")
    return response.send([
      { pid: 10, name: "MacBook" },
      { pid: 20, name: "Gaming Computer" },
    ]);

  return response
    .status(403)
    .send({ msg: "Sorry you need the correct signed cookie" });
});

export default router;
