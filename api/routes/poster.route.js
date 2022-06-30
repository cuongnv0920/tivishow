const express = require("express");
const router = express.Router();
const upload = require("../../config/storage.conf");

const controller = require("../controllers/poster.controller");

router.post("/create", upload.single("image"), controller.create);

router.get("/list", controller.list);

router.put("/update", upload.single("image"), controller.update);

module.exports = router;
