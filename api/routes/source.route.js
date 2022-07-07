const express = require("express");
const router = express.Router();

const controller = require("../controllers/source.controller");

const multer = require("multer");
const uploadSource = require("../../config/storage.conf");

router.post("/create", uploadSource.single("source"), controller.create);

router.get("/list", controller.list);

router.put("/update", uploadSource.single("source"), controller.update);

module.exports = router;
