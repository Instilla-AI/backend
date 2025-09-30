# 🚂 Deploy su Railway - Guida Completa

## Prerequisiti

- Account GitHub
- Account Railway (https://railway.app)
- Repository GitHub con questo template

## Passo 1: Prepara il Repository GitHub

### 1.1 Crea un nuovo repository su GitHub

```bash
# Nella cartella saas-starter-template
git init
git add .
git commit -m "Initial commit - SaaS Starter Template"
git branch -M main
git remote add origin https://github.com/TUO-USERNAME/tuo-saas.git
git push -u origin main
```

### 1.2 File essenziali (già inclusi)

✅ `.gitignore` - Esclude file sensibili
✅ `package.json` - Dipendenze e scripts
✅ `drizzle.config.ts` - Configurazione database
✅ Setup Wizard - Configurazione guidata

## Passo 2: Deploy su Railway

### 2.1 Crea un Nuovo Progetto

1. Vai su https://railway.app
2. Clicca "New Project"
3. Seleziona "Deploy from GitHub repo"
4. Autorizza Railway ad accedere ai tuoi repository
5. Seleziona il repository del tuo SaaS

### 2.2 Aggiungi PostgreSQL

1. Nel tuo progetto Railway, clicca "+ New"
2. Seleziona "Database" → "PostgreSQL"
3. Railway creerà automaticamente il database
4. Copia la variabile `DATABASE_URL` (la useremo nel wizard)

### 2.3 Configura le Variabili d'Ambiente

Railway rileverà automaticamente che è un'app Next.js.

**Variabili da aggiungere manualmente:**

```env
NODE_ENV=production
```

**Le altre variabili verranno configurate dal Setup Wizard!**

### 2.4 Deploy Automatico

Railway farà il deploy automaticamente:
- ✅ Installa le dipendenze
- ✅ Build dell'applicazione Next.js
- ✅ Avvia il server

## Passo 3: Setup Wizard (Prima Configurazione)

### 3.1 Accedi al Wizard

Una volta completato il deploy, Railway ti fornirà un URL pubblico (es: `https://tuo-saas.up.railway.app`).

1. Apri l'URL nel browser
2. Verrai automaticamente reindirizzato a `/setup`
3. Segui il wizard passo-passo

### 3.2 Wizard Steps

#### Step 1: Welcome
- Panoramica del processo di setup

#### Step 2: Database
- Incolla il `DATABASE_URL` copiato da Railway PostgreSQL
- Il wizard testerà automaticamente la connessione
- Formato: `postgresql://user:password@host:port/database`

#### Step 3: Authentication
- Clicca "Generate" per creare un secret sicuro
- Questo verrà usato per firmare i JWT tokens

#### Step 4: Branding
- **App Name**: Nome della tua SaaS (es: "My Awesome SaaS")
- **Primary Color**: Scegli il colore principale (es: #ea580c)
- **Logo URL**: (Opzionale) URL del tuo logo

#### Step 5: Complete
- Il wizard:
  - ✅ Salva la configurazione in `.env.local`
  - ✅ Inizializza lo schema del database
  - ✅ Crea le tabelle necessarie
  - ✅ Marca il setup come completato

### 3.3 Crea il Primo Account

Dopo il wizard, verrai reindirizzato a `/auth/signup`:
1. Registra il primo account admin
2. Riceverai automaticamente 100 crediti gratuiti
3. Accedi alla dashboard

## Passo 4: Configurazione Post-Deploy

### 4.1 Variabili d'Ambiente Railway

Dopo il wizard, aggiungi queste variabili in Railway (Settings → Variables):

```env
DATABASE_URL=<copiato-da-railway-postgres>
BETTER_AUTH_SECRET=<generato-dal-wizard>
BETTER_AUTH_URL=https://tuo-saas.up.railway.app
NEXT_PUBLIC_APP_URL=https://tuo-saas.up.railway.app
```

**Importante:** Sostituisci `tuo-saas.up.railway.app` con il tuo dominio Railway.

### 4.2 Redeploy

Dopo aver aggiunto le variabili:
1. Railway farà automaticamente un redeploy
2. L'app sarà completamente configurata

### 4.3 Dominio Personalizzato (Opzionale)

1. In Railway, vai su Settings → Domains
2. Clicca "Custom Domain"
3. Aggiungi il tuo dominio (es: `app.tuosito.com`)
4. Configura i DNS secondo le istruzioni di Railway
5. Aggiorna `BETTER_AUTH_URL` e `NEXT_PUBLIC_APP_URL` con il nuovo dominio

## Passo 5: Verifica Funzionamento

### 5.1 Checklist

- ✅ L'app è accessibile all'URL Railway
- ✅ Il setup wizard è completato
- ✅ Puoi registrare nuovi utenti
- ✅ Il login funziona
- ✅ I crediti vengono assegnati (100 iniziali)
- ✅ La dashboard è accessibile

### 5.2 Test Database

```bash
# Connettiti al database Railway (opzionale)
psql <DATABASE_URL>

# Verifica tabelle create
\dt

# Dovresti vedere:
# - user
# - session
# - account
# - verification
# - user_credits
```

## Troubleshooting

### Problema: Setup Wizard non appare

**Soluzione:**
- Vai manualmente a `https://tuo-app.up.railway.app/setup`
- Controlla i logs in Railway per errori

### Problema: Database connection failed

**Soluzione:**
- Verifica che il `DATABASE_URL` sia corretto
- Assicurati che il database PostgreSQL sia attivo in Railway
- Controlla che non ci siano firewall che bloccano la connessione

### Problema: Build fails

**Soluzione:**
- Controlla i logs di build in Railway
- Verifica che `package.json` sia corretto
- Assicurati che tutte le dipendenze siano installate

### Problema: App crashes dopo deploy

**Soluzione:**
- Controlla i runtime logs in Railway
- Verifica che tutte le variabili d'ambiente siano configurate
- Assicurati che il database sia inizializzato

## Aggiornamenti Futuri

### Deploy Automatico

Railway è configurato per il deploy automatico:
1. Fai modifiche al codice localmente
2. Commit e push su GitHub
3. Railway rileva il push e fa automaticamente il deploy

### Rollback

Se qualcosa va storto:
1. Vai su Railway → Deployments
2. Seleziona un deployment precedente
3. Clicca "Redeploy"

## Costi Railway

- **Hobby Plan**: $5/mese + usage
- **PostgreSQL**: ~$5/mese
- **Totale stimato**: ~$10-15/mese per iniziare

## Prossimi Passi

1. ✅ Personalizza l'app con le tue features
2. ✅ Aggiungi nuove pagine e funzionalità
3. ✅ Configura email (per password reset, etc.)
4. ✅ Aggiungi payment provider (Stripe, etc.)
5. ✅ Implementa analytics

## Risorse

- [Railway Docs](https://docs.railway.app/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [PostgreSQL on Railway](https://docs.railway.app/databases/postgresql)

---

🎉 **Congratulazioni! Il tuo SaaS è live!**
