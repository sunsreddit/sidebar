import { describe, test, expect } from '@jest/globals';
import { discordHeader } from './discordHeader.mjs';

describe('discordTable', () => {
  test('generates the correct subreddit header', () => {
    const team = 'Team1', url = 'https://discord.gg/jest';
    const expected = `## ${team} *subreddit* ➠\n###[Join the conversation in](${url})\n\n`;
    const result = discordHeader(team, url);
    expect(result).toEqual(expected);
  });
});