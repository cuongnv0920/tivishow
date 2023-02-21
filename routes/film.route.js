const express = require("express");
const router = express.Router();
const controller = require("../controllers/film.controller");
const uploadFilm = require("../config/storage.conf");

router.post("/create", uploadFilm.single("upload"), controller.create);
router.get("/getAll", controller.getAll);
router.get("/get", controller.get);
router.put("/update/:id", uploadFilm.single("upload"), controller.update);
router.put("/delete/:id", controller.delete);

module.exports = router;
