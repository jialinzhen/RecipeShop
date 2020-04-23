module.exports = function() {
  const mongoose = require("mongoose");
  mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/FoodHub", { useNewUrlParser: true }).then(res => {
    console.log('connected');
  })
}
