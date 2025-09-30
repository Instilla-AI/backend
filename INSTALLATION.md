# SaaS Starter Template - Installation Guide

## ✅ Template Already Created

Il template è stato creato con successo nella directory `saas-starter-template/`.

## 📦 Cosa Contiene

- ✅ Next.js 15 + TypeScript
- ✅ Better Auth (autenticazione)
- ✅ PostgreSQL + Drizzle ORM
- ✅ Sistema crediti integrato
- ✅ UI components (Tailwind + shadcn/ui)
- ✅ Pagine auth (signin/signup)
- ✅ Dashboard protetta
- ✅ Navbar con crediti utente

## 🚀 Setup Rapido

### 1. Installa Dipendenze

```bash
cd saas-starter-template
npm install
```

### 2. Configura Database

Avvia PostgreSQL con Docker:

```bash
docker run -d \
  --name saas-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=saasdb \
  -p 5432:5432 \
  postgres:15
```

### 3. Configura Environment

Copia `.env.example` in `.env.local`:

```bash
copy .env.example .env.local
```

Genera un secret per Better Auth:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Modifica `.env.local` con il secret generato:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/saasdb
BETTER_AUTH_SECRET=<il-tuo-secret-generato>
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Setup Database Schema

```bash
npm run db:push
```

### 5. Avvia il Server

```bash
npm run dev
```

Apri http://localhost:3000

## 📁 Struttura Progetto

```
saas-starter-template/
├── app/
│   ├── api/
│   │   ├── auth/[...better-auth]/    # Endpoints autenticazione
│   │   └── credits/                   # API crediti
│   ├── auth/
│   │   ├── signin/                    # Pagina login
│   │   └── signup/                    # Pagina registrazione
│   ├── dashboard/                     # Dashboard protetta
│   ├── plans/                         # Pagina piani/pricing
│   ├── layout.tsx                     # Layout principale
│   ├── page.tsx                       # Homepage
│   └── globals.css                    # Stili globali
├── components/
│   ├── navbar.tsx                     # Navbar con crediti
│   ├── footer.tsx                     # Footer
│   ├── providers.tsx                  # React Query provider
│   ├── user-credits.tsx               # Componente crediti
│   └── ui/                            # Componenti UI (shadcn)
├── lib/
│   ├── auth.ts                        # Configurazione Better Auth
│   ├── auth-client.ts                 # Hook client-side auth
│   ├── db/
│   │   ├── index.ts                   # Connessione database
│   │   └── schema.ts                  # Schema Drizzle
│   ├── utils.ts                       # Utility functions
│   ├── api-errors.ts                  # Error handling API
│   └── client-errors.ts               # Error handling client
├── hooks/
│   └── useCredits.ts                  # Hook per gestire crediti
├── config/
│   └── constants.ts                   # Costanti applicazione
└── package.json
```

## 🎯 Come Usare

### Aggiungere una Nuova Feature

1. **Crea l'API Route:**

```typescript
// app/api/my-feature/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { userCredits } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Controlla crediti
  const userCredit = await db.query.userCredits.findFirst({
    where: eq(userCredits.userId, session.user.id)
  });

  const FEATURE_COST = 5;
  if (!userCredit || userCredit.credits < FEATURE_COST) {
    return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 });
  }

  // Scala crediti
  await db.update(userCredits)
    .set({
      credits: userCredit.credits - FEATURE_COST,
      totalUsed: userCredit.totalUsed + FEATURE_COST,
      updatedAt: new Date()
    })
    .where(eq(userCredits.userId, session.user.id));

  // La tua logica qui
  
  return NextResponse.json({ success: true });
}
```

2. **Crea la Pagina:**

```typescript
// app/my-feature/page.tsx
'use client';

import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function MyFeaturePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  if (isPending) return <div>Loading...</div>;
  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold">My Feature</h1>
      {/* Il tuo contenuto */}
    </div>
  );
}
```

### Modificare i Crediti Iniziali

Modifica `lib/auth.ts`:

```typescript
const INITIAL_CREDITS = 100; // Cambia questo valore
```

### Aggiungere Nuove Tabelle

1. Modifica `lib/db/schema.ts`
2. Esegui `npm run db:generate`
3. Esegui `npm run db:push`

## 🔒 Sicurezza

- ✅ Non committare mai `.env.local`
- ✅ Usa un `BETTER_AUTH_SECRET` forte
- ✅ Abilita HTTPS in produzione
- ✅ Valida tutti gli input utente
- ✅ Implementa rate limiting per le API

## 🚀 Deploy

### Vercel

1. Push su GitHub
2. Importa progetto in Vercel
3. Aggiungi variabili d'ambiente
4. Deploy

### Database Produzione

Usa un servizio managed:
- Vercel Postgres
- Supabase
- Neon
- Railway

Aggiorna `DATABASE_URL` nelle variabili d'ambiente di produzione.

## 📚 Risorse

- [Better Auth Docs](https://www.better-auth.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

## 🎉 Pronto all'Uso!

Il template è completo e pronto per essere utilizzato come base per qualsiasi progetto SaaS.

Ogni volta che vuoi creare un nuovo progetto:
1. Copia questa cartella
2. Rinomina il progetto in `package.json`
3. Segui i passi di setup
4. Inizia a sviluppare!

**Buon coding! 🚀**
