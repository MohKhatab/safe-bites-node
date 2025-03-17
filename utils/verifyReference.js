const mongoose = require("mongoose");

const verifyReference = async (objectIds, modelName) => {
  const Model = mongoose.model(modelName);

  if (!Array.isArray(objectIds)) objectIds = [objectIds];

  if (!mongoose.models[modelName]) {
    throw new Error(`Model "${modelName}" is not registered.`);
  }

  const count = await Model.countDocuments({ _id: { $in: objectIds } });

  return count === objectIds.length;
};

module.exports = verifyReference;
