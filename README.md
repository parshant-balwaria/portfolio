# Parshant Balwaria - Portfolio

Personal portfolio for **Parshant Balwaria**, a full-stack software engineer with 3+ years at **Ramboll** and **MapMyIndia**. He works mainly in Python/FastAPI, PostgreSQL/PostGIS, React and TypeScript, and specialises in geospatial systems.

**Live:** [www.parshant.co.in](https://www.parshant.co.in)

## Built with

- Plain HTML, CSS and vanilla JavaScript. No framework, no build step, no npm.
- Canvas API for the interactive dot globe, which reads Natural Earth 110m land data.
- Content is in the HTML and stays readable with JavaScript disabled. Animations (scroll reveal, stat counters, typing line, globe rotation) are progressive enhancements, and all of them respect `prefers-reduced-motion`.

## Structure

```
portfolio/
├── index.html            # Portfolio page: all content lives here
├── styles.css            # Styles and design tokens (:root custom properties)
├── script.js             # Nav, scroll reveal, stat counters, typing line, globe
├── land-110m.json        # Natural Earth 110m TopoJSON, fetched at runtime by the globe
├── world-land.js         # Older pre-processed land polygons; not referenced by any page
├── og-image.png          # 1200x630 link-preview image (og:image)
├── card.html             # Digital business card (NFC/QR target): share, copy, PNG download
├── qr.html               # Styled QR code for the site, with SVG/PNG download and print
├── save.html             # Downloads a vCard (.vcf) contact
├── content.md            # Older copy notes; not used by the site
├── Parshant_Resume.pdf   # Resume linked from the nav and hero
├── .github/workflows/static.yml  # GitHub Pages deploy
└── LICENSE               # GPL-3.0
```

## Sections

| Section | Contents |
|---|---|
| **Hero** | Name, role line, summary, stat counters, draggable globe with a Gurugram pin |
| **Experience** | Ramboll and MapMyIndia roles, including the promotion to Software Engineer III; community work and education |
| **Projects** | Work projects and personal projects in a row-based card grid |
| **Capabilities** | Six capability cards |
| **Tech Stack** | Technology chips grouped by domain |
| **Testimonials** | Quotes from colleagues and a client |
| **Contact** | Email, LinkedIn, GitHub, Threads and X |

## Local development

Serve the folder over HTTP so the globe can `fetch()` `land-110m.json`:

```
python -m http.server 8000
```

Then open <http://localhost:8000>. Opening `index.html` from `file://` also works, but the globe falls back to rough continent boxes because the browser blocks the fetch.

## Deployment

Every push to `main` runs [`.github/workflows/static.yml`](.github/workflows/static.yml), which uploads the repository root to GitHub Pages. The custom domain `www.parshant.co.in` is set in the repo's **Settings → Pages**. There is no `CNAME` file, because Actions-based deploys don't use one. The bare domain and `parshant-balwaria.github.io/portfolio/` both redirect to `www`, and `index.html` declares `https://www.parshant.co.in/` as canonical.

Check after each deploy:

```
curl -s https://www.parshant.co.in | grep -E "Yrs|parshant\.dev|TODO"
```

This should show the real counter values and no `parshant.dev` or `TODO` matches.

## License

GPL-3.0. See [LICENSE](LICENSE).

## Author

**Parshant Balwaria**

- Site: [parshant.co.in](https://www.parshant.co.in)
- GitHub: [parshant-balwaria](https://github.com/parshant-balwaria)
- LinkedIn: [parshant-balwaria-b930a21b9](https://www.linkedin.com/in/parshant-balwaria-b930a21b9/)
- Email: parshantbalwaria@gmail.com
