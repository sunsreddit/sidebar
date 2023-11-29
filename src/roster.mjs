import NBA from 'nba-api-client';
import { seasonYearRange } from './helpers/index.mjs';
import { default as parameters } from '../config/parameters.json' assert { type: 'json' };

async function playerRosterTable(players) {
  let table = `\n# | PLAYER | POSITION\n:- | :-: | -:\n`;
  Object.values(players).forEach((player) => {
    table += `${player.NUM} | ${player.PLAYER} | ${player.POSITION}\n`;
  });
  return table;
}

async function coachRosterTable(coaches) {
  let table = `\nCOACH | POSITION\n:- | -:\n`;
  Object.values(coaches).forEach((coach) => {
    table += `${coach.COACH_NAME} | ${coach.COACH_TYPE}\n`;
  });
  return table;
}

export async function TeamRosterTable() {
  const {
    reddit: { roster },
    nba: { TeamID },
  } = parameters;
  const Season = seasonYearRange;
  const { Coaches, CommonTeamRoster } = await NBA.teamRoster({
    TeamID,
    Season,
  });
  const label = `\n###${roster.team_name} ROSTER ${Season}\n`;
  const pTable = await playerRosterTable(CommonTeamRoster);
  const cTable = await coachRosterTable(Coaches);
  return label + pTable + cTable;
}
