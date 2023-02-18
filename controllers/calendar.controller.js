module.exports.getAll = async (req, res, next) => {
  const date = new Date();

  const today = (date) => {
    switch (date.getDay()) {
      case 0:
        return "Chủ nhật";
      case 1:
        return "Thứ hai";
      case 2:
        return "Thứ ba";
      case 3:
        return "Thứ tư";
      case 4:
        return "Thứ năm";
      case 5:
        return "Thứ sáu";
      case 6:
        return "Thứ bảy";
    }
  };

  if (date) {
    return res.status(200).json([{ date: date, today: today(date) }]);
  }
};
