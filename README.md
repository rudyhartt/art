# Rudy Hartt — portfolio V2

A static artist portfolio on black, with nine images arranged in the supplied reference's order, relative sizes and desktop positions. No build step or external dependency is required.

## Site files

- `index.html` includes all nine artworks as semantic HTML images and links. The gallery remains usable without JavaScript.
- `styles.css` preserves the desktop composition in a fluid canvas up to 1680px wide. Below 700px, the images flow in source order at 76–90% of the viewport width with alternating alignment.
- `app.js` adds a native dialog viewer with previous/next buttons, arrow keys, Escape-to-close and focus return. If JavaScript or native dialog support is unavailable, each artwork link opens the full image directly.
- `artworks-data.js` provides the image viewer with public image paths and descriptive alt text. It contains no source-file metadata.
- `assets/` contains WebP images at native resolution and responsive derivatives, with no upscaling.

Images retain their full original compositions. Source images are never cropped. The gallery has no visible captions or invented artwork titles; the viewer uses image numbers and plain visual descriptions.

## Preview

Open `index.html` in a current browser. Relative image paths and script data allow the website to work directly from a local folder as well as on a host. No package installation is needed.

## Deploy with GitHub Pages

The included `.github/workflows/pages.yml` publishes on a push to `main`. In repository **Settings → Pages → Build and deployment**, choose **GitHub Actions**. Adjust `branches: [main]` if another branch is used.

The workflow copies only `index.html`, `styles.css`, `app.js`, `artworks-data.js`, `favicon.svg`, `.nojekyll` and `assets/` into the public artifact. This README is not deployed. The reference PDF, extraction metadata and local source files are not part of this directory.

The same site can also be served by a static web host from the directory root. There are no hardcoded hostname requirements, remote fonts, tracking scripts or third-party embeds.

## Verification

JavaScript syntax, local asset references, image decoding, responsive candidate dimensions, image order and desktop canvas bounds can be checked without a browser. Visual browser rendering is a separate validation step and has not been claimed as performed in this environment.
