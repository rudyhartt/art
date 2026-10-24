# Rudy Hartt — portfolio V2

A static artist portfolio on black, with nine images arranged in the supplied reference's order and five featured collections: **Friends Stitch the Broken Sun** (six images), **A Softer Kind of Physics** (four images), **Small Rebellions** (eight images), **The Weight of Tenderness** (twelve images), and **What the Light Can Hold** (eight images). No build step or external dependency is required.

## Site files

- `spaces.html` introduces spatial concepts, with RUDY’S™ as the first project. Eight existing concept renders show the street frontage, creative clubhouse, listening lounge, broadcast suite, brand objects, Vision Store, performance lounge and architectural cutaway. THE MAISONETTE follows as Project 02, with six contemporary views developed from the supplied interior model, new abstract paintings and a separate viewer sequence. Both projects preserve complete render framing and stack into a single column on mobile. RUDY’S™ text carries the trademark symbol, with a native superscript beside the project heading and the homepage footer mark. `spaces.css` controls the responsive full-image gallery, and `spaces-data.js` supplies descriptions and navigation for the shared image viewer. Spaces appears before Collections in the navigation on all three pages.

- `about.html` presents the approved artist biography, Every image begins with a story headline, transparent silver-and-red ribbon and Explore the artwork link. `about.css` contains only About-page layout rules. The shared navigation, disabled Store button, footer and scroll-linked waves remain unchanged in appearance; About links to this page and Works/Collections return to the homepage anchors. Biography columns stack below 700px, and decorative motion respects reduced-motion preferences.

- `index.html` includes all forty-seven artworks and five collection covers as semantic HTML images and viewer buttons. Without JavaScript, all gallery images and captions remain visible, while expanded viewing is unavailable.
- The top and footer identities use matching heavy Arial-family **RUDY HARTT** names with **Human Artist** in red beneath. The header has the artist identity at left, centered page navigation and a temporarily disabled Store button with a diagonal arrow at right. Below 700px, the navigation occupies a centered second row beneath the name and Store link.
- A spacious logo section follows the last artwork, with V&A, IWM and UAL in the first row; MAHacks, Gamli Skóli and Tate in the second; Sony, the UK Royal Family and the Royal House of the Netherlands in the third; Amsterdam University College, Ogilvy and the University of Oxford in the fourth; and the supplied WAOWI, RUDY’S™ and SYMB10 logos in the fifth. The first twelve logos link to external sites in new tabs. The final three are static brand marks. The layout preserves three columns and five rows on mobile, with larger display sizes on desktop and additional room for tall marks.
- Original raster logo artwork remains unchanged, with lossless WebP versions of the latest supplied marks. CSS renders the transparent MAHacks symbol in white and the Gamli Skóli JPEG on black; the supplied `</hacks>` wording is typeset below the MAHacks symbol in native HTML.
- `styles.css` preserves the original artwork sizes and staggered positions in five fluid canvases up to 1680px wide. The first collection follows original images 1–3; the second follows images 4–5; the third follows image 6. MOMENTS 07 and 08 share their original combined canvas, followed by **The Weight of Tenderness**, the bench image MOMENTS 09, and **What the Light Can Hold**. The fifth collection completes the artwork sequence before the logos. The 07–08 canvas retains its original 1413.10595703 / 1220.06689482 ratio and original figure coordinates. Each canvas uses rebased source coordinates to preserve artwork proportions. Exact scroll fractions vary with viewport width and text layout.
- The first collection uses a square cover on the left and six thumbnails in three columns and two rows at 1100px and above. The second uses a larger square cover beside a two-column, two-row grid from 1200px upward. The third uses a cover beside eight thumbnails in four columns and two rows from 1280px upward. The fourth pairs a portrait cover with twelve thumbnails in four columns and three rows from 1280px upward. The fifth uses a square cover beside eight thumbnails in four columns and two rows from 1280px upward. Below those thresholds, covers sit above their grids. Below 700px, all collections use two-column thumbnail grids, and original artworks flow at 76–90% of viewport width with alternating alignment.
- `app.js` adds a native dialog viewer with previous/next buttons, arrow keys, Escape-to-close and focus return. Opening, closing and switching use short opacity fades, with reduced-motion support and stale-load protection. Artwork controls do not link directly to image files, and the viewer has no download or full-file link.
- `artworks-data.js` provides the image viewer with public image paths, descriptive alt text and navigation scopes. The original gallery browses nine images; each collection browses its own six, four, eight or twelve full images. Each cover opens independently. It contains no source-file metadata.
- `assets/` contains WebP images at native resolution and responsive derivatives, with no upscaling.
- The browser and social sharing title is **RUDY HARTT**. Open Graph and Twitter large-image cards use `https://rudyhartt.com/assets/rudy-hartt-share-art-red.jpg`, a 1200 × 630 JPEG, with a shared description and descriptive image alt text. The native white-heart-on-black `favicon.svg` is accompanied by a 32px PNG, an ICO containing 16/32/48px sizes, and a 180px Apple touch icon.

The original gallery and full-size viewer retain each artwork's complete composition. Image controls prevent ordinary dragging and image-specific context menus, with touch-callout and selection deterrents. These are browser interaction deterrents, not DRM: public image files remain retrievable and screenshots remain possible. Collection thumbnails use prepared square previews; selecting one reveals the complete image. All five collections have visible titles and comma-separated materials lists beginning with **Human**. The nine original MOMENTS works carry pale story ribbons with a numbered fragment on each. A cobalt SVG thread connects them in sequence, routing through the outer gutter around the other collections. The viewer retains its original image numbers and descriptive captions.

Text is slightly enlarged throughout the interface. Collection layouts allow captions to wrap naturally and adjust the cover-to-grid proportions at narrow desktop widths.

`moments.js` draws the decorative connector ribbons from the actual image and caption positions. It recalculates on resize, image load and font readiness; it has no scroll listener or animation. The ribbons do not intercept clicks and are hidden from assistive technology; the story itself is accessible HTML. Below 700px, the story ribbons overlap each image’s lower edge and flow with the artwork, keeping the text readable. Without JavaScript, all nine story fragments and gallery images remain visible.

A decorative viewport background uses a vertically seamless `assets/ambient-waves.svg`: charcoal crests and black troughs at 55% overall opacity, behind all artwork and navigation. A passive scroll listener in `app.js` updates the front and rear texture positions at 45% and 25% of page scroll through one requested animation frame; scrolling back reverses the movement. The soft 24/32-second CSS drift continues independently. Mobile uses one layer. The background uses a non-negative layer with positioned content above it; the main element remains unisolated so logo blending works. It is hidden from assistive technology and does not intercept input. `prefers-reduced-motion: reduce` disables both scroll coupling and timed animation. The stylesheet, script and SVG background URL use content versions to refresh cached visuals.

Three transparent decorative accents float gently in existing empty gallery space: a glass ribbon beside MOMENTS 02, sculptural fragments to the right of MOMENTS 06, and a small character encounter to the left of MOMENTS 08. Each uses an 800 × 450 WebP with a 400px responsive variant. On desktop their transparent canvases are 180–420px wide, producing visible accents about 210–235px wide at larger viewports. Below 700px they use 110–160px canvases, producing roughly 62–126px of visible artwork within the existing bottom margins; transparent padding can extend beyond those margins. They add no gallery height, preserve all artwork coordinates, and remain below the story labels. They are hidden from assistive technology, cannot receive pointer input, and have no viewer action. Reduced-motion preferences disable their slow vertical drift.

`fireflies.js` draws softly glowing white creatures in drifting clouds of small particles on the homepage and About page. Each creature has a translucent circular body and two fluttering translucent oval wings. A generated transparent white nebula texture (`assets/firefly-nebula.webp`) drifts behind each cloud of creatures at low opacity, with all mist drawn beneath the particles. Clouds are anchored throughout the document and move with the artwork as visitors scroll, while their gentle drift continues. A viewport-sized canvas draws only nearby clouds to keep memory use low. The decorative canvas sits between the waves and page content, receives no pointer input, and is hidden from assistive technology. Small screens use fewer creatures; reduced-motion preferences replace the animation with a sparse still field. Animation pauses while the page is hidden or the artwork viewer is open.

Four original animated companions are interspersed between the homepage sections: a paper courier, cobalt thread creature, lantern moth and glass sprout keeper. Each uses a transparent 320 × 320 GIF (`assets/character-01.gif` through `character-04.gif`) and a matching static WebP selected automatically for reduced-motion preferences. Their separate decorative spaces keep artwork, captions and the existing story ribbon clear. They load lazily, ignore pointer input and scale down on mobile.

## Version checkpoints

The `v2.3-backup` branch preserves the site with the WAR mural banner and exhibition introduction, before the firefly animation, at commit `024358f1226b5e42615572c2019569a138eacbf1`.

The `v2.2-backup` branch preserves the complete site before the floating decorations at commit `b7d5ae106d1fbce8b1795569d0ac59c3d0d69381`.

The `v2.1-backup` branch preserves the design before the MOMENTS ribbons at commit `f6e72762cd762df49e20c2c20a7dbae2646f7952`. The earlier V1 backup remains on `v1-backup`.

## Preview

Open `index.html` in a current browser. Relative image paths and script data allow the website to work directly from a local folder as well as on a host. No package installation is needed.

CSS and JavaScript URLs in `index.html` and `about.html` include a version derived from each file’s SHA-256 content hash (first 12 characters). Update the corresponding query value whenever that file changes so returning visitors receive matching HTML, styles and viewer data.

## Deploy with GitHub Pages

The included `.github/workflows/pages.yml` publishes on a push to `main`. In repository **Settings → Pages → Build and deployment**, choose **GitHub Actions**. Adjust `branches: [main]` if another branch is used.

The workflow copies only `index.html`, `about.html`, `about.css`, `spaces.html`, `spaces.css`, `spaces-data.js`, `styles.css`, `app.js`, `artworks-data.js`, `moments.js`, `fireflies.js`, `favicon.svg`, `favicon-32.png`, `favicon.ico`, `apple-touch-icon.png`, `.nojekyll` and `assets/` into the public artifact. This README is not deployed. The reference PDF, extraction metadata and local source files are not part of this directory.

The same site can also be served by a static web host from the directory root. Page assets use relative paths; the social metadata identifies `https://rudyhartt.com/`. There are no remote fonts, tracking scripts or third-party embeds.

## Verification

JavaScript syntax, local asset references, image decoding, responsive candidate dimensions, image order and desktop canvas bounds can be checked without a browser. Visual browser rendering is a separate validation step and has not been claimed as performed in this environment.

The Gamli Skóli, RUDY’S™ and SYMB10 footer marks now use transparent SVG masks over the original source pixels. Their white shapes need no page blend mode, so the animated background shows through all negative spaces.

The share artwork highlights ART in red within HARTT and adds a larger, bold white superscript trademark symbol after the final T.

