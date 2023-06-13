const cron = require('node-cron');

const { updateMeal } = require('./meal');

const cronJobs = [
  {
    name: "급식 업데이트",
    schedule: "0 */2 * * *",
    action: async () => await updateMeal(),
    runOnSetup: true
  }
].map((c) => ({
  ...c,
  action: async () => {
    try {
      console.log(`Started '${c.name}'`);
      await c.action();
      console.log(`Ended '${c.name}'`);
    } catch (error) {
      console.log(`[${c.name}] ${error}`);
    }
  },
}));

const setCronJobs = async () => {
  for (const { schedule, action } of cronJobs) {
    cron.schedule(schedule, action, {
      timezone: 'Asia/Seoul',
    });
  }
};

const manuallyRunCronJobs = async (isSetup = false) => {
  for (const { action, runOnSetup } of cronJobs) {
    if (!isSetup || runOnSetup) await action();
  }
};

module.exports = {
  setCronJobsAndRun: async () => {
    await setCronJobs();
    await manuallyRunCronJobs(true);
  }
};