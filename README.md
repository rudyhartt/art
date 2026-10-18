# Rudy Hartt — portfolio V2

A static artist portfolio on black, with nine images arranged in the supplied reference's order and a featured six-image collection, **Friends Stitch the Broken Sun**. No build step or external dependency is required.

## Site files

- `index.html` includes all fifteen artworks and the collection cover as semantic HTML images and links. The gallery remains usable without JavaScript.
- `styles.css` preserves the original artwork sizes and staggered positions in two fluid canvases up to 1680px wide. The collection sits after the first three original images; images 4–9 continue after it. Each canvas uses rebased source coordinates to keep the existing artwork proportions.
- The featured collection uses a square cover on the left and six square thumbnails in three columns and two rows on the right at 1100px and above. The cover sits above the thumbnails below that width. Below 700px, thumbnails use two columns, and the original artworks flow at 76–90% of viewport width with alternating alignment.
- `app.js` adds a native dialog viewer with previous/next buttons, arrow keys, Escape-to-close and focus return. If JavaScript or native dialog support is unavailable, each artwork link opens the full image directly.
- `artworks-data.js` provides the image viewer with public image paths, descriptive alt text and navigation scopes. The original gallery browses nine images; the featured collection browses its six full images. The cover opens independently. It contains no source-file metadata.
- `assets/` contains WebP images at native resolution and responsive derivatives, with no upscaling.

The original gallery and full-size viewer retain each artwork's complete composition. The six collection thumbnails use prepared square previews; selecting one reveals the full portrait image. The featured collection has visible titles and comma-separated materials lists beginning with **AI**. The original nine images remain uncaptioned on the page and use image numbers in the viewer.

## Preview

Open `index.html` in a current browser. Relative image paths and script data allow the website to work directly from a local folder as well as on a host. No package installation is needed.

## Deploy with GitHub Pages

The included `.github/workflows/pages.yml` publishes on a push to `main`. In repository **Settings → Pages → Build and deployment**, choose **GitHub Actions**. Adjust `branches: [main]` if another branch is used.

The workflow copies only `index.html`, `styles.css`, `app.js`, `artworks-data.js`, `favicon.svg`, `.nojekyll` and `assets/` into the public artifact. This README is not deployed. The reference PDF, extraction metadata and local source files are not part of this directory.

The same site can also be served by a static web host from the directory root. There are no hardcoded hostname requirements, remote fonts, tracking scripts or third-party embeds.

## Verification

JavaScript syntax, local asset references, image decoding, responsive candidate dimensions, image order and desktop canvas bounds can be checked without a browser. Visual browser rendering is a separate validation step and has not been claimed as performed in this environment.
