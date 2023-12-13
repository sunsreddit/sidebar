import { describe, jest, it, expect } from '@jest/globals';
import { TeamRosterTable } from './roster.mjs';

describe('TeamRosterTable', () => {
  it('should return a string with player and coach roster tables', async () => {
    jest.mock('nba-api-client', () => ({
      testRoster: jest.fn().mockResolvedValue({
        Coaches: {
          /* */
        },
        CommonTeamRoster: {
          /* */
        },
      }),
    }));
    const result = await TeamRosterTable();
    expect(result).toContain('###');
    expect(result).toContain('| PLAYER | POSITION');
    expect(result).toContain('COACH | POSITION');
  });
});
