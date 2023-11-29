import { TeamRosterTable } from '../src/roster.mjs';
import { MonthlyScheduleTable } from '../src/schedule.mjs';
import {default as parameters } from '../config/parameters.json' assert { type: 'json' };

 (async () => {
  const schedule = await MonthlyScheduleTable();
  const roster = await TeamRosterTable();
  console.log(schedule + roster)
  return schedule + roster
})();
