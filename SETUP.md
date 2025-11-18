# Blog Platform Setup Guide

A modern, full-featured blog platform built with React, TypeScript, Vite, Tailwind CSS, and Supabase.

## Features

- 📝 **Rich Text Editor** - Create and edit articles with ReactQuill
- 🖼️ **Media Management** - Upload images and videos or embed from URLs
- 💬 **Comment System** - Reader engagement with moderation tools
- 🔐 **Admin Dashboard** - Secure admin area for content management
- 🎨 **Dark Mode** - Beautiful light/dark theme toggle
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🚀 **Fast & Modern** - Built with Vite for lightning-fast development

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v4 with custom theme
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Routing**: React Router v7
- **Editor**: ReactQuill
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ and npm
- A Supabase account and project ([sign up free](https://supabase.com))

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a new project at [supabase.com](https://app.supabase.com)
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Fill in your Supabase credentials in `.env`:
   - `VITE_PUBLIC_SUPABASE_URL` - Your project URL (e.g., `https://xxxxx.supabase.co`)
   - `VITE_SUPABASE_PUBLIC_ANON_KEY` - Your anon/public key

   You can find these in: **Supabase Dashboard → Project Settings → API**

### 3. Run Database Migrations

Execute the SQL migrations in your Supabase project in order:

1. Go to **SQL Editor** in your Supabase dashboard
2. Run each migration file in `supabase/migrations/` in order:
   - `001_create_articles_table.sql`
   - `002_create_media_table.sql`
   - `003_create_comments_table.sql`
   - `004_enable_rls_policies.sql`
   - `005_create_storage_bucket.sql`

### 4. Create an Admin User

1. Go to **Authentication → Users** in Supabase dashboard
2. Click **Add user** → **Create new user**
3. Enter email and password (you'll use these to login to `/admin`)

### 5. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── admin/          # Admin dashboard components
│   ├── blog/           # Public blog components
│   └── common/         # Shared components
├── contexts/           # React contexts (Auth, Theme)
├── pages/              # Page components
├── services/           # API service layers
├── lib/                # Supabase client
└── utils/              # Utility functions

supabase/
└── migrations/         # Database schema migrations
```

## Usage

### Public Area
- Visit `/` to see published articles
- Click any article to read the full content
- Leave comments on articles

### Admin Area
- Visit `/admin/login` and sign in with your admin credentials
- Create new articles or edit existing ones
- Upload media or embed from URLs
- Publish/unpublish articles
- Moderate comments

## Database Schema

- **articles** - Blog posts with title, content, author, publish status
- **media** - Images and videos attached to articles
- **comments** - Reader comments on articles
- **storage.media** - File storage bucket for uploaded media

## Security

- Row Level Security (RLS) enabled on all tables
- Public users can only read published content
- Authenticated users (admins) have full CRUD access
- Media bucket allows public reads, authenticated uploads

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure `.env` file exists and contains valid credentials
- Restart the dev server after updating `.env` file

### Cannot see articles on the homepage
- Check that you've run all database migrations
- Verify you have at least one published article in Supabase
- Check browser console for errors

### Admin login not working
- Ensure you've created a user in Supabase Authentication
- Check that the email/password match your Supabase user
- Verify RLS policies are enabled correctly

## Next Steps

After setup, you can:
1. Customize the theme in `tailwind.config.js`
2. Add more fields to articles (tags, categories, etc.)
3. Implement text-to-speech functionality (service exists in `src/services/ttsService.ts`)
4. Deploy to Vercel, Netlify, or your preferred hosting platform
