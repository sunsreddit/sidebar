import { TeamRosterTable } from '../src/roster.mjs';
import { MonthlyScheduleGenerator } from '../src/schedule.mjs';
import { default as parameters } from '../config/parameters.json' assert { type: 'json' };

(async () => {
  const generateSchedule = new MonthlyScheduleGenerator(parameters);
  const schedule = await generateSchedule.generateMonthlySchedule();
  const roster = await TeamRosterTable();
  console.log(schedule + roster);
  return schedule + roster;
})();
