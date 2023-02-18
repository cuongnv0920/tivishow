const express = require("express");
const router = express.Router();
const uploadImage = require("../config/storage.conf");
const controller = require("../controllers/poster.controller");

router.post("/create", uploadImage.single("image"), controller.create);
router.get("/getAll", controller.getAll);
router.put("/update", uploadImage.single("image"), controller.update);

module.exports = router;
