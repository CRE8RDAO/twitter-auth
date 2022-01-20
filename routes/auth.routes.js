import { Router } from "express";
import {
  handleTwitterCallback,
  twitter,
} from "../controllers/auth.controller.js";
const router = Router();

router.get("/twitter/authenticate", twitter("authenticate"));
router.get("/twitter/authorize", twitter("authorize"));

router.get("/twitter/callback", handleTwitterCallback);

export default router;
