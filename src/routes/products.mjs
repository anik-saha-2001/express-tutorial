import { Router } from "express";

const router = Router();

router.get("/api/products", (request, response) => {
  response.send([
    { pid: 10, name: "MacBook" },
    { pid: 20, name: "Gaming Computer" },
  ]);
});

export default router;