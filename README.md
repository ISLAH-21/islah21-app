# Islah 21

Alumni directory web app untuk jaringan alumni Islah 21. Pencarian & filter data alumni (nama, skills, domisili, perusahaan) dengan data source Google Sheets.

## 🚀 Getting Started

### Prerequisites

- **Node.js 20** (Node 22+ crash karena dependency `buffer-equal-constant-time` pakai `SlowBuffer` yang sudah dihapus). Rekomendasi pakai `nvm`:
  ```sh
  nvm install 20
  nvm use 20
  ```
- [pnpm](https://pnpm.io/installation)

### Installation & Setup

1. **Clone the repository:**
    ```sh
    git clone <your-repository-url>
    cd islah21-app
    ```

2. **Install dependencies:**
    ```sh
    pnpm install
    ```

3. **Set up environment variables:**

    ```sh
    cp .env.example .env
    ```
    Isi `.env` dengan nilai yang sesuai (credentials Google Sheets service account, spreadsheet ID, dan `REVALIDATE_ID`).

4. **Run the dev server:**
    ```sh
    pnpm dev
    ```

    App jalan di http://localhost:3000.

## 🏗️ Deployment (Netlify)

Project ini di-deploy ke **Netlify** (free tier, bisa komersial). Config ada di `netlify.toml` — sudah set Node 20 + `@netlify/plugin-nextjs` (auto-installed saat build).

### Via Netlify dashboard (recommended)

1. Connect repo GitHub ke Netlify dashboard.
2. Build settings otomatis ke-detect dari `netlify.toml`.
3. Set env vars di Site settings → Environment variables:
   - `GOOGLE_CLIENT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `GOOGLE_SPREADSHEET_ID`
   - `GOOGLE_SPREADSHEET_SHEET_NAME`
   - `GOOGLE_SPREADSHEET_SCOPE`
   - `REVALIDATE_ID` (secret 32-byte hex — jangan reuse nilai `.env` dev)

Tiap push ke branch → auto deploy preview. Merge ke `main` → production deploy.

### Via Netlify CLI

```sh
pnpm dlx netlify-cli login
pnpm dlx netlify-cli deploy          # preview
pnpm dlx netlify-cli deploy --prod   # production
```

## 🔄 Cache Revalidation

Data alumni di-cache 1 jam (`unstable_cache` dengan tag `alumni-list`). Untuk invalidate manual setelah update data:

```sh
curl "https://<your-domain>/api/v1/revalidate?tag=alumni-list&id=<REVALIDATE_ID>"
```
