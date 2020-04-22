const mongoose = require("mongoose");
const SavedRecipeSchema = mongoose.Schema({
  Recipe: {type: mongoose.Schema.Types.ObjectId, ref: 'RecipeModel'},
  User: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'}
}, {collection: "SavedRecipes"});

module.exports = SavedRecipeSchema;
