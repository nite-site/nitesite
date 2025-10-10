# Nite Site Deployment Guide

## 🚀 Cloudflare Pages Deployment

### Option 1: Direct Upload (Recommended for first deployment)

1. **Build the site:**
   ```bash
   npm run build
   ```

2. **Go to Cloudflare Dashboard:**
   - Visit [dash.cloudflare.com](https://dash.cloudflare.com)
   - Navigate to **Pages** → **Create a project**

3. **Upload your site:**
   - Choose **"Upload assets"**
   - Upload the entire `dist` folder contents
   - Name your project (e.g., "nitesite")

4. **Connect your domain:**
   - Go to **Custom domains** → **Set up a custom domain**
   - Enter your domain name
   - Cloudflare will automatically configure DNS

### Option 2: GitHub Integration (For automatic deployments)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/nitesite.git
   git push -u origin main
   ```

2. **Connect to Cloudflare Pages:**
   - In Cloudflare Pages, choose **"Connect to Git"**
   - Select your GitHub repository
   - Set build command: `npm run build`
   - Set build output directory: `dist`
   - Deploy!

### Option 3: Wrangler CLI (Advanced)

1. **Install Wrangler:**
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare:**
   ```bash
   wrangler login
   ```

3. **Deploy:**
   ```bash
   wrangler pages deploy dist --project-name nitesite
   ```

## 📁 Files to Upload

The `dist` folder contains:
- `index.html` - Main HTML file
- `assets/` - CSS, JS, and font files
- `manifest.json` - PWA manifest
- `nitesite-512.png` - App icon

## 🌐 Domain Configuration

1. **Add Custom Domain:**
   - In Cloudflare Pages → Custom domains
   - Add your domain (e.g., `yoursite.com`)

2. **DNS Settings:**
   - Cloudflare will automatically create CNAME records
   - Your site will be available at your domain

3. **SSL Certificate:**
   - Cloudflare provides free SSL
   - HTTPS will be automatically enabled

## ✅ Post-Deployment Checklist

- [ ] Site loads at your domain
- [ ] Moon icon is clickable
- [ ] Date picker opens and closes smoothly
- [ ] Moon phases change when selecting dates
- [ ] Mobile responsive design works
- [ ] PWA installation works (Add to Home Screen)
- [ ] Favicon shows current moon phase

## 🔧 Environment Variables (if needed)

If you need to change the moon phase data location, you can set:
- `VITE_PHASES_URL` - URL to phases.json file

## 📱 Testing

Test on mobile:
1. Visit your domain on phone
2. Tap moon icon to open date picker
3. Select different dates
4. Try "Add to Home Screen"
5. Verify app icon appears

## 🎯 Performance

Your site is optimized for:
- ✅ Static hosting
- ✅ CDN distribution
- ✅ Mobile performance
- ✅ PWA functionality
- ✅ SEO-friendly URLs

## 🆘 Troubleshooting

**Site not loading:**
- Check DNS propagation (can take 24 hours)
- Verify domain is properly connected in Cloudflare

**Moon phases not working:**
- Ensure `phases.json` is in the `dist` folder
- Check browser console for errors

**Mobile issues:**
- Test on different devices
- Check viewport meta tag

## 📞 Support

For Cloudflare Pages support:
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare Community](https://community.cloudflare.com/)
