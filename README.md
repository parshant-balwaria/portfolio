# Parshant Balwaria — GIS Software Engineer Portfolio

Personal portfolio website for **Parshant Balwaria**, a GIS Software Engineer with 2.5+ years of experience building enterprise spatial platforms at **Ramboll** and **MapMyIndia**.

## 🚀 Live Demo

[View Portfolio](https://parshant-balwaria.github.io/portfolio/)

## 🛠️ Built With

- Pure HTML5 / CSS3 / Vanilla JavaScript — zero build tools, zero dependencies
- CSS Grid, Flexbox, Custom Properties, and keyframe animations
- Canvas API — interactive 3D globe with real Natural Earth 110m land boundaries
- Fully self-contained single file (`index.html`) + local world data (`world-land.js`)

## 📋 Sections

| Section | Description |
|---|---|
| **Hero** | Animated terminal, stat badges, floating 3D shapes |
| **Spatial Reach** | Draggable 3D globe (Canvas API) with India highlight and New Delhi pin |
| **Experience** | Timeline with promotion tracking across Ramboll & MapMyIndia |
| **Projects** | Bento-grid cards with category badges (GIS / Full-stack / API / DevOps) |
| **Capabilities** | Service cards for GIS development, automation, data engineering |
| **Skills** | Technology chips grouped by domain |
| **Spatial Architecture** | Interactive layer-stack (Presentation → Logic → Storage → Source) |
| **Data Pipeline** | 5-card end-to-end geospatial pipeline: Ingest → Process → Store → Analyse → Serve |
| **Testimonials** | Client recommendations |
| **Contact** | GitHub, LinkedIn, Email links |

## ✨ Design Highlights

- Dark GIS-themed palette (`#06080F` bg · `#22C55E` accent · `#3B82F6` / `#38BDF8` / `#A78BFA`)
- Ambient GIS decorators: compass rose, GPS crosshairs, spot-height markers, north arrow, contour rings, scale bar, coordinate readouts
- Globe: free drag + momentum, world land polygons from Natural Earth 110m, India border, pulsing New Delhi pin
- Cursor glow, particle canvas background, scroll-reveal animations

## 📁 Structure

```
portfolio/
├── index.html        # Entire portfolio — HTML + CSS + JS (self-contained)
├── world-land.js     # Pre-processed Natural Earth 110m land polygons (globe data)
├── land-110m.json    # Original TopoJSON source (not loaded at runtime)
├── README.md         # This file
└── LICENSE           # MIT License
```

## 💻 Local Development

Open `index.html` directly in any modern browser. No build process, no npm, no server needed.

> **Note:** `world-land.js` must be in the same folder as `index.html` — it provides the globe boundary data as a plain JS variable to avoid `file://` CORS restrictions.

## 🚀 Deployment (GitHub Pages)

1. Push `index.html` and `world-land.js` to your repository
2. Go to **Settings → Pages**
3. Set source to `main` branch, `/ (root)` folder
4. Save — your site will be live at `https://[username].github.io/portfolio/`

## 📝 License

MIT License — see [LICENSE](LICENSE) for details.

## 👤 Author

**Parshant Balwaria**

- GitHub: [parshant-balwaria](https://github.com/parshant-balwaria)
- LinkedIn: [parshant-balwaria-b930a21b9](https://www.linkedin.com/in/parshant-balwaria-b930a21b9/)
- Email: parshantbalwaria@gmail.com
