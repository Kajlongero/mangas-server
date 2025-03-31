import { Router } from "express";

const router = Router();

router.post("/login", (req, res) => {
  res.send("login");
});

router.post("/register", (req, res) => {
  res.send("register");
});

router.post("/logout", (req, res) => {
  res.send("logout");
});

router.post("/refresh-token", (req, res) => {
  res.send("refresh-token");
});

export { router as authRouter };
