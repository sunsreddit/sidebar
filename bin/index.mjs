// import reddit from '../src/reddit-api.mjs';
import { discordTable } from "../src/discordTable.mjs";
import { teamRecordTable } from "../src/record.mjs";
import { divisionStandingsTable } from "../src/standing.mjs";
import { MonthlyScheduleGenerator } from "../src/schedule.mjs";
import { TeamRosterTable } from "../src/roster.mjs";
import { hyperlinkTables } from "../src/hyperlink.mjs";
import { default as parameters } from "../config/parameters.json" assert { type: "json" };
import { formatTable } from "../src/helpers.mjs";

(async () => {
  /* User input parameters */
  const { reddit: { subreddit }, discord, nba: { TeamID } } = parameters;

  /* Banner Tables */
  const _discordTable = discordTable(subreddit.long_name, discord.url);
  const _teamRecordTable = await teamRecordTable(TeamID);

  /* Sidebar Tables */
  const _divisionStandingsTable = await divisionStandingsTable(TeamID);

  // Will likely refactor; class seems a little overkill
  const generateSchedule = new MonthlyScheduleGenerator(parameters);
  const _monthlyTeamSchedule = await generateSchedule.generateMonthlySchedule();
  const _teamRosterTable = await TeamRosterTable();
  const _hyperlinkTables = hyperlinkTables(parameters.reddit.sections);
  const _sidebarFooter = '\n[BACK TO TOP](#top)';
  const results =
    _discordTable +
    formatTable(_teamRecordTable) +
    formatTable(_divisionStandingsTable) +
    formatTable(_monthlyTeamSchedule) +
    formatTable(_teamRosterTable) +
    _hyperlinkTables +
    formatTable(_sidebarFooter);
  console.log(results);
  return results;
})();

// const subreddit = await reddit.getSubreddit(parameters.reddit.subreddit.r);
// await subreddit.editSettings({description: schedule + roster});
// return schedule + roster;