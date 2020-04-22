const mongoose = require("mongoose");
const LikesSchema = require('../FoodHubbackendmodel/Likes.schema.server');
const LikesModel = mongoose.model('LikesModel', LikesSchema);

UserLikesARecipe = (likes) => {
  return LikesModel.create({
    Recipe: likes.foodId,
    User: likes.userId
  })
}

FetchAllLikesInfo = () => {
  return LikesModel.find().populate([{path: 'User'}, {path: 'Recipe'}])
}

DeleteALikeForRecipe = (item) => {
  return LikesModel.findOneAndDelete({Recipe: item.foodId, User: item.userId});
}

module.exports = {
  UserLikesARecipe,
  FetchAllLikesInfo,
  DeleteALikeForRecipe
}
