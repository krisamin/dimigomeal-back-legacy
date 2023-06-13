const moment = require('moment');

const { HttpException } = require('../../exceptions');

const { mealModel } = require('../../schemas/meal');

const getDayMeal = async (req, res) => {
  const date = moment(req.params.day, 'YYYY-MM-DD').format('YYYY-MM-DD');
  console.log(date);

  const meal = await mealModel.findOne({ date });

  if (!meal) {
    throw new HttpException(404, '급식이 없습니다.');
  }

  const modifiedMeal = {
    date: moment(meal.date).format('YYYY-MM-DD'),
    breakfast: meal.breakfast,
    lunch: meal.lunch,
    dinner: meal.dinner,
  };

  res.send(modifiedMeal);
};

const getWeekMeal = async (req, res) => {
  const start = moment().startOf('week');
  const end = moment().endOf('week');

  const meals = await mealModel.find({
    date: {
      $gte: start.toDate(),
      $lte: end.toDate(),
    },
  }).sort({ date: 1 });

  const modifiedMeals = [];
  for (const meal of meals) {
    const modifiedMeal = {
      date: moment(meal.date).format('YYYY-MM-DD'),
      breakfast: meal.breakfast,
      lunch: meal.lunch,
      dinner: meal.dinner,
    };
    modifiedMeals.push(modifiedMeal);
  }

  res.send(modifiedMeals);
}

module.exports = {
  getDayMeal,
  getWeekMeal
};