# POSTUREX Showcase Website

Static site (HTML, CSS, JavaScript; no build step) for the POSTUREX capstone project.

## Structure

```
index.html            Main one-page site (all sections)
article.html          Blog article template (article.html?id=<article-id>)
assets/css/styles.css Styles, light/dark theme tokens
assets/js/main.js     Navigation, theme, timeline, carousel, charts, video, contact form
assets/js/articles.js Blog article content (edit/add articles here)
assets/img/           Optimized images from the manuscript, logo, Open Graph image
```

## Run locally

```
python -m http.server 8000
```
Then open http://localhost:8000.

## Deploy

Upload the whole folder to any static host (Vercel, Netlify, GitHub Pages). No configuration is needed.

## Things to update

- **Contact email:** set `CONFIG.contactEmail` at the top of `assets/js/main.js` to a verified address. Until then the email row stays hidden and the form explains that no address is published.
- **AVP video:** embedded from YouTube (`CONFIG.youtubeId`). It loads only when the visitor presses Play.
- **Team photos:** the team cards use initials. To add real photos, replace the `.avatar` div in `index.html` with an `<img>`.
- **Open Graph URLs:** after deployment, change the `og:image` paths in both HTML files to absolute URLs (for example `https://your-domain/assets/img/og-image.jpg`) so link previews work on every platform.

All content is drawn from the capstone manuscript. POSTUREX is a research prototype for posture awareness, not a medical diagnostic or treatment system.
