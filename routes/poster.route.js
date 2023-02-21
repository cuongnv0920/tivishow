const express = require("express");
const router = express.Router();
const uploadImage = require("../config/storage.conf");
const controller = require("../controllers/poster.controller");

router.post("/create", uploadImage.single("upload"), controller.create);
router.get("/getAll", controller.getAll);
router.put("/update/:id", uploadImage.single("upload"), controller.update);
router.put("/delete/:id", controller.delete);

module.exports = router;
