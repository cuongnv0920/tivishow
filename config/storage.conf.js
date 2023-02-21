const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, "./public/uploads/");
  },
  filename: (req, file, cd) => {
    cd(null, Date.now() + "-" + file.originalname);
  },
});

const uploadImage = multer({
  storage: storage,
  limits: {
    fileSize: "8mb",
  },
});

const uploadFilm = multer({
  storage: storage,
  limits: {
    fileSize: "150mb",
  },
});

module.exports = uploadImage;
module.exports = uploadFilm;
