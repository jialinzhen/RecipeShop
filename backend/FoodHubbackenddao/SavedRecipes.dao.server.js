const mongoose = require("mongoose");
const SavedRecipeSchema = require('../FoodHubbackendmodel/SavedRecipes.schema.server');
const SavedRecipeModel = mongoose.model('SavedRecipeModel', SavedRecipeSchema);

onSaveRecipe = (item) => {
  return SavedRecipeModel.create({
    Recipe: item.foodId,
    User: item.userId
  })
}

FetchAllSavedRecipe = () => {
  return SavedRecipeModel.find().populate([{path: 'User'}, {path: 'Recipe'}])
}

FetchAllSavedRecipeBySingleUser = (id) => {
  return SavedRecipeModel.findOne({_id: id}).populate([{path: 'User'}, {path: 'Recipe'}])
}

DeleteOneSaveByUser = (item) => {
  return SavedRecipeModel.findOneAndDelete({Recipe: item.foodId, User: item.userId})
}

module.exports = {
  onSaveRecipe,
  FetchAllSavedRecipe,
  FetchAllSavedRecipeBySingleUser,
  DeleteOneSaveByUser
}
