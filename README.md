# 🚀 SaaS Starter Template

Minimal Next.js 15 SaaS starter with authentication, credits system, and **Setup Wizard** - Ready for Railway deployment!

## ✨ New: Setup Wizard

WordPress-style configuration wizard that guides you through:
- 🗄️ Database connection (Railway PostgreSQL)
- 🔐 Authentication setup
- 🎨 Branding customization (logo, colors, app name)
- ✅ Automatic database initialization

**No manual configuration needed!**

## Features

✅ **Authentication System**
- Better Auth integration
- Email/Password authentication
- Session management
- Protected routes

✅ **Credits System**
- Database-backed credits
- Automatic credit allocation on signup (100 free credits)
- Credit consumption tracking
- Real-time credit display

✅ **Database**
- PostgreSQL with Drizzle ORM
- Pre-configured schema for users, sessions, and credits
- Docker setup included

✅ **UI Components**
- Tailwind CSS + shadcn/ui
- Responsive navbar with user menu
- Credit display component
- Authentication pages (signin/signup)

## Quick Start

### 1. Prerequisites

- Node.js 18+
- Docker (for PostgreSQL)

### 2. Installation

```bash
# Clone or copy this template
cd saas-starter-template

# Install dependencies
npm install

# Start PostgreSQL with Docker
docker run -d \
  --name saas-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=saasdb \
  -p 5432:5432 \
  postgres:15

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your values
```

### 3. Configure Environment

Edit `.env.local`:

```bash
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/saasdb

# Better Auth
BETTER_AUTH_SECRET=your-32-byte-secret-here
BETTER_AUTH_URL=http://localhost:3000

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Generate a secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Setup Database

```bash
# Push schema to database
npm run db:push

# (Optional) Open Drizzle Studio to view data
npm run db:studio
```

### 5. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Project Structure

```
saas-starter-template/
├── app/
│   ├── api/
│   │   ├── auth/[...better-auth]/route.ts  # Auth endpoints
│   │   └── credits/route.ts                 # Credits API
│   ├── auth/
│   │   ├── signin/page.tsx                  # Sign in page
│   │   └── signup/page.tsx                  # Sign up page
│   ├── dashboard/page.tsx                   # Protected dashboard
│   ├── plans/page.tsx                       # Pricing plans
│   └── layout.tsx                           # Root layout
├── components/
│   ├── navbar.tsx                           # Navigation with credits
│   ├── providers.tsx                        # React Query provider
│   └── ui/                                  # shadcn/ui components
├── lib/
│   ├── auth.ts                              # Better Auth config
│   ├── auth-client.ts                       # Client-side auth hooks
│   ├── db/
│   │   ├── index.ts                         # Database connection
│   │   └── schema.ts                        # Database schema
│   └── utils.ts                             # Utility functions
├── hooks/
│   └── useCredits.ts                        # Credits hook
└── config/
    └── constants.ts                         # App constants
```

## Usage

### Adding a New Feature

1. **Create API Route** (if needed)
```typescript
// app/api/my-feature/route.ts
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { userCredits } from '@/lib/db/schema';

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Your feature logic here
  // Deduct credits if needed
  
  return Response.json({ success: true });
}
```

2. **Create Page**
```typescript
// app/my-feature/page.tsx
'use client';

import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function MyFeaturePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  if (isPending) return <div>Loading...</div>;
  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  return <div>My Feature</div>;
}
```

### Credit System

**Deduct Credits:**
```typescript
import { db } from '@/lib/db';
import { userCredits } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const FEATURE_COST = 5; // credits

await db
  .update(userCredits)
  .set({
    credits: userCredit.credits - FEATURE_COST,
    totalUsed: userCredit.totalUsed + FEATURE_COST,
    updatedAt: new Date(),
  })
  .where(eq(userCredits.userId, userId));
```

**Check Credits:**
```typescript
const userCredit = await db.query.userCredits.findFirst({
  where: eq(userCredits.userId, userId),
});

if (!userCredit || userCredit.credits < FEATURE_COST) {
  throw new Error('Insufficient credits');
}
```

## Customization

### Change Initial Credits

Edit `lib/auth.ts`:
```typescript
const INITIAL_CREDITS = 100; // Change this value
```

### Add New Database Tables

1. Edit `lib/db/schema.ts`
2. Run `npm run db:generate`
3. Run `npm run db:push`

### Styling

- Edit `tailwind.config.ts` for theme customization
- Modify `app/globals.css` for global styles
- Update `components/ui/*` for component styles

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Database

Use a managed PostgreSQL service:
- Vercel Postgres
- Supabase
- Neon
- Railway

Update `DATABASE_URL` in production environment.

## Security Notes

- ✅ Never commit `.env.local`
- ✅ Use strong `BETTER_AUTH_SECRET`
- ✅ Enable HTTPS in production
- ✅ Validate all user inputs
- ✅ Rate limit API endpoints

## License

MIT - Feel free to use for your projects

## Support

For issues or questions, refer to:
- [Better Auth Docs](https://www.better-auth.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
