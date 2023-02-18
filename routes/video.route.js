const express = require("express");
const router = express.Router();
const controller = require("../controllers/video.controller");
const uploadVideo = require("../config/storage.conf");

router.post("/create", uploadVideo.single("video"), controller.create);
router.get("/getAll", controller.getAll);
router.put("/update", uploadVideo.single("video"), controller.update);

module.exports = router;
