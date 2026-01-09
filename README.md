# Brass Home Atelier

A B2B brass hardware catalog with admin dashboard for managing categories, SKUs, and quote requests.

## Features

- **Public Catalog**: Browse categories and SKUs, request quotes
- **Admin Dashboard**: Manage categories, SKUs, and view quote requests
- **Static Authentication**: Login with username/password
- **Supabase Backend**: PostgreSQL database hosted on Supabase
- **Netlify Deployment**: Easy deployment with Netlify

## Tech Stack

- React 18 + TypeScript
- Material UI 6
- Vite
- Supabase (Database)
- Netlify (Hosting)

## Getting Started

### 1. Clone and Install

```bash
git clone <your-repo>
cd brasshomeatlier-frontend
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free project
2. Once created, go to **Settings > API** and copy:
   - `Project URL`
   - `anon public` key
3. Go to **SQL Editor** and run the contents of `supabase-schema.sql`
4. Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Locally

```bash
# With Netlify CLI (recommended)
npm run dev

# Or just Vite
npm run dev:vite
```

Visit [http://localhost:8888](http://localhost:8888) (or 5173 for Vite only)

### 4. Access Admin Dashboard

Navigate to `/admin/login` and use these credentials:

- **Username**: `salman`
- **Password**: `password`

## Deployment to Netlify

### Option 1: Deploy via Netlify CLI

```bash
# Install Netlify CLI globally (if not already)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init
netlify deploy --prod
```

### Option 2: Deploy via GitHub

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and sign up/login
3. Click "Add new site" > "Import an existing project"
4. Connect your GitHub repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Add environment variables in **Site settings > Environment variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Deploy!

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key |

## Project Structure

```
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React contexts (Auth)
│   ├── lib/              # API, Supabase client, types
│   ├── pages/            # Page components
│   │   └── admin/        # Admin dashboard pages
│   ├── providers/        # Theme provider
│   ├── App.tsx           # Main app with routes
│   └── main.tsx          # Entry point
├── netlify.toml          # Netlify configuration
├── supabase-schema.sql   # Database schema
└── package.json
```

## Admin Dashboard Routes

| Route | Description |
|-------|-------------|
| `/admin/login` | Login page |
| `/admin/dashboard` | Overview with stats |
| `/admin/categories` | Manage product categories |
| `/admin/skus` | Manage SKUs/products |
| `/admin/quotes` | View and manage quote requests |

## Mock Mode

If Supabase credentials are not configured, the app runs in **mock mode** with sample data. This is useful for local development without a database.

## Security Notes

- The admin credentials are hardcoded for simplicity. In production, consider:
  - Using Supabase Auth
  - Environment-based credentials
  - More secure authentication methods
- Supabase RLS (Row Level Security) is configured for:
  - Public read access to categories and SKUs
  - Public write access for quote requests (customers can submit quotes)
  - Admin operations should use the service role key

## License

MIT
