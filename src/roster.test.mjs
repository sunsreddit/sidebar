import { describe, expect, jest, test } from '@jest/globals';
import NBA from '@sunsreddit/nba-stats';
import { TeamRosterTable, playerRosterTable, coachRosterTable } from './roster.mjs';
import parameters from '../config/parameters.json';

// Mocking dependencies
jest.mock('@sunsreddit/nba-stats');
jest.mock('./helpers.mjs', () => ({
  seasonYearRange: '2023-24',
}));

// Mock players and coaches data
const mockPlayers = {
  1: { NUM: 1, PLAYER: 'Player 1', POSITION: 'PG' },
  2: { NUM: 2, PLAYER: 'Player 2', POSITION: 'SG' },
};
const mockCoaches = {
  1: { COACH_NAME: 'Coach 1', COACH_TYPE: 'Head Coach' },
  2: { COACH_NAME: 'Coach 2', COACH_TYPE: 'Assistant Coach' },
};

describe('playerRosterTable', () => {
  test('should return a table string of players', async () => {
    const expectedTable = '\n\\# | PLAYER | POSITION\n:-: | :-: | :-:\n1 | Player 1 | PG\n2 | Player 2 | SG\n';
    const result = await playerRosterTable(mockPlayers);
    expect(result).toEqual(expectedTable);
  });
});

describe('coachRosterTable', () => {
  test('should return a table string of coaches', async () => {
    const expectedTable = '\nCOACH | POSITION\n:-: | :-:\nCoach 1 | Head Coach\nCoach 2 | Assistant Coach\n';
    const result = await coachRosterTable(mockCoaches);
    expect(result).toEqual(expectedTable);
  });
});

describe('TeamRosterTable', () => {
  test('should return a cohesive roster table for the sidebar', async () => {
    // Mocking the NBA.teamRoster method to return mock players and coaches
    NBA.teamRoster = jest.fn().mockResolvedValue({ Coaches: mockCoaches, CommonTeamRoster: mockPlayers });
    const expectedTable = `
###PHX SUNS ROSTER 2023-24

\\# | PLAYER | POSITION
:-: | :-: | :-:
1 | Player 1 | PG
2 | Player 2 | SG

COACH | POSITION
:-: | :-:
Coach 1 | Head Coach
Coach 2 | Assistant Coach
`;
    const result = await TeamRosterTable();
    expect(result).toEqual(expectedTable);
    // Ensure that NBA.teamRoster is called with the correct arguments
    expect(NBA.teamRoster).toHaveBeenCalledWith({ TeamID: parameters.nba.TeamID, Season: '2023-24' });
  });
});