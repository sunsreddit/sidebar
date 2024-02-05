import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { MonthlyScheduleGenerator } from './schedule.mjs';

// Mock MonthlyGames response
const sampleGamesData = {
  leagueSchedule: {
    gameDates: [
      {
        games: [
          {
            monthNum: 12,
            homeTeam: { teamId: 1, teamName: 'Team1', score: 99 },
            awayTeam: { teamId: 2, teamName: 'Team2', score: 100 },
            gameDateTimeUTC: '2024-12-01T00:00:00Z',
            gameStatus: 3,
          },
          {
            monthNum: 12,
            homeTeam: { teamId: 3, teamName: 'Team3', score: 100 },
            awayTeam: { teamId: 4, teamName: 'Team4', score: 99 },
            gameDateTimeUTC: '2024-12-02T00:00:00Z',
            gameStatus: 3,
          },
        ],
      },
    ],
  },
};

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(sampleGamesData),
  })
);

jest.mock('./helpers', () => ({
  MonthlyGames: jest.fn(() => sampleGamesData),
  GameDayInfo: jest.fn(() => ({
    month_number: '12',
    day_number: '01',
    game_time_local: '05:00 PM',
    game_score: '99-100',
    game_result: 'W',
  })),
}));

describe('MonthlyScheduleGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('generates the correct home schedule', async () => {
    // Create an instance of MonthlyScheduleGenerator
    const teamObject = { nba: { TeamID: 1 }, reddit: { subreddit: { short_name: 'Team1' } } };
    const generator = new MonthlyScheduleGenerator(teamObject);

    // Call the generateMonthlySchedule method
    const result = await generator.generateMonthlySchedule();

    // Assertions
    expect(result).toContain('###Team1 MONTHLY SCHEDULE');
    expect(result).toContain('🗓️ | 🕘  | 🏀 |  📊 | 🏆');
    expect(result).toMatch(':-: | :-: | :-: | :-: | :-:');
    // Add more assertions based on your specific test case
  });

  test('generates the correct away schedule', async () => {
    const teamObject = { nba: { TeamID: 2 }, reddit: { subreddit: { short_name: 'Team2' } } };
    const generator = new MonthlyScheduleGenerator(teamObject);

    // Call the generateMonthlySchedule method
    const result = await generator.generateMonthlySchedule();

    // Assertions
    expect(result).toContain('###Team2 MONTHLY SCHEDULE');
    expect(result).toContain('🗓️ | 🕘  | 🏀 |  📊 | 🏆');
    expect(result).toMatch(':-: | :-: | :-: | :-: | :-:');
  });




  describe('_formatGameRow', () => {
    test('should return the formatted game row for the home team', () => {
      const generator = new MonthlyScheduleGenerator({ nba: { TeamID: 1 }, reddit: { subreddit: { short_name: 'Team1' } } });
      const game = {
        homeTeam: { teamId: 1, teamSlug: 'team1', score: 100 },
        awayTeam: { teamId: 2, teamSlug: 'team2', score: 99 },
        gameDateTimeUTC: '2024-03-18T20:00:00Z',
        gameStatus: 3,
      };
      const expected = ' 🏠 03/18 | 01:00MST | [](#team2) | 100-99 | L\n';
      expect(generator._formatGameRow(game)).toEqual(expected);
    });

    test('should return the formatted game row for the away team', () => {
      const generator = new MonthlyScheduleGenerator({ nba: { TeamID: 2 }, reddit: { subreddit: { short_name: 'Team2' } } });
      const game = {
        homeTeam: { teamId: 1, teamSlug: 'team1', score: 100 },
        awayTeam: { teamId: 2, teamSlug: 'team2', score: 99 },
        gameDateTimeUTC: '2024-03-18T20:00:00Z',
        gameStatus: 3,
      };
      const expected = ' ✈️ 03/18 | 01:00MST | [](#team1) | 100-99 | L\n';
      expect(generator._formatGameRow(game)).toEqual(expected);
    });
  });






});