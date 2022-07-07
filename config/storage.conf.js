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

const uploadSource = multer({
  storage: storage,
  limits: {
    fileSize: "100mb",
  },
});

module.exports = uploadImage;
module.exports = uploadSource;
