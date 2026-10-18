# Rudy Hartt — artist portfolio

A self-contained static portfolio. There is no build step and no external JavaScript, font, analytics or image dependency.

## Preview

Open `index.html` in a current browser. Because the image manifest is loaded as a script, the collection also works when opened directly from a local folder.

For a local web server, run `python3 -m http.server 8000` from this folder and open `http://localhost:8000`.

## Edit the collection

Update `artworks-data.js`, which defines `window.ARTWORKS` as an array. Each entry has this shape:

```javascript
{
  id: 'unique-artwork-id',
  title: 'Artwork title',
  year: 2026,
  group: 'Material Studies',
  src: 'assets/artwork-full.webp',
  thumb: 'assets/artwork-preview.webp',
  width: 1536,
  height: 1024,
  alt: 'A useful description of what is visible in the image.',
  caption: 'A short interpretive caption. Describe an imagined installation as a digital study.'
}
```

The artwork marked `hero: true` appears in the featured position; the first artwork is used if none is marked. Collection order follows the first appearance of each group. Artwork order within each collection follows the array order. Filters and counts update automatically. Images retain their complete original compositions. Use relative asset paths so the site works on a GitHub project Pages URL as well as a local preview.

Titles and captions are display copy; source provenance should be kept separately when needed. The portfolio describes the practice as AI-assisted digital art. Images of sculpture and installation must not be described as fabricated or exhibited objects unless that is independently true.

## GitHub Pages

The included `.github/workflows/pages.yml` publishes the site through GitHub Actions when changes are pushed to `main`. In **Settings → Pages → Build and deployment**, select **GitHub Actions**. If the repository's publishing branch has another name, change `branches: [main]` in the workflow. The workflow copies only public site files into the deployment artifact; this README and any working notes are not published.

Alternatively, this folder can be published from the root of a repository using **Deploy from a branch**. Select the branch containing these files, and select `/(root)` as the folder. The included `.nojekyll` file tells GitHub to serve the static files directly.

If replacing an existing site, review and preserve any existing source you need before replacing the published files. To use the default `github.io` address, clear the custom domain in **Settings → Pages** and ensure the deployed repository contains no `CNAME` file. Changes to DNS records at a domain provider are separate from clearing the GitHub Pages domain.

## Interaction and accessibility

- Native modal artwork viewer with previous/next controls.
- Arrow keys navigate the current collection; Escape closes the viewer.
- Focus returns to the artwork button when the viewer closes.
- Keyboard-visible focus, alt text, semantic landmarks and a skip link.
- A reduced-motion preference disables ribbon animation and smooth scrolling.
- Responsive layouts keep images uncropped, including on narrow screens.

The site has no visitor tracking, forms, mailing lists or third-party embeds.

## Delivery status

The 24-artwork collection and static source files are complete. Image integrity, asset references, aspect ratios, HTML IDs, JavaScript syntax, and the portable preview packaging were checked. Browser rendering was not available in the creation session. The source is maintained in `rudyhartt/art`. GitHub Pages deployment is configured through GitHub Actions. Changes to any previous websites and domain settings are managed separately.

Workflow reference: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

Domain settings reference: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
