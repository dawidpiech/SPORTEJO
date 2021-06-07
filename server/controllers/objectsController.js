const Category = require("./../models/category");

const getCategories = async (req, res, next) => {
  const categories = await Category.find({}).populate("categories");
  res.send(categories);
};

exports.getCategories = getCategories;
