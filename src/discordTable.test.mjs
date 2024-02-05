import { describe, test, expect } from '@jest/globals';
import { discordTable } from './discordTable.mjs';

describe('discordTable', () => {
  test('generates the correct subreddit header', () => {
    const team = 'Team1', url = 'https://discord.gg/jest';
    const expected = `>## ${team} *subreddit* ➠\n>###[Join the conversation in](${url})\n`;
    const result = discordTable(team, url);
    expect(result).toEqual(expected);
  });
});