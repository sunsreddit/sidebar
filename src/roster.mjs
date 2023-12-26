import NBA from 'nba-api-client';
import { seasonYearRange } from './helpers.mjs';
import { default as parameters } from '../config/parameters.json' assert { type: 'json' };

/**
 * Returns a table string of all the provided current NBA players.
 * @param {object} players - Players data object
 * @returns {string}
 * @private
 */
async function playerRosterTable(players) {
  let table = `\n# | PLAYER | POSITION\n:- | :-: | -:\n`;
  Object.values(players).forEach((player) => {
    table += `${player.NUM} | ${player.PLAYER} | ${player.POSITION}\n`;
  });
  return table;
}

/**
 * Returns a table string of all the provided current NBA coaches.
 * @param {*} coaches - Coaches data object
 * @returns {string}
 * @private
 */
async function coachRosterTable(coaches) {
  let table = `\nCOACH | POSITION\n:- | -:\n`;
  Object.values(coaches).forEach((coach) => {
    table += `${coach.COACH_NAME} | ${coach.COACH_TYPE}\n`;
  });
  return table;
}

/**
 * Compiles players & coaches table into a cohesive roster table for the sidebar.
 * @returns {string}
 * @public
 */
export async function TeamRosterTable() {
  const {
    reddit: { subreddit },
    nba: { TeamID },
  } = parameters;
  const Season = seasonYearRange;
  const { Coaches, CommonTeamRoster } = await NBA.teamRoster({
    TeamID,
    Season,
  });
  const label = `\n###${subreddit.short_name} ROSTER ${Season}\n`;
  const pTable = await playerRosterTable(CommonTeamRoster);
  const cTable = await coachRosterTable(Coaches);
  return label + pTable + cTable;
}
