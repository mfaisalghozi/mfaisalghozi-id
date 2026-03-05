# Notion Webhook Setup for On-Demand Revalidation

## What this does
When you publish or update a blog post in Notion, this webhook instantly clears the Next.js cache so the latest content appears on the site — without waiting for the 30-minute revalidation window.

## Revalidate Endpoint
```
POST https://mfaisalghozi.id/api/revalidate?secret=<REVALIDATE_SECRET>
```

The secret is stored in `.env.local` and must also be set in Vercel environment variables.

---

## Step 1 — Add secret to Vercel

1. Go to your project on [vercel.com](https://vercel.com)
2. **Settings** → **Environment Variables**
3. Add:
   - Name: `REVALIDATE_SECRET`
   - Value: *(copy from `.env.local`)*
   - Environment: Production, Preview, Development

---

## Step 2 — Set up Notion Automation

1. Open your **blog database** in Notion
2. Click the **"Automate"** button (top-right of the database)
3. Click **"+ New automation"**

### Trigger
Set up two triggers (or one automation each):
- **"Page added"** — fires when a new post is created
- **"Property edited"** → select `Published` — fires when you set/change the publish date

### Action
1. Click **"+ Add action"**
2. Choose **"Send webhook"**
3. Configure:
   - **URL:** `https://mfaisalghozi.id/api/revalidate?secret=8e4eb07a422f063a4edc2ab230c096e1c421a3f82a225022e49723148ade53a1`
   - **Method:** POST
4. Click **Save**

---

## Step 3 — Test it

After deploying to production, trigger the webhook manually via terminal:
```bash
curl -X POST "https://mfaisalghozi.id/api/revalidate?secret=8e4eb07a422f063a4edc2ab230c096e1c421a3f82a225022e49723148ade53a1"
```

Expected response:
```json
{ "revalidated": true }
```

---

## How it works

The endpoint calls Next.js `revalidatePath` on:
- `/` (landing page recent posts)
- `/blog` (blog list)
- `/blog/[slug]` (all blog post pages)

This forces the next visitor to get fresh data from Notion instead of the cached version.
