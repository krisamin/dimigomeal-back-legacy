const controllers = require('./controllers');

module.exports = {
  name: '급식 서비스',
  baseURL: '/api',
  routes: [
    {
      method: 'get',
      path: '/week',
      handler: controllers.getWeekMeal,
    },
    {
      method: 'get',
      path: '/:day',
      handler: controllers.getDayMeal,
    },
  ],
};