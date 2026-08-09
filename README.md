# PULSO recovery-tech ecommerce website

A framework-free, PHP-hosting-ready single-product ecommerce experience for a cordless massage gun. The project includes a long-form home page, six shared-system product pages, cart and quote flow, a dedicated contact page, and three legal pages.

## Run locally

From the project root:

```bash
php -S 127.0.0.1:8008
```

Then open `http://127.0.0.1:8008/`.

PHP's built-in server can render the site and execute `contact.php`. Successful email delivery still depends on the host's mail transport. A production host should configure authenticated mail delivery at the server level.

## Central configuration

All recurring commercial and company data lives in `config/config.js`. It is deliberately JSON-compatible inside `window.SITE_CONFIG` so PHP can parse the same master source.

- Brand and company: `brand`
- Corporate email and address: `contact`
- Product SKU, price, stock and specifications: `product`
- Speed levels: `speeds`
- Warranty, returns and shipping labels: `policies`
- Bundle contents and prices: `bundles`
- Review statistics and editable testimonials: `reviews`
- Offer price and real end date: `offer`
- Shipping-zone rates: `shippingZones`
- Advertise & Collaborate copy: `advertise`
- Legal company fields: `legal`

Change the corporate email only in `config/config.js`. Frontend elements use `data-config-email`, and `contact.php` reads the recipient from the same file at runtime. There is no separate recipient constant in PHP.

## Commerce flow

The default mode is `commerce.mode: "inquiry"`. Add-to-bag actions persist in versioned local storage (`pulso_cart_v1`). The cart calculates configured shipping estimates and opens a quote sheet. It never asks for payment-card numbers and never presents a fake charge result.

To enable real payments later, keep card collection inside a hosted or tokenized provider UI and add server-side credentials outside the public repository. Do not place payment secrets in JavaScript.

## Forms

`contact.php` accepts `contact`, `advertise`, and `quote` form types. It validates email, caps field sizes, removes header-injection characters, uses a honeypot, includes quote cart details, returns JSON, and never exposes PHP errors to visitors.

## Images

Original project photography is in `assets/images/`. Ten primary images were generated for this project with the built-in ImageGen workflow, converted to optimized JPEGs, and reused in contextually cropped card assets. Replace any image at the same path, or update the consuming `src` and config path. Keep hero photography near 1600–2000 px on the long edge and card photography around 800–1200 px.

## Styling and scripts

- Global design system: `assets/css/`
- Shared runtime and cart: `assets/js/`
- Home-only styles/scripts: `home/`
- Contact-only styles/scripts: `contact/`
- Six product pages: `product-pages/`
- Cart: `cart/`
- Legal pages: `legal/`
- Local lightweight AOS and Swiper-compatible vendor files: `assets/vendor/`

The site uses no npm, bundler, React, CDN, gradient UI, or external runtime dependency.

## Legal content

The legal pages are neutral operational frameworks. Confirm the company legal name, address, effective date, shipping regions, returns, warranty coverage, exclusions, and jurisdiction with qualified counsel before production launch.
