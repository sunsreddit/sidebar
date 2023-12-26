import NBA from 'nba-api-client';
import { seasonYearRange } from './helpers.mjs';

export async function teamRecordTable(teamId) {
  const standings = (await NBA.leagueStandings({ Season: seasonYearRange })).Standings;
  const teamInfo = Object.values(standings).find((s) => s.TeamID === teamId);
  const header =  `\n##${seasonYearRange} Record\n\n` + `WINS | LOSSES\n:--:|:--:\n`;
  const record = `${teamInfo.WINS} | ${teamInfo.LOSSES}\n`;
  const footer = `\n[View Games](https://nba.com/${teamInfo.teamSlug}/schedule)\n`;
  return header + record + footer;
}