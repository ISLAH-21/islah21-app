# Islah 21

## Features

- ⚡️ Next.js 14 (App Router)
- 🎨 AI-generated components via v0
- 💅 Tailwind CSS
- 🧱 Component-first architecture
- 🧪 Built-in testing setup (e.g. Playwright / Vitest optional)
- 🚀 Ready for deployment (Vercel optimized)

## Getting Started

```bash
# Clone the repo
git clone https://github.com/ISLAH-21/islah21-app.git
cd islah21-app

# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

## Scripts

```bash
pnpm dev       # Start local dev
pnpm build     # Production build
pnpm lint      # Linting
pnpm test      # Run tests (if set up)
```

## Folder Structure

```
/
├── app/               # Next.js app directory
│   └── components/    # v0-generated components
├── public/            # Static assets
├── styles/            # Global styles (tailwind config, etc.)
├── tests/             # Test files (if added)
├── utils/             # Helpers
├── tsconfig.json
└── tailwind.config.ts
```

## Deployment

Deploy instantly to [Vercel](https://vercel.com) — just hook up your repo.