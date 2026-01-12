# GitHub Actions Secrets Setup

For the CI/CD pipeline to work, you need to configure the following secrets in your GitHub repository:

## Required Secrets

1. **FIREBASE_SERVICE_ACCOUNT**
   - Go to Firebase Console → Project Settings → Service Accounts
   - Generate new private key
   - Copy the entire JSON content
   - Add as GitHub secret

2. **FIREBASE_PROJECT_ID**
   - Your Firebase project ID (e.g., `your-project-id`)
   - Found in Firebase Console → Project Settings

## How to Add Secrets

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each secret with the exact names listed above

## Alternative: Using Firebase CLI

You can also use the Firebase CLI to set up GitHub Actions:

```bash
firebase init hosting:github
```

This will automatically configure the necessary secrets in your repository.
