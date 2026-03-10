# Deploy to Cloudflare Pages

## Quick Deploy

1. Go to [Cloudflare Pages](https://dash.cloudflare.com/pages)
2. Click "Create a project"
3. Connect your GitHub/GitLab repository OR upload directly:
   - For direct upload: Drag and drop the `public/` folder

## Deploy via Wrangler CLI

1. Install Wrangler:
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

3. Deploy:
```bash
cd public
wrangler pages deploy .
```

## File Structure

```
public/
├── index.html      # Main page
├── style.css       # Black & white theme (image stays colored)
├── script.js       # Infinite scroll logic
├── posts.json      # All blog posts data
├── nana_image.jpg  # Grandpa's photo (in color)
├── 404.html        # 404 error page
└── _routes.json    # Cloudflare Pages routing
```

## Features

- ✨ **Black & White Theme** - Elegant monochrome design
- 🖼️ **Colored Photo** - Grandpa's image stays in full color
- 📜 **Infinite Scroll** - Posts load as you scroll down
- 📱 **Responsive** - Works on all devices
- ⚡ **Fast** - Static site with no backend needed
- 🔍 **SEO Ready** - Meta tags and Open Graph included

## Customization

To update posts:
1. Add/modify markdown files in `posts/` folder
2. Run `python3 convert_posts.py` to regenerate `posts.json`
3. Redeploy to Cloudflare Pages
