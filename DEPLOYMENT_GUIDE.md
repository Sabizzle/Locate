# Deployment Guide for loCATE!

This guide will walk you through deploying your loCATE! application to Vercel.

## Prerequisites

Before you begin, ensure you have:

1. A GitHub account
2. A Vercel account (free tier available at [vercel.com](https://vercel.com))
3. A Supabase account (free tier available at [supabase.com](https://supabase.com))
4. Git installed on your computer

## Step 1: Set Up Supabase

### 1.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in the details:
   - **Name**: locate-jamaica
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to Jamaica (US East recommended)
4. Click "Create new project" and wait for it to initialize

### 1.2 Set Up Database Tables

1. In your Supabase dashboard, go to the SQL Editor
2. Run the following SQL to create tables:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  parish TEXT,
  address TEXT,
  notify_opt_in BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Cases table
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  photo_url TEXT,
  description TEXT,
  last_known_clothing TEXT,
  last_seen_date DATE NOT NULL,
  last_seen_time TIME,
  last_seen_address TEXT NOT NULL,
  parish TEXT NOT NULL,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  reporter_name TEXT NOT NULL,
  reporter_contact TEXT NOT NULL,
  reporter_email TEXT,
  relationship TEXT NOT NULL,
  police_report_number TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Active', 'Found', 'Closed')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tips table
CREATE TABLE tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  tip_text TEXT NOT NULL,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  anonymous BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Reviewed', 'Forwarded')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Search Parties table
CREATE TABLE search_parties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  organizer_name TEXT NOT NULL,
  organizer_contact TEXT NOT NULL,
  meeting_point TEXT NOT NULL,
  parish TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  description TEXT,
  max_volunteers INTEGER,
  current_volunteers INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Completed', 'Cancelled')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_parish ON cases(parish);
CREATE INDEX idx_cases_created_at ON cases(created_at);
CREATE INDEX idx_tips_case_id ON tips(case_id);
CREATE INDEX idx_search_parties_case_id ON search_parties(case_id);
CREATE INDEX idx_search_parties_date ON search_parties(scheduled_date);
```

### 1.3 Set Up Storage

1. Go to Storage in Supabase dashboard
2. Create a new bucket called `photos`
3. Set it to **Public** bucket
4. Add the following policy for uploads:

```sql
-- Allow authenticated users to upload photos
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'photos');

-- Allow public read access
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'photos');
```

### 1.4 Enable Row Level Security (RLS)

Run these policies for security:

```sql
-- Enable RLS
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Public can read active cases
CREATE POLICY "Public can view active cases"
ON cases FOR SELECT
USING (status IN ('Active', 'Found'));

-- Authenticated users can insert cases
CREATE POLICY "Authenticated can insert cases"
ON cases FOR INSERT
TO authenticated
WITH CHECK (true);

-- Public can submit tips
CREATE POLICY "Anyone can submit tips"
ON tips FOR INSERT
WITH CHECK (true);

-- Public can view search parties
CREATE POLICY "Public can view search parties"
ON search_parties FOR SELECT
USING (status = 'Active');

-- Users can read their own data
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = id);
```

### 1.5 Get Your Supabase Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy these values:
   - **Project URL** (e.g., https://xxxxx.supabase.co)
   - **anon/public key** (starts with "eyJ...")
3. Update `supabaseClient.js` with these values:

```javascript
const SUPABASE_URL = "your-project-url-here";
const SUPABASE_ANON_KEY = "your-anon-key-here";
```

## Step 2: Prepare Your Code for Deployment

### 2.1 Initialize Git Repository

```bash
cd C:\Users\THEO\Desktop\Locate-1
git init
git add .
git commit -m "Initial commit - loCATE! application"
```

### 2.2 Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Name it: `locate-jamaica`
4. Set to Public or Private
5. Do NOT initialize with README (you already have one)
6. Click "Create repository"

### 2.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR-USERNAME/locate-jamaica.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### Method A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository (`locate-jamaica`)
4. Configure your project:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: (leave empty)
   - **Output Directory**: ./
5. Click "Deploy"
6. Wait for deployment to complete (usually 1-2 minutes)
7. You'll get a URL like: `https://locate-jamaica.vercel.app`

### Method B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   cd C:\Users\THEO\Desktop\Locate-1
   vercel
   ```

4. Follow the prompts:
   - Link to existing project? → No
   - Project name → locate-jamaica
   - Directory → ./
   - Want to override settings? → No

5. Deploy to production:
   ```bash
   vercel --prod
   ```

## Step 4: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain (e.g., `locate.com.jm`)
4. Follow DNS configuration instructions
5. Vercel will automatically provision SSL certificate

## Step 5: Test Your Deployment

1. Visit your Vercel URL
2. Test these features:
   - User registration
   - Login
   - Report a missing person (with photo upload)
   - Browse missing persons page
   - Submit a tip
   - Chat with the chatbot
   - Mobile responsiveness

## Step 6: Monitor and Maintain

### Analytics

1. In Vercel dashboard, view:
   - Page views
   - Response times
   - Error rates

### Supabase Monitoring

1. In Supabase dashboard, check:
   - Database usage
   - Storage usage
   - API requests

### Updates

To update your deployment:

```bash
# Make changes to your code
git add .
git commit -m "Description of changes"
git push origin main
```

Vercel will automatically redeploy!

## Troubleshooting

### Issue: Supabase Connection Error

**Solution:**
- Verify your `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct
- Check browser console for errors
- Ensure Row Level Security policies are set up correctly

### Issue: Photos Not Uploading

**Solution:**
- Verify the `photos` bucket exists in Supabase Storage
- Check storage policies allow uploads
- Ensure file size is under 5MB

### Issue: 404 on Page Refresh

**Solution:**
- Vercel handles this automatically for static sites
- Ensure `vercel.json` is properly configured

### Issue: Slow Loading

**Solution:**
- Enable caching in Vercel
- Optimize images before upload
- Consider adding a CDN

## Security Checklist

Before going live:

- [ ] Update all API keys in production
- [ ] Enable RLS on all Supabase tables
- [ ] Add CAPTCHA to forms (recommended)
- [ ] Set up email verification in Supabase Auth
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Review privacy policy
- [ ] Set up SSL (Vercel does this automatically)

## Next Steps

1. **Marketing**: Share your URL on social media
2. **Community**: Partner with local organizations
3. **Feedback**: Collect user feedback and iterate
4. **Features**: Add SMS notifications, mobile app
5. **Integration**: Connect with law enforcement databases

## Support

If you encounter issues:

1. Check Vercel logs: Dashboard → Deployments → View Logs
2. Check Supabase logs: Dashboard → Logs
3. Check browser console for JavaScript errors
4. Review this guide again
5. Contact support or open a GitHub issue

## Costs

- **Vercel Free Tier**:
  - 100 GB bandwidth/month
  - Unlimited deployments
  - Automatic SSL

- **Supabase Free Tier**:
  - 500 MB database
  - 1 GB file storage
  - 50,000 monthly active users

Both are sufficient for starting out!

---

**Congratulations! Your loCATE! app is now live! 🎉**
