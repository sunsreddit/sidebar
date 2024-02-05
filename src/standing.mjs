import NBA from '@sunsreddit/nba-stats';
import { seasonYearRange } from './helpers.mjs';
import { default as parameters } from '../config/parameters.json' assert { type: 'json' };

export async function divisionStandingsTable(teamId) {
  const headUrl = `\n##[Division Standings](https://www.nba.com/standings)\n\n`;
  const header = `TEAM | W | L | PCT | GB` + `\n:--|:--:|:--:|:--:|:--:|\n`;
  let table = '';
  const footUrl = `\n####[View full standings](http://www.nba.com/standings)\n`;
  const standings = (await NBA.leagueStandings({Season: seasonYearRange })).Standings;
  const conference = Object.entries(standings).filter(([,value]) => value.Division === parameters.nba.Division ? value : null);
  conference.forEach((t) => {
    const team = t[1];
    const __bold__ = '**';
    const teamName = team.TeamID === teamId ? __bold__ + team.TeamName + __bold__ : team.TeamName;
    const teamLogo = `[](#${team.TeamSlug})${teamName}`;
    table += `${teamLogo} | ${team.WINS} | ${team.LOSSES} | ${team.WinPCT} | ${team.ConferenceGamesBack}\n`;
  });
  return headUrl + header + table + footUrl;
}