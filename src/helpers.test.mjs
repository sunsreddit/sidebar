import { beforeEach, describe, jest, it, expect } from '@jest/globals';
import { GameDayInfo, MonthlyGames } from './helpers.mjs';

global.fetch = jest.fn();

describe('MonthlyGames', () => {
  beforeEach(() => {
    global.fetch.mockClear();
  });

  it('should return the filtered and mapped games for the current month and specific team', async () => {
    const mockTeamID = 123; // Replace with your test TeamID

    // Mock the fetch response
    const mockResponse = {
      leagueSchedule: {
        gameDates: [
          {
            monthNum: 12,
            games: [
              {
                monthNum: 12,
                homeTeam: { teamId: mockTeamID },
                awayTeam: { teamId: 456 },
              },
            ],
          },
        ],
      },
    };

    // Mock the fetch function to resolve with the mock response
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    // Call the MonthlyGames function
    const result = await MonthlyGames(mockTeamID);

    // Assertions
    const urlEndpoint =
      'https://cdn.nba.com/static/json/staticData/scheduleLeagueV2_1.json';
    expect(global.fetch).toHaveBeenCalledWith(urlEndpoint);
    expect(result).toHaveLength(1);
    // Add more assertions based on your specific test case
  });
});

describe('GameDayInfo', () => {
  jest.useFakeTimers().setSystemTime(new Date('2023-01-01T00:00:00Z'));
  it('should return the correct game day information', () => {
    // Mock data
    const mockGame = {
      homeTeam: { teamId: 1, score: 100 },
      awayTeam: { teamId: 2, score: 99 },
      gameStatus: 3, // Assuming the game is completed
      gameDateTimeUTC: '2023-01-01T00:00:00Z',
    };

    // Mock parameters
    const mockParameters = {
      nba: { TeamID: 1 },
      reddit: { schedule: { timezone: 'America/New_York' } },
    };
    // Mock parameters.json
    jest.mock('../config/parameters.json', () => ({
      default: mockParameters,
    }));

    // Call the GameDayInfo function
    const result = GameDayInfo(mockGame);

    // Assertions
    expect(result).toEqual({
      day_number: '31',
      month_number: '12',
      month_short: 'Dec',
      month_long: 'December',
      year_number: '2022',
      game_time_local: '05:00pm MST',
      game_score: '100-99',
      game_result: 'L',
    });
  });
});
