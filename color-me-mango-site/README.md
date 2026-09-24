# Color Me Mango — Certified Color Analysis Website

A clean, warm, minimal multi-page website built with plain HTML, CSS, and vanilla JS
(no build tools required — just open or host the files as-is).

## File structure

```
/
├── index.html                     Home
├── about.html                     About the owner
├── what-is-color-analysis.html    Education + seasonal palettes + FAQ
├── services.html                  Service/pricing cards
├── booking.html                   Booking + payment UI
├── confirmation.html              Post-payment confirmation
├── contact.html                   Contact form + details
├── privacy.html                   Privacy policy (placeholder)
├── terms.html                     Terms & conditions (placeholder)
├── css/style.css                  All design tokens + styles
├── js/main.js                     Nav, animations, FAQ, booking logic
├── robots.txt / sitemap.xml       SEO basics
```

## Editing text

All copy is plain HTML text — open any page in a text editor and edit directly.
Anything wrapped in `[brackets]` or marked with `<em>[Editable placeholder]:</em>`
is meant to be replaced with real content (owner's story, address, prices, etc.).

## Design tokens

Colors, fonts, radii, and shadows are all defined as CSS variables at the top of
`css/style.css` under `:root`. Change a value once (e.g. `--brand`) and it updates
everywhere the color is used — no need to hunt through the whole file.

## Connecting real payments (Stripe or Square)

`booking.html` includes an HTML comment with full setup notes near the bottom of
the page. In short:

- **Easiest:** Create Stripe Payment Links for each service/deposit combo, then
  point the "Continue to Secure Payment" button at the right link.
- **More flexible:** Stand up a small backend endpoint that creates a Stripe
  Checkout Session (or use Square's Checkout API) and redirect the browser to it.
- Either way, set the success URL to `confirmation.html`.

## Connecting real scheduling

The date/time fields in `booking.html` are placeholders. Swap them for an embed
from Calendly, Acuity Scheduling, or Square Appointments for live availability.

## Adding more services

Copy one `.service-card` block in `services.html` and one `.option-pill` block
in `booking.html`, then edit the name/price/description. No CSS changes needed.

## Adding more testimonials

Copy one `.testi-card` block in `index.html`'s testimonials section. Consider
creating a dedicated `testimonials.html` page later using the same card markup
if the list grows long.

## Adding before/after photos

Use the existing `.photo-placeholder` pattern (see `about.html`) as a starting
point for an image grid, or add a simple two-column "before / after" layout
using `.grid.grid-2` with real photos swapped in for the placeholder divs.

## Adding a blog

Create a `blog.html` index page reusing the `.card` grid pattern, and individual
`blog/post-name.html` pages reusing the page-hero + prose section pattern from
`about.html`. Add a "Blog" link to the shared nav in every page's `<header>`.

## Adding gift cards

A "Gift Cards (Coming Soon)" card already exists in `services.html` and is
linked from the footer — once ready, turn it into a real service card with a
Stripe Payment Link for custom/fixed amounts.

## Before launch

- Replace placeholder photo, name, address, phone, social links, and pricing.
- Replace the placeholder legal text in `privacy.html` and `terms.html` with
  policy reviewed by a qualified professional.
- Wire up the contact form (`contact.html`) to an email service (Formspree,
  Netlify Forms, etc.) or your own backend — it currently only shows a
  placeholder success message.
- Update `sitemap.xml` and canonical URLs with your real domain.
