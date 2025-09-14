import { initAuth0 } from '@auth0/nextjs-auth0';

export default initAuth0({
  secret: process.env.AUTH0_SECRET,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  authorizationParams: {
    response_type: 'code',
    scope: 'openid profile email',
  },
  session: {
    rollingDuration: 24 * 60 * 60, // 24 hours
    absoluteDuration: 7 * 24 * 60 * 60, // 7 days
  },
});
