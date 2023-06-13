const moment = require('moment-timezone');

const timezone = 'Asia/Seoul';
moment.tz.setDefault(timezone);
const format = 'YYYY-MM-DD';

module.exports = {
  getNowDateString: () => moment().toISOString(),
  getTodayDateString: () => moment('2022-04-20').format(format),
  getWeekStartString: (date) => moment(date).startOf('week').format(format),
  getWeekEndString: (date) => moment(date).endOf('week').format(format),
  getTomorrowDateString: (date) => moment(date).add(1, 'days').format(format),
};