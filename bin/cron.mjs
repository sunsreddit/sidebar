
import { CronJob } from 'cron';
import { Sidebar } from './index.mjs';
const { default: { cron: { cronTime, timeZone }}} = await import('../config/parameters.json', { assert: { type: 'json' } });

// Break handler
const handleExit = async () => {
  console.log('Exiting...');
  process.exit();
};

// Listen for the SIGINT signal (Ctrl+C)
process.on('SIGINT', handleExit);

console.log('Invoking Cron...');
CronJob.from({
  cronTime,
  onTick: async function () {
    await Sidebar();
    console.log(`Cron iteration: ${new Date().toLocaleString('en-US', { timeZone })}`);
  },
  runOnInit: false,
  start: process.env.NPM_CRON.toLowerCase() === 'on' ? true : false,
  timeZone,
});
