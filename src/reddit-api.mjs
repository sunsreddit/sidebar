import Snoowrap from 'snoowrap';
import 'dotenv/config';

const reddit = new Snoowrap({
  userAgent: process.env.USER_AGENT,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.REFRESH_TOKEN
});

export default reddit;