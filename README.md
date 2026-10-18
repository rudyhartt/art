# Rudy Hartt — portfolio V2

A static artist portfolio on black, with nine images arranged in the supplied reference's order and three featured collections: **Friends Stitch the Broken Sun** (six images), **A Softer Kind of Physics** (four images) and **Small Rebellions** (eight images). No build step or external dependency is required.

## Site files

- `index.html` includes all twenty-seven artworks and three collection covers as semantic HTML images and links. The gallery remains usable without JavaScript.
- `styles.css` preserves the original artwork sizes and staggered positions in four fluid canvases up to 1680px wide. The first collection follows original images 1–3; the second follows images 4–5; the third follows image 6; original images 7–9 finish the page. Each canvas uses rebased source coordinates to preserve artwork proportions. On wide desktop layouts, collection starts fall approximately around one-fifth, two-fifths and three-fifths of the page, depending on text layout and viewport width.
- The first collection uses a square cover on the left and six thumbnails in three columns and two rows at 1100px and above. The second uses a larger square cover beside a two-column, two-row grid from 1200px upward. The third uses a cover beside eight thumbnails in four columns and two rows from 1280px upward. Below those thresholds, covers sit above their grids. Below 700px, all collections use two-column thumbnail grids, and original artworks flow at 76–90% of viewport width with alternating alignment.
- `app.js` adds a native dialog viewer with previous/next buttons, arrow keys, Escape-to-close and focus return. If JavaScript or native dialog support is unavailable, each artwork link opens the full image directly.
- `artworks-data.js` provides the image viewer with public image paths, descriptive alt text and navigation scopes. The original gallery browses nine images; each collection browses its own six, four or eight full images. Each cover opens independently. It contains no source-file metadata.
- `assets/` contains WebP images at native resolution and responsive derivatives, with no upscaling.

The original gallery and full-size viewer retain each artwork's complete composition. Collection thumbnails use prepared square previews; selecting one reveals the complete image. All three collections have visible titles and comma-separated materials lists beginning with **AI**. The original nine images remain uncaptioned on the page and use image numbers in the viewer.

## Preview

Open `index.html` in a current browser. Relative image paths and script data allow the website to work directly from a local folder as well as on a host. No package installation is needed.

## Deploy with GitHub Pages

The included `.github/workflows/pages.yml` publishes on a push to `main`. In repository **Settings → Pages → Build and deployment**, choose **GitHub Actions**. Adjust `branches: [main]` if another branch is used.

The workflow copies only `index.html`, `styles.css`, `app.js`, `artworks-data.js`, `favicon.svg`, `.nojekyll` and `assets/` into the public artifact. This README is not deployed. The reference PDF, extraction metadata and local source files are not part of this directory.

The same site can also be served by a static web host from the directory root. There are no hardcoded hostname requirements, remote fonts, tracking scripts or third-party embeds.

## Verification

JavaScript syntax, local asset references, image decoding, responsive candidate dimensions, image order and desktop canvas bounds can be checked without a browser. Visual browser rendering is a separate validation step and has not been claimed as performed in this environment.
