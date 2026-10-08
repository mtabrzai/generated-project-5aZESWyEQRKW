# Deployment Guide

## 🚀 Deployment Overview

This project is optimized for deployment on Vercel, but can be deployed to any static hosting service or Node.js server.

### Supported Deployment Targets
- **Vercel** (Recommended)
- **Netlify**
- **AWS Amplify**
- **Firebase Hosting**
- **Static file hosting** (GitHub Pages, S3, etc.)
- **Node.js server** (Express, Fastify, etc.)

## 🔧 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
VITE_API_BASE_URL=https://your-api-endpoint.com/api
VITE_APP_ENV=production
```

### Required Variables
| Variable | Description | Example Value |
|----------|-------------|---------------|
| `VITE_API_BASE_URL` | Base URL for your backend API | `https://api.example.com/api` |
| `VITE_APP_ENV` | Application environment | `production`, `development`, `staging` |

### Optional Variables
| Variable | Description | Default Value |
|----------|-------------|---------------|
| `VITE_SENTRY_DSN` | Sentry DSN for error tracking | - |
| `VITE_GOOGLE_ANALYTICS_ID` | Google Analytics tracking ID | - |

## 🌐 Vercel Deployment

### Quick Start
1. Install Vercel CLI (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. Link your project:
   ```bash
   vercel
   ```

3. Deploy:
   ```bash
   vercel --prod
   ```

### Configuration
The project includes a `vercel.json` configuration file:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ]
}
```

### Environment Variables in Vercel
1. Go to your project dashboard on Vercel
2. Navigate to **Settings** > **Environment Variables**
3. Add all required environment variables
4. Redeploy your application

### Custom Domains
1. Go to your project dashboard
2. Navigate to **Settings** > **Domains**
3. Add your custom domain
4. Follow the DNS configuration instructions

## 📦 Build Process

### Production Build
```bash
npm run build
```

This command:
1. Runs TypeScript compilation (if applicable)
2. Processes Tailwind CSS
3. Bundles the application with Vite
4. Outputs optimized files to the `dist` directory

### Preview Build
```bash
npm run preview
```

Starts a local server to preview the production build.

## 🔄 CI/CD Setup

### GitHub Actions
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build project
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
          VITE_APP_ENV: production

      - name: Deploy to Vercel
        run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
          VITE_APP_ENV: production
```

### Required GitHub Secrets
- `VERCEL_TOKEN` - Vercel authentication token
- `VITE_API_BASE_URL` - Your API base URL

## 🛠 Post-Deployment Checks

After deployment, verify the following:

1. **Authentication Flow**
   - Register a new user
   - Login with existing credentials
   - Verify protected routes are inaccessible without authentication

2. **Admin Functionality**
   - Login with admin credentials
   - Verify admin dashboard is accessible
   - Test user management features

3. **Content Management**
   - Create a new post
   - Edit an existing post
   - Delete a post
   - Verify post listing and filtering

4. **Error Handling**
   - Test 404 page by visiting a non-existent route
   - Verify error messages are displayed properly

5. **Performance**
   - Check Lighthouse scores in Chrome DevTools
   - Verify images are optimized
   - Check that the application loads quickly

## 🔄 Rollback Procedure

### Vercel Rollback
1. Go to your project dashboard
2. Navigate to **Deployments**
3. Select the deployment you want to roll back to
4. Click **Redeploy**

### Manual Rollback
1. Checkout the previous Git tag/commit:
   ```bash
   git checkout v1.0.0
   ```

2. Rebuild and redeploy:
   ```bash
   npm run build
   vercel --prod
   ```

## 📊 Monitoring

### Vercel Analytics
Enable Vercel Analytics in your project settings for:
- Performance metrics
- Real-time user monitoring
- Error tracking

### Sentry Integration (Optional)
1. Install Sentry SDK:
   ```bash
   npm install @sentry/react @sentry/vite
   ```

2. Initialize Sentry in `src/main.jsx`:
   ```javascript
   import * as Sentry from '@sentry/react';
   import { BrowserTracing } from '@sentry/tracing';

   Sentry.init({
     dsn: import.meta.env.VITE_SENTRY_DSN,
     integrations: [new BrowserTracing()],
     tracesSampleRate: 1.0,
   });
   ```

## 🔒 Security Considerations

1. **Environment Variables**
   - Never commit `.env.local` to version control
   - Use Vercel's environment variable management for production

2. **Authentication**
   - Ensure JWT tokens are stored securely in localStorage
   - Implement proper token expiration handling
   - Use HTTPS for all production deployments

3. **Admin Access**
   - Change default admin credentials after first deployment
   - Implement IP restrictions if possible
   - Consider adding 2FA for admin accounts

4. **Content Security**
   - Sanitize user-generated content
   - Implement rate limiting on API endpoints
   - Use proper CORS configuration

## 📈 Scaling

### Vercel Scaling
Vercel automatically scales your application based on traffic. For high-traffic applications:
- Consider Vercel Pro or Enterprise plans
- Implement edge functions for critical paths
- Use Vercel's caching features

### Database Scaling
- Consider using a managed database service (PlanetScale, Supabase, etc.)
- Implement connection pooling
- Add read replicas for read-heavy workloads

## 🧪 Testing in Production

### Feature Flags
Implement feature flags for gradual rollouts:

1. Install a feature flag library:
   ```bash
   npm install @unleash/proxy-client-react
   ```

2. Wrap features in flag checks:
   ```javascript
   import { useFlag } from '@unleash/proxy-client-react';

   const MyComponent = () => {
     const newFeatureEnabled = useFlag('new-feature');

     return (
       <div>
         {newFeatureEnabled && <NewFeature />}
         {!newFeatureEnabled && <OldFeature />}
       </div>
     );
   };
   ```

### A/B Testing
Use Vercel's experimentation features or integrate with:
- Google Optimize
- Optimizely
- LaunchDarkly

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Deployment Guide](https://react.dev/learn/deployment)
- [Tailwind CSS Production Guide](https://tailwindcss.com/docs/production)