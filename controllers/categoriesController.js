const Category = require("./../models/Category");
const APIError = require("./../utils/errors/APIError");

const createCategory = async (req, res, next) => {
  try {
    const parentCategory = await Category.findOne({ name: req.body.type });

    if (!parentCategory && req.body.type) {
      throw new APIError(
        `Invalid Request: Category type "${req.body.type}" does not exist`,
        400
      );
    }

    if (parentCategory && parentCategory.type) {
      throw new APIError(
        `Invalid Request: Category type "${req.body.type}" is a sub category not a category type`,
        400
      );
    }

    const categoryObj = {
      name: req.body.name,
      type: parentCategory ? parentCategory.id : null,
    };

    const category = await Category.create(categoryObj);

    res.status(200).json({
      message: "Created cateogry successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

const getCateogries = async (req, res, next) => {
  try {
    const categories = await Category.find().populate({
      path: "type",
      select: "name _id",
    });

    res.status(200).json({
      message: "Successfully fetched categories",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      throw new APIError(
        `Not Found: Category with id ${req.params.id} does not exist`,
        404
      );
    }

    await category.deleteOne();

    res.status(200).json({ message: "Successfully deleted category" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createCategory, getCateogries, deleteCategory };
