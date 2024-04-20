import urlFunctions from "../controllers/url";
const { createShortUrl, getAllUrls, getUrl, deleteUrls } = urlFunctions;
import auth from "../middleware/authentication";
import express from "express";

const router = express.Router();

router.post("/shorten", auth, createShortUrl);
router.get("/urls", auth, getAllUrls);
router.get("/url/:id", auth, getUrl);
router.delete("/url/delete/:id", auth, deleteUrls);

export default router;
