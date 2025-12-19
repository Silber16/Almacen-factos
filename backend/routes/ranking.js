import express from "express";
import rankingcontroller from "../controllers/ranking.js";
const router = express.Router();
router.get("/" , rankingcontroller.topRanking);
export default router;