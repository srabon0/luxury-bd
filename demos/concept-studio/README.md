# Luxurry Concept Studio

Three interactive design demos for the sanitaryware website, separate from production.

Open `dist/index.html` through any static web server. There is no framework, build step,
package installation, production API connection or server dependency. Theme and catalog
state are encoded in the query string; the enquiry shortlist is browser-local.

## cPanel

Upload the contents of `dist/` to a demo subdirectory (for example `public_html/demos/`).
The application uses relative assets and query-string navigation, so no SPA rewrite is
required. Keep the live store in its current directory. The `.openai/` manifest belongs
to the private review host and is not needed on cPanel.

## Demo features

- Three art directions: Architectural Minimalism, Boutique Luxury, Modern Showroom.
- Responsive navigation, home, catalog, inspiration, professional resources and contact.
- Search, category filtering, price/name sorting, product details and three-item comparison.
- Local shortlist, editable enquiry brief download, sample specification PDF download.
- No orders, payments, live stock, message delivery, accounts or database writes.

## Data and imagery

All catalog products, prices and dimensions are clearly labelled sample data.
Generated images are illustrative, and must be replaced by verified product photographs
before production. Contact details were carried over from the existing site and need
owner verification before launch. Personal contact fields are never stored or submitted.

## Verification

Run `node --test tests/catalog.test.mjs` for catalog behavior checks.
Run `node --check dist/app.mjs` to check syntax. Browser QA covers concept switching,
filters, comparison, product details, shortlist and enquiry behavior when available.

## Production plan after design selection

Build the selected direction in a dedicated GitHub branch. Verify the actual cPanel
Node support, CPU/RAM limits and database before choosing the API runtime. Production
work includes verified catalog imports, authenticated/authorized administration, image
uploads and optimization, schema validation, indexes/pagination, rate limits, automated
tests/CI, backups, environment configuration, monitoring and a rollback procedure.
The demo is a design and interaction prototype, not an enterprise production release.
