const { Schema, model } = require("mongoose");

const mealSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  breakfast: {
    type: String,
    default: "",
  },
  lunch: {
    type: String,
    default: "",
  },
  dinner: {
    type: String,
    default: "",
  },
});

const mealModel = model("meals", mealSchema);
module.exports = {
  mealSchema,
  mealModel,
};
