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

## Client theme and homepage video

Primary accent is deep indigo `#3730A3` (`rgb(55,48,163)`), with `#312E81`
for hover states. This supersedes the original `#4F46E5` request after the
client asked for a deeper shade. All three concept layouts use this palette.

The homepage uses the existing Luxurry hero video, re-encoded with H.264, no
audio and MP4 fast-start metadata (about 762 KiB versus the original 1.7 MiB).
A roughly 26 KiB poster paints immediately. Playback is initialized after
first paint and idle time, with a pause/play control and off-screen pausing.
Reduced-motion and data-saving preferences suppress automatic playback.
The video is hosted alongside the website, with no external video subscription.

The Architectural homepage now uses a full-width video hero with a dark
readability gradient and white text. The previous light-purple split panel
has been removed; the deep-indigo accent and the rest of the layout remain.
