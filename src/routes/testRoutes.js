import express from "express";
import { createTestCase, getTestCases, deleteTestCase } from "../controllers/testController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/", authenticateToken, createTestCase);
router.get("/", authenticateToken, getTestCases);
router.delete("/:id", authenticateToken, deleteTestCase);

export default router;
