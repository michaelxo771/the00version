# The 00s Version — Shopify Theme Setup Guide

Follow these steps in order to get your store live on `the00sversion.myshopify.com`.

---

## Step 1 — Upload the Theme

1. In your Shopify admin go to **Online Store → Themes**
2. Click **Add theme → Upload zip file**
3. Zip the entire `shopify-theme/` folder:
   ```
   cd /path/to/the00version
   zip -r the00sversion-theme.zip shopify-theme/
   ```
4. Upload the zip. Shopify will process it.
5. Click **Customize** to preview, or **Publish** to make it live.

> **Note:** Do NOT publish until you've completed steps 2–6 below.

---

## Step 2 — Import Products

1. In Shopify admin go to **Products → Import**
2. Upload `shopify-theme/products.csv`
3. Tick **Overwrite any current products that have the same handle**
4. Click **Import products**

After import, for each product:
- Add real product photos (drag & drop in product editor)
- Verify prices are correct
- Set which products appear in each collection (step 4)

---

## Step 3 — Create Pages

Go to **Online Store → Pages** and create these pages. For each one, assign the correct template using the **Theme template** dropdown on the right.

| Page Title            | Handle (URL)          | Template             |
|-----------------------|-----------------------|----------------------|
| FAQ                   | `faq`                 | `page.faq`           |
| Shipping & Returns    | `returns`             | `page.returns`       |
| Size Guide            | `size-guide`          | `page.size-guide`    |
| Track Order           | `track-order`         | `page.track-order`   |
| Privacy Policy        | `privacy-policy`      | `page.privacy-policy`|
| Terms of Service      | `terms`               | `page.terms`         |
| Cookie Policy         | `cookie-policy`       | `page` (default)     |

For **Cookie Policy**, paste your cookie policy content into the page body.

---

## Step 4 — Create Collections

Go to **Products → Collections** and create these collections:

| Title          | Handle          | Products to include                        |
|----------------|-----------------|---------------------------------------------|
| All Products   | `all`           | (auto — all products)                       |
| New Drops      | `new-drops`     | Tag condition: `new`                        |
| Hoodies        | `hoodies`       | Product type = `Hoodies`                   |
| T-Shirts       | `t-shirts`      | Product type = `T-Shirts`                  |
| Bottoms        | `bottoms`       | Product type = `Bottoms`                   |
| Outerwear      | `outerwear`     | Product type = `Outerwear`                 |
| Sets           | `sets`          | Product type = `Sets`                      |
| Accessories    | `accessories`   | Product type = `Accessories`               |
| Featured       | `featured`      | Manually add 4 hero products               |

For automatic collections, use **Conditions**:
- Set `Product tag is equal to new` for New Drops
- Set `Product type is equal to Hoodies` for Hoodies, etc.

---

## Step 5 — Configure Navigation

Go to **Online Store → Navigation**.

### Main Menu (header)
Edit the existing main menu or create one with handle `main-menu`:

| Label        | Link                         |
|--------------|------------------------------|
| Shop         | `/collections/all`           |
| New Drops    | `/collections/new-drops`     |
| Sets         | `/collections/sets`          |
| Accessories  | `/collections/accessories`   |
| Outerwear    | `/collections/outerwear`     |

> The header is hardcoded in `sections/header.liquid` — navigation is already embedded there. You can edit the section directly if you want different links.

### Footer Menu
Already hardcoded in `sections/footer.liquid`. Edit directly if needed.

---

## Step 6 — Configure Theme Settings

1. Go to **Online Store → Themes → Customize**
2. Click **Theme settings** (bottom left)
3. Verify colors: Gold `#C9A84C`, Background `#080808`, Text `#e5e5e5`
4. Add your social media URLs

---

## Step 7 — Email / Notifications

Shopify sends order confirmation emails automatically. To match your brand:

1. Go to **Settings → Notifications**
2. Edit **Order confirmation** email
3. Change the header color to `#080808` and accent to `#C9A84C`

For custom transactional emails (via Resend), your existing Next.js API at `the00sversion.com/api/webhook` still handles this — you don't need to migrate it.

---

## Step 8 — Domain

1. Go to **Settings → Domains**
2. Click **Connect existing domain**
3. Enter `the00sversion.com`
4. Follow Shopify's DNS instructions to point your domain

> You'll need to update DNS records at your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.)

---

## Step 9 — Payments

1. Go to **Settings → Payments**
2. Enable **Shopify Payments** (or your preferred gateway)
3. Add your banking details to receive payouts

---

## Step 10 — Go Live

1. Remove the storefront password: **Online Store → Preferences → Password protection** → uncheck
2. Publish your theme if not already done
3. Test a complete checkout with a real card (then refund yourself)
4. Verify all pages render correctly on mobile

---

## Theme File Reference

```
shopify-theme/
├── assets/
│   ├── theme.css          # All styles — dark/gold design system
│   └── theme.js           # All JS — search, cart, timer, animations
├── config/
│   ├── settings_data.json # Default theme settings
│   └── settings_schema.json
├── layout/
│   └── theme.liquid       # Main HTML wrapper
├── sections/
│   ├── header.liquid
│   ├── footer.liquid
│   ├── hero.liquid
│   ├── marquee-ticker.liquid
│   ├── featured-products.liquid
│   ├── category-strip.liquid
│   ├── brand-story.liquid
│   ├── countdown-timer.liquid
│   ├── testimonials.liquid
│   ├── tiktok-banner.liquid
│   ├── email-signup.liquid
│   ├── main-product.liquid
│   ├── main-collection.liquid
│   ├── main-cart.liquid
│   ├── main-page.liquid
│   ├── main-404.liquid
│   ├── page-faq.liquid
│   ├── page-returns.liquid
│   ├── page-size-guide.liquid
│   ├── page-track-order.liquid
│   ├── page-privacy-policy.liquid
│   └── page-terms.liquid
├── snippets/
│   └── product-card.liquid
├── templates/
│   ├── index.json
│   ├── product.json
│   ├── collection.json
│   ├── cart.json
│   ├── page.json
│   ├── page.faq.json
│   ├── page.returns.json
│   ├── page.size-guide.json
│   ├── page.track-order.json
│   ├── page.privacy-policy.json
│   ├── page.terms.json
│   └── 404.json
├── products.csv           # Import this in Shopify admin
└── SETUP.md               # This file
```

---

## Limitations vs. Next.js store

| Feature | Status on Shopify |
|---|---|
| CJ Dropshipping auto-submit | ❌ Not included — handled by Next.js API |
| Custom checkout design | ❌ Requires Shopify Plus ($2,300/mo) |
| Resend confirmation emails | ✅ Shopify sends its own (or keep Next.js webhook) |
| Promo/discount codes | ✅ Native Shopify discounts |
| Order tracking | ✅ Built-in `/account/orders/` |
| Reviews | ✅ Add free Shopify app (e.g. Judge.me) |
| Abandoned cart emails | ✅ Native Shopify feature (enable in Marketing) |

---

*Built for The 00s Version · the00sversion.myshopify.com*
