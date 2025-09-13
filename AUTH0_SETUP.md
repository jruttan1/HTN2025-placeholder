# Auth0 Setup Instructions

## Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Auth0 Configuration
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_SECRET=your-long-random-secret
AUTH0_BASE_URL=http://localhost:3000
```

## How to Get Auth0 Values

1. **Sign up/Login to Auth0**: Go to [auth0.com](https://auth0.com) and create an account
2. **Create a new Application**:
   - Go to Applications > Create Application
   - Choose "Regular Web Applications"
   - Select Next.js as the technology
3. **Configure Application Settings**:
   - **Allowed Callback URLs**: `http://localhost:3000/api/auth/callback` (for dev), `https://yourdomain.com/api/auth/callback` (for prod)
   - **Allowed Logout URLs**: `http://localhost:3000` (for dev), `https://yourdomain.com` (for prod)
   - **Allowed Web Origins**: `http://localhost:3000` (for dev), `https://yourdomain.com` (for prod)
4. **Get your values**:
   - **AUTH0_DOMAIN**: Found in Application Settings (Domain field)
   - **AUTH0_CLIENT_ID**: Found in Application Settings (Client ID field)
   - **AUTH0_CLIENT_SECRET**: Found in Application Settings (Client Secret field)
   - **AUTH0_SECRET**: Generate with `openssl rand -hex 32` or use any long random string
   - **AUTH0_BASE_URL**: Your application URL (localhost for dev, your domain for production)

## Security Best Practices

- Never commit `.env.local` to version control
- Use different Auth0 applications for different environments (dev, staging, prod)
- Rotate your AUTH0_SECRET regularly in production
- Use HTTPS in production (required by Auth0)
- Set up proper CORS and allowed origins in Auth0 dashboard

## Production Deployment

For production, set these environment variables in your hosting platform:
- Vercel: Project Settings > Environment Variables
- Netlify: Site Settings > Environment Variables  
- Heroku: Settings > Config Vars
- AWS/Azure/GCP: Set in your deployment configuration

Make sure to update AUTH0_BASE_URL to your production domain and configure the corresponding URLs in Auth0 dashboard.
