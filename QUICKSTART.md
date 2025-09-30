# ⚡ Quick Start - Deploy in 5 Minutes

## 🎯 Goal
Get your SaaS live on Railway with a Setup Wizard in under 5 minutes.

## 📋 Prerequisites
- GitHub account
- Railway account (free tier available)

## 🚀 Steps

### 1. Push to GitHub (2 minutes)

```bash
cd saas-starter-template
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/your-saas.git
git push -u origin main
```

### 2. Deploy on Railway (1 minute)

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Click "+ New" → "Database" → "PostgreSQL"

**That's it!** Railway will automatically:
- ✅ Detect it's a Next.js app
- ✅ Install dependencies
- ✅ Build the application
- ✅ Deploy to a public URL

### 3. Run Setup Wizard (2 minutes)

Once deployed, Railway gives you a URL (e.g., `https://your-app.up.railway.app`).

1. **Open the URL** - You'll be redirected to `/setup`

2. **Follow the Wizard:**
   - **Step 1**: Welcome screen
   - **Step 2**: Paste `DATABASE_URL` from Railway PostgreSQL
   - **Step 3**: Click "Generate" for auth secret
   - **Step 4**: Customize branding (name, color, logo)
   - **Step 5**: Complete!

3. **Create First Account** - Register your admin account

## ✅ Done!

Your SaaS is now live with:
- ✅ User authentication
- ✅ Credits system (100 free credits per user)
- ✅ Custom branding
- ✅ Database configured
- ✅ Ready to add features

## 🎨 Next Steps

1. **Add Features**: Create new pages in `app/`
2. **Customize**: Edit components in `components/`
3. **Add APIs**: Create routes in `app/api/`
4. **Deploy Updates**: Just `git push` - Railway auto-deploys!

## 💡 Pro Tips

- **Custom Domain**: Add in Railway Settings → Domains
- **Environment Variables**: Manage in Railway Settings → Variables
- **Database Access**: Use Railway's built-in PostgreSQL client
- **Logs**: Check Railway's real-time logs for debugging

## 📚 Full Documentation

- [RAILWAY_DEPLOY.md](./RAILWAY_DEPLOY.md) - Detailed deployment guide
- [README.md](./README.md) - Complete feature documentation
- [INSTALLATION.md](./INSTALLATION.md) - Local development setup

---

**Questions?** Check the troubleshooting section in RAILWAY_DEPLOY.md
