import reddit from '../src/reddit-api.mjs';
import { TeamRosterTable } from '../src/roster.mjs';
import { MonthlyScheduleGenerator } from '../src/schedule.mjs';
import { default as parameters } from '../config/parameters.json' assert { type: 'json' };

(async () => {
  const generateSchedule = new MonthlyScheduleGenerator(parameters);
  const schedule = await generateSchedule.generateMonthlySchedule();
  const roster = await TeamRosterTable();
  const subreddit = await reddit.getSubreddit(parameters.reddit.subreddit.name);
  await subreddit.editSettings({description: schedule + roster});
  // console.log(schedule + roster);
  // return schedule + roster;
})();
