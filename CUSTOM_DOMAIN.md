# Add Custom Domain from Namecheap to Cloudflare Pages

## Overview

To use a custom domain (e.g., `yourdomain.com`) with your Cloudflare Pages site, you need to:
1. Add the domain in Cloudflare Pages settings
2. Update DNS records in Namecheap to point to Cloudflare

---

## Step 1: Add Domain in Cloudflare Pages

1. Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/pages)
2. Select your project (the blog site you just deployed)
3. Go to **"Custom domains"** tab
4. Click **"Set up a custom domain"**
5. Enter your domain name (e.g., `yourdomain.com`)
6. Click **"Continue"**
7. Cloudflare will verify the domain - it may say "Invalid configuration" initially (that's ok!)

---

## Step 2: Get Cloudflare Nameservers

Before updating Namecheap, you need to add your domain to Cloudflare's DNS management:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **"Add a site"** or **"+ Add site"**
3. Enter your domain name (e.g., `yourdomain.com`)
4. Select the **Free plan**
5. Cloudflare will scan for existing DNS records (you can delete these later)
6. Continue until you see **Cloudflare nameservers**

You'll see two nameservers like:
- `lara.ns.cloudflare.com`
- `greg.ns.cloudflare.com`

**Copy these nameservers** - you'll need them for Namecheap.

---

## Step 3: Update Nameservers in Namecheap

1. Log in to [Namecheap](https://www.namecheap.com)
2. Go to **"Domain List"** from the left sidebar
3. Click **"Manage"** next to your domain
4. Find the **"Nameservers"** section
5. Change from "Namecheap BasicDNS" to **"Custom DNS"**
6. Enter the two Cloudflare nameservers you copied:
   - Nameserver 1: `lara.ns.cloudflare.com` (example)
   - Nameserver 2: `greg.ns.cloudflare.com` (example)
7. Click the **green checkmark** to save
8. It may take 24-48 hours for nameserver changes to propagate (usually much faster)

---

## Step 4: Add DNS Record in Cloudflare

Once your domain is using Cloudflare nameservers:

1. Go back to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your domain
3. Go to **"DNS"** → **"Records"**
4. Add a CNAME record:
   - **Type:** CNAME
   - **Name:** `@` (or `www` for www.yourdomain.com)
   - **Target:** `your-project.pages.dev` (your Cloudflare Pages URL)
   - **TTL:** Auto
5. Click **Save**

### For Apex Domain (yourdomain.com without www)

If you want `yourdomain.com` (without www), Cloudflare has a special feature:

1. Add a CNAME record:
   - **Type:** CNAME
   - **Name:** `@`
   - **Target:** `your-project.pages.dev`
   - **TTL:** Auto

Cloudflare's CNAME flattening will handle this automatically.

---

## Step 5: Verify in Cloudflare Pages

1. Go back to [Cloudflare Pages](https://dash.cloudflare.com/pages)
2. Select your project
3. Go to **"Custom domains"** tab
4. Wait for the status to change to **"Active"**
   - This can take a few minutes to a few hours
5. Once active, visit `https://yourdomain.com` to see your blog!

---

## Step 6: Enable HTTPS (SSL)

Cloudflare automatically provides SSL certificates:

1. In Cloudflare Dashboard, go to **"SSL/TLS"**
2. Set encryption mode to **"Full (strict)"**
3. Enable **"Always Use HTTPS"** in the "Edge Certificates" section
4. Your site will now redirect HTTP to HTTPS automatically

---

## Quick Checklist

- [ ] Added custom domain in Cloudflare Pages settings
- [ ] Added domain to Cloudflare DNS management
- [ ] Copied Cloudflare nameservers
- [ ] Updated nameservers in Namecheap (Custom DNS)
- [ ] Added CNAME record pointing to `your-project.pages.dev`
- [ ] Waited for DNS propagation (check status in Cloudflare Pages)
- [ ] Enabled HTTPS/SSL in Cloudflare

---

## Troubleshooting

### "Invalid Configuration" persists
- Wait longer for DNS propagation (can take up to 24 hours)
- Double-check your CNAME record points to the correct `pages.dev` URL

### Domain shows wrong content
- Clear browser cache
- Check that the CNAME target matches your Cloudflare Pages URL exactly

### SSL/HTTPS not working
- Go to Cloudflare → SSL/TLS → Overview
- Set to "Full (strict)" mode
- Wait a few minutes for the certificate to issue

### Want both www and non-www?
Add both domains in Cloudflare Pages custom domains, and set up page rules to redirect one to the other.

---

## Example Setup

| Setting | Value |
|---------|-------|
| Domain | `nanaspoetry.com` |
| Cloudflare Nameservers | `lara.ns.cloudflare.com`, `greg.ns.cloudflare.com` |
| CNAME Record | `@` → `nana-blog.pages.dev` |
| SSL Mode | Full (strict) |

After setup, your blog will be live at `https://nanaspoetry.com`!
