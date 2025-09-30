# Setup Instructions

## Files to Copy from Original Project

Copy these essential files from your `firegeo` project:

### Configuration Files
```
firegeo/tailwind.config.js → saas-starter-template/
firegeo/postcss.config.js → saas-starter-template/
firegeo/drizzle.config.ts → saas-starter-template/
```

### Core Library Files
```
firegeo/lib/auth.ts → saas-starter-template/lib/
firegeo/lib/auth-client.ts → saas-starter-template/lib/
firegeo/lib/db/index.ts → saas-starter-template/lib/db/
firegeo/lib/db/schema.ts → saas-starter-template/lib/db/
firegeo/lib/utils.ts → saas-starter-template/lib/
firegeo/lib/api-errors.ts → saas-starter-template/lib/
firegeo/lib/client-errors.ts → saas-starter-template/lib/
```

### Hooks
```
firegeo/hooks/useCredits.ts → saas-starter-template/hooks/
```

### Config
```
firegeo/config/constants.ts → saas-starter-template/config/
```

### API Routes
```
firegeo/app/api/auth/[...better-auth]/route.ts → saas-starter-template/app/api/auth/[...better-auth]/
firegeo/app/api/credits/route.ts → saas-starter-template/app/api/credits/
```

### Auth Pages
```
firegeo/app/auth/signin/page.tsx → saas-starter-template/app/auth/signin/
firegeo/app/auth/signup/page.tsx → saas-starter-template/app/auth/signup/
```

### Core Pages
```
firegeo/app/page.tsx → saas-starter-template/app/
firegeo/app/layout.tsx → saas-starter-template/app/
firegeo/app/globals.css → saas-starter-template/app/
firegeo/app/dashboard/page.tsx → saas-starter-template/app/dashboard/
firegeo/app/plans/page.tsx → saas-starter-template/app/plans/
```

### Components
```
firegeo/components/navbar.tsx → saas-starter-template/components/
firegeo/components/footer.tsx → saas-starter-template/components/
firegeo/components/providers.tsx → saas-starter-template/components/
firegeo/components/user-credits.tsx → saas-starter-template/components/
firegeo/components/ui/* → saas-starter-template/components/ui/
```

## Quick Copy Script (PowerShell)

Run this in PowerShell from the `Seo New Tool` directory:

```powershell
$source = "firegeo"
$dest = "saas-starter-template"

# Create directories
New-Item -ItemType Directory -Force -Path "$dest/lib/db"
New-Item -ItemType Directory -Force -Path "$dest/hooks"
New-Item -ItemType Directory -Force -Path "$dest/config"
New-Item -ItemType Directory -Force -Path "$dest/app/api/auth/[...better-auth]"
New-Item -ItemType Directory -Force -Path "$dest/app/api/credits"
New-Item -ItemType Directory -Force -Path "$dest/app/auth/signin"
New-Item -ItemType Directory -Force -Path "$dest/app/auth/signup"
New-Item -ItemType Directory -Force -Path "$dest/app/dashboard"
New-Item -ItemType Directory -Force -Path "$dest/app/plans"
New-Item -ItemType Directory -Force -Path "$dest/components/ui"

# Copy files
Copy-Item "$source/tailwind.config.js" "$dest/" -ErrorAction SilentlyContinue
Copy-Item "$source/postcss.config.js" "$dest/" -ErrorAction SilentlyContinue
Copy-Item "$source/drizzle.config.ts" "$dest/"

Copy-Item "$source/lib/auth.ts" "$dest/lib/"
Copy-Item "$source/lib/auth-client.ts" "$dest/lib/"
Copy-Item "$source/lib/db/index.ts" "$dest/lib/db/"
Copy-Item "$source/lib/db/schema.ts" "$dest/lib/db/"
Copy-Item "$source/lib/utils.ts" "$dest/lib/"
Copy-Item "$source/lib/api-errors.ts" "$dest/lib/"
Copy-Item "$source/lib/client-errors.ts" "$dest/lib/"

Copy-Item "$source/hooks/useCredits.ts" "$dest/hooks/"
Copy-Item "$source/config/constants.ts" "$dest/config/"

Copy-Item "$source/app/api/auth/[...better-auth]/route.ts" "$dest/app/api/auth/[...better-auth]/"
Copy-Item "$source/app/api/credits/route.ts" "$dest/app/api/credits/"

Copy-Item "$source/app/auth/signin/page.tsx" "$dest/app/auth/signin/"
Copy-Item "$source/app/auth/signup/page.tsx" "$dest/app/auth/signup/"

Copy-Item "$source/app/page.tsx" "$dest/app/"
Copy-Item "$source/app/layout.tsx" "$dest/app/"
Copy-Item "$source/app/globals.css" "$dest/app/"
Copy-Item "$source/app/dashboard/page.tsx" "$dest/app/dashboard/"
Copy-Item "$source/app/plans/page.tsx" "$dest/app/plans/"

Copy-Item "$source/components/navbar.tsx" "$dest/components/"
Copy-Item "$source/components/footer.tsx" "$dest/components/"
Copy-Item "$source/components/providers.tsx" "$dest/components/"
Copy-Item "$source/components/user-credits.tsx" "$dest/components/"
Copy-Item "$source/components/ui/*" "$dest/components/ui/" -Recurse

Write-Host "✅ Files copied successfully!"
```

## After Copying

1. Create `.env.example`:
```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/saasdb
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

2. Install dependencies:
```bash
npm install
```

3. Setup database:
```bash
docker run -d --name saas-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=saasdb -p 5432:5432 postgres:15
npm run db:push
```

4. Run:
```bash
npm run dev
```
