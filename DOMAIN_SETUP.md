# Domain Setup for sportalcorporate.org

To officially connect your new domain (`sportalcorporate.org`), you need to simplify point your DNS records to Netlify.

### Step 1: Netlify Configuration
1. Go to your **Netlify Dashboard** > **Site Settings**.
2. Click **Domain Management** > **Add Custom Domain**.
3. Enter `sportalcorporate.org`.
4. Click **Verify**.

### Step 2: DNS Configuration (GoDaddy/Namecheap/etc)
Log in to where you bought the domain and add these records:

| Type  | Name | Value | TTL |
|-------|------|-------|-----|
| **A** | `@`  | `75.2.60.5` | 3600 |
| **CNAME** | `www` | `sportalcorporate.netlify.app` | 3600 |

### Step 3: Wait
DNS changes can take up to 24 hours (usually 15 mins). Once active, Netlify will automatically provision an SSL certificate (HTTPS).

**Note:** All your SEO meta tags and sitemaps have already been updated to point to `sportalcorporate.org` to ensure Google indexes the RIGHT domain immediately.
