# Suggested Commands

## Development Commands

### Start Development Server
```bash
npm run dev
```
Starts Next.js development server with Turbopack on http://localhost:3000

### Build for Production
```bash
npm run build
```
Creates optimized production build

### Start Production Server
```bash
npm start
```
Runs production build locally (must run `npm run build` first)

### Linting
```bash
npm run lint
```
Runs ESLint with Next.js configuration

## Git Commands (macOS/Darwin)

### Check Status
```bash
git status
```

### Pull Latest Changes
```bash
git pull
```

### View Recent Commits
```bash
git log --oneline -10
```

### Create Branch
```bash
git checkout -b feature/branch-name
```

### Stage and Commit
```bash
git add .
git commit -m "commit message"
```

### Push Changes
```bash
git push origin branch-name
```

## File Operations (macOS/Darwin)

### List Files
```bash
ls -la
```

### Find Files by Name
```bash
find . -name "filename"
```

### Search Content
```bash
grep -r "search term" .
```

### View File
```bash
cat filename
```

## Environment Setup

### Install Dependencies
```bash
npm install
```

### Environment Variables
```bash
cp .env.local.example .env.local
```
Then edit `.env.local` with required API keys:
- `BEEHIIV_API_KEY`
- `CIRCLE_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## Deployment (Vercel)

### Deploy to Production
```bash
npx vercel --prod
```

### Deploy Preview
```bash
npx vercel
```

## Notes
- This project runs on macOS (Darwin) system
- Node.js 18+ required
- Use npm (not yarn or pnpm) for consistency
- Turbopack is automatically used in development (Next.js 16 default)
