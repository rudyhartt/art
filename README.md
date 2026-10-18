# Rudy Hartt — portfolio V2

A static artist portfolio on black, with nine images arranged in the supplied reference's order and three featured collections: **Friends Stitch the Broken Sun** (six images), **A Softer Kind of Physics** (four images) and **Small Rebellions** (eight images). No build step or external dependency is required.

## Site files

- `index.html` includes all twenty-seven artworks and three collection covers as semantic HTML images and links. The gallery remains usable without JavaScript.
- The top and footer identities use matching heavy Arial-family **RUDY HARTT** names with **AI Artist** beneath. The header has the artist identity at left, centered page navigation and a Store link with a diagonal arrow at right. Store opens the LOVE Shopify shop in a new tab. Below 700px, the navigation occupies a centered second row beneath the name and Store link.
- A spacious logo section follows the last artwork, with V&A, IWM and UAL in the first row; MAHacks, Gamli Skóli and Tate in the second; Sony, the UK Royal Family and the Royal House of the Netherlands in the third; Amsterdam University College, Ogilvy and the University of Oxford in the fourth. These neutral external links open in new tabs. The layout preserves three columns and four rows on mobile, with larger display sizes on desktop and additional room for tall marks.
- Original raster logo files remain unchanged. CSS renders the transparent MAHacks symbol in white and the Gamli Skóli JPEG on black; the supplied `</hacks>` wording is typeset below the MAHacks symbol in native HTML.
- `styles.css` preserves the original artwork sizes and staggered positions in four fluid canvases up to 1680px wide. The first collection follows original images 1–3; the second follows images 4–5; the third follows image 6; original images 7–9 finish the page. Each canvas uses rebased source coordinates to preserve artwork proportions. On wide desktop layouts, collection starts fall approximately around one-fifth, two-fifths and three-fifths of the page, depending on text layout and viewport width.
- The first collection uses a square cover on the left and six thumbnails in three columns and two rows at 1100px and above. The second uses a larger square cover beside a two-column, two-row grid from 1200px upward. The third uses a cover beside eight thumbnails in four columns and two rows from 1280px upward. Below those thresholds, covers sit above their grids. Below 700px, all collections use two-column thumbnail grids, and original artworks flow at 76–90% of viewport width with alternating alignment.
- `app.js` adds a native dialog viewer with previous/next buttons, arrow keys, Escape-to-close and focus return. If JavaScript or native dialog support is unavailable, each artwork link opens the full image directly.
- `artworks-data.js` provides the image viewer with public image paths, descriptive alt text and navigation scopes. The original gallery browses nine images; each collection browses its own six, four or eight full images. Each cover opens independently. It contains no source-file metadata.
- `assets/` contains WebP images at native resolution and responsive derivatives, with no upscaling.

The original gallery and full-size viewer retain each artwork's complete composition. Collection thumbnails use prepared square previews; selecting one reveals the complete image. All three collections have visible titles and comma-separated materials lists beginning with **AI**. The nine original MOMENTS works carry pale story ribbons with a numbered fragment on each. A cobalt SVG thread connects them in sequence, routing through the outer gutter around the other collections. The viewer retains its original image numbers and descriptive captions.

Text is slightly enlarged throughout the interface. Collection layouts allow captions to wrap naturally and adjust the cover-to-grid proportions at narrow desktop widths.

`moments.js` draws the decorative connector ribbons from the actual image and caption positions. It recalculates on resize, image load and font readiness; it has no scroll listener or animation. The ribbons do not intercept clicks and are hidden from assistive technology; the story itself is accessible HTML. Below 700px, the story ribbons overlap each image’s lower edge and flow with the artwork, keeping the text readable. Without JavaScript, all nine story fragments and artwork links remain available.

A decorative viewport background uses a vertically seamless `assets/ambient-waves.svg`: charcoal crests and black troughs at 55% overall opacity, behind all artwork and navigation. A passive scroll listener in `app.js` updates the front and rear texture positions at 45% and 25% of page scroll through one requested animation frame; scrolling back reverses the movement. The soft 24/32-second CSS drift continues independently. Mobile uses one layer. The background uses a non-negative layer with positioned content above it; the main element remains unisolated so logo blending works. It is hidden from assistive technology and does not intercept input. `prefers-reduced-motion: reduce` disables both scroll coupling and timed animation. The stylesheet, script and SVG background URL use content versions to refresh cached visuals.

## Version checkpoints

The `v2.1-backup` branch preserves the design before the MOMENTS ribbons at commit `f6e72762cd762df49e20c2c20a7dbae2646f7952`. The earlier V1 backup remains on `v1-backup`.

## Preview

Open `index.html` in a current browser. Relative image paths and script data allow the website to work directly from a local folder as well as on a host. No package installation is needed.

CSS and JavaScript URLs in `index.html` include a version derived from each file’s SHA-256 content hash (first 12 characters). Update the corresponding query value whenever that file changes so returning visitors receive matching HTML, styles and viewer data.

## Deploy with GitHub Pages

The included `.github/workflows/pages.yml` publishes on a push to `main`. In repository **Settings → Pages → Build and deployment**, choose **GitHub Actions**. Adjust `branches: [main]` if another branch is used.

The workflow copies only `index.html`, `styles.css`, `app.js`, `artworks-data.js`, `moments.js`, `favicon.svg`, `.nojekyll` and `assets/` into the public artifact. This README is not deployed. The reference PDF, extraction metadata and local source files are not part of this directory.

The same site can also be served by a static web host from the directory root. There are no hardcoded hostname requirements, remote fonts, tracking scripts or third-party embeds.

## Verification

JavaScript syntax, local asset references, image decoding, responsive candidate dimensions, image order and desktop canvas bounds can be checked without a browser. Visual browser rendering is a separate validation step and has not been claimed as performed in this environment.
