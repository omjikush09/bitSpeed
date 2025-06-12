import { Router } from "express";
import { getContactsController } from "./contact.controller";

const router = Router();

router.post("/", getContactsController);

export default router;
