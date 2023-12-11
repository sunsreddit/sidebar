import { describe, jest, it, expect } from '@jest/globals';
import { MonthlyScheduleGenerator } from './schedule.mjs';

// Mock MonthlyGames response
const sampleGamesData = {
  leagueSchedule: {
    gameDates: [
      {
        games: [
          {
            monthNum: 12,
            homeTeam: { teamId: 1, teamName: 'Team1', score: 123 },
            awayTeam: { teamId: 2, teamName: 'Team2', score: 456 },
            gameDateTimeUTC: '2024-12-01T00:00:00Z',
            gameStatus: 3,
          },
          {
            monthNum: 12,
            homeTeam: { teamId: 3, teamName: 'Team3', score: 456 },
            awayTeam: { teamId: 4, teamName: 'Team4', score: 123 },
            gameDateTimeUTC: '2024-12-01T00:00:00Z',
            gameStatus: 3,
          },
        ],
      },
    ],
  },
};

jest.mock('./helpers', () => ({
  ...jest.requireActual('./helpers'),
  MonthlyGames: jest.fn(() => sampleGamesData),
  GameDayInfo: jest.fn(() => ({
    month_number: '12',
    day_number: '01',
    game_time_local: '05:00 PM',
    game_score: '123-456',
    game_result: 'W',
  })),
}));

describe('MonthlyScheduleGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('generates the correct monthly schedule', async () => {
    // Mock the fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(sampleGamesData),
      })
    );

    // Create an instance of MonthlyScheduleGenerator
    const teamObject = {
      nba: { TeamID: 1 },
      reddit: { roster: { team_name: 'Team1' } },
    };
    const generator = new MonthlyScheduleGenerator(teamObject);

    // Call the generateMonthlySchedule method
    const result = await generator.generateMonthlySchedule();

    // Assertions
    console.log(result);
    expect(result).toContain('MONTHLY SCHEDULE');
    expect(result).toContain('05:00pm MST');
    expect(result).toContain('Home');
    // Add more assertions based on your specific test case
  });
});
