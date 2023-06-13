const controllers = require('./controllers');

module.exports = {
  name: '급식 서비스',
  baseURL: '/api',
  routes: [
    {
      method: 'get',
      path: '/',
      handler: controllers.getMeal,
    },
  ],
};